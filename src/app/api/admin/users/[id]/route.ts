// // File: app/api/admin/users/[id]/route.js
// import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';

// export async function GET(request, { params }) {
//   try {
//     const { id } = params;

//     const user = await prisma.user.findUnique({
//       where: { id },
//       include: {
//         vendor: true,
//         bookings: {
//           include: {
//             restaurant: {
//               select: {
//                 name: true,
//                 city: true
//               }
//             },
//             table: true
//           },
//           orderBy: {
//             createdAt: 'desc'
//           },
//           take: 5 // Limit to the most recent 5 bookings
//         }
//       }
//     });

//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       user
//     });
//   } catch (error) {
//     console.error('Error fetching user details:', error);
//     return NextResponse.json(
//       { success: false, message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
// File: app/api/admin/users/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        vendor: true,
        bookings: {
          include: {
            restaurant: {
              select: {
                name: true,
                city: true
              }
            },
            table: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // Limit to the most recent 5 bookings
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add PATCH handler for updating users
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Extract user data from the request body
    const { name, email, phone, type } = body;
    
    // Vendor data if provided
    const vendorData = body.vendor || {};
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        type,
        // Update vendor data if user is a vendor
        ...(type === 'VENDOR' && {
          vendor: {
            upsert: {
              create: {
                storeName: vendorData.storeName || '',
                status: vendorData.status || 'PENDING'
              },
              update: {
                storeName: vendorData.storeName,
                status: vendorData.status
              }
            }
          }
        })
      },
      include: {
        vendor: true
      }
    });

    return NextResponse.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, message: 'Email already in use' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
