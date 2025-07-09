import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import {
  convertToCompressedJPG,
  extractTextWithCoordinates,
  extractSearchTermsFromInvoiceData,
  saveFileToPublic,
  type InvoiceData
} from '@/lib/utils/file-processing'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    console.log('Processing invoice upload...')
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      console.log('No file provided')
      return NextResponse.json(
        { error: 'Failas nerastas' },
        { status: 400 }
      )
    }

    console.log('File received:', file.name, file.type, file.size)

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let extractedText = ''

    // Extract text based on file type
    if (file.type === 'application/pdf') {
      try {
        console.log('Extracting text from PDF...')
        // Use dynamic import to avoid debug mode issues
        const pdf = (await import('pdf-parse')).default
        const data = await pdf(buffer)
        extractedText = data.text
        console.log('PDF text extracted, length:', extractedText.length)
      } catch (error) {
        console.error('PDF parsing error:', error)
        return NextResponse.json(
          { error: 'Nepavyko apdoroti PDF failo' },
          { status: 400 }
        )
      }
    } else if (file.type.startsWith('image/')) {
      // For images, we'll use OpenAI Vision API
      console.log('Processing image with Vision API...')
      const base64Image = buffer.toString('base64')
      const imageUrl = `data:${file.type};base64,${base64Image}`
      console.log('Image converted to base64, length:', base64Image.length)
      
      try {
        const visionResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Ištraukk visą tekstą iš šios sąskaitos faktūros nuotraukos. Pateik tik tekstą, be papildomo komentavimo."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageUrl
                  }
                }
              ]
            }
          ],
          max_tokens: 1000
        })
        
        extractedText = visionResponse.choices[0]?.message?.content || ''
      } catch (error) {
        console.error('Vision API error:', error)
        return NextResponse.json(
          { error: 'Nepavyko apdoroti nuotraukos' },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Nepalaikomas failo tipas. Palaikomi PDF ir nuotraukų failai.' },
        { status: 400 }
      )
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: 'Nepavyko ištraukti teksto iš failo' },
        { status: 400 }
      )
    }

    // Limit text length to avoid token limits
    const limitedText = extractedText.length > 3000 ? extractedText.substring(0, 3000) + '...' : extractedText
    
    // Process with OpenAI
    const prompt = `Išanalizuok šį lietuvišką sąskaitos faktūros dokumentą ir pateik informaciją JSON formatu.

Dokumento tekstas: ${limitedText}

Pateik tiksliai tokią JSON struktūrą:
{
  "ar_dokumentas_yra_saskaita": "Taip",
  "serija_ir_numeris": "SF-2024-001",
  "isdavimo_data": "2024-01-15",
  "mokejimo_terminas": "2024-02-15",
  "kaina": "100.00",
  "pvm": "21.00",
  "bendra_kaina": "121.00",
  "pardavejas": {
    "pardavejo_imones_pavadinimas": "UAB Pavyzdys",
    "pardavejo_imones_kodas": "123456789",
    "pardavejo_pvm_identifikacijos_numeris": "LT123456789",
    "pardavejo_telefono_numeris": "+37060000000",
    "pardavejo_el_pastas": "info@pavyzdys.lt",
    "pardavejo_gatve": "Vilniaus g. 1",
    "pardavejo_miestas": "Vilnius",
    "pardavejo_salies_dvieju_raidziu_kodas": "LT",
    "pardavejo_pasto_kodas": "01234",
    "pardavejas_fizinis_asmuo": "Ne"
  },
  "pirkejas": {
    "pirkejo_imones_pavadinimas": "UAB Klientas",
    "pirkejo_imones_kodas": "987654321",
    "pirkejo_pvm_identifikacijos_numeris": "LT987654321",
    "pirkejo_gatve": "Kauno g. 2",
    "pirkejo_miestas": "Kaunas",
    "pirkejo_salies_dvieju_raidziu_kodas": "LT",
    "pirkejo_pasto_kodas": "44321",
    "pirkejas_fizinis_asmuo": "Ne"
  },
  "prekes": [
    {
      "kiekis": "1",
      "pavadinimas": "Paslaugos",
      "kaina": "100.00",
      "pvm": "21.00",
      "bendra_kaina": "121.00"
    }
  ]
}

SVARBU: Jei informacijos nerandi, rašyk "Nerasta". Grąžink tik JSON formatą.`

    console.log('Calling OpenAI API...')
    console.log('Prompt length:', prompt.length)
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Tu esi profesionalus sąskaitų faktūrų analizės asistentas. Pateik tik JSON formatą be papildomo teksto."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1
    })
    
    console.log('OpenAI API call successful')

    const invoiceDataStr = response.choices[0]?.message?.content
    if (!invoiceDataStr) {
      return NextResponse.json(
        { error: 'Nepavyko gauti atsakymo iš AI' },
        { status: 500 }
      )
    }

    try {
      // Clean the response string before parsing
      const cleanedResponse = invoiceDataStr.trim()
      console.log('AI Response:', cleanedResponse)
      
      const invoiceData = JSON.parse(cleanedResponse)
      
      // Validate that we have the expected structure
      if (!invoiceData || typeof invoiceData !== 'object') {
        throw new Error('Invalid response structure')
      }
      

      // Convert file to compressed JPG for storage and OCR processing
      let compressedBuffer: Buffer
      let compressedUrl: string
      let ocrBuffer: Buffer // Buffer specifically for OCR processing
      
      try {
        if (file.type.startsWith('image/')) {
          // Convert images to compressed JPG
          compressedBuffer = await convertToCompressedJPG(buffer, file.type)
          ocrBuffer = compressedBuffer // Use the same buffer for OCR
          const jpgFileName = file.name.replace(/\.[^/.]+$/, '') + '.jpg'
          compressedUrl = await saveFileToPublic(compressedBuffer, jpgFileName, 'processed-documents')
          console.log('Image converted to JPG and saved:', compressedUrl)
        } else if (file.type === 'application/pdf') {
          // Convert PDF to JPG for better OCR accuracy
          console.log('Converting PDF to JPG for OCR processing...')
          compressedBuffer = await convertToCompressedJPG(buffer, file.type)
          ocrBuffer = compressedBuffer // Use JPG buffer for OCR
          
          // Save original PDF
          const originalPdfUrl = await saveFileToPublic(buffer, file.name, 'processed-documents')
          console.log('PDF saved as original:', originalPdfUrl)
          
          // Save converted JPG for OCR
          const jpgFileName = file.name.replace(/\.[^/.]+$/, '') + '_converted.jpg'
          compressedUrl = await saveFileToPublic(compressedBuffer, jpgFileName, 'processed-documents')
          console.log('PDF converted to JPG for OCR:', compressedUrl)
        } else {
          // Other file types - save as is
          compressedUrl = await saveFileToPublic(buffer, file.name, 'processed-documents')
          ocrBuffer = buffer // Use original buffer for OCR
          console.log('File saved as original:', compressedUrl)
        }
      } catch (error) {
        console.error('File processing error:', error)
        // Final fallback to base64
        const fileBase64 = buffer.toString('base64')
        compressedUrl = `data:${file.type};base64,${fileBase64}`
        ocrBuffer = buffer // Use original buffer for OCR
        console.log('Using base64 as fallback')
      }

      // Generate comprehensive coordinates for all invoice fields
      let coordinates: Record<string, { x: number; y: number; width: number; height: number }> = {}
      
      try {
        // Extract search terms from AI response
        const searchTerms = extractSearchTermsFromInvoiceData(invoiceData as InvoiceData)
        console.log('Search terms for OCR:', searchTerms)

        // Get OCR coordinates for search terms using the processed buffer (JPG for PDFs)
        console.log('Running OCR on processed image buffer...')
        const ocrResult = await extractTextWithCoordinates(ocrBuffer, searchTerms)
        Object.assign(coordinates, ocrResult.coordinates)
        console.log('OCR coordinates extracted:', Object.keys(coordinates).length, 'terms found')
      } catch (error) {
        console.error('OCR error:', error)
      }

      // Generate more realistic coordinates for typical Lithuanian invoice layout
      const allFieldCoordinates = {
        // Document info - typically in header area
        ar_dokumentas_yra_saskaita: { x: 2, y: 2, width: 25, height: 4 },
        serija_ir_numeris: coordinates['serija_ir_numeris'] || { x: 70, y: 5, width: 28, height: 4 },
        isdavimo_data: coordinates['isdavimo_data'] || { x: 70, y: 10, width: 25, height: 4 },
        mokejimo_terminas: coordinates['mokejimo_terminas'] || { x: 70, y: 15, width: 25, height: 4 },
        kaina: coordinates['kaina'] || { x: 65, y: 70, width: 20, height: 4 },
        pvm: coordinates['pvm'] || { x: 65, y: 75, width: 20, height: 4 },
        bendra_kaina: coordinates['bendra_kaina'] || { x: 65, y: 80, width: 30, height: 5 },

        // Seller info - typically left side, upper area
        pardavejo_imones_pavadinimas: coordinates['pardavejo_imones_pavadinimas'] || { x: 5, y: 22, width: 40, height: 4 },
        pardavejo_imones_kodas: coordinates['pardavejo_imones_kodas'] || { x: 5, y: 27, width: 30, height: 4 },
        pardavejo_pvm_identifikacijos_numeris: coordinates['pardavejo_pvm_identifikacijos_numeris'] || { x: 5, y: 32, width: 35, height: 4 },
        pardavejo_telefono_numeris: coordinates['pardavejo_telefono_numeris'] || { x: 5, y: 37, width: 30, height: 4 },
        pardavejo_el_pastas: coordinates['pardavejo_el_pastas'] || { x: 5, y: 42, width: 35, height: 4 },
        pardavejo_gatve: coordinates['pardavejo_gatve'] || { x: 5, y: 47, width: 35, height: 4 },
        pardavejo_miestas: coordinates['pardavejo_miestas'] || { x: 5, y: 52, width: 25, height: 4 },
        pardavejo_pasto_kodas: coordinates['pardavejo_pasto_kodas'] || { x: 32, y: 52, width: 15, height: 4 },

        // Buyer info - typically right side, upper area
        pirkejo_imones_pavadinimas: coordinates['pirkejo_imones_pavadinimas'] || { x: 50, y: 22, width: 45, height: 4 },
        pirkejo_imones_kodas: coordinates['pirkejo_imones_kodas'] || { x: 50, y: 27, width: 30, height: 4 },
        pirkejo_pvm_identifikacijos_numeris: coordinates['pirkejo_pvm_identifikacijos_numeris'] || { x: 50, y: 32, width: 35, height: 4 },
        pirkejo_gatve: coordinates['pirkejo_gatve'] || { x: 50, y: 37, width: 35, height: 4 },
        pirkejo_miestas: coordinates['pirkejo_miestas'] || { x: 50, y: 42, width: 25, height: 4 },
        pirkejo_pasto_kodas: coordinates['pirkejo_pasto_kodas'] || { x: 77, y: 42, width: 15, height: 4 },
      }

      // Add item coordinates - typically in table format in middle section
      if (invoiceData.prekes && Array.isArray(invoiceData.prekes)) {
        invoiceData.prekes.forEach((item: { pavadinimas?: string; bendra_kaina?: string }, index: number) => {
          const baseY = 58 + (index * 6) // Items table starts around 58% from top
          const itemCoords: Record<string, { x: number; y: number; width: number; height: number }> = {
            [`item_${index}_pavadinimas`]: coordinates[item.pavadinimas || ''] || { x: 5, y: baseY, width: 45, height: 4 },
            [`item_${index}_kiekis`]: { x: 52, y: baseY, width: 10, height: 4 },
            [`item_${index}_kaina`]: { x: 64, y: baseY, width: 15, height: 4 },
            [`item_${index}_bendra_kaina`]: coordinates[item.bendra_kaina || ''] || { x: 81, y: baseY, width: 17, height: 4 }
          }
          Object.assign(allFieldCoordinates, itemCoords)
        })
      }

      console.log('Generated coordinates for', Object.keys(allFieldCoordinates).length, 'fields')
      coordinates = allFieldCoordinates

      // Note: Document is NOT saved to database here anymore
      // It will be saved when user confirms it via the upload interface
      console.log('Document processed but not saved to database yet (pending confirmation)')

      // Convert file to base64 for immediate display
      const fileBase64 = buffer.toString('base64')
      const fileDataUrl = `data:${file.type};base64,${fileBase64}`
      
      return NextResponse.json({
        success: true,
        data: invoiceData,
        coordinates,
        originalFile: {
          name: file.name,
          type: file.type,
          dataUrl: fileDataUrl
        },
        compressedUrl
      })
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      console.error('Raw AI response:', invoiceDataStr)
      return NextResponse.json(
        {
          error: 'Nepavyko apdoroti AI atsakymo',
          details: parseError instanceof Error ? parseError.message : 'Unknown error',
          rawResponse: invoiceDataStr?.substring(0, 200) + '...' // First 200 chars for debugging
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Invoice processing error:', error)
    return NextResponse.json(
      { error: 'Sisteminė klaida apdorojant sąskaitą' },
      { status: 500 }
    )
  }
}