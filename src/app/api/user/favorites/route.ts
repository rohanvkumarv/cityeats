import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

// GET - Fetch user's favorite restaurants
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
    
    // Get user's wishlist
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: authData.id },
      include: {
        favorites: {
          include: {
            restaurant: {
              include: {
                images: true
              }
            }
          }
        }
      }
    });
    
    if (!wishlist) {
      // Create wishlist if it doesn't exist
      const newWishlist = await prisma.wishlist.create({
        data: {
          userId: authData.id
        }
      });
      
      return NextResponse.json({
        success: true,
        favorites: []
      });
    }
    
    return NextResponse.json({
      success: true,
      favorites: wishlist.favorites
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add restaurant to favorites
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
    const { restaurantId } = data;
    
    if (!restaurantId) {
      return NextResponse.json(
        { success: false, error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }
    
    // Verify restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });
    
    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }
    
    // Get or create wishlist
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: authData.id }
    });
    
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          userId: authData.id
        }
      });
    }
    
    // Check if restaurant is already in favorites
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        wishlistId: wishlist.id,
        restaurantId
      }
    });
    
    if (existingFavorite) {
      return NextResponse.json({
        success: true,
        message: 'Restaurant is already in favorites',
        favorite: existingFavorite
      });
    }
    
    // Add restaurant to favorites
    const favorite = await prisma.favorite.create({
      data: {
        wishlistId: wishlist.id,
        restaurantId
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Restaurant added to favorites',
      favorite
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}