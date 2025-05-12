 
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// PATCH - Update booking status (cancel, confirm, complete)
export async function PATCH(request, { params }) {
  try {
    const bookingId = params.id;
    const data = await request.json();
    const { status } = data;
    
    // Get user ID from auth cookie
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
    
    const userId = authData.id;
    
    // Validate status value
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // Verify booking exists and belongs to the user
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: userId
      }
    });
    
    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found or does not belong to the user' },
        { status: 404 }
      );
    }
    
    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            images: true
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
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}