import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

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

// GET - Fetch admin dashboard stats
export async function GET(request) {
  try {
    const authResult = await checkAdminAuth();
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }
    
    // Fetch various stats
    const [
      totalUsers,
      totalRestaurants,
      totalBookings,
      pendingVendors
    ] = await Promise.all([
      prisma.user.count(),
      prisma.restaurant.count(),
      prisma.booking.count(),
      prisma.vendor.count({
        where: { status: 'PENDING' }
      })
    ]);
    
    // Get user counts by type
    const usersByType = await prisma.user.groupBy({
      by: ['type'],
      _count: {
        _all: true
      }
    });
    
    // Format user type counts
    const userTypeCounts = {};
    usersByType.forEach(item => {
      userTypeCounts[item.type] = item._count._all;
    });
    
    // Get booking counts by status
    const bookingsByStatus = await prisma.booking.groupBy({
      by: ['status'],
      _count: {
        _all: true
      }
    });
    
    // Format booking status counts
    const bookingStatusCounts = {};
    bookingsByStatus.forEach(item => {
      bookingStatusCounts[item.status] = item._count._all;
    });
    
    // Calculate additional metrics
    const recentUsersCount = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });
    
    const recentBookingsCount = await prisma.booking.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalRestaurants,
        totalBookings,
        pendingVendors,
        userTypeCounts,
        bookingStatusCounts,
        recentUsersCount,
        recentBookingsCount
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}