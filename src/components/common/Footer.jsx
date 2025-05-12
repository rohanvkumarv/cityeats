
// import Link from 'next/link';
// import { RiFacebookFill, RiTwitterFill, RiInstagramFill } from 'react-icons/ri';

// export default function Footer() {
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="bg-gray-800 text-white">
//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Logo and info */}
//           <div className="md:col-span-1">
//             <h2 className="text-2xl font-bold text-white mb-4">CityEats</h2>
//             <p className="text-gray-300 mb-4">
//               Discover and book the best restaurants in your city
//             </p>
//             <div className="flex space-x-4">
//               <a
//                 href="https://facebook.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-white hover:text-blue-400"
//               >
//                 <RiFacebookFill className="text-xl" />
//               </a>
//               <a
//                 href="https://twitter.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-white hover:text-blue-400"
//               >
//                 <RiTwitterFill className="text-xl" />
//               </a>
//               <a
//                 href="https://instagram.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-white hover:text-blue-400"
//               >
//                 <RiInstagramFill className="text-xl" />
//               </a>
//             </div>
//           </div>

//           {/* Quick links */}
//           <div className="md:col-span-1">
//             <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
//             <ul className="space-y-2">
//               <li>
//                 <Link href="/" className="text-gray-300 hover:text-white">
//                   Home
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/restaurants" className="text-gray-300 hover:text-white">
//                   Restaurants
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/auth/login" className="text-gray-300 hover:text-white">
//                   Login
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/auth/signup" className="text-gray-300 hover:text-white">
//                   Sign Up
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* For restaurants */}
//           <div className="md:col-span-1">
//             <h3 className="text-lg font-semibold mb-4">For Restaurants</h3>
//             <ul className="space-y-2">
//               <li>
//                 <Link href="/auth/vendor/signup" className="text-gray-300 hover:text-white">
//                   List Your Restaurant
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/auth/vendor/login" className="text-gray-300 hover:text-white">
//                   Restaurant Login
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Contact */}
//           <div className="md:col-span-1">
//             <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
//             <p className="text-gray-300 mb-2">
//               Email: info@citieats.com
//             </p>
//             <p className="text-gray-300 mb-2">
//               Phone: +1 (123) 456-7890
//             </p>
//             <p className="text-gray-300">
//               Address: 123 Main Street, City, Country
//             </p>
//           </div>
//         </div>

