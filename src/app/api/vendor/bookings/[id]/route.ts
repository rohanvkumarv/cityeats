import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// GET - Fetch specific booking details for vendor
export async function GET(request, { params }) {
  try {
    const bookingId = params.id;
    
    // Get vendor ID from auth cookie
    const cookieStore = cookies();
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
    
    // Get the vendor from user ID
    const user = await prisma.user.findUnique({
      where: { id: authData.id },
      include: { vendor: true }
    });
    
    if (!user || user.type !== 'VENDOR' || !user.vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor access required' },
        { status: 403 }
      );
    }
    
    const vendorId = user.vendor.id;
    
    // Get restaurant ID for the vendor
    const restaurant = await prisma.restaurant.findUnique({
      where: { vendorId }
    });
    
    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }
    
    // Fetch booking with validation that it belongs to this vendor's restaurant
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        restaurantId: restaurant.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        restaurant: {
          select: {
            name: true,
            address: true,
            city: true
          }
        },
        table: true,
        order: {
          include: {
            orderItems: {
              include: {
                menuItem: true
              }
            }
          }
        }
      }
    });
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found or does not belong to your restaurant' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      booking
    });
    
  } catch (error) {
    console.error('Error fetching booking details:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update booking status (confirm, cancel, complete)
export async function PATCH(request, { params }) {
  try {
    const bookingId = params.id;
    const data = await request.json();
    const { status } = data;
    
    // Get vendor ID from auth cookie
    const cookieStore = cookies();
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
    
    // Get the vendor from user ID
    const user = await prisma.user.findUnique({
      where: { id: authData.id },
      include: { vendor: true }
    });
    
    if (!user || user.type !== 'VENDOR' || !user.vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor access required' },
        { status: 403 }
      );
    }
    
    const vendorId = user.vendor.id;
    
    // Get restaurant ID for the vendor
    const restaurant = await prisma.restaurant.findUnique({
      where: { vendorId }
    });
    
    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }
    
    // Validate booking belongs to this restaurant
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        restaurantId: restaurant.id
      }
    });
    
    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found or does not belong to your restaurant' },
        { status: 404 }
      );
    }
    
    // Validate status value
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        table: true,
        order: {
          include: {
            orderItems: {
              include: {
                menuItem: true
              }
            }
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      booking: updatedBooking
    });
    
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}