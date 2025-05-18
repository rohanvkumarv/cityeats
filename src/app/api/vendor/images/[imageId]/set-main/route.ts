// app/api/vendor/images/[imageId]/set-main/route.js

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

// Helper function to authenticate vendor
async function authenticateVendor() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth');
  
  if (!authCookie) {
    throw new Error('Authentication required');
  }
  
  const authData = JSON.parse(authCookie.value);
  
  if (!authData.id || authData.exp < Date.now()) {
    throw new Error('Authentication required');
  }
  
  const user = await prisma.user.findUnique({
    where: { id: authData.id },
    include: { vendor: true }
  });
  
  if (!user || user.type !== 'VENDOR' || !user.vendor) {
    throw new Error('Vendor access required');
  }
  
  return user;
}

export async function PATCH(request, { params }) {
  try {
    // Authenticate vendor
    const user = await authenticateVendor();
    
    // Get image ID from params
    const { imageId } = params;
    
    // Find the image and verify ownership
    const image = await prisma.restaurantImage.findUnique({
      where: { id: imageId },
      include: { 
        restaurant: {
          include: { vendor: true }
        }
      }
    });
    
    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }
    
    // Verify ownership
    if (image.restaurant.vendorId !== user.vendor.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }
    
    // Set all images of this restaurant to not main
    await prisma.restaurantImage.updateMany({
      where: { restaurantId: image.restaurantId },
      data: { isMain: false }
    });
    
    // Set the selected image as main
    await prisma.restaurantImage.update({
      where: { id: imageId },
      data: { isMain: true }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Main image updated successfully'
    });
    
  } catch (error) {
    console.error('Error setting main image:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update main image' },
      { status: 500 }
    );
  }
}