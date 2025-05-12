// File: app/api/admin/restaurants/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        vendor: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true
              }
            }
          }
        },
        images: true,
        menuItems: {
          orderBy: { category: 'asc' }
        },
        tables: {
          orderBy: { tableNumber: 'asc' }
        }
      }
    });

    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      restaurant
    });
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}