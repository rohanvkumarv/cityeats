import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { sendRegistrationConfirmation } from '@/lib/email';

// Helper function to check admin authorization
async function checkAdminAuth() {
  // Get the auth cookie
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth');
  
  if (!authCookie) {
    return { authorized: false, error: 'Authentication required', status: 401 };
  }
  
  // Parse auth data
  const authData = JSON.parse(authCookie.value);
  
  if (!authData.id || authData.exp < Date.now()) {
    return { authorized: false, error: 'Authentication required', status: 401 };
  }
  
  // Verify user is an admin
  const user = await prisma.user.findUnique({
    where: { id: authData.id }
  });
  
  if (!user || user.type !== 'ADMIN') {
    return { authorized: false, error: 'Admin access required', status: 403 };
  }
  
  return { authorized: true, user };
}

// GET - Fetch specific vendor details
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const authResult = await checkAdminAuth();
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }
    
    // Fetch vendor with related data
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
            updatedAt: true
          }
        },
        restaurant: {
          include: {
            images: true,
            tables: true
          }
        }
      }
    });
    
    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      vendor
    });
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update vendor status (approve/reject)
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const authResult = await checkAdminAuth();
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }
    
    // Parse request body
    const data = await request.json();
    const { status } = data;
    
    // Validate status
    if (!status || !['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // Fetch vendor to check current status
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        user: true
      }
    });
    
    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }
    
    // Update vendor status
    const updatedVendor = await prisma.vendor.update({
      where: { id },
      data: { status },
      include: {
        user: true
      }
    });
    
    // Send notification email to vendor
    try {
      // Different email templates based on status
      if (status === 'APPROVED') {
        await sendRegistrationConfirmation({
          email: vendor.user.email,
          name: vendor.user.name
        });
      }
      // Additional email templates could be added for rejection
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Continue even if email fails
    }
    
    return NextResponse.json({
      success: true,
      vendor: updatedVendor
    });
  } catch (error) {
    console.error('Error updating vendor status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}