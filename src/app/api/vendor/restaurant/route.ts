// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import prisma from '@/lib/prisma';

// // GET - Fetch vendor's restaurant
// export async function GET(request) {
//   try {
//     // Check if user is authenticated
//     const cookieStore = await cookies();
//     const authCookie = cookieStore.get('auth');
    
//     if (!authCookie) {
//       return NextResponse.json(
//         { success: false, error: 'Authentication required' },
//         { status: 401 }
//       );
//     }
    
//     // Parse auth data
//     const authData = JSON.parse(authCookie.value);
    
//     if (!authData.id || authData.exp < Date.now()) {
//       return NextResponse.json(
//         { success: false, error: 'Authentication required' },
//         { status: 401 }
//       );
//     }
    
//     // Verify user is a vendor
//     const user = await prisma.user.findUnique({
//       where: { id: authData.id },
//       include: { vendor: true }
//     });
    
//     if (!user || user.type !== 'VENDOR' || !user.vendor) {
//       return NextResponse.json(
//         { success: false, error: 'Vendor access required' },
//         { status: 403 }
//       );
//     }
    
//     // Get vendor's restaurant
//     const restaurant = await prisma.restaurant.findUnique({
//       where: { vendorId: user.vendor.id },
//       include: { 
//         images: true,
//         tables: true 
//       }
//     });
    
//     return NextResponse.json({
//       success: true,
//       restaurant
//     });
//   } catch (error) {
//     console.error('Error fetching vendor restaurant:', error);
//     return NextResponse.json(
//       { success: false, error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // POST - Create or update vendor's restaurant
// export async function POST(request) {
//   try {
//     // Check if user is authenticated
//     const cookieStore = await cookies();
//     const authCookie = cookieStore.get('auth');
    
//     if (!authCookie) {
//       return NextResponse.json(
//         { success: false, error: 'Authentication required' },
//         { status: 401 }
//       );
//     }
    
//     // Parse auth data
//     const authData = JSON.parse(authCookie.value);
    
//     if (!authData.id || authData.exp < Date.now()) {
//       return NextResponse.json(
//         { success: false, error: 'Authentication required' },
//         { status: 401 }
//       );
//     }
    
//     // Verify user is a vendor
//     const user = await prisma.user.findUnique({
//       where: { id: authData.id },
//       include: { vendor: true }
//     });
    
//     if (!user || user.type !== 'VENDOR' || !user.vendor) {
//       return NextResponse.json(
//         { success: false, error: 'Vendor access required' },
//         { status: 403 }
//       );
//     }
    
//     // Parse request body
//     const data = await request.json();
//     const { 
//       name, 
//       description, 
//       address, 
//       city, 
//       cuisine, 
//       openingHours, 
//       closingHours,
//       hasAC,
//       hasRooftop,
//       hasWifi,
//       hasParking,
//       isOpen,
//       tables
//     } = data;
    
//     // Validate required fields
//     if (!name || !address || !city || !cuisine || !openingHours || !closingHours) {
//       return NextResponse.json(
//         { success: false, error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }
    
//     // Format the cuisine array if needed
//     const formattedCuisine = Array.isArray(cuisine) ? cuisine : [cuisine];
    
//     // Check if restaurant exists
//     const existingRestaurant = await prisma.restaurant.findUnique({
//       where: { vendorId: user.vendor.id }
//     });
    
//     let restaurant;
//     if (existingRestaurant) {
//       // Update existing restaurant
//       restaurant = await prisma.restaurant.update({
//         where: { id: existingRestaurant.id },
//         data: { 
//           name, 
//           description, 
//           address, 
//           city, 
//           cuisine: formattedCuisine, 
//           openingHours, 
//           closingHours,
//           hasAC: hasAC === true,
//           hasRooftop: hasRooftop === true,
//           hasWifi: hasWifi === true,
//           hasParking: hasParking === true,
//           isOpen: isOpen === true
//         },
//         include: { 
//           images: true,
//           tables: true 
//         }
//       });
//     } else {
//       // Create new restaurant
//       restaurant = await prisma.restaurant.create({
//         data: { 
//           vendorId: user.vendor.id,
//           name, 
//           description, 
//           address, 
//           city, 
//           cuisine: formattedCuisine, 
//           openingHours, 
//           closingHours,
//           hasAC: hasAC === true,
//           hasRooftop: hasRooftop === true,
//           hasWifi: hasWifi === true,
//           hasParking: hasParking === true,
//           isOpen: isOpen === true
//         },
//         include: { 
//           images: true,
//           tables: true 
//         }
//       });
//     }
    
