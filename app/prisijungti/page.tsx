'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleCredentialsSubmit(formData: FormData) {
    setError(null)
    setIsLoading(true)
    
    try {
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Neteisingi prisijungimo duomenys')
      } else if (result?.ok) {
        // Redirect to dashboard on successful login
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Įvyko klaida prisijungiant')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true)
    try {
      await signIn('google', {
        redirect: true,
        callbackUrl: '/dashboard'
      })
    } catch (error) {
      console.error('Google sign-in error:', error)
      setError('Nepavyko prisijungti per Google')
      setIsLoading(false)
    }
  }

  async function handleAdminLogin() {
    setError(null)
    setIsLoading(true)
    
    try {
      const result = await signIn('credentials', {
        email: 'admin@admin.com',
        password: 'admin',
        redirect: false
      })

      if (result?.error) {
        setError('Nepavyko prisijungti kaip administratorius')
      } else if (result?.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Admin login error:', error)
      setError('Įvyko klaida prisijungiant')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center">Prisijungimas</h1>
        
        <form action={handleCredentialsSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">El. paštas</Label>
            <Input
              type="email"
              id="email"
              name="email"
              required
              placeholder="jusu.pastas@pavyzdys.lt"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Slaptažodis</Label>
            <Input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Įveskite slaptažodį"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Prisijungiama...' : 'Prisijungti'}
          </Button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">arba</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="space-y-2">
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleAdminLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Prisijungiama...' : 'Prisijungti kaip Admin'}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? 'Prisijungiama...' : 'Prisijungti per Google'}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Neturite paskyros? {' '}
            <Link href="/registracija" className="text-blue-600 hover:underline">
              Registruotis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
