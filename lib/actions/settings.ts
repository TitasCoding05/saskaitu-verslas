'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const VatRateSchema = z.object({
  name: z.string().min(1, { message: "PVM tarifo pavadinimas privalomas" }),
  rate: z.number().min(0, { message: "PVM tarifas negali būti neigiamas" }),
  isDefault: z.boolean().optional()
})

const UnitSchema = z.object({
  name: z.string().min(1, { message: "Vieneto pavadinimas privalomas" }),
  shortName: z.string().min(1, { message: "Trumpas vieneto pavadinimas privalomas" })
})

const BankAccountSchema = z.object({
  bankName: z.string().min(1, { message: "Banko pavadinimas privalomas" }),
  accountNumber: z.string().min(1, { message: "Sąskaitos numeris privalomas" }),
  iban: z.string().min(1, { message: "IBAN privalomas" }),
  swift: z.string().optional(),
  isDefault: z.boolean().optional()
})

export async function createVatRate(formData: FormData) {
  const validatedFields = VatRateSchema.safeParse({
    name: formData.get('name'),
    rate: parseFloat(formData.get('rate') as string),
    isDefault: formData.get('isDefault') === 'true'
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Trūksta duomenų. Nepavyko sukurti PVM tarifo.'
    }
  }

  const { name, rate, isDefault } = validatedFields.data

  try {
    // Jei nustatomas kaip numatytasis, pašaliname ankstesnį numatytąjį
    if (isDefault) {
      await prisma.vatRate.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      })
    }

    const vatRate = await prisma.vatRate.create({
      data: {
        name,
        rate,
        isDefault: isDefault || false
      }
    })

    revalidatePath('/dashboard/nustatymai')
    return { success: true, vatRate }
  } catch (error) {
    console.error('Klaida kuriant PVM tarifą:', error)
    return { 
      success: false, 
      message: 'Nepavyko sukurti PVM tarifo dėl sisteminės klaidos.' 
    }
  }
}

export async function getVatRates() {
  try {
    const vatRates = await prisma.vatRate.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, vatRates }
  } catch (error) {
    console.error('Klaida gaunant PVM tarifus:', error)
    return { 
      success: false, 
      message: 'Nepavyko gauti PVM tarifų sąrašo.' 
    }
  }
}

export async function createUnit(formData: FormData) {
  const validatedFields = UnitSchema.safeParse({
    name: formData.get('name'),
    shortName: formData.get('shortName')
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Trūksta duomenų. Nepavyko sukurti vieneto.'
    }
  }

  const { name, shortName } = validatedFields.data

  try {
    const unit = await prisma.unit.create({
      data: {
        name,
        shortName
      }
    })

    revalidatePath('/dashboard/nustatymai')
    return { success: true, unit }
  } catch (error) {
    console.error('Klaida kuriant vienetą:', error)
    return { 
      success: false, 
      message: 'Nepavyko sukurti vieneto dėl sisteminės klaidos.' 
    }
  }
}

export async function getUnits() {
  try {
    const units = await prisma.unit.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, units }
  } catch (error) {
    console.error('Klaida gaunant vienetus:', error)
    return { 
      success: false, 
      message: 'Nepavyko gauti vienetų sąrašo.' 
    }
  }
}

export async function createBankAccount(formData: FormData) {
  const validatedFields = BankAccountSchema.safeParse({
    bankName: formData.get('bankName'),
    accountNumber: formData.get('accountNumber'),
    iban: formData.get('iban'),
    swift: formData.get('swift'),
    isDefault: formData.get('isDefault') === 'true'
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Trūksta duomenų. Nepavyko sukurti banko sąskaitos.'
    }
  }

  const { bankName, accountNumber, iban, swift, isDefault } = validatedFields.data

  try {
    // Jei nustatoma kaip numatytoji, pašaliname ankstesnę numatytąją
    if (isDefault) {
      await prisma.bankAccount.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      })
    }

    const bankAccount = await prisma.bankAccount.create({
      data: {
        bankName,
        accountNumber,
        iban,
        swift,
        isDefault: isDefault || false
      }
    })

    revalidatePath('/dashboard/nustatymai')
    return { success: true, bankAccount }
  } catch (error) {
    console.error('Klaida kuriant banko sąskaitą:', error)
    return { 
      success: false, 
      message: 'Nepavyko sukurti banko sąskaitos dėl sisteminės klaidos.' 
    }
  }
}

export async function getBankAccounts() {
  try {
    const bankAccounts = await prisma.bankAccount.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, bankAccounts }
  } catch (error) {
    console.error('Klaida gaunant banko sąskaitas:', error)
    return { 
      success: false, 
      message: 'Nepavyko gauti banko sąskaitų sąrašo.' 
    }
  }
}