
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const search = searchParams.get('search') || '';
    const cuisine = searchParams.get('cuisine');
    const city = searchParams.get('city');
    const hasAC = searchParams.get('hasAC') === 'true';
    const hasRooftop = searchParams.get('hasRooftop') === 'true';
    const hasWifi = searchParams.get('hasWifi') === 'true';
    const hasParking = searchParams.get('hasParking') === 'true';
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Build where clause for filtering
    const where = {
      isOpen: true, // Only show open restaurants by default
    };
    
    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Location filter
    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }
    
    // Cuisine filter
    if (cuisine) {
      where.cuisine = { has: cuisine };
    }
    
    // Amenities filters
    if (hasAC) where.hasAC = true;
    if (hasRooftop) where.hasRooftop = true;
    if (hasWifi) where.hasWifi = true;
    if (hasParking) where.hasParking = true;
    
    // Featured restaurants have higher ratings (for demo purposes)
    if (featured) {
      where.rating = { gte: 4.0 };
    }
    
    // Execute query
    const [restaurants, totalCount] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        include: {
          images: true,
        },
        take: limit,
        skip,
        orderBy: featured ? { rating: 'desc' } : { createdAt: 'desc' },
      }),
      prisma.restaurant.count({ where })
    ]);
    
    return NextResponse.json({
      success: true,
      restaurants,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}