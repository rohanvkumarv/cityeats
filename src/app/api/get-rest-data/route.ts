import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Filtering parameters
    const city = searchParams.get('city');
    const cuisine = searchParams.get('cuisine');
    const hasRooftop = searchParams.get('hasRooftop') === 'true';
    const hasAC = searchParams.get('hasAC') === 'true';
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    
    // Sorting parameters
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Build the filter object
    const filter = {
      isOpen: true, // Default to only open restaurants
      ...(city && { city }),
      ...(cuisine && { cuisine: { has: cuisine } }),
      ...(hasRooftop && { hasRooftop }),
      ...(hasAC && { hasAC }),
      ...(minRating && { rating: { gte: minRating } })
    };
    
    // Query for total count (for pagination)
    const totalCount = await prisma.restaurant.count({
      where: filter
    });
    
    // Query for restaurants with filtering, sorting, and pagination
    const restaurants = await prisma.restaurant.findMany({
      where: filter,
      include: {
        images: true,
        vendor: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        tables: {
          select: {
            id: true,
            tableNumber: true,
            capacity: true,
            type: true,
            isAvailable: true
          }
        },
        menuItems: {
          where: {
            isAvailable: true
          },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            category: true,
            imageUrl: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit
    });
    
    // Return response with pagination metadata
    return NextResponse.json({
      success: true,
      data: restaurants,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}