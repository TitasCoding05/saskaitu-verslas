import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import db from '@/lib/db'

export async function GET() {
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

    // Get only confirmed processed documents
    const documents = await db.processedDocument.findMany({
      where: {
        userId: user.id,
        status: 'CONFIRMED'
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        originalName: true,
        fileType: true,
        compressedUrl: true,
        extractedData: true,
        coordinates: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      success: true,
      documents
    })

  } catch (error) {
    console.error('Error fetching processed documents:', error)
    return NextResponse.json(
      { error: 'Sisteminė klaida' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Neprisijungęs vartotojas' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('id')

    if (!documentId) {
      return NextResponse.json(
        { error: 'Dokumento ID nerastas' },
        { status: 400 }
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

    // Delete document (only if it belongs to the user)
    const deletedDocument = await db.processedDocument.deleteMany({
      where: {
        id: documentId,
        userId: user.id
      }
    })

    if (deletedDocument.count === 0) {
      return NextResponse.json(
        { error: 'Dokumentas nerastas arba neturite teisių jį ištrinti' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Dokumentas sėkmingai ištrintas'
    })

  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: 'Sisteminė klaida' },
      { status: 500 }
    )
  }
}