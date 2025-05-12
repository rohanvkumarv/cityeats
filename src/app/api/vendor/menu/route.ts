import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

// GET - Fetch vendor's menu items
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
    
    // Verify user is a vendor
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
    
    // Get vendor's restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { vendorId: user.vendor.id }
    });
    
    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }
    
    // Get menu items
    const menuItems = await prisma.menuItem.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });
    
    return NextResponse.json({
      success: true,
      menuItems
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new menu item
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
    
    // Verify user is a vendor
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
    
    // Get vendor's restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { vendorId: user.vendor.id }
    });
    
    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }
    
    // Parse request body
    const data = await request.json();
    const { 
      name, 
      description, 
      price, 
      category, 
      isAvailable 
    } = data;
    
    // Validate required fields
    if (!name || !category || typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid menu item data' },
        { status: 400 }
      );
    }
    
    // Create menu item
    const menuItem = await prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        name,
        description: description || '',
        price,
        category,
        isAvailable: isAvailable === true
      }
    });
    
    return NextResponse.json({
      success: true,
      menuItem
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}