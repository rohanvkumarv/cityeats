// // app/api/vendor/upload-images/route.js

// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import prisma from '@/lib/prisma';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// // Initialize S3 client
// const s3Client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// const BUCKET_NAME = process.env.AWS_S3_BUCKET;

// // Helper function to authenticate vendor
// async function authenticateVendor() {
//   const cookieStore = await cookies();
//   const authCookie = cookieStore.get('auth');
  
//   if (!authCookie) {
//     throw new Error('Authentication required');
//   }
  
//   const authData = JSON.parse(authCookie.value);
  
//   if (!authData.id || authData.exp < Date.now()) {
//     throw new Error('Authentication required');
//   }
  
//   const user = await prisma.user.findUnique({
//     where: { id: authData.id },
//     include: { vendor: true }
//   });
  
//   if (!user || user.type !== 'VENDOR' || !user.vendor) {
//     throw new Error('Vendor access required');
//   }
  
//   return user;
// }

// export async function POST(request) {
//   try {
//     // Authenticate vendor
//     const user = await authenticateVendor();
    
//     // Parse form data
//     const formData = await request.formData();
//     const files = formData.getAll('images');
//     const restaurantId = formData.get('restaurantId');
    
//     if (!restaurantId) {
//       return NextResponse.json(
//         { success: false, error: 'Restaurant ID is required' },
//         { status: 400 }
//       );
//     }
    
//     // Verify restaurant ownership
//     const restaurant = await prisma.restaurant.findFirst({
//       where: { 
//         id: restaurantId,
//         vendorId: user.vendor.id
//       },
//       include: { images: true }
//     });
    
//     if (!restaurant) {
//       return NextResponse.json(
//         { success: false, error: 'Restaurant not found or access denied' },
//         { status: 404 }
//       );
//     }
    
//     // Validate files
//     if (!files || files.length === 0) {
//       return NextResponse.json(
//         { success: false, error: 'No images provided' },
//         { status: 400 }
//       );
//     }
    
//     // Check file count
//     if (files.length > 10) {
//       return NextResponse.json(
//         { success: false, error: 'Maximum 10 images allowed' },
//         { status: 400 }
//       );
//     }
    
//     const uploadedImages = [];
//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
//     for (const file of files) {
//       // Validate file type
//       if (!allowedTypes.includes(file.type)) {
//         continue;
//       }
      
//       // Validate file size (5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         continue;
//       }
      
//       // Generate unique key for S3
//       const fileExtension = file.name.split('.').pop() || 'jpg';
//       const timestamp = Date.now();
//       const random = Math.random().toString(36).substring(7);
//       const key = `restaurants/${restaurant.id}/${timestamp}-${random}.${fileExtension}`;
      
//       // Upload to S3
//       const arrayBuffer = await file.arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);
      
//       const uploadCommand = new PutObjectCommand({
//         Bucket: BUCKET_NAME,
//         Key: key,
//         Body: buffer,
//         ContentType: file.type,
//         // Make the uploaded images publicly readable
//         ACL: 'public-read',
//       });
      
//       await s3Client.send(uploadCommand);
      
//       // Construct the public URL
//       const imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      
//       // Create database record
//       const isMain = restaurant.images.length === 0 && uploadedImages.length === 0;
      
//       const restaurantImage = await prisma.restaurantImage.create({
//         data: {
//           restaurantId: restaurant.id,
//           imageUrl,
//           isMain,
//         },
//       });
      
//       uploadedImages.push(restaurantImage);
//     }
    
//     if (uploadedImages.length === 0) {
//       return NextResponse.json(
//         { success: false, error: 'No valid images uploaded' },
//         { status: 400 }
//       );
//     }
    
//     return NextResponse.json({
//       success: true,
//     //   images: uploadedImages,
//       message: `${uploadedImages.length} image(s) uploaded successfully`
//     });
    
//   } catch (error) {
//     console.error('Error uploading images:', error);
//     return NextResponse.json(
//       { success: false, error: error.message || 'Failed to upload images' },
//       { status: 500 }
//     );
//   }
// }
// app/api/vendor/upload-images/route.js

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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
      
      // Generate unique key for S3
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const key = `restaurants/${restaurant.id}/${timestamp}-${random}.${fileExtension}`;
      
      // Upload to S3
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        // NOTE: ACL removed - using bucket policy for public access instead
      });
      
      await s3Client.send(uploadCommand);
      
      // Construct the public URL
      const imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      
      // Create database record
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