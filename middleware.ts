import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get session instead of just user
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user

  console.log('🔄 Middleware: Request to', request.nextUrl.pathname)
  console.log('👤 User authenticated:', !!user)
  console.log('🔗 Supabase URL configured:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('🔑 Supabase Key configured:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  console.log('🍪 Session exists:', !!session)

  // Only protect dashboard routes - don't interfere with login/register
  const protectedRoutes = ['/dashboard', '/profile', '/settings']
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Temporarily disable protection to test login flow
  if (isProtectedRoute && !user) {
    console.log('🔄 Middleware: Unauthenticated user trying to access', request.nextUrl.pathname)
    console.log('⚠️ TEMPORARILY ALLOWING ACCESS FOR TESTING')
    // const redirectUrl = new URL('/login', request.url)
    // redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    // return NextResponse.redirect(redirectUrl)
  }

  // Don't redirect authenticated users away from auth pages
  // Let the client-side handle login redirects

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 