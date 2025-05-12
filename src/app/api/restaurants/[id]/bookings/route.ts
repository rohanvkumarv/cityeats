 
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { sendBookingConfirmation } from '@/lib/email';

export async function POST(request) {
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
    const { 
      restaurantId, 
      tableId, 
      date, 
      time, 
      people,
      specialRequests,
      orderItems = []
    } = data;
    
    // Validate required fields
    if (!restaurantId || !tableId || !date || !time || !people) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
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
    
    // Check if restaurant is open
    if (!restaurant.isOpen) {
      return NextResponse.json(
        { success: false, error: 'Restaurant is currently closed for bookings' },
        { status: 400 }
      );
    }
    
    // Check if table exists and is available
    const table = await prisma.table.findUnique({
      where: { id: tableId }
    });
    
    if (!table) {
      return NextResponse.json(
        { success: false, error: 'Table not found' },
        { status: 404 }
      );
    }
    
    if (!table.isAvailable) {
      return NextResponse.json(
        { success: false, error: 'Table is not available' },
        { status: 400 }
      );
    }
    
    // Check if table capacity is sufficient
    if (table.capacity < people) {
      return NextResponse.json(
        { success: false, error: 'Table capacity is insufficient for the number of people' },
        { status: 400 }
      );
    }
    
    // Check for existing bookings at the same time
    const bookingDate = new Date(date);
    const existingBooking = await prisma.booking.findFirst({
      where: {
        tableId,
        date: {
          gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
          lt: new Date(bookingDate.setHours(23, 59, 59, 999)),
        },
        time,
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    });
    
    if (existingBooking) {
      return NextResponse.json(
        { success: false, error: 'Table is already booked for this time slot' },
        { status: 400 }
      );
    }
    
    // Calculate total amount for pre-ordered items
    let totalAmount = 0;
    let validatedOrderItems = [];
    
    if (orderItems.length > 0) {
      // Get all menu items at once for better performance
      const menuItemIds = orderItems.map(item => item.menuItemId);
      const menuItems = await prisma.menuItem.findMany({
        where: {
          id: { in: menuItemIds },
          restaurantId
        }
      });
      
      // Map of menu item id to price
      const menuItemPrices = {};
      menuItems.forEach(item => {
        menuItemPrices[item.id] = item.price;
      });
      
      // Validate each order item
      for (const item of orderItems) {
        if (!menuItemPrices[item.menuItemId]) {
          return NextResponse.json(
            { success: false, error: 'Invalid menu item in order' },
            { status: 400 }
          );
        }
        
        const itemPrice = menuItemPrices[item.menuItemId];
        const itemTotal = itemPrice * item.quantity;
        totalAmount += itemTotal;
        
        validatedOrderItems.push({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: itemPrice
        });
      }
    }
    
    // Create booking with transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create booking
      const booking = await tx.booking.create({
        data: {
          userId: authData.id,
          restaurantId,
          tableId,
          date: new Date(date),
          time,
          people,
          specialRequests,
          status: 'CONFIRMED'
        }
      });
      
      // Create order if there are order items
      if (validatedOrderItems.length > 0) {
        const order = await tx.order.create({
          data: {
            bookingId: booking.id,
            totalAmount,
            isPaid: false,
            orderItems: {
              create: validatedOrderItems.map(item => ({
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                price: item.price
              }))
            }
          }
        });
      }
      
      return booking;
    });
    
    // Get user data for email
    const user = await prisma.user.findUnique({
      where: { id: authData.id },
      select: { name: true, email: true }
    });
    
    // Send confirmation email
    if (user && user.email) {
      try {
        await sendBookingConfirmation(result, restaurant, user);
      } catch (emailError) {
        console.error('Error sending booking confirmation email:', emailError);
        // Don't fail the booking if email fails
      }
    }
    
    return NextResponse.json({
      success: true,
      booking: result
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

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
    
    const { searchParams } = new URL(request.url);
    const userId = authData.id;
    const status = searchParams.get('status');
    const upcoming = searchParams.get('upcoming') === 'true';
    
    // Build query
    const where = { userId };
    
    if (status) {
      where.status = status;
    }
    
    if (upcoming) {
      where.date = {
        gte: new Date()
      };
    }
    
    // Get bookings
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            images: {
              where: { isMain: true },
              take: 1
            }
          }
        },
        table: {
          select: {
            type: true,
            hasAC: true,
            capacity: true
          }
        },
        order: {
          include: {
            orderItems: {
              include: {
                menuItem: {
                  select: {
                    name: true,
                    price: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    return NextResponse.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}