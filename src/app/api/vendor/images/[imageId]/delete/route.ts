// app/api/vendor/images/[imageId]/delete/route.js

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET;

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

// Function to extract S3 key from URL
function extractS3KeyFromUrl(url) {
  try {
    // Handle different S3 URL formats:
    // https://bucket.s3.region.amazonaws.com/key
    // https://s3.region.amazonaws.com/bucket/key
    const urlObj = new URL(url);
    
    if (urlObj.hostname.includes('amazonaws.com')) {
      if (urlObj.hostname.startsWith('s3.')) {
        // Format: https://s3.region.amazonaws.com/bucket/key
        const pathParts = urlObj.pathname.split('/').filter(part => part);
        return pathParts.slice(1).join('/'); // Remove bucket name, keep the rest
      } else {
        // Format: https://bucket.s3.region.amazonaws.com/key
        return urlObj.pathname.substring(1); // Remove leading slash
      }
    }
    
    // If it's not an S3 URL, return null
    return null;
  } catch (error) {
    console.error('Error parsing S3 URL:', error);
    return null;
  }
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
    
    // Delete from S3
    const s3Key = extractS3KeyFromUrl(image.imageUrl);
    if (s3Key) {
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: s3Key,
        });
        
        await s3Client.send(deleteCommand);
      } catch (s3Error) {
        console.warn('Could not delete file from S3:', s3Error.message);
        // Continue with database deletion even if S3 deletion fails
      }
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