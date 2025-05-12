import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    // Parse request body
    const data = await request.json();
    const { 
      userId, 
      restaurantId, 
      tableId, 
      date, 
      time, 
      people, 
      specialRequests, 
      orderItems 
    } = data;
    
    // Validate required fields
    if (!userId || !restaurantId || !tableId || !date || !time || !people) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });
    
    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }
    
    // Check if restaurant is open for bookings
    if (!restaurant.isOpen) {
      return NextResponse.json(
        { success: false, error: 'Restaurant is not accepting bookings at this time' },
        { status: 400 }
      );
    }
    
    // Check if table exists and belongs to the restaurant
    const table = await prisma.table.findFirst({
      where: { 
        id: tableId,
        restaurantId: restaurantId
      }
    });
    
    if (!table) {
      return NextResponse.json(
        { success: false, error: 'Table not found or does not belong to this restaurant' },
        { status: 404 }
      );
    }
    
    // Check if table is available
    if (!table.isAvailable) {
      return NextResponse.json(
        { success: false, error: 'Selected table is not available' },
        { status: 400 }
      );
    }
    
    // Check if table capacity is sufficient
    if (table.capacity < people) {
      return NextResponse.json(
        { success: false, error: 'Table capacity is not sufficient for your group size' },
        { status: 400 }
      );
    }
    
    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        restaurantId,
        tableId,
        date: new Date(date),
        time,
        people,
        specialRequests,
        status: 'PENDING'
      }
    });
    
    // Create order if orderItems are provided
    if (orderItems && orderItems.length > 0) {
      // Fetch menu items to calculate prices
      const menuItemIds = orderItems.map(item => item.menuItemId);
      const menuItems = await prisma.menuItem.findMany({
        where: {
          id: { in: menuItemIds },
          restaurantId
        }
      });
      
      // Calculate total amount
      const totalAmount = orderItems.reduce((total, orderItem) => {
        const menuItem = menuItems.find(item => item.id === orderItem.menuItemId);
        return total + (menuItem?.price || 0) * orderItem.quantity;
      }, 0);
      
      // Create order
      const order = await prisma.order.create({
        data: {
          bookingId: booking.id,
          totalAmount,
          isPaid: false,
          orderItems: {
            create: orderItems.map(item => {
              const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
              return {
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                price: menuItem?.price || 0
              };
            })
          }
        }
      });
    }
    
    // Fetch the created booking with related data
    const createdBooking = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
        restaurant: {
          select: {
            name: true,
            address: true
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
      booking: createdBooking
    });
    
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Fetch bookings for a user

import { cookies } from 'next/headers';

// GET - Fetch bookings with filtering
export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get('upcoming');
    const past = searchParams.get('past');
    const status = searchParams.get('status');
    
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
    
    // Create the where clause for filtering
    const whereClause = {
      userId: userId
    };
    
    // Filter by status if provided
    if (status) {
      whereClause.status = status;
    }
    
    // Handle upcoming/past filtering
    const now = new Date();
    
    if (upcoming === 'true') {
      whereClause.date = {
        gte: now
      };
      // Exclude cancelled bookings for upcoming tab
      if (!status) {
        whereClause.status = { 
          not: 'CANCELLED' 
        };
      }
    }
    
    if (past === 'true') {
      whereClause.date = {
        lt: now
      };
      // Exclude cancelled bookings for past tab
      if (!status) {
        whereClause.status = { 
          not: 'CANCELLED' 
        };
      }
    }
    
    // Fetch bookings for the user with filters
    const bookings = await prisma.booking.findMany({
      where: whereClause,
      orderBy: { 
        date: past === 'true' ? 'desc' : 'asc' // Past bookings newest first, upcoming oldest first
      },
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
      bookings
    });
    
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update booking status (cancel, confirm, complete)
export async function PATCH(request) {
  try {
    const data = await request.json();
    const { bookingId, status, userId } = data;
    
    if (!bookingId || !status) {
      return NextResponse.json(
        { success: false, error: 'Booking ID and status are required' },
        { status: 400 }
      );
    }
    
    // Verify booking exists and belongs to the user if userId is provided
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        ...(userId && { userId })
      }
    });
    
    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found or does not belong to the user' },
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
        restaurant: {
          select: {
            name: true,
            address: true
          }
        },
        table: true,
        order: true
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