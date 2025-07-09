import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  // Apsaugoti prisijungimo reikalaujančius puslapius
  const protectedPaths = [
    '/dashboard',
    '/atsiskaitymas'
  ]

  const isPathProtected = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // Jei puslapis apsaugotas ir nėra prisijungimo, nukreipti į prisijungimo puslapį
  if (isPathProtected && !token) {
    return NextResponse.redirect(new URL('/prisijungti', request.url))
  }

  // Jei prisijungęs bando patekti į prisijungimo puslapį, nukreipti į pagrindinį puslapį
  if (request.nextUrl.pathname === '/prisijungti' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Nurodyti, kuriuos kelius stebėti
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/atsiskaitymas/:path*', 
    '/prisijungti'
  ]
}