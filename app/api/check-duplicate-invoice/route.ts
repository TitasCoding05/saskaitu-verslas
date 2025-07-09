import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { sellerCode, invoiceNumber, userId } = await request.json()

    if (!sellerCode || !invoiceNumber || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Search for existing invoices with the same seller code and invoice number
    const existingInvoices = await prisma.processedDocument.findMany({
      where: {
        userId: userId,
        extractedData: {
          path: ['pardavejas', 'pardavejo_imones_kodas'],
          equals: sellerCode
        }
      }
    })

    // Check if any of the found invoices have the same invoice number
    const duplicateInvoice = existingInvoices.find(invoice => {
      const extractedData = invoice.extractedData as Record<string, unknown>
      return extractedData?.serija_ir_numeris === invoiceNumber
    })

    return NextResponse.json({
      isDuplicate: !!duplicateInvoice,
      duplicateInvoice: duplicateInvoice ? {
        id: duplicateInvoice.id,
        originalName: duplicateInvoice.originalName,
        createdAt: duplicateInvoice.createdAt
      } : null
    })
  } catch (error) {
    console.error('Error checking duplicate invoice:', error)
    return NextResponse.json(
      { error: 'Failed to check duplicate invoice' },
      { status: 500 }
    )
  }
}