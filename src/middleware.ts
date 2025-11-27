import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Public routes
  const publicRoutes = ['/login', '/register', '/api/auth', '/connect'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // API routes that need auth
  const protectedApiRoutes = ['/api/connections', '/api/n8n'];
  const isProtectedApiRoute = protectedApiRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Admin routes
  const adminRoutes = ['/admin'];
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Redirect to login if accessing protected route without auth
  if (!isLoggedIn && !isPublicRoute && pathname !== '/') {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect to dashboard if logged in and trying to access login
  if (isLoggedIn && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  // Disable public registration - only admin can create accounts
  if (pathname === '/register' && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Check admin access
  if (isAdminRoute && isLoggedIn) {
    const role = req.auth?.user?.role;
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

