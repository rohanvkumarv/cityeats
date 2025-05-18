// app/api/vendor/upload-images/route.js

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

export async function POST(request) {
  try {
    // Authenticate vendor
    const user = await authenticateVendor();
    
    // Parse form data
    const formData = await request.formData();
    const files = formData.getAll('images');
    const restaurantId = formData.get('restaurantId');
    
    if (!restaurantId) {
      return NextResponse.json(
        { success: false, error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }
    
    // Verify restaurant ownership
    const restaurant = await prisma.restaurant.findFirst({
      where: { 
        id: restaurantId,
        vendorId: user.vendor.id
      },
      include: { images: true }
    });
    
    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found or access denied' },
        { status: 404 }
      );
    }
    
    // Validate files
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No images provided' },
        { status: 400 }
      );
    }
    
    // Check file count
    if (files.length > 10) {
      return NextResponse.json(
        { success: false, error: 'Maximum 10 images allowed' },
        { status: 400 }
      );
    }
    
    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public/images/restaurant');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }
    
    const uploadedImages = [];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    for (const file of files) {
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        continue;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        continue;
      }
      
      // Generate unique filename
      const fileExtension = path.extname(file.name) || '.jpg';
      const uniqueFilename = `${restaurant.id}_${Date.now()}_${Math.random().toString(36).substring(7)}${fileExtension}`;
      const filePath = path.join(uploadDir, uniqueFilename);
      
      // Save file
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);
      
      // Create database record
      const imageUrl = `/images/restaurant/${uniqueFilename}`;
      const isMain = restaurant.images.length === 0 && uploadedImages.length === 0;
      
      const restaurantImage = await prisma.restaurantImage.create({
        data: {
          restaurantId: restaurant.id,
          imageUrl,
          isMain,
        },
      });
      
      uploadedImages.push(restaurantImage);
    }
    
    if (uploadedImages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid images uploaded' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      images: uploadedImages,
      message: `${uploadedImages.length} image(s) uploaded successfully`
    });
    
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload images' },
      { status: 500 }
    );
  }
}