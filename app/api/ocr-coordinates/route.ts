import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fieldName = formData.get('fieldName') as string
    const fieldValue = formData.get('fieldValue') as string
    
    if (!file || !fieldName || !fieldValue) {
      return NextResponse.json(
        { error: 'Trūksta duomenų' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    const imageUrl = `data:${file.type};base64,${base64Image}`

    // Use OpenAI Vision to find text coordinates
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Rask šį tekstą "${fieldValue}" dokumente ir pateik jo apytikslę poziciją procentais nuo viršutinio kairiojo kampo. Grąžink JSON formatą su x, y, width, height procentais (0-100). Pavyzdys: {"x": 20, "y": 30, "width": 15, "height": 3}`
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
      response_format: { type: "json_object" },
      max_tokens: 300
    })

    const coordinatesStr = response.choices[0]?.message?.content
    if (!coordinatesStr) {
      return NextResponse.json(
        { error: 'Nepavyko gauti koordinačių' },
        { status: 500 }
      )
    }

    const coordinates = JSON.parse(coordinatesStr)
    
    return NextResponse.json({
      success: true,
      coordinates,
      fieldName,
      fieldValue
    })

  } catch (error) {
    console.error('OCR coordinates error:', error)
    return NextResponse.json(
      { error: 'Sisteminė klaida' },
      { status: 500 }
    )
  }
}