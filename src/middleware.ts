import { NextResponse } from 'next/server';

// Define protected paths and their allowed types
const protectedPaths = {
  '/admin': ['ADMIN'],
  '/vendor': ['VENDOR'],
  '/my-account': ['CUSTOMER', 'VENDOR', 'ADMIN']
};

export async function middleware(request) {
  try {
    // Get the path from the request
    const path = request.nextUrl.pathname;

    // Default redirects for dashboard paths
    if (path === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    if (path === '/vendor') {
      return NextResponse.redirect(new URL('/vendor/dashboard', request.url));
    }
    if (path === '/my-account') {
      return NextResponse.redirect(new URL('/my-account/library', request.url));
    }

    // Check if this path needs protection
    const needsProtection = Object.keys(protectedPaths).some(protectedPath =>
      path.startsWith(protectedPath)
    );

    if (!needsProtection) {
      return NextResponse.next();
    }

    // Get the auth cookie
    const authCookie = request.cookies.get('auth');

    if (!authCookie) {
      // Redirect to login if no auth cookie
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Parse the auth cookie
    const authData = JSON.parse(authCookie.value);

    // Check if cookie is expired
    if (authData.exp && authData.exp < Date.now()) {
      // Redirect to login if cookie is expired
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Check user type and path permissions
    const userType = authData.type;
    let isAllowed = false;

    // Check each protected path
    for (const [protectedPath, allowedTypes] of Object.entries(protectedPaths)) {
      if (path.startsWith(protectedPath)) {
        isAllowed = allowedTypes.includes(userType);
        break;
      }
    }

    if (!isAllowed) {
      // If admin tries to access other dashboards
      if (userType === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      // If vendor tries to access other dashboards
      if (userType === 'VENDOR') {
        return NextResponse.redirect(new URL('/vendor', request.url));
      }
      // If customer tries to access admin or vendor dashboard
      if (userType === 'CUSTOMER') {
        return NextResponse.redirect(new URL('/my-account', request.url));
      }
      // For any other unauthorized access
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Allow the request to proceed
    return NextResponse.next();

  } catch (error) {
    console.error('Middleware error:', error);
    // On any error, redirect to login
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/admin/:path*',
    '/vendor/:path*',
    '/my-account/:path*'
  ]
};