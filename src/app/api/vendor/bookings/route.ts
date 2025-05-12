import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// GET - Fetch vendor bookings with filters
export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const search = searchParams.get('search');
    
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
    
    // Build where clause for filtering
    const whereClause = {
      restaurantId
    };
    
    // Filter by status if provided
    if (status) {
      whereClause.status = status;
    }
    
    // Filter by date if provided
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      whereClause.date = {
        gte: startDate,
        lte: endDate
      };
    }
    
    // Build user search filter
    let userWhereClause = {};
    if (search) {
      userWhereClause = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      };
    }
    
    // Fetch bookings with filters
    const bookings = await prisma.booking.findMany({
      where: {
        ...whereClause,
        ...(search ? { user: userWhereClause } : {})
      },
      orderBy: [
        { date: 'desc' },
        { time: 'desc' }
      ],
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
      bookings
    });
    
  } catch (error) {
    console.error('Error fetching vendor bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}