//     // Handle tables if provided
//     if (tables && Array.isArray(tables) && tables.length > 0) {
//       // First, delete all existing tables
//       await prisma.table.deleteMany({
//         where: { restaurantId: restaurant.id }
//       });
      
//       // Create new tables
//       await prisma.table.createMany({
//         data: tables.map(table => ({
//           restaurantId: restaurant.id,
//           tableNumber: table.tableNumber,
//           capacity: table.capacity,
//           type: table.type,
//           hasAC: table.hasAC === true,
//           isAvailable: table.isAvailable === true
//         }))
//       });
      
//       // Fetch updated restaurant with tables
//       restaurant = await prisma.restaurant.findUnique({
//         where: { id: restaurant.id },
//         include: { 
//           images: true,
//           tables: true 
//         }
//       });
//     }
    
//     return NextResponse.json({
//       success: true,
//       restaurant
//     });
//   } catch (error) {
//     console.error('Error saving restaurant:', error);
//     return NextResponse.json(
//       { success: false, error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // PATCH - Update restaurant status (open/closed)
// export async function PATCH(request) {
//   try {
//     // Check if user is authenticated
//     const cookieStore = await cookies();
//     const authCookie = cookieStore.get('auth');
    
//     if (!authCookie) {
//       return NextResponse.json(
//         { success: false, error: 'Authentication required' },
//         { status: 401 }
//       );
//     }
    
//     // Parse auth data
//     const authData = JSON.parse(authCookie.value);
    
//     if (!authData.id || authData.exp < Date.now()) {
//       return NextResponse.json(
//         { success: false, error: 'Authentication required' },
//         { status: 401 }
//       );
//     }
    
//     // Verify user is a vendor
//     const user = await prisma.user.findUnique({
//       where: { id: authData.id },
//       include: { vendor: true }
//     });
    
//     if (!user || user.type !== 'VENDOR' || !user.vendor) {
//       return NextResponse.json(
//         { success: false, error: 'Vendor access required' },
//         { status: 403 }
//       );
//     }
    
//     // Get vendor's restaurant
//     const existingRestaurant = await prisma.restaurant.findUnique({
//       where: { vendorId: user.vendor.id }
//     });
    
//     if (!existingRestaurant) {
//       return NextResponse.json(
//         { success: false, error: 'Restaurant not found' },
//         { status: 404 }
//       );
//     }
    
//     // Parse request body
//     const data = await request.json();
//     const { isOpen } = data;
    
//     if (typeof isOpen !== 'boolean') {
//       return NextResponse.json(
//         { success: false, error: 'isOpen must be a boolean' },
//         { status: 400 }
//       );
//     }
    
//     // Update restaurant status
//     const restaurant = await prisma.restaurant.update({
//       where: { id: existingRestaurant.id },
//       data: { isOpen }
//     });
    
//     return NextResponse.json({
//       success: true,
//       restaurant
//     });
//   } catch (error) {
//     console.error('Error updating restaurant status:', error);
//     return NextResponse.json(
//       { success: false, error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }



// app/api/vendor/restaurant/route.js (Updated)

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

