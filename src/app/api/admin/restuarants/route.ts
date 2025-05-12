// File: app/api/admin/restaurants/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    // Get URL to parse query parameters
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search') || '';
    const city = searchParams.get('city') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const skip = (page - 1) * limit;

    // Build filter object
    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (city) {
      where.city = city;
    }
    
    if (status === 'open') {
      where.isOpen = true;
    } else if (status === 'closed') {
      where.isOpen = false;
    }

    // Get total count for pagination
    const total = await prisma.restaurant.count({ where });
    const pages = Math.ceil(total / limit);

    // Fetch restaurants with their vendor and user info
    const restaurants = await prisma.restaurant.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        vendor: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Return response
    return NextResponse.json({
      success: true,
      restaurants,
      pagination: {
        total,
        page,
        limit,
        pages
      }
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}