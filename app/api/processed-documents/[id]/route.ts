import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Find the document first to get the file path
    const document = await prisma.processedDocument.findUnique({
      where: { id }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Delete the physical file if it exists
    if (document.compressedUrl) {
      try {
        const filePath = join(process.cwd(), 'public', document.compressedUrl)
        await unlink(filePath)
      } catch (fileError) {
        console.warn('Could not delete physical file:', fileError)
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete from database
    await prisma.processedDocument.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}