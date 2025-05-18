// app/api/vendor/images/[imageId]/delete/route.js

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

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

export async function DELETE(request, { params }) {
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
    
    // Delete from local storage
    const filePath = path.join(process.cwd(), 'public', image.imageUrl);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.warn('Could not delete file:', filePath, error.message);
      // Continue with database deletion even if file deletion fails
    }
    
    // Delete from database
    await prisma.restaurantImage.delete({
      where: { id: imageId }
    });
    
    // If this was the main image, set another image as main
    if (image.isMain) {
      const firstImage = await prisma.restaurantImage.findFirst({
        where: { restaurantId: image.restaurantId },
        orderBy: { createdAt: 'asc' }
      });
      
      if (firstImage) {
        await prisma.restaurantImage.update({
          where: { id: firstImage.id },
          data: { isMain: true }
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete image' },
      { status: 500 }
    );
  }
}