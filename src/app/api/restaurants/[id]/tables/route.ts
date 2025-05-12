// // import { NextResponse } from 'next/server';
// // import prisma from '@/lib/prisma';

// // // GET - Fetch tables for a specific restaurant
// // export async function GET(request, { params }) {
// //   try {
// //     const { id } = params;
    
// //     if (!id) {
// //       return NextResponse.json(
// //         { success: false, error: 'Restaurant ID is required' },
// //         { status: 400 }
// //       );
// //     }
    
// //     // Verify restaurant exists
// //     const restaurant = await prisma.restaurant.findUnique({
// //       where: { id }
// //     });
    
// //     if (!restaurant) {
// //       return NextResponse.json(
// //         { success: false, error: 'Restaurant not found' },
// //         { status: 404 }
// //       );
// //     }
    
// //     // Get query parameters
// //     const { searchParams } = new URL(request.url);
// //     const availableOnly = searchParams.get('availableOnly') === 'true';
// //     const date = searchParams.get('date');
// //     const time = searchParams.get('time');
    
// //     // Base query for tables
// //     const whereClause = {
// //       restaurantId: id
// //     };
    
// //     // Add available filter if requested
// //     if (availableOnly) {
// //       whereClause.isAvailable = true;
// //     }
    
// //     // Get tables for the restaurant
// //     const tables = await prisma.table.findMany({
// //       where: whereClause,
// //       orderBy: [
// //         { type: 'asc' },
// //         { capacity: 'asc' },
// //         { tableNumber: 'asc' }
// //       ]
// //     });
    
// //     // If date and time are provided, check bookings to determine actual availability
// //     if (date && time) {
// //       const bookingDate = new Date(date);
      
// //       // Get all bookings for the given date and time
// //       const bookings = await prisma.booking.findMany({
// //         where: {
// //           restaurantId: id,
// //           date: {
// //             gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
// //             lt: new Date(bookingDate.setHours(23, 59, 59, 999)),
// //           },
// //           time: time,
// //           status: { in: ['PENDING', 'CONFIRMED'] }
// //         },
// //         select: {
// //           tableId: true
// //         }
// //       });
      
// //       // Get array of booked table IDs
// //       const bookedTableIds = bookings.map(booking => booking.tableId);
      
// //       // Mark tables as unavailable if they're booked
// //       const tablesWithAvailability = tables.map(table => ({
// //         ...table,
// //         isBookable: table.isAvailable && !bookedTableIds.includes(table.id)
// //       }));
      
// //       return NextResponse.json({
// //         success: true,
// //         tables: tablesWithAvailability
// //       });
// //     }
    
// //     return NextResponse.json({
// //       success: true,
// //       tables
// //     });
// //   } catch (error) {
// //     console.error('Error fetching restaurant tables:', error);
// //     return NextResponse.json(
// //       { success: false, error: 'Failed to fetch restaurant tables' },
// //       { status: 500 }
// //     );
// //   }
// // }
// import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';

// // GET - Fetch tables for a specific restaurant
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
    
//     // Get query parameters
//     const { searchParams } = new URL(request.url);
//     const availableOnly = searchParams.get('availableOnly') === 'true';
//     const date = searchParams.get('date');
//     const time = searchParams.get('time');
    
//     // Base query for tables
//     const whereClause = {
//       restaurantId: id
//     };
    
//     // Add available filter if requested
//     if (availableOnly) {
//       whereClause.isAvailable = true;
//     }
    
//     // Get tables for the restaurant
//     const tables = await prisma.table.findMany({
//       where: whereClause,
//       orderBy: [
//         { type: 'asc' },
//         { capacity: 'asc' },
//         { tableNumber: 'asc' }
//       ]
//     });
    
//     // If date and time are provided, check bookings to determine actual availability
//     if (date && time) {
//       const bookingDate = new Date(date);
      
//       // Get all bookings for the given date and time
//       const bookings = await prisma.booking.findMany({
//         where: {
//           restaurantId: id,
//           date: {
//             gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
//             lt: new Date(bookingDate.setHours(23, 59, 59, 999)),
//           },
//           time: time,
//           status: { in: ['PENDING', 'CONFIRMED'] }
//         },
//         select: {
//           tableId: true
//         }
//       });
      
//       // Get array of booked table IDs
//       const bookedTableIds = bookings.map(booking => booking.tableId);
      
//       // Mark tables as unavailable if they're booked
//       const tablesWithAvailability = tables.map(table => ({
//         ...table,
//         isBookable: table.isAvailable && !bookedTableIds.includes(table.id)
//       }));
      
//       return NextResponse.json({
//         success: true,
//         tables: tablesWithAvailability
//       });
//     }
    
//     return NextResponse.json({
//       success: true,
//       tables
//     });
//   } catch (error) {
//     console.error('Error fetching restaurant tables:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to fetch restaurant tables' },
//       { status: 500 }
//     );
//   }
// }
// app/api/restaurants/[id]/tables/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const tables = await prisma.table.findMany({
      where: { 
        restaurantId: id,
        isAvailable: true 
      },
      orderBy: { tableNumber: 'asc' }
    });
    
    return NextResponse.json({
      success: true,
      tables
    });
    
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tables' },
      { status: 500 }
    );
  }
}