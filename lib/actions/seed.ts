'use server'

import prisma from '@/lib/db'
import * as bcrypt from 'bcrypt'

export async function seedAdminAccount() {
  const adminEmail = 'admin@admin.com'

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (existingAdmin) {
    return { 
      success: true, 
      message: 'Admin account already exists.' 
    }
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10)

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'Administratorius',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    // Optionally create a default company for the admin
    await prisma.client.create({
      data: {
        name: 'Sistemos Administracija',
        registrationCode: '000000000',
        address: 'Administracijos g. 1, Vilnius',
        email: adminEmail,
        userId: adminUser.id
      }
    })

    return { 
      success: true, 
      message: 'Admin account created successfully.' 
    }
  } catch (error) {
    console.error('Admin account creation error:', error)
    return { 
      success: false, 
      message: 'Failed to create admin account.' 
    }
  }
}