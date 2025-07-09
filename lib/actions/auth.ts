'use server'

import prisma from '@/lib/db'
import { z } from 'zod'
import * as bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const RegisterSchema = z.object({
  name: z.string().min(2, { message: "Vardas turi būti bent 2 simbolių" }),
  email: z.string().email({ message: "Neteisingas el. pašto formatas" }),
  password: z.string().min(6, { message: "Slaptažodis turi būti bent 6 simbolių" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Slaptažodžiai nesutampa",
  path: ["confirmPassword"]
})

const LoginSchema = z.object({
  email: z.string().email({ message: "Neteisingas el. pašto formatas" }),
  password: z.string().min(1, { message: "Slaptažodis privalomas" })
})

export async function registerUser(formData: FormData) {
  const validatedFields = RegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword')
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Registracijos duomenys neteisingi.'
    }
  }

  const { name, email, password } = validatedFields.data

  try {
    // Patikrinti, ar vartotojas jau egzistuoja
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return {
        message: 'Vartotojas su šiuo el. paštu jau egzistuoja.',
        success: false
      }
    }

    // Užkoduoti slaptažodį
    const hashedPassword = await bcrypt.hash(password, 10)

    // Sukurti vartotoją
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    // Nustatyti sesiją per cookies
    await (await cookies()).set({
      name: 'userId',
      value: user.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 dienų galiojimas
    })

    return { 
      success: true, 
      message: 'Vartotojas sėkmingai užregistruotas.',
      userId: user.id 
    }
  } catch (error) {
    console.error('Registracijos klaida:', error)
    return { 
      success: false, 
      message: 'Nepavyko užregistruoti vartotojo.' 
    }
  }
}

export async function loginUser(formData: FormData) {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Prisijungimo duomenys neteisingi.'
    }
  }

  const { email, password } = validatedFields.data

  try {
    console.log(`Attempting login for email: ${email}`)

    // Rasti visus vartotojus (debug)
    const allUsers = await prisma.user.findMany()
    console.log('All users:', allUsers.map(u => u.email))

    // Rasti vartotoją
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log(`No user found with email: ${email}`)
      return {
        message: 'Vartotojas nerastas.',
        success: false
      }
    }

    console.log(`User found: ${user.email}, checking password`)

    // Patikrinti slaptažodį
    const isPasswordValid = await bcrypt.compare(password, user.password || '')

    if (!isPasswordValid) {
      console.log('Password validation failed')
      return {
        message: 'Neteisingas slaptažodis.',
        success: false
      }
    }

    console.log('Password validated successfully')

    // Nustatyti sesiją per cookies
    await (await cookies()).set({
      name: 'userId',
      value: user.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 dienų galiojimas
    })

    return {
      success: true,
      message: 'Sėkmingai prisijungta.',
      userId: user.id
    }
  } catch (error) {
    console.error('Prisijungimo klaida:', error)
    return {
      success: false,
      message: 'Nepavyko prisijungti.'
    }
  }
}

export async function logoutUser() {
  await (await cookies()).delete('userId')
  redirect('/prisijungti')
}