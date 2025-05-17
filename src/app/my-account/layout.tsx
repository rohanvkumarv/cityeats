
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { 
  RiCalendarEventLine, 
  RiUser3Line, 
  RiHeart3Line, 
  RiSettings3Line,
  RiLogoutBoxLine,
  RiMenuLine,
  RiCloseLine,
  RiAccountCircleLine
} from 'react-icons/ri';

export default function MyAccountLayout({ children }) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  const navItems = [
    {
      name: 'My Bookings',
      href: '/my-account/bookings',
      icon: <RiCalendarEventLine className="text-xl" />,
    },
    {
      name: 'Profile',
      href: '/my-account/profile',
      icon: <RiUser3Line className="text-xl" />,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
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
            <h1 className="text-3xl md:text-4xl font-serif mb-2">My Account</h1>
            <p className="text-amber-100 max-w-xl mx-auto text-lg">Manage your bookings and profile</p>
          </div>
        </div>
        
        <div className="flex min-h-[50vh] items-center justify-center flex-col p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
          <RiAccountCircleLine className="text-6xl text-amber-500 mb-4" />
          <h1 className="text-2xl font-serif text-amber-900 mb-3">Please Login</h1>
          <p className="mb-6 text-stone-600 text-center">You need to be logged in to access your account details and bookings.</p>
          <Link
            href="/auth/login"
            className="bg-amber-700 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition-all duration-300 shadow-md font-medium"
          >
            Login to Your Account
          </Link>
        </div>
      </div>
    );
  }

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
        <div className="container mx-auto px-4 py-12 relative z-20">
          <h1 className="text-3xl md:text-4xl font-serif mb-2">My Account</h1>
          <p className="text-amber-100 max-w-xl text-lg">Manage your bookings and profile</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden bg-white p-3 rounded-lg shadow-md mb-4 self-start flex items-center border border-stone-100"
          >
            {isMobileSidebarOpen ? (
              <RiCloseLine className="text-xl text-amber-700" />
            ) : (
              <div className="flex items-center">
                <RiMenuLine className="text-xl mr-2 text-amber-700" />
                <span className="font-medium">Account Menu</span>
              </div>
            )}
          </button>

          {/* Sidebar for mobile */}
          {isMobileSidebarOpen && (
            <div className="md:hidden bg-white rounded-lg shadow-md p-5 mb-6 border border-stone-100">
              <h2 className="font-serif text-xl text-amber-900 px-4 mb-4">My Account</h2>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg ${
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
                ))}
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-3 text-stone-700 hover:bg-stone-50 rounded-lg mt-4"
                >
                  <RiLogoutBoxLine className="text-xl text-amber-500" />
                  <span className="ml-3 font-medium">Logout</span>
                </button>
              </nav>
            </div>
          )}

          {/* Sidebar for desktop */}
          <div className="hidden md:block w-64 bg-white rounded-lg shadow-md p-5 h-fit border border-stone-100">
            <h2 className="font-serif text-xl text-amber-900 px-4 mb-6">My Account</h2>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
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
              ))}
              <button
                onClick={logout}
                className="flex items-center w-full px-4 py-3 text-stone-700 hover:bg-stone-50 rounded-lg mt-6 transition-all duration-200"
              >
                <RiLogoutBoxLine className="text-xl text-amber-500" />
                <span className="ml-3 font-medium">Logout</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6 md:p-8 border border-stone-100">
            {children}
          </div>
        </div>
      </div>
      
      {/* Footer */}
     
    </div>
  );
}