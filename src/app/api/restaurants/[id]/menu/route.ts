// import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';

// // GET - Fetch menu items for a specific restaurant
// export async function GET(request, context) {
//   try {
//     const params = await context.params;
//     const { id } = params;
    
//     if (!id) {
//       return NextResponse.json(
//         { success: false, error: 'Restaurant ID is required' },
//         { status: 400 }
//       );
//     }
    
//     // Verify restaurant exists
//     const restaurant = await prisma.restaurant.findUnique({
//       where: { id }
//     });
    
//     if (!restaurant) {
//       return NextResponse.json(
//         { success: false, error: 'Restaurant not found' },
//         { status: 404 }
//       );
//     }
    
//     // Get menu items for the restaurant
//     const menuItems = await prisma.menuItem.findMany({
//       where: { 
//         restaurantId: id,
//         isAvailable: true // Only fetch available items by default
//       },
//       orderBy: [
//         { category: 'asc' },
//         { name: 'asc' }
//       ]
//     });
    
//     return NextResponse.json({
//       success: true,
//       menuItems
//     });
//   } catch (error) {
//     console.error('Error fetching restaurant menu:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to fetch restaurant menu' },
//       { status: 500 }
//     );
//   }
// }
// app/api/restaurants/[id]/menu/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const menuItems = await prisma.menuItem.findMany({
      where: { 
        restaurantId: id,
        isAvailable: true 
      },
      orderBy: { category: 'asc' }
    });
    
    return NextResponse.json({
      success: true,
      menuItems
    });
    
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}