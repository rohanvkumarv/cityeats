 
// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useAuth } from '@/contexts/authContext';
// import { 
//   RiCalendarEventLine, 
//   RiRestaurantLine, 
//   RiUser3Line, 
//   RiPieChartLine,
//   RiArrowRightSLine,
//   RiCheckboxCircleLine,
//   RiTimeLine,
//   RiAlertLine
// } from 'react-icons/ri';

// export default function VendorDashboard() {
//   const { userId } = useAuth();
//   const [restaurant, setRestaurant] = useState(null);
//   const [todayBookings, setTodayBookings] = useState([]);
//   const [stats, setStats] = useState({
//     totalBookings: 0,
//     pendingBookings: 0,
//     completedBookings: 0,
//     cancelledBookings: 0
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         // Fetch restaurant data
//         const restaurantRes = await fetch('/api/vendor/restaurant');
//         const restaurantData = await restaurantRes.json();
        
//         if (restaurantData.success) {
//           setRestaurant(restaurantData.restaurant);
          
//           // Fetch today's bookings
//           const bookingsRes = await fetch('/api/vendor/bookings?today=true');
//           const bookingsData = await bookingsRes.json();
          
//           if (bookingsData.success) {
//             setTodayBookings(bookingsData.bookings);
//           }
          
//           // Fetch stats
//           const statsRes = await fetch('/api/vendor/stats');
//           const statsData = await statsRes.json();
          
//           if (statsData.success) {
//             setStats(statsData.stats);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId) {
//       fetchDashboardData();
//     }
//   }, [userId]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-full">
//         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   // If restaurant is not set up yet
//   if (!restaurant) {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
//         <div className="text-center">
//           <RiRestaurantLine className="text-5xl text-blue-500 mx-auto mb-4" />
//           <h1 className="text-2xl font-bold mb-4">Welcome to the Vendor Dashboard</h1>
//           <p className="text-gray-600 mb-6">
//             You need to set up your restaurant profile to start accepting bookings.
//           </p>
//           <Link
//             href="/vendor/settings"
//             className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 inline-block"
//           >
//             Set Up Restaurant
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const formatDate = (date) => {
//     const options = { weekday: 'short', month: 'short', day: 'numeric' };
//     return new Date(date).toLocaleDateString('en-US', options);
//   };

//   return (
//     <div>
//       {/* Restaurant Status */}
//       <div className="mb-8 bg-white rounded-lg shadow-md p-6">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//           <div>
//             <h1 className="text-2xl font-bold mb-2">{restaurant.name}</h1>
//             <p className="text-gray-600">{restaurant.address}, {restaurant.city}</p>
//           </div>
//           <div className="mt-4 md:mt-0 flex items-center">
//             <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//               restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//             }`}>
//               {restaurant.isOpen ? 'Open' : 'Closed'}
//             </span>
//             <Link
//               href="/vendor/settings"
//               className="ml-4 text-blue-600 hover:text-blue-800 inline-flex items-center"
//             >
//               <span>Update Status</span>
//               <RiArrowRightSLine className="ml-1" />
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {/* Total Bookings */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-blue-100 mr-4">
//               <RiCalendarEventLine className="text-xl text-blue-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Total Bookings</p>
//               <h3 className="text-2xl font-bold">{stats.totalBookings}</h3>
//             </div>
//           </div>
//         </div>

//         {/* Pending Bookings */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-yellow-100 mr-4">
//               <RiTimeLine className="text-xl text-yellow-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Pending</p>
//               <h3 className="text-2xl font-bold">{stats.pendingBookings}</h3>
//             </div>
//           </div>
//         </div>

//         {/* Completed Bookings */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-green-100 mr-4">
//               <RiCheckboxCircleLine className="text-xl text-green-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Completed</p>
//               <h3 className="text-2xl font-bold">{stats.completedBookings}</h3>
//             </div>
//           </div>
//         </div>

//         {/* Cancelled Bookings */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-red-100 mr-4">
//               <RiAlertLine className="text-xl text-red-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Cancelled</p>
//               <h3 className="text-2xl font-bold">{stats.cancelledBookings}</h3>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Today's Bookings */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold">Today's Bookings</h2>
//           <Link
//             href="/vendor/bookings"
//             className="text-blue-600 hover:text-blue-800 inline-flex items-center"
//           >
//             <span>View All</span>
//             <RiArrowRightSLine className="ml-1" />
//           </Link>
//         </div>

//         {todayBookings.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Time
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     People
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Table
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {todayBookings.map((booking) => (
//                   <tr key={booking.id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10">
//                           <RiUser3Line className="h-10 w-10 text-gray-300" />
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">
//                             {booking.user.name}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {booking.user.email}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{booking.time}</div>
//                       <div className="text-sm text-gray-500">{formatDate(booking.date)}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {booking.people}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {booking.table.type} {booking.table.hasAC ? '(AC)' : '(Non-AC)'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         booking.status === 'CONFIRMED'
//                           ? 'bg-green-100 text-green-800'
//                           : booking.status === 'PENDING'
//                           ? 'bg-yellow-100 text-yellow-800'
//                           : booking.status === 'CANCELLED'
//                           ? 'bg-red-100 text-red-800'
//                           : 'bg-blue-100 text-blue-800'
//                       }`}>
//                         {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <Link
//                         href={`/vendor/bookings`}
//                         className="text-blue-600 hover:text-blue-900"
//                       >
//                         Details
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="text-center py-10">
//             <RiCalendarEventLine className="text-4xl text-gray-300 mx-auto mb-3" />
//             <p className="text-gray-500">No bookings for today</p>
//           </div>
//         )}
//       </div>

//       {/* Quick Links */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Link href="/vendor/menu" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
//           <RiRestaurantLine className="text-3xl text-blue-500 mb-3" />
//           <h3 className="text-lg font-semibold mb-2">Manage Menu</h3>
//           <p className="text-gray-600">Update your menu items, prices, and availability</p>
//         </Link>
        
//         <Link href="/vendor/bookings" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
//           <RiCalendarEventLine className="text-3xl text-blue-500 mb-3" />
//           <h3 className="text-lg font-semibold mb-2">All Bookings</h3>
//           <p className="text-gray-600">View and manage all your restaurant bookings</p>
//         </Link>
        
//         <Link href="/vendor/settings" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
//           <RiPieChartLine className="text-3xl text-blue-500 mb-3" />
//           <h3 className="text-lg font-semibold mb-2">Restaurant Settings</h3>
//           <p className="text-gray-600">Update your restaurant profile and settings</p>
//         </Link>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/authContext';
import { 
  RiCalendarEventLine, 
  RiRestaurantLine, 
  RiUser3Line, 
  RiPieChartLine,
  RiArrowRightSLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiAlertLine,
  RiMapPin2Line,
  RiBuilding3Line,
  RiStore2Line
} from 'react-icons/ri';

export default function VendorDashboard() {
  const { userId } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [todayBookings, setTodayBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch restaurant data
        const restaurantRes = await fetch('/api/vendor/restaurant');
        const restaurantData = await restaurantRes.json();
        
        if (restaurantData.success) {
          setRestaurant(restaurantData.restaurant);
          
          // Fetch today's bookings
          const bookingsRes = await fetch('/api/vendor/bookings?today=true');
          const bookingsData = await bookingsRes.json();
          
          if (bookingsData.success) {
            setTodayBookings(bookingsData.bookings);
          }
          
          // Fetch stats
          const statsRes = await fetch('/api/vendor/stats');
          const statsData = await statsRes.json();
          
          if (statsData.success) {
            setStats(statsData.stats);
          }
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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // If restaurant is not set up yet
  if (!restaurant) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto border border-stone-100">
        <div className="text-center">
          <RiStore2Line className="text-6xl text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-serif text-amber-900 mb-4">Welcome to the Vendor Dashboard</h1>
          <p className="text-stone-600 mb-6">
            You need to set up your restaurant profile to start accepting bookings.
          </p>
          <Link
            href="/vendor/settings"
            className="bg-amber-700 text-white px-6 py-3 rounded-lg hover:bg-amber-800 inline-block transition-all duration-300 shadow-md font-medium"
          >
            Set Up Restaurant
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  return (
    <div>
      {/* Restaurant Status */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6 border border-stone-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-serif text-amber-900 mb-2 flex items-center">
              <RiStore2Line className="mr-3 text-amber-600" />
              {restaurant.name}
            </h1>
            <p className="text-stone-600 flex items-center">
              <RiMapPin2Line className="mr-1 text-amber-500" />
              {restaurant.address}, {restaurant.city}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              restaurant.isOpen ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </span>
            <Link
              href="/vendor/settings"
              className="ml-4 text-amber-700 hover:text-amber-900 inline-flex items-center"
            >
              <span>Update Status</span>
              <RiArrowRightSLine className="ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-stone-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 mr-4">
              <RiCalendarEventLine className="text-xl text-amber-700" />
            </div>
            <div>
              <p className="text-sm text-stone-600">Total Bookings</p>
              <h3 className="text-2xl font-bold text-amber-900">{stats.totalBookings}</h3>
            </div>
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-stone-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <RiTimeLine className="text-xl text-yellow-700" />
            </div>
            <div>
              <p className="text-sm text-stone-600">Pending</p>
              <h3 className="text-2xl font-bold text-amber-900">{stats.pendingBookings}</h3>
            </div>
          </div>
        </div>

        {/* Completed Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-stone-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <RiCheckboxCircleLine className="text-xl text-green-700" />
            </div>
            <div>
              <p className="text-sm text-stone-600">Completed</p>
              <h3 className="text-2xl font-bold text-amber-900">{stats.completedBookings}</h3>
            </div>
          </div>
        </div>

        {/* Cancelled Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-stone-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <RiAlertLine className="text-xl text-red-700" />
            </div>
            <div>
              <p className="text-sm text-stone-600">Cancelled</p>
              <h3 className="text-2xl font-bold text-amber-900">{stats.cancelledBookings}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Bookings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-stone-100">
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-stone-100">
          <h2 className="text-xl font-serif text-amber-900">Today's Bookings</h2>
          <Link
            href="/vendor/bookings"
            className="text-amber-700 hover:text-amber-900 inline-flex items-center"
          >
            <span>View All</span>
            <RiArrowRightSLine className="ml-1" />
          </Link>
        </div>

        {todayBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    People
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Table
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-stone-200">
                {todayBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-stone-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-amber-50 rounded-full flex items-center justify-center">
                          <RiUser3Line className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-stone-900">
                            {booking.user.name}
                          </div>
                          <div className="text-sm text-stone-500">
                            {booking.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-stone-900">{booking.time}</div>
                      <div className="text-sm text-stone-500">{formatDate(booking.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                      {booking.people}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                      {booking.table.type} {booking.table.hasAC ? '(AC)' : '(Non-AC)'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'CONFIRMED'
                          ? 'bg-green-50 text-green-800 border border-green-200'
                          : booking.status === 'PENDING'
                          ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                          : booking.status === 'CANCELLED'
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/vendor/bookings`}
                        className="text-amber-600 hover:text-amber-900 transition-colors duration-150"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <RiCalendarEventLine className="text-5xl text-amber-300 mx-auto mb-3" />
            <p className="text-stone-600">No bookings for today</p>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/vendor/menu" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-stone-100">
          <RiRestaurantLine className="text-3xl text-amber-600 mb-3" />
          <h3 className="text-lg font-serif text-amber-900 mb-2">Manage Menu</h3>
          <p className="text-stone-600">Update your menu items, prices, and availability</p>
        </Link>
        
        <Link href="/vendor/bookings" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-stone-100">
          <RiCalendarEventLine className="text-3xl text-amber-600 mb-3" />
          <h3 className="text-lg font-serif text-amber-900 mb-2">All Bookings</h3>
          <p className="text-stone-600">View and manage all your restaurant bookings</p>
        </Link>
        
        <Link href="/vendor/settings" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-stone-100">
          <RiBuilding3Line className="text-3xl text-amber-600 mb-3" />
          <h3 className="text-lg font-serif text-amber-900 mb-2">Restaurant Settings</h3>
          <p className="text-stone-600">Update your restaurant profile and settings</p>
        </Link>
      </div>
    </div>
  );
}