// File: app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, password, phone, type, storeName } = data;

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        type,
      },
    });

    // If user is a vendor, create vendor record
    if (type === 'VENDOR') {
      if (!storeName) {
        return NextResponse.json(
          { success: false, error: 'Restaurant name is required for vendors' },
          { status: 400 }
        );
      }

      await prisma.vendor.create({
        data: {
          userId: user.id,
          storeName,
          status: 'PENDING' // Vendors start with pending status
        },
      });

      // For vendors, don't set cookie, just return success
      return NextResponse.json({
        success: true,
        message: 'Your vendor account has been created and is pending review. You will be able to login once approved.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          type: user.type,
        },
      });
    }

    // For regular customers, set auth cookie and return success
    const sessionData = {
      id: user.id,
      email: user.email,
      type: user.type,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    };

    // Set cookie - properly awaited now
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth',
      value: JSON.stringify(sessionData),
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: 'strict',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}