// GET - Fetch vendor's restaurant with images ordered properly
export async function GET(request) {
  try {
    // Check if user is authenticated
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse auth data
    const authData = JSON.parse(authCookie.value);
    
    if (!authData.id || authData.exp < Date.now()) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Verify user is a vendor
    const user = await prisma.user.findUnique({
      where: { id: authData.id },
      include: { vendor: true }
    });
    
    if (!user || user.type !== 'VENDOR' || !user.vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor access required' },
        { status: 403 }
      );
    }
    
    // Get vendor's restaurant with images ordered properly
    const restaurant = await prisma.restaurant.findUnique({
      where: { vendorId: user.vendor.id },
      include: { 
        images: {
          orderBy: [
            { isMain: 'desc' }, // Main image first
            { createdAt: 'asc' }  // Then by creation date
          ]
        },
        tables: {
          orderBy: { tableNumber: 'asc' }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      restaurant
    });
  } catch (error) {
    console.error('Error fetching vendor restaurant:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create or update vendor's restaurant
export async function POST(request) {
  try {
    // Check if user is authenticated
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse auth data
    const authData = JSON.parse(authCookie.value);
    
    if (!authData.id || authData.exp < Date.now()) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Verify user is a vendor
    const user = await prisma.user.findUnique({
      where: { id: authData.id },
      include: { vendor: true }
    });
    
    if (!user || user.type !== 'VENDOR' || !user.vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor access required' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const data = await request.json();
    const { 
      name, 
      description, 
      address, 
      city, 
      cuisine, 
      openingHours, 
      closingHours,
      hasAC,
      hasRooftop,
      hasWifi,
      hasParking,
      isOpen,
      tables
    } = data;
    
    // Validate required fields
    if (!name || !address || !city || !cuisine || !openingHours || !closingHours) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Format the cuisine array if needed
    const formattedCuisine = Array.isArray(cuisine) ? cuisine : [cuisine];
    
    // Check if restaurant exists
    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { vendorId: user.vendor.id }
    });
    
    let restaurant;
    if (existingRestaurant) {
      // Update existing restaurant
      restaurant = await prisma.restaurant.update({
        where: { id: existingRestaurant.id },
        data: { 
          name, 
          description, 
          address, 
          city, 
          cuisine: formattedCuisine, 
          openingHours, 
          closingHours,
          hasAC: hasAC === true,
          hasRooftop: hasRooftop === true,
          hasWifi: hasWifi === true,
          hasParking: hasParking === true,
          isOpen: isOpen === true
        },
        include: { 
          images: {
            orderBy: [
              { isMain: 'desc' },
              { createdAt: 'asc' }
            ]
          },
          tables: {
            orderBy: { tableNumber: 'asc' }
          }
        }
      });
    } else {
      // Create new restaurant
      restaurant = await prisma.restaurant.create({
        data: { 
          vendorId: user.vendor.id,
          name, 
          description, 
          address, 
          city, 
          cuisine: formattedCuisine, 
          openingHours, 
          closingHours,
          hasAC: hasAC === true,
          hasRooftop: hasRooftop === true,
          hasWifi: hasWifi === true,
          hasParking: hasParking === true,
          isOpen: isOpen === true
        },
        include: { 
          images: {
            orderBy: [
              { isMain: 'desc' },
              { createdAt: 'asc' }
            ]
          },
          tables: {
            orderBy: { tableNumber: 'asc' }
          }
        }
      });
    }
    
    // Handle tables if provided
    if (tables && Array.isArray(tables) && tables.length > 0) {
      // First, delete all existing tables
      await prisma.table.deleteMany({
        where: { restaurantId: restaurant.id }
      });
      
      // Create new tables
      await prisma.table.createMany({
        data: tables.map(table => ({
          restaurantId: restaurant.id,
          tableNumber: table.tableNumber,
          capacity: table.capacity,
          type: table.type,
          hasAC: table.hasAC === true,
          isAvailable: table.isAvailable === true
        }))
      });
      
      // Fetch updated restaurant with tables
      restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurant.id },
        include: { 
          images: {
            orderBy: [
              { isMain: 'desc' },
              { createdAt: 'asc' }
            ]
          },
          tables: {
            orderBy: { tableNumber: 'asc' }
          }
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      restaurant
    });
  } catch (error) {
    console.error('Error saving restaurant:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update restaurant status (open/closed)
export async function PATCH(request) {
  try {
    // Check if user is authenticated
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse auth data
    const authData = JSON.parse(authCookie.value);
    
    if (!authData.id || authData.exp < Date.now()) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Verify user is a vendor
    const user = await prisma.user.findUnique({
      where: { id: authData.id },
      include: { vendor: true }
    });
    
    if (!user || user.type !== 'VENDOR' || !user.vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor access required' },
        { status: 403 }
      );
    }
    
    // Get vendor's restaurant
    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { vendorId: user.vendor.id }
    });
    
    if (!existingRestaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }
    
    // Parse request body
    const data = await request.json();
    const { isOpen } = data;
    
    if (typeof isOpen !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'isOpen must be a boolean' },
        { status: 400 }
      );
    }
    
    // Update restaurant status
    const restaurant = await prisma.restaurant.update({
      where: { id: existingRestaurant.id },
      data: { isOpen },
      include: {
        images: {
          orderBy: [
            { isMain: 'desc' },
            { createdAt: 'asc' }
          ]
        },
        tables: {
          orderBy: { tableNumber: 'asc' }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      restaurant
    });
  } catch (error) {
    console.error('Error updating restaurant status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}