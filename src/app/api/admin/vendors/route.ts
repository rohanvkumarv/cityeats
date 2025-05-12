import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

// Helper function to check admin authorization
async function checkAdminAuth() {
  // Get the auth cookie
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth');
  
  if (!authCookie) {
    return { authorized: false, error: 'Authentication required', status: 401 };
  }
  
  // Parse auth data
  const authData = JSON.parse(authCookie.value);
  
  if (!authData.id || authData.exp < Date.now()) {
    return { authorized: false, error: 'Authentication required', status: 401 };
  }
  
  // Verify user is an admin
  const user = await prisma.user.findUnique({
    where: { id: authData.id }
  });
  
  if (!user || user.type !== 'ADMIN') {
    return { authorized: false, error: 'Admin access required', status: 403 };
  }
  
  return { authorized: true, user };
}

// GET - Fetch vendors with filtering and pagination
export async function GET(request) {
  try {
    const authResult = await checkAdminAuth();
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }
    
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const sort = searchParams.get('sort') || 'latest'; // 'latest', 'oldest', 'name'
    
    // Build where clause for filtering
    const where = {};
    
    if (search) {
      where.OR = [
        { storeName: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ];
    }
    
    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      where.status = status;
    }
    
    // Determine sort order
    let orderBy = {};
    switch (sort) {
      case 'latest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'name':
        orderBy = { storeName: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Fetch vendors with count
    const [vendors, totalCount] = await Promise.all([
      prisma.vendor.findMany({
        where,
        take: limit,
        skip,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              createdAt: true
            }
          },
          restaurant: {
            select: {
              id: true,
              name: true,
              city: true,
              isOpen: true
            }
          }
        }
      }),
      prisma.vendor.count({ where })
    ]);
    
    return NextResponse.json({
      success: true,
      vendors,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}