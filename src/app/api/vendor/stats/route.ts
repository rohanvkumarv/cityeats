import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// GET - Fetch vendor booking statistics
export async function GET(request) {
  try {
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
    
    const restaurantId = restaurant.id;
    
    // Get total bookings count
    const totalBookings = await prisma.booking.count({
      where: { restaurantId }
    });
    
    // Get pending bookings count
    const pendingBookings = await prisma.booking.count({
      where: { 
        restaurantId,
        status: 'PENDING'
      }
    });
    
    // Get completed bookings count
    const completedBookings = await prisma.booking.count({
      where: { 
        restaurantId,
        status: 'COMPLETED'
      }
    });
    
    // Get cancelled bookings count
    const cancelledBookings = await prisma.booking.count({
      where: { 
        restaurantId,
        status: 'CANCELLED'
      }
    });
    
    // Return stats
    return NextResponse.json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        completedBookings,
        cancelledBookings
      }
    });
    
  } catch (error) {
    console.error('Error fetching vendor stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}