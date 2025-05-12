// File: app/api/admin/restaurants/[id]/status/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { isOpen } = body;

    if (typeof isOpen !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Update restaurant status
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id },
      data: { isOpen }
    });

    return NextResponse.json({
      success: true,
      restaurant: updatedRestaurant
    });
  } catch (error) {
    console.error('Error updating restaurant status:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Restaurant not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}