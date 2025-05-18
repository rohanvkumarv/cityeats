
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import RestaurantCard from '@/components/restaurant/RestaurantCard';
import { 
  RiSearch2Line, 
  RiFilterLine, 
  RiRestaurantLine, 
  RiMapPinLine,
  RiCalendarEventLine,
  RiArrowRightSLine,
  RiStore2Line
} from 'react-icons/ri';

export default function Home() {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Fetch featured restaurants
  useEffect(() => {
    const fetchFeaturedRestaurants = async () => {
      try {
        const response = await fetch('/api/restaurants?featured=true&limit=6');
        const data = await response.json();
        
        if (data.success) {
          setFeaturedRestaurants(data.restaurants);
        }
      } catch (error) {
        console.error('Error fetching featured restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRestaurants();
  }, []);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <main>
      {/* Hero Section with Premium Styling */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Restaurant atmosphere"
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-black/70"></div>
          <div 
            className="absolute inset-0 opacity-30" 
            style={{
              backgroundImage: "url('/images/uk-restaurant-pattern.png')",
              backgroundSize: "100px",
              backgroundRepeat: "repeat"
            }}
          ></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              Discover & Book Amazing Restaurants
            </h1>
            <p className="text-xl text-amber-100 mb-8 font-light">
              Find the perfect restaurant for any occasion and book your table in seconds
            </p>
            
            {/* Enhanced Search Form */}
            <form onSubmit={handleSearch} className="flex w-full rounded-lg overflow-hidden shadow-lg">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search by restaurant name, cuisine or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 px-6 pr-12 text-white focus:outline-none border-0"
                />
                <RiSearch2Line className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-500 text-xl" />
              </div>
              <button
                type="submit"
                className="bg-amber-700 text-white py-4 px-8 font-medium hover:bg-amber-800 transition duration-300"
              >
                Search
              </button>
            </form>
            
            {/* Quick Filter Pills with Premium Styling */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Link href="/restaurants?cuisine=Italian" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm transition duration-300 flex items-center">
                <RiRestaurantLine className="mr-2 text-amber-300" />
                <span className="text-white">Italian</span>
              </Link>
              <Link href="/restaurants?cuisine=Chinese" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm transition duration-300 flex items-center">
                <RiRestaurantLine className="mr-2 text-amber-300" />
                <span className="text-white">Chinese</span>
              </Link>
              <Link href="/restaurants?cuisine=Indian" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm transition duration-300 flex items-center">
                <RiRestaurantLine className="mr-2 text-amber-300" />
                <span className="text-white">Indian</span>
              </Link>
              <Link href="/restaurants?hasRooftop=true" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm transition duration-300 flex items-center">
                <RiMapPinLine className="mr-2 text-amber-300" />
                <span className="text-white">Rooftop</span>
              </Link>
              <Link href="/restaurants?hasAC=true" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm transition duration-300 flex items-center">
                <RiMapPinLine className="mr-2 text-amber-300" />
                <span className="text-white">AC</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Restaurants Section with Premium Styling */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-serif text-amber-900">Featured Restaurants</h2>
            <Link href="/restaurants" className="text-amber-700 hover:text-amber-900 font-medium flex items-center group transition-colors duration-300">
              <span>View All</span>
              <RiArrowRightSLine className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md h-80 animate-pulse border border-stone-100">
                  <div className="h-48 bg-stone-200 rounded-t-xl"></div>
                  <div className="p-5">
                    <div className="h-5 bg-stone-200 rounded-full w-3/4 mb-3"></div>
                    <div className="h-4 bg-stone-200 rounded-full w-1/2 mb-3"></div>
                    <div className="h-8 bg-stone-200 rounded-lg w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {featuredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-stone-100">
              <RiStore2Line className="text-6xl text-amber-300 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-amber-900 mb-2">No featured restaurants available</h3>
              <p className="text-stone-600 mb-6">
                Check back soon for our featured restaurant selections
              </p>
              <Link 
                href="/restaurants"
                className="inline-flex items-center justify-center px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all duration-300 font-medium shadow-md"
              >
                Browse All Restaurants
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* How It Works Section with Premium Styling */}
      <section className="py-20 bg-gradient-to-r from-amber-800 to-amber-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center text-amber-100 mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-200 group-hover:bg-amber-100 transition-all duration-300 shadow-sm">
                <RiSearch2Line className="text-3xl text-stone-900" />
              </div>
              <h3 className="text-xl font-serif text-amber-100 mb-3">Search</h3>
              <p className="text-amber-300">
                Find restaurants by location, cuisine, or amenities like rooftop seating or air conditioning.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-200 group-hover:bg-amber-100 transition-all duration-300 shadow-sm">
                <RiRestaurantLine className="text-3xl text-stone-900" />
              </div>
              <h3 className="text-xl font-serif text-amber-100 mb-3">Choose</h3>
              <p className="text-amber-300">
                Compare options, check reviews, and select the perfect restaurant for your occasion.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-200 group-hover:bg-amber-100 transition-all duration-300 shadow-sm">
                <RiCalendarEventLine className="text-3xl text-stone-900" />
              </div>
              <h3 className="text-xl font-serif text-amber-100 mb-3">Book</h3>
              <p className="text-amber-300">
                Reserve your table with just a few clicks and optionally pre-order your meal.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center text-amber-900 mb-16">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-stone-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-serif text-xl">
                    S
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-amber-900">Sarah Johnson</h4>
                  <p className="text-sm text-stone-500">Food Enthusiast</p>
                </div>
              </div>
              <p className="text-stone-600 italic">
                "CityEats made finding a restaurant for my anniversary dinner so easy. I was able to browse by cuisine, check availability, and make a reservation in minutes!"
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-stone-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-serif text-xl">
                    M
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-amber-900">Michael Chen</h4>
                  <p className="text-sm text-stone-500">Business Professional</p>
                </div>
              </div>
              <p className="text-stone-600 italic">
                "I use CityEats for all my business dinners. The ability to filter by amenities like AC and rooftop dining has been incredibly helpful for impressing clients."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-stone-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-serif text-xl">
                    L
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-amber-900">Laura Martinez</h4>
                  <p className="text-sm text-stone-500">Restaurant Owner</p>
                </div>
              </div>
              <p className="text-stone-600 italic">
                "As a restaurant owner, joining CityEats has increased our bookings by 30%. The platform is easy to manage and has brought us many new loyal customers."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section with Premium Styling */}
      <section className="relative py-20 text-white overflow-hidden">
        {/* Background with pattern and gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-800 to-amber-900 z-0"></div>
        <div 
          className="absolute inset-0 opacity-30" 
          style={{
            backgroundImage: "url('/images/uk-restaurant-pattern.png')",
            backgroundSize: "100px",
            backgroundRepeat: "repeat"
          }}
        ></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-serif font-bold mb-6">Own a Restaurant?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-amber-100">
            Join CityEats to increase your visibility, streamline bookings, and grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-block bg-white text-amber-800 py-3 px-8 rounded-lg font-medium hover:bg-amber-50 transition-all duration-300 shadow-md"
            >
              List Your Restaurant
            </Link>
            <Link
              href="#features"
              className="inline-block border border-white/30 backdrop-blur-sm text-white py-3 px-8 rounded-lg font-medium hover:bg-white/10 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Cities Section */}
      {/* <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center text-amber-900 mb-6">Popular Cities</h2>
          <p className="text-center text-stone-600 max-w-3xl mx-auto mb-12">
            Discover top dining experiences in these popular destinations
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Glasgow', 'Liverpool'].map((city) => (
              <Link 
                key={city}
                href={`/restaurants?city=${city}`} 
                className="group relative h-40 rounded-lg overflow-hidden shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-amber-900/30 group-hover:bg-amber-900/20 transition-all duration-300 z-10"></div>
                <Image 
                  src={`/images/cities/${city.toLowerCase()}.jpg`} 
                  alt={city}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-white font-serif">{city}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section> */}
      
      {/* App Download Section */}
      {/* <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-3xl font-serif text-amber-900 mb-4">Download Our App</h2>
              <p className="text-stone-600 mb-6 max-w-lg">
                Get the CityEats app for a seamless dining experience. Book tables, explore menus, and receive exclusive offers on the go.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="#" className="block w-36">
                  <Image 
                    src="/images/app-store-badge.png" 
                    alt="Download on the App Store" 
                    width={144} 
                    height={48}
                    className="hover:opacity-90 transition-opacity duration-300"
                  />
                </Link>
                <Link href="#" className="block w-36">
                  <Image 
                    src="/images/google-play-badge.png" 
                    alt="Get it on Google Play" 
                    width={144} 
                    height={48}
                    className="hover:opacity-90 transition-opacity duration-300"
                  />
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-64 h-96">
                <Image 
                  src="/images/app-mockup.png" 
                  alt="CityEats mobile app" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </main>
  );
}