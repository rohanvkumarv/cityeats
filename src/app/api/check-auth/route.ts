import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

// const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get the auth cookie
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');

    // If no cookie, return not authenticated
    if (!authCookie) {
      return NextResponse.json({ success: false, message: 'Not authenticated' });
    }

    // Parse cookie value
    const authData = JSON.parse(authCookie.value);
    
    // Check if cookie is expired
    if (authData.exp && authData.exp < Date.now()) {
      return NextResponse.json({ success: false, message: 'Session expired' });
    }

    // Get user from database to verify they still exist
    const user = await prisma.user.findUnique({
      where: { id: authData.id },
      select: {
        id: true,
        email: true,
        name: true,
        type: true
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' });
    }

    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type
      }
    });
  } catch (error) {
    console.error('Error checking authentication:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}