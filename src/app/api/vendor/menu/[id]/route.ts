import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

// Helper function to check vendor authorization
async function checkVendorAuth(menuItemId) {
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
  
  // Verify user is a vendor
  const user = await prisma.user.findUnique({
    where: { id: authData.id },
    include: { vendor: true }
  });
  
  if (!user || user.type !== 'VENDOR' || !user.vendor) {
    return { authorized: false, error: 'Vendor access required', status: 403 };
  }
  
  // Get vendor's restaurant
  const restaurant = await prisma.restaurant.findUnique({
    where: { vendorId: user.vendor.id }
  });
  
  if (!restaurant) {
    return { authorized: false, error: 'Restaurant not found', status: 404 };
  }
  
  // Get menu item
  const menuItem = await prisma.menuItem.findUnique({
    where: { id: menuItemId }
  });
  
  if (!menuItem) {
    return { authorized: false, error: 'Menu item not found', status: 404 };
  }
  
  // Check if menu item belongs to vendor's restaurant
  if (menuItem.restaurantId !== restaurant.id) {
    return { authorized: false, error: 'Unauthorized access', status: 403 };
  }
  
  return { authorized: true, user, restaurant, menuItem };
}

// GET - Fetch specific menu item
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const authResult = await checkVendorAuth(id);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }
    
    return NextResponse.json({
      success: true,
      menuItem: authResult.menuItem
    });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update menu item
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const authResult = await checkVendorAuth(id);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
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
    
    // Update menu item
    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: {
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
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update menu item availability
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const authResult = await checkVendorAuth(id);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }
    
    // Parse request body
    const data = await request.json();
    const { isAvailable } = data;
    
    if (typeof isAvailable !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'isAvailable must be a boolean' },
        { status: 400 }
      );
    }
    
    // Update menu item
    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: { isAvailable }
    });
    
    return NextResponse.json({
      success: true,
      menuItem
    });
  } catch (error) {
    console.error('Error updating menu item availability:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete menu item
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const authResult = await checkVendorAuth(id);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }
    
    // Delete menu item
    await prisma.menuItem.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    
    // Handle foreign key constraint errors (item is referenced in orders)
    if (error.code === 'P2003') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete this menu item as it is referenced in orders' 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}