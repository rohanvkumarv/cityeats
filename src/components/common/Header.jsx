
// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { useAuth } from '@/contexts/authContext';
// import { RiMenu3Line, RiCloseLine, RiUser3Line } from 'react-icons/ri';

// export default function Header() {
//   const { isAuthenticated, isAdmin, isVendor, isCustomer, logout, userEmail } = useAuth();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//     if (isProfileOpen) setIsProfileOpen(false);
//   };

//   const toggleProfile = () => {
//     setIsProfileOpen(!isProfileOpen);
//     if (isMenuOpen) setIsMenuOpen(false);
//   };

//   const handleLogout = async () => {
//     await logout();
//   };

//   return (
//     <header className="bg-white shadow-md">
//       <div className="container mx-auto px-4 py-3">
//         <div className="flex justify-between items-center">
//           {/* Logo */}
//           <Link href="/" className="flex items-center">
//             <span className="text-2xl font-bold text-blue-600">CityEats</span>
//           </Link>

//           {/* Navigation for desktop */}
//           <nav className="hidden md:flex space-x-8">
//             <Link href="/" className="text-gray-600 hover:text-blue-600">
//               Home
//             </Link>
//             <Link href="/restaurants" className="text-gray-600 hover:text-blue-600">
//               Restaurants
//             </Link>
//             {isVendor && (
//               <Link href="/vendor/dashboard" className="text-gray-600 hover:text-blue-600">
//                 Vendor Dashboard
//               </Link>
//             )}
//             {isAdmin && (
//               <Link href="/admin/dashboard" className="text-gray-600 hover:text-blue-600">
//                 Admin Dashboard
//               </Link>
//             )}
//           </nav>

//           {/* Auth buttons for desktop */}
//           <div className="hidden md:flex items-center space-x-4">
//             {isAuthenticated ? (
//               <div className="relative">
//                 <button
//                   onClick={toggleProfile}
//                   className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
//                 >
//                   <RiUser3Line className="text-xl" />
//                   <span className="hidden lg:inline">{userEmail}</span>
//                 </button>
                
//                 {isProfileOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
//                     {isCustomer && (
//                       <Link href="/my-account/bookings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                         My Bookings
//                       </Link>
//                     )}
//                     {isVendor && (
//                       <Link href="/vendor/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                         Vendor Dashboard
//                       </Link>
//                     )}
//                     {isAdmin && (
//                       <Link href="/admin/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                         Admin Dashboard
//                       </Link>
//                     )}
//                     <button
//                       onClick={handleLogout}
//                       className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <>
//                 <Link href="/auth/login" className="text-gray-600 hover:text-blue-600">
//                   Login
//                 </Link>
//                 <Link
//                   href="/auth/signup"
//                   className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <button onClick={toggleMenu} className="md:hidden text-gray-600">
//             {isMenuOpen ? <RiCloseLine className="text-2xl" /> : <RiMenu3Line className="text-2xl" />}
//           </button>
//         </div>

//         {/* Mobile menu */}
//         {isMenuOpen && (
//           <div className="md:hidden mt-4 pb-4">
//             <nav className="flex flex-col space-y-4">
//               <Link
//                 href="/"
//                 className="text-gray-600 hover:text-blue-600"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Home
//               </Link>
//               <Link
//                 href="/restaurants"
//                 className="text-gray-600 hover:text-blue-600"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Restaurants
//               </Link>
//               {isVendor && (
//                 <Link
//                   href="/vendor/dashboard"
//                   className="text-gray-600 hover:text-blue-600"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Vendor Dashboard
//                 </Link>
//               )}
//               {isAdmin && (
//                 <Link
//                   href="/admin/dashboard"
//                   className="text-gray-600 hover:text-blue-600"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   Admin Dashboard
//                 </Link>
//               )}
//               {isAuthenticated ? (
//                 <>
//                   {isCustomer && (
//                     <Link
//                       href="/my-account/bookings"
//                       className="text-gray-600 hover:text-blue-600"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       My Bookings
//                     </Link>
//                   )}
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setIsMenuOpen(false);
//                     }}
//                     className="text-left text-gray-600 hover:text-blue-600"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     href="/auth/login"
//                     className="text-gray-600 hover:text-blue-600"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     href="/auth/signup"
//                     className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block w-fit"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     Sign Up
//                   </Link>
//                 </>
//               )}
//             </nav>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/authContext';
import { 
  RiMenu3Line, 
  RiCloseLine, 
  RiUser3Line, 
  RiRestaurantLine,
  RiCalendarEventLine,
  RiLogoutBoxLine,
  RiDashboardLine,
  RiArrowDownSLine,
  RiStore2Line
} from 'react-icons/ri';

