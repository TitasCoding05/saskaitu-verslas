import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import db from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Neprisijungęs vartotojas' },
        { status: 401 }
      )
    }

    // Get user
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Vartotojas nerastas' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { 
      originalName, 
      fileType, 
      compressedUrl, 
      extractedData, 
      coordinates 
    } = body

    if (!originalName || !fileType || !compressedUrl || !extractedData) {
      return NextResponse.json(
        { error: 'Trūksta reikalingų duomenų' },
        { status: 400 }
      )
    }

    // Save document to database with CONFIRMED status
    const document = await db.processedDocument.create({
      data: {
        originalName,
        fileType,
        compressedUrl,
        originalUrl: compressedUrl,
        extractedData,
        coordinates: coordinates || {},
        status: 'CONFIRMED',
        userId: user.id
      }
    })

    return NextResponse.json({
      success: true,
      document
    })

  } catch (error) {
    console.error('Error confirming document:', error)
    return NextResponse.json(
      { error: 'Sisteminė klaida' },
      { status: 500 }
    )
  }
}