//         <div className="border-t border-gray-700 mt-8 pt-6 text-center">
//           <p className="text-gray-400">
//             &copy; {currentYear} CityEats. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  RiFacebookFill, 
  RiTwitterFill, 
  RiInstagramFill, 
  RiStore2Line,
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiArrowRightSLine,
  RiSendPlaneLine
} from 'react-icons/ri';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      // In a real application, you would send this to your backend
    }
  };

  return (
    <footer className="bg-stone-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Footer top section with pattern */}
        <div className="relative bg-amber-900 text-white rounded-lg mb-12 overflow-hidden">
          <div className="absolute inset-0 bg-black/20 z-10"></div>
          <div 
            className="absolute inset-0 opacity-30" 
            style={{
              backgroundImage: "url('/images/uk-restaurant-pattern.png')",
              backgroundSize: "100px",
              backgroundRepeat: "repeat"
            }}
          ></div>
          {/* <div className="relative z-20 p-8 md:p-10 flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-12 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-serif mb-2">Join Our Community</h2>
              <p className="text-amber-100 max-w-md">
                Subscribe to our newsletter for exclusive offers, new restaurant alerts, and dining inspiration
              </p>
            </div>
            {subscribed ? (
              <div className="bg-amber-800/50 p-4 rounded-lg text-center md:text-left">
                <p className="text-amber-100 flex items-center justify-center md:justify-start">
                  <RiArrowRightSLine className="mr-2" />
                  Thanks for subscribing! Check your inbox soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="w-full max-w-md flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="px-4 py-3 bg-white/10 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-full border border-white/20 placeholder:text-amber-100"
                  required
                />
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-r-lg transition duration-300 flex items-center font-medium"
                >
                  <RiSendPlaneLine className="mr-2" />
                  <span className="hidden sm:inline">Subscribe</span>
                </button>
              </form>
            )}
          </div> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <RiStore2Line className="text-2xl text-amber-500 mr-2" />
              <h2 className="text-2xl font-serif text-white">CityEats</h2>
            </div>
            <p className="text-stone-300 mb-6">
              Discover and book the best restaurants in your city with our premium dining reservation platform.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-stone-800 hover:bg-amber-700 text-white p-2 rounded-full transition-all duration-300"
                aria-label="Facebook"
              >
                <RiFacebookFill className="text-xl" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-stone-800 hover:bg-amber-700 text-white p-2 rounded-full transition-all duration-300"
                aria-label="Twitter"
              >
                <RiTwitterFill className="text-xl" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-stone-800 hover:bg-amber-700 text-white p-2 rounded-full transition-all duration-300"
                aria-label="Instagram"
              >
                <RiInstagramFill className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-serif mb-4 text-amber-400">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-stone-300 hover:text-amber-300 transition-colors duration-300 flex items-center">
                  <RiArrowRightSLine className="mr-2 text-amber-500" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/restaurants" className="text-stone-300 hover:text-amber-300 transition-colors duration-300 flex items-center">
                  <RiArrowRightSLine className="mr-2 text-amber-500" />
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-stone-300 hover:text-amber-300 transition-colors duration-300 flex items-center">
                  <RiArrowRightSLine className="mr-2 text-amber-500" />
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-stone-300 hover:text-amber-300 transition-colors duration-300 flex items-center">
                  <RiArrowRightSLine className="mr-2 text-amber-500" />
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* For restaurants */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-serif mb-4 text-amber-400">For Restaurants</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/auth/vendor/signup" className="text-stone-300 hover:text-amber-300 transition-colors duration-300 flex items-center">
                  <RiArrowRightSLine className="mr-2 text-amber-500" />
                  List Your Restaurant
                </Link>
              </li>
              <li>
                <Link href="/auth/vendor/login" className="text-stone-300 hover:text-amber-300 transition-colors duration-300 flex items-center">
                  <RiArrowRightSLine className="mr-2 text-amber-500" />
                  Restaurant Login
                </Link>
              </li>
              <li>
                <Link href="/vendor/dashboard" className="text-stone-300 hover:text-amber-300 transition-colors duration-300 flex items-center">
                  <RiArrowRightSLine className="mr-2 text-amber-500" />
                  Vendor Dashboard
                </Link>
              </li>
              <li>
                <Link href="#" className="text-stone-300 hover:text-amber-300 transition-colors duration-300 flex items-center">
                  <RiArrowRightSLine className="mr-2 text-amber-500" />
                  Restaurant Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-serif mb-4 text-amber-400">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <RiMailLine className="text-amber-500 mt-1 mr-3" />
                <div>
                  <p className="text-stone-300 font-medium">Email</p>
                  <a href="mailto:info@citieats.com" className="text-amber-300 hover:text-amber-400 transition-colors duration-300">
                    info@cityeats.com
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <RiPhoneLine className="text-amber-500 mt-1 mr-3" />
                <div>
                  <p className="text-stone-300 font-medium">Phone</p>
                  <a href="tel:+11234567890" className="text-amber-300 hover:text-amber-400 transition-colors duration-300">
                    +1 (123) 456-7890
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <RiMapPinLine className="text-amber-500 mt-1 mr-3" />
                <div>
                  <p className="text-stone-300 font-medium">Address</p>
                  <p className="text-stone-400">
                    123 Main Street<br />City, Country
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-8 text-center">
          <p className="text-stone-400">
            &copy; {currentYear} CityEats. All rights reserved.
          </p>
          <div className="mt-4 space-x-6 text-sm">
            <Link href="/terms" className="text-stone-400 hover:text-amber-300 transition-colors duration-300">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-stone-400 hover:text-amber-300 transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-stone-400 hover:text-amber-300 transition-colors duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}