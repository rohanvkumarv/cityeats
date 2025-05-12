import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

// GET - Fetch user profile
export async function GET(request) {
  try {
    // Check if user is authenticated
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse auth data
    const authData = JSON.parse(authCookie.value);
    
    if (!authData.id || authData.exp < Date.now()) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: authData.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        type: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request) {
  try {
    // Check if user is authenticated
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse auth data
    const authData = JSON.parse(authCookie.value);
    
    if (!authData.id || authData.exp < Date.now()) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const data = await request.json();
    const { name, email, phone } = data;
    
    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Check if email is already in use by another user
    if (email !== authData.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser && existingUser.id !== authData.id) {
        return NextResponse.json(
          { success: false, error: 'Email is already in use' },
          { status: 409 }
        );
      }
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: authData.id },
      data: {
        name,
        email,
        phone: phone || null
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        type: true
      }
    });
    
    // If email was changed, update the cookie with new email
    if (email !== authData.email) {
      const updatedAuthData = {
        ...authData,
        email
      };
      
      cookieStore.set({
        name: 'auth',
        value: JSON.stringify(updatedAuthData),
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        sameSite: 'strict',
      });
    }
    
    return NextResponse.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}