export default function Header() {
  const { isAuthenticated, isAdmin, isVendor, isCustomer, logout, userEmail } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-menu')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <header className={`sticky top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-md'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <RiStore2Line className="text-2xl text-amber-600 mr-2" />
            <span className="text-2xl font-serif font-bold text-amber-900">CityEats</span>
          </Link>

          {/* Navigation for desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-stone-700 hover:text-amber-700 font-medium transition-colors duration-300"
            >
              Home
            </Link>
            <Link 
              href="/restaurants" 
              className="text-stone-700 hover:text-amber-700 font-medium transition-colors duration-300"
            >
              Restaurants
            </Link>
            {isVendor && (
              <Link 
                href="/vendor/dashboard" 
                className="text-stone-700 hover:text-amber-700 font-medium transition-colors duration-300"
              >
                Vendor Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link 
                href="/admin/dashboard" 
                className="text-stone-700 hover:text-amber-700 font-medium transition-colors duration-300"
              >
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Auth buttons for desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative profile-menu">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 text-stone-700 hover:text-amber-700 transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-stone-50"
                >
                  <RiUser3Line className="text-xl text-amber-600" />
                  <span className="hidden lg:inline max-w-[150px] truncate">{userEmail}</span>
                  <RiArrowDownSLine className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-10 border border-stone-100 overflow-hidden">
                    {isCustomer && (
                      <Link 
                        href="/my-account/bookings" 
                        className="flex items-center px-4 py-2 text-stone-700 hover:bg-amber-50 hover:text-amber-700 transition-colors duration-300"
                      >
                        <RiCalendarEventLine className="mr-2 text-amber-500" />
                        My Bookings
                      </Link>
                    )}
                    {isCustomer && (
                      <Link 
                        href="/my-account/profile" 
                        className="flex items-center px-4 py-2 text-stone-700 hover:bg-amber-50 hover:text-amber-700 transition-colors duration-300"
                      >
                        <RiUser3Line className="mr-2 text-amber-500" />
                        My Profile
                      </Link>
                    )}
                    {isVendor && (
                      <Link 
                        href="/vendor/dashboard" 
                        className="flex items-center px-4 py-2 text-stone-700 hover:bg-amber-50 hover:text-amber-700 transition-colors duration-300"
                      >
                        <RiDashboardLine className="mr-2 text-amber-500" />
                        Vendor Dashboard
                      </Link>
                    )}
                    {isAdmin && (
                      <Link 
                        href="/admin/dashboard" 
                        className="flex items-center px-4 py-2 text-stone-700 hover:bg-amber-50 hover:text-amber-700 transition-colors duration-300"
                      >
                        <RiDashboardLine className="mr-2 text-amber-500" />
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-stone-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-stone-700 hover:bg-amber-50 hover:text-amber-700 transition-colors duration-300"
                    >
                      <RiLogoutBoxLine className="mr-2 text-amber-500" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="text-stone-700 hover:text-amber-700 font-medium transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-amber-700 text-white px-5 py-2 rounded-lg hover:bg-amber-800 transition-all duration-300 shadow-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden text-stone-700 hover:text-amber-700 transition-colors duration-300 p-2"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <RiCloseLine className="text-2xl text-amber-600" />
            ) : (
              <RiMenu3Line className="text-2xl text-amber-600" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 bg-white rounded-lg shadow-md border border-stone-100 p-4 animate-fadeIn">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-stone-700 hover:text-amber-700 font-medium transition-colors duration-300 py-2 px-3 rounded-md hover:bg-stone-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/restaurants"
                className="text-stone-700 hover:text-amber-700 font-medium transition-colors duration-300 py-2 px-3 rounded-md hover:bg-stone-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Restaurants
              </Link>
              {isVendor && (
                <Link
                  href="/vendor/dashboard"
                  className="text-stone-700 hover:text-amber-700 font-medium transition-colors duration-300 py-2 px-3 rounded-md hover:bg-stone-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Vendor Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="text-stone-700 hover:text-amber-700 font-medium transition-colors duration-300 py-2 px-3 rounded-md hover:bg-stone-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              
              <div className="border-t border-stone-100 my-1"></div>
              
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-stone-500 text-sm">
                    Signed in as: <span className="font-medium text-amber-700">{userEmail}</span>
                  </div>
                  
                  {isCustomer && (
                    <>
                      <Link
                        href="/my-account/bookings"
                        className="text-stone-700 hover:text-amber-700 font-medium transition-colors duration-300 py-2 px-3 rounded-md hover:bg-stone-50 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <RiCalendarEventLine className="mr-2 text-amber-500" />
                        My Bookings
                      </Link>
                      <Link
                        href="/my-account/profile"
                        className="text-stone-700 hover:text-amber-700 font-medium transition-colors duration-300 py-2 px-3 rounded-md hover:bg-stone-50 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <RiUser3Line className="mr-2 text-amber-500" />
                        My Profile
                      </Link>
                    </>
                  )}
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-stone-700 hover:text-amber-700 font-medium transition-colors duration-300 py-2 px-3 rounded-md hover:bg-stone-50 flex items-center w-full"
                  >
                    <RiLogoutBoxLine className="mr-2 text-amber-500" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-stone-700 hover:text-amber-700 font-medium transition-colors duration-300 py-2 px-3 rounded-md hover:bg-stone-50 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <RiUser3Line className="mr-2 text-amber-500" />
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-all duration-300 inline-block w-full text-center font-medium shadow-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}