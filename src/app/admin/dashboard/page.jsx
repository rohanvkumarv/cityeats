 
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/authContext';
import { 
  RiUser3Line, 
  RiStore2Line, 
  RiCalendarEventLine, 
  RiArrowRightSLine,
  RiPieChartLine,
  RiAlertLine
} from 'react-icons/ri';

export default function AdminDashboard() {
  // @ts-ignore
  const { userId } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalBookings: 0,
    pendingVendors: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats
        const statsRes = await fetch('/api/admin/stats');
        const statsData = await statsRes.json();
        
        if (statsData.success) {
          setStats(statsData.stats);
        }
        
        // Fetch recent users
        const usersRes = await fetch('/api/admin/users?limit=5&sort=latest');
        const usersData = await usersRes.json();
        
        if (usersData.success) {
          setRecentUsers(usersData.users);
        }
        
        // Fetch pending vendor applications
        const vendorsRes = await fetch('/api/admin/vendors?status=PENDING');
        const vendorsData = await vendorsRes.json();
        
        if (vendorsData.success) {
          setPendingVendors(vendorsData.vendors);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Helper function to approve or reject vendor
  const handleVendorAction = async (vendorId, action) => {
    try {
      const res = await fetch(`/api/admin/vendors/${vendorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: action === 'approve' ? 'APPROVED' : 'REJECTED' 
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Remove from pending list
        setPendingVendors(prev => prev.filter(vendor => vendor.id !== vendorId));
        
        // Update stats
        setStats(prev => ({
          ...prev,
          pendingVendors: prev.pendingVendors - 1
        }));
      }
    } catch (error) {
      console.error('Error updating vendor status:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the CityEats admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <RiUser3Line className="text-xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
            </div>
          </div>
          <Link
            href="/admin/users"
            className="mt-4 text-blue-600 hover:text-blue-800 inline-flex items-center text-sm"
          >
            <span>View Users</span>
            <RiArrowRightSLine className="ml-1" />
          </Link>
        </div>

        {/* Total Restaurants */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <RiStore2Line className="text-xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Restaurants</p>
              <h3 className="text-2xl font-bold">{stats.totalRestaurants}</h3>
            </div>
          </div>
          <Link
            href="/admin/restaurants"
            className="mt-4 text-blue-600 hover:text-blue-800 inline-flex items-center text-sm"
          >
            <span>View Restaurants</span>
            <RiArrowRightSLine className="ml-1" />
          </Link>
        </div>

        {/* Total Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <RiCalendarEventLine className="text-xl text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Bookings</p>
              <h3 className="text-2xl font-bold">{stats.totalBookings}</h3>
            </div>
          </div>
          <Link
            href="/admin/bookings"
            className="mt-4 text-blue-600 hover:text-blue-800 inline-flex items-center text-sm"
          >
            <span>View Bookings</span>
            <RiArrowRightSLine className="ml-1" />
          </Link>
        </div>

        {/* Pending Vendors */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <RiAlertLine className="text-xl text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Vendors</p>
              <h3 className="text-2xl font-bold">{stats.pendingVendors}</h3>
            </div>
          </div>
          <Link
            href="/admin/vendors?status=PENDING"
            className="mt-4 text-blue-600 hover:text-blue-800 inline-flex items-center text-sm"
          >
            <span>Review Applications</span>
            <RiArrowRightSLine className="ml-1" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Recent Users</h2>
            <Link
              href="/admin/users"
              className="text-blue-600 hover:text-blue-800 inline-flex items-center text-sm"
            >
              <span>View All</span>
              <RiArrowRightSLine className="ml-1" />
            </Link>
          </div>

          {recentUsers.length > 0 ? (
            <div className="divide-y">
              {recentUsers.map((user) => (
                <div key={user.id} className="py-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                      <RiUser3Line className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      user.type === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-800' 
                        : user.type === 'VENDOR' 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.type}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Joined {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>

        {/* Pending Vendor Applications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Pending Vendor Applications</h2>
            <Link
              href="/admin/vendors?status=PENDING"
              className="text-blue-600 hover:text-blue-800 inline-flex items-center text-sm"
            >
              <span>View All</span>
              <RiArrowRightSLine className="ml-1" />
            </Link>
          </div>

          {pendingVendors.length > 0 ? (
            <div className="divide-y">
              {pendingVendors.map((vendor) => (
                <div key={vendor.id} className="py-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium">{vendor.storeName}</p>
                      <p className="text-sm text-gray-500">{vendor.user.name} - {vendor.user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Applied on {formatDate(vendor.createdAt)}
                      </p>
                    </div>
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      PENDING
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleVendorAction(vendor.id, 'approve')}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleVendorAction(vendor.id, 'reject')}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                    <Link
                      href={`/admin/vendors/${vendor.id}`}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No pending applications</p>
            </div>
          )}
        </div>
      </div>

      {/* Platform Stats/Chart */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Platform Overview</h2>
          <div className="text-sm text-gray-500">Last 30 days</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center h-64">
          <div className="text-center">
            <RiPieChartLine className="text-5xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Charts and analytics will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
}