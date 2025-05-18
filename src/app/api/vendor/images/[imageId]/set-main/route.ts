// pages/api/vendor/images/[imageId]/set-main.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageId } = req.query;

    // Find the image and get restaurant info
    const image = await prisma.restaurantImage.findUnique({
      where: { id: imageId },
      include: { restaurant: true }
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
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

    res.status(200).json({ 
      success: true,
      message: 'Main image updated successfully'
    });

  } catch (error) {
    console.error('Error setting main image:', error);
    res.status(500).json({ error: 'Failed to update main image' });
  } finally {
    await prisma.$disconnect();
  }
}