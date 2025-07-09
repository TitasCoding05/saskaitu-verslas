'use server'

import prisma from '@/lib/db'
import { z } from 'zod'
import * as bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const CompanyRegistrationSchema = z.object({
  // User details
  name: z.string().min(2, { message: "Vardas turi būti bent 2 simbolių" }),
  email: z.string().email({ message: "Neteisingas el. pašto formatas" }),
  password: z.string().min(6, { message: "Slaptažodis turi būti bent 6 simbolių" }),
  confirmPassword: z.string(),

  // Company details
  companyName: z.string().min(2, { message: "Įmonės pavadinimas privalomas" }),
  companyCode: z.string().min(5, { message: "Įmonės kodas privalomas" }),
  vatCode: z.string().optional(),
  companyAddress: z.string().min(5, { message: "Įmonės adresas privalomas" }),
  companyPhone: z.string().min(8, { message: "Telefono numeris privalomas" }),
  contactPerson: z.string().min(2, { message: "Kontaktinio asmens vardas privalomas" }),
  contactEmail: z.string().email({ message: "Neteisingas kontaktinio asmens el. pašto formatas" }),

  // Plan details
  planId: z.enum(["free", "monthly", "annual"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Slaptažodžiai nesutampa",
  path: ["confirmPassword"]
})

export async function registerCompany(formData: FormData) {
  const validatedFields = CompanyRegistrationSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    companyName: formData.get('companyName'),
    companyCode: formData.get('companyCode'),
    vatCode: formData.get('vatCode'),
    companyAddress: formData.get('companyAddress'),
    companyPhone: formData.get('companyPhone'),
    contactPerson: formData.get('contactPerson'),
    contactEmail: formData.get('contactEmail'),
    planId: formData.get('planId')
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Registracijos duomenys neteisingi.'
    }
  }

  const { 
    name, email, password, 
    companyName, companyCode, vatCode, 
    companyAddress, companyPhone, 
    contactPerson, contactEmail,
    planId 
  } = validatedFields.data

  try {
    // Check if user or company already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    const existingCompany = await prisma.client.findFirst({
      where: { registrationCode: companyCode }
    })

    if (existingUser) {
      return {
        message: 'Vartotojas su šiuo el. paštu jau egzistuoja.',
        success: false
      }
    }

    if (existingCompany) {
      return {
        message: 'Įmonė su šiuo kodu jau yra sistemoje.',
        success: false
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user and company in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Determine role (special case for admin)
      const role = email === 'admin@admin.com' ? 'ADMIN' : 'USER'

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role
        }
      })

      // Create company/client
      const client = await prisma.client.create({
        data: {
          name: companyName,
          registrationCode: companyCode,
          vatCode: vatCode || null,
          address: companyAddress,
          phone: companyPhone,
          email: contactEmail,
          userId: user.id
        }
      })

      return { user, client }
    })

    // Set session cookie
    await (await cookies()).set({
      name: 'userId',
      value: result.user.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    // Redirect based on plan
    const redirectPath = planId === 'free' 
      ? '/dashboard' 
      : `/atsiskaitymas?plan=${planId}`

    return { 
      success: true, 
      message: 'Vartotojas ir įmonė sėkmingai užregistruoti.',
      redirectPath 
    }
  } catch (error) {
    console.error('Registracijos klaida:', error)
    return { 
      success: false, 
      message: 'Nepavyko užregistruoti vartotojo ir įmonės.' 
    }
  }
}