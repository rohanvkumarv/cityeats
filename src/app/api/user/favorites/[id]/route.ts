import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

// DELETE - Remove restaurant from favorites
export async function DELETE(request, { params }) {
  try {
    const { id: restaurantId } = params;
    
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
    
    // Get user's wishlist
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: authData.id }
    });
    
    if (!wishlist) {
      return NextResponse.json(
        { success: false, error: 'Wishlist not found' },
        { status: 404 }
      );
    }
    
    // Delete favorite if it exists
    await prisma.favorite.deleteMany({
      where: {
        wishlistId: wishlist.id,
        restaurantId
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Restaurant removed from favorites'
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}