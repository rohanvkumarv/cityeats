 
// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useAuth } from '@/contexts/authContext';
// import { 
//   RiDashboardLine, 
//   RiCalendarEventLine, 
//   RiRestaurantLine, 
//   RiSettings3Line,
//   RiLogoutBoxLine,
//   RiMenuLine,
//   RiCloseLine
// } from 'react-icons/ri';

// export default function VendorLayout({ children }) {
//   const { isVendor, isLoading, logout } = useAuth();
//   const pathname = usePathname();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

//   // Handle screen resize
//   useEffect(() => {
//     const handleResize = () => {
//       setIsSidebarOpen(window.innerWidth >= 1024);
//       if (window.innerWidth >= 1024) {
//         setIsMobileSidebarOpen(false);
//       }
//     };

//     // Set initial state
//     handleResize();

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Close mobile sidebar when route changes
//   useEffect(() => {
//     setIsMobileSidebarOpen(false);
//   }, [pathname]);

//   const navItems = [
//     {
//       name: 'Dashboard',
//       href: '/vendor/dashboard',
//       icon: <RiDashboardLine className="text-xl" />,
//     },
//     {
//       name: 'Bookings',
//       href: '/vendor/bookings',
//       icon: <RiCalendarEventLine className="text-xl" />,
//     },
//     {
//       name: 'Menu',
//       href: '/vendor/menu',
//       icon: <RiRestaurantLine className="text-xl" />,
//     },
//     {
//       name: 'Settings',
//       href: '/vendor/settings',
//       icon: <RiSettings3Line className="text-xl" />,
//     },
//   ];

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (!isVendor) {
//     return (
//       <div className="flex min-h-screen items-center justify-center flex-col p-4">
//         <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
//         <p className="mb-6">You don't have permission to access the vendor dashboard.</p>
//         <Link
//           href="/"
//           className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//         >
//           Go to Homepage
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Mobile Sidebar Toggle */}
//       <button
//         onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md"
//       >
//         {isMobileSidebarOpen ? (
//           <RiCloseLine className="text-xl" />
//         ) : (
//           <RiMenuLine className="text-xl" />
//         )}
//       </button>

//       {/* Sidebar for mobile */}
//       {isMobileSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={() => setIsMobileSidebarOpen(false)}
//         ></div>
//       )}

//       {/* Sidebar */}
//       <div
//         className={`${
//           isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-md transition-transform duration-300 ease-in-out lg:transition-none`}
//       >
//         <div className="flex flex-col h-full">
//           {/* Sidebar Header */}
//           <div className="flex items-center justify-center h-16 border-b">
//             <Link href="/vendor/dashboard" className="text-xl font-bold text-blue-600">
//               CityEats Vendor
//             </Link>
//           </div>

//           {/* Sidebar Navigation */}
//           <nav className="flex-1 overflow-y-auto py-4">
//             <ul className="space-y-1 px-2">
//               {navItems.map((item) => (
//                 <li key={item.name}>
//                   <Link
//                     href={item.href}
//                     className={`flex items-center px-4 py-3 rounded-md ${
//                       pathname === item.href
//                         ? 'bg-blue-50 text-blue-600'
//                         : 'text-gray-700 hover:bg-gray-100'
//                     }`}
//                   >
//                     {item.icon}
//                     <span className="ml-3">{item.name}</span>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </nav>

//           {/* Sidebar Footer */}
//           <div className="p-4 border-t">
//             <button
//               onClick={logout}
//               className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
//             >
//               <RiLogoutBoxLine className="text-xl" />
//               <span className="ml-3">Logout</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Main Content Area */}
//         <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { 
  RiDashboardLine, 
  RiCalendarEventLine, 
  RiRestaurantLine, 
  RiSettings3Line,
  RiLogoutBoxLine,
  RiMenuLine,
  RiCloseLine,
  RiStore2Line
} from 'react-icons/ri';

export default function VendorLayout({ children }) {
  const { isVendor, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  const navItems = [
    {
      name: 'Dashboard',
      href: '/vendor/dashboard',
      icon: <RiDashboardLine className="text-xl" />,
    },
    {
      name: 'Bookings',
      href: '/vendor/bookings',
      icon: <RiCalendarEventLine className="text-xl" />,
    },
    {
      name: 'Menu',
      href: '/vendor/menu',
      icon: <RiRestaurantLine className="text-xl" />,
    },
    {
      name: 'Settings',
      href: '/vendor/settings',
      icon: <RiSettings3Line className="text-xl" />,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!isVendor) {
    return (
      <div className="min-h-screen bg-stone-50">
        {/* Hero banner */}
        <div className="relative bg-amber-900 text-white mb-8">
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <div 
            className="absolute inset-0 opacity-30" 
            style={{
              backgroundImage: "url('/images/uk-restaurant-pattern.png')",
              backgroundSize: "100px",
              backgroundRepeat: "repeat"
            }}
          ></div>
          <div className="container mx-auto px-4 py-12 relative z-20 text-center">
            <h1 className="text-3xl md:text-4xl font-serif mb-2">Restaurant Dashboard</h1>
            <p className="text-amber-100 max-w-xl mx-auto text-lg">Manage your restaurant and bookings</p>
          </div>
        </div>
        
        <div className="flex min-h-[50vh] items-center justify-center flex-col p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
          <RiStore2Line className="text-6xl text-amber-500 mb-4" />
          <h1 className="text-2xl font-serif text-amber-900 mb-3">Unauthorized Access</h1>
          <p className="mb-6 text-stone-600 text-center">You don't have permission to access the vendor dashboard.</p>
          <Link
            href="/"
            className="bg-amber-700 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition-all duration-300 shadow-md font-medium"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-stone-50">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md border border-stone-200"
      >
        {isMobileSidebarOpen ? (
          <RiCloseLine className="text-xl text-amber-700" />
        ) : (
          <RiMenuLine className="text-xl text-amber-700" />
        )}
      </button>

      {/* Sidebar for mobile */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-md transition-transform duration-300 ease-in-out lg:transition-none border-r border-stone-100`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-center h-16 border-b border-stone-100">
            <Link href="/vendor/dashboard" className="text-xl font-serif font-bold text-amber-900">
              CityEats Vendor
            </Link>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-3">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      pathname === item.href
                        ? 'bg-amber-50 text-amber-800 border-l-4 border-amber-600'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className={`${pathname === item.href ? 'text-amber-600' : 'text-amber-500'}`}>
                      {item.icon}
                    </div>
                    <span className="ml-3 font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-stone-100">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-stone-700 hover:bg-stone-50 rounded-lg transition-all duration-200"
            >
              <RiLogoutBoxLine className="text-xl text-amber-500" />
              <span className="ml-3 font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}