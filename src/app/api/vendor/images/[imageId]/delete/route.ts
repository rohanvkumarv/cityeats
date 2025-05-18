// pages/api/vendor/images/[imageId]/delete.js

// import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageId } = req.query;

    // Find the image
    const image = await prisma.restaurantImage.findUnique({
      where: { id: imageId },
      include: { restaurant: true }
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete from local storage
    const filePath = path.join(process.cwd(), 'public', image.imageUrl);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.warn('Could not delete file:', filePath);
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await prisma.restaurantImage.delete({
      where: { id: imageId }
    });

    // If this was the main image, set another image as main
    if (image.isMain) {
      const firstImage = await prisma.restaurantImage.findFirst({
        where: { restaurantId: image.restaurantId }
      });
      
      if (firstImage) {
        await prisma.restaurantImage.update({
          where: { id: firstImage.id },
          data: { isMain: true }
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  } finally {
    await prisma.$disconnect();
  }
}