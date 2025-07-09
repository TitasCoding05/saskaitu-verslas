'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const InvoiceItemSchema = z.object({
  name: z.string().min(1, { message: "Produkto pavadinimas privalomas" }),
  quantity: z.number().min(0.01, { message: "Kiekis turi būti didesnis už nulį" }),
  unitPrice: z.number().min(0, { message: "Vieneto kaina negali būti neigiama" }),
  vatRate: z.number().min(0, { message: "PVM tarifas negali būti neigiamas" }),
  totalPrice: z.number().min(0, { message: "Bendra kaina negali būti neigiama" })
})

const InvoiceSchema = z.object({
  number: z.string().min(1, { message: "Sąskaitos numeris privalomas" }),
  date: z.date(),
  dueDate: z.date(),
  totalAmount: z.number().min(0, { message: "Bendra suma negali būti neigiama" }),
  vatAmount: z.number().min(0, { message: "PVM suma negali būti neigiama" }),
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']).default('DRAFT'),
  userId: z.string(),
  clientId: z.string(),
  items: z.array(InvoiceItemSchema).min(1, { message: "Bent vienas produktas privalomas" })
})

export async function createInvoice(formData: FormData) {
  const validatedFields = InvoiceSchema.safeParse({
    number: formData.get('number'),
    date: new Date(formData.get('date') as string),
    dueDate: new Date(formData.get('dueDate') as string),
    totalAmount: parseFloat(formData.get('totalAmount') as string),
    vatAmount: parseFloat(formData.get('vatAmount') as string),
    status: formData.get('status') || 'DRAFT',
    userId: formData.get('userId'),
    clientId: formData.get('clientId'),
    items: JSON.parse(formData.get('items') as string)
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Trūksta duomenų. Nepavyko sukurti sąskaitos.'
    }
  }

  const { 
    number, date, dueDate, totalAmount, vatAmount, 
    status, userId, clientId, items 
  } = validatedFields.data

  try {
    const invoice = await prisma.invoice.create({
      data: {
        number,
        date,
        dueDate,
        totalAmount,
        vatAmount,
        status,
        userId,
        clientId,
        items: {
          create: items
        }
      }
    })

    revalidatePath('/dashboard/saskaitos')
    return { success: true, invoice }
  } catch (error) {
    console.error('Klaida kuriant sąskaitą:', error)
    return { 
      success: false, 
      message: 'Nepavyko sukurti sąskaitos dėl sisteminės klaidos.' 
    }
  }
}

export async function getInvoices(userId: string) {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      include: {
        client: true,
        items: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, invoices }
  } catch (error) {
    console.error('Klaida gaunant sąskaitas:', error)
    return { 
      success: false, 
      message: 'Nepavyko gauti sąskaitų sąrašo.' 
    }
  }
}

export async function getInvoiceById(id: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true,
        items: true
      }
    })
    return { success: true, invoice }
  } catch (error) {
    console.error('Klaida gaunant sąskaitą:', error)
    return { 
      success: false, 
      message: 'Nepavyko rasti sąskaitos.' 
    }
  }
}

export async function updateInvoice(id: string, formData: FormData) {
  const validatedFields = InvoiceSchema.safeParse({
    number: formData.get('number'),
    date: new Date(formData.get('date') as string),
    dueDate: new Date(formData.get('dueDate') as string),
    totalAmount: parseFloat(formData.get('totalAmount') as string),
    vatAmount: parseFloat(formData.get('vatAmount') as string),
    status: formData.get('status') || 'DRAFT',
    userId: formData.get('userId'),
    clientId: formData.get('clientId'),
    items: JSON.parse(formData.get('items') as string)
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Trūksta duomenų. Nepavyko atnaujinti sąskaitos.'
    }
  }

  const { 
    number, date, dueDate, totalAmount, vatAmount, 
    status, userId, clientId, items 
  } = validatedFields.data

  try {
    // Pirmiausia ištriname esamas sąskaitos eilutes
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: id }
    })

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        number,
        date,
        dueDate,
        totalAmount,
        vatAmount,
        status,
        userId,
        clientId,
        items: {
          create: items
        }
      }
    })

    revalidatePath('/dashboard/saskaitos')
    return { success: true, invoice }
  } catch (error) {
    console.error('Klaida atnaujinant sąskaitą:', error)
    return { 
      success: false, 
      message: 'Nepavyko atnaujinti sąskaitos dėl sisteminės klaidos.' 
    }
  }
}

export async function deleteInvoice(id: string) {
  try {
    // Pirmiausia ištriname sąskaitos eilutes
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: id }
    })

    // Tada ištriname pačią sąskaitą
    await prisma.invoice.delete({
      where: { id }
    })

    revalidatePath('/dashboard/saskaitos')
    return { success: true }
  } catch (error) {
    console.error('Klaida trinant sąskaitą:', error)
    return { 
      success: false, 
      message: 'Nepavyko ištrinti sąskaitos dėl sisteminės klaidos.' 
    }
  }
}