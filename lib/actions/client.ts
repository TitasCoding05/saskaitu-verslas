'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const ClientSchema = z.object({
  name: z.string().min(2, { message: "Kliento vardas turi būti bent 2 simbolių" }),
  email: z.string().email({ message: "Neteisingas el. pašto formatas" }).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  registrationCode: z.string().optional(),
  vatCode: z.string().optional(),
  userId: z.string()
})

export async function createClient(formData: FormData) {
  const validatedFields = ClientSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    registrationCode: formData.get('registrationCode'),
    vatCode: formData.get('vatCode'),
    userId: formData.get('userId')
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Trūksta duomenų. Nepavyko sukurti kliento.'
    }
  }

  const { name, email, phone, address, registrationCode, vatCode, userId } = validatedFields.data

  try {
    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        address,
        registrationCode,
        vatCode,
        userId
      }
    })

    revalidatePath('/dashboard/klientai')
    return { success: true, client }
  } catch (error) {
    console.error('Klaida kuriant klientą:', error)
    return { 
      success: false, 
      message: 'Nepavyko sukurti kliento dėl sisteminės klaidos.' 
    }
  }
}

export async function getClients(userId: string) {
  try {
    const clients = await prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, clients }
  } catch (error) {
    console.error('Klaida gaunant klientus:', error)
    return { 
      success: false, 
      message: 'Nepavyko gauti klientų sąrašo.' 
    }
  }
}

export async function getClientById(id: string) {
  try {
    const client = await prisma.client.findUnique({
      where: { id }
    })
    return { success: true, client }
  } catch (error) {
    console.error('Klaida gaunant klientą:', error)
    return { 
      success: false, 
      message: 'Nepavyko rasti kliento.' 
    }
  }
}

export async function updateClient(id: string, formData: FormData) {
  const validatedFields = ClientSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    registrationCode: formData.get('registrationCode'),
    vatCode: formData.get('vatCode'),
    userId: formData.get('userId')
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Trūksta duomenų. Nepavyko atnaujinti kliento.'
    }
  }

  const { name, email, phone, address, registrationCode, vatCode, userId } = validatedFields.data

  try {
    const client = await prisma.client.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        registrationCode,
        vatCode,
        userId
      }
    })

    revalidatePath('/dashboard/klientai')
    return { success: true, client }
  } catch (error) {
    console.error('Klaida atnaujinant klientą:', error)
    return { 
      success: false, 
      message: 'Nepavyko atnaujinti kliento dėl sisteminės klaidos.' 
    }
  }
}

export async function deleteClient(id: string) {
  try {
    await prisma.client.delete({
      where: { id }
    })

    revalidatePath('/dashboard/klientai')
    return { success: true }
  } catch (error) {
    console.error('Klaida trinant klientą:', error)
    return { 
      success: false, 
      message: 'Nepavyko ištrinti kliento dėl sisteminės klaidos.' 
    }
  }
}