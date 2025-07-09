import { PrismaClient, UserRole } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed script...')

  try {
    // Delete existing related records first
    console.log('Deleting existing admin-related records...')
    await prisma.processedDocument.deleteMany({
      where: { user: { email: 'admin@admin.com' } }
    })
    await prisma.client.deleteMany({
      where: { email: 'admin@admin.com' }
    })
    await prisma.user.deleteMany({
      where: { email: 'admin@admin.com' }
    })
    console.log('Existing admin records deleted')

    // Hash the password
    console.log('Hashing password...')
    const hashedPassword = await bcrypt.hash('admin', 10)
    
    // Ensure the password is exactly 'admin'
    const isPasswordValid = await bcrypt.compare('admin', hashedPassword)
    if (!isPasswordValid) {
      throw new Error('Password hashing failed')
    }

    // Create admin user
    console.log('Creating admin user...')
    const adminUser = await prisma.user.create({
      data: {
        name: 'Administratorius',
        email: 'admin@admin.com',
        password: hashedPassword,
        role: UserRole.ADMIN
      }
    })
    console.log(`Admin user created with ID: ${adminUser.id}`)

    // Create a default company for the admin
    console.log('Creating admin company...')
    const adminCompany = await prisma.client.create({
      data: {
        name: 'Sistemos Administracija',
        registrationCode: '000000000',
        address: 'Administracijos g. 1, Vilnius',
        email: 'admin@admin.com',
        userId: adminUser.id
      }
    })
    console.log(`Admin company created with ID: ${adminCompany.id}`)

    // Verify user creation
    const createdUser = await prisma.user.findUnique({
      where: { email: 'admin@admin.com' }
    })
    console.log('Verification:', createdUser ? 'User found' : 'User NOT found')
    if (createdUser) {
      console.log('Created user details:', JSON.stringify(createdUser, null, 2))
    }

    console.log('Admin account creation completed successfully')
  } catch (error) {
    console.error('Error in seed script:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('Seed script failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })