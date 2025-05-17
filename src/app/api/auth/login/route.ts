
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    const { email, password } = data;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email with vendor info included
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        vendor: true
      }
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check vendor status if user is a vendor
    if (user.type === 'VENDOR') {
      if (!user.vendor) {
        return NextResponse.json(
          { success: false, error: 'Vendor account is incomplete. Please contact support.' },
          { status: 403 }
        );
      }

      if (user.vendor.status === 'PENDING') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Your restaurant account is still under review. You will be notified when approved.',
            pendingVendor: true
          },
          { status: 403 }
        );
      }

      if (user.vendor.status === 'REJECTED') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Your restaurant account application was not approved. Please contact support for more information.',
            rejectedVendor: true
          },
          { status: 403 }
        );
      }
    }

    // Create session data
    const sessionData = {
      id: user.id,
      email: user.email,
      type: user.type,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    };

    // Set cookie
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

    // Return success response
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
        ...(user.type === 'VENDOR' && { 
          vendor: {
            storeName: user.vendor.storeName,
            status: user.vendor.status
          }
        })
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}