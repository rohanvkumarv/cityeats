
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import RestaurantCard from '@/components/restaurant/RestaurantCard';
import { 
  RiSearch2Line, 
  RiFilterLine, 
  RiCloseLine, 
  RiCheckboxCircleLine,
  RiStore2Line,
  RiMapPinLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiPriceTag3Line,
  RiCupLine
} from 'react-icons/ri';
import { 
  FaUmbrella, 
  FaWifi, 
  FaSnowflake, 
  FaParking,
  FaUtensils,
  FaLocationArrow
} from 'react-icons/fa';

export default function RestaurantsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get initial filter values from URL
  const initialSearch = searchParams.get('search') || '';
  const initialCuisine = searchParams.get('cuisine') || '';
  const initialCity = searchParams.get('city') || '';
  const initialHasAC = searchParams.get('hasAC') === 'true';
  const initialHasRooftop = searchParams.get('hasRooftop') === 'true';
  const initialHasWifi = searchParams.get('hasWifi') === 'true';
  const initialHasParking = searchParams.get('hasParking') === 'true';
  
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    pages: 1
  });
  
  // State for form inputs
  const [searchValue, setSearchValue] = useState(initialSearch);
  
  // State for applied filters
  const [filters, setFilters] = useState({
    search: initialSearch,
    cuisine: initialCuisine,
    city: initialCity,
    hasAC: initialHasAC,
    hasRooftop: initialHasRooftop,
    hasWifi: initialHasWifi,
    hasParking: initialHasParking,
    page: 1
  });
  
  // Enhanced filter options for UK context
  const cuisines = [
    'British', 'Italian', 'Indian', 'French', 
    'Chinese', 'Thai', 'Mediterranean', 'Gastropub',
    'Seafood', 'Steakhouse', 'Vegan', 'Afternoon Tea'
  ];
  
  const cities = [
    'London', 'Manchester', 'Birmingham', 'Edinburgh', 
    'Glasgow', 'Liverpool', 'Bristol', 'Leeds',
    'Oxford', 'Cambridge', 'York', 'Bath'
  ];

  // Fetch restaurants based on filters
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        
        // Build query string from filters
        const params = new URLSearchParams();
        
        if (filters.search) params.append('search', filters.search);
        if (filters.cuisine) params.append('cuisine', filters.cuisine);
        if (filters.city) params.append('city', filters.city);
        if (filters.hasAC) params.append('hasAC', 'true');
        if (filters.hasRooftop) params.append('hasRooftop', 'true');
        if (filters.hasWifi) params.append('hasWifi', 'true');
        if (filters.hasParking) params.append('hasParking', 'true');
        
        params.append('page', filters.page);
        params.append('limit', pagination.limit);
        
        // Update URL with current filters
        router.push(`/restaurants?${params.toString()}`, { scroll: false });
        
        // Fetch data
        const response = await fetch(`/api/restaurants?${params.toString()}`);
        const data = await response.json();
        
        if (data.success) {
          setRestaurants(data.restaurants);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [filters, pagination.limit, router]);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      search: searchValue,
      page: 1
    }));
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      page: 1
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchValue('');
    setFilters({
      search: '',
      cuisine: '',
      city: '',
      hasAC: false,
      hasRooftop: false,
      hasWifi: false,
      hasParking: false,
      page: 1
    });
  };

  // Handle page change
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setFilters(prev => ({
        ...prev,
        page: newPage
      }));
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Count active filters
  const activeFiltersCount = 
    (filters.cuisine ? 1 : 0) + 
    (filters.city ? 1 : 0) + 
    (filters.hasAC ? 1 : 0) + 
    (filters.hasRooftop ? 1 : 0) + 
    (filters.hasWifi ? 1 : 0) + 
    (filters.hasParking ? 1 : 0);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero banner */}
      <div className="relative bg-amber-900 text-white">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div 
          className="absolute inset-0 opacity-30" 
          style={{
            backgroundImage: "url('/images/uk-restaurant-pattern.png')",
            backgroundSize: "100px",
            backgroundRepeat: "repeat"
          }}
        ></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-20">
          <h1 className="text-3xl md:text-5xl font-serif mb-4 max-w-2xl">
            Discover Exceptional <span className="text-amber-300">British Dining</span>
          </h1>
          <p className="text-amber-100 max-w-xl text-lg md:text-xl mb-8 font-light">
            From traditional afternoon tea to modern gastronomy, explore the finest restaurants across the UK
          </p>
          
          {/* Search Form - Hero Version */}
          <form onSubmit={handleSearch} className="flex w-full max-w-2xl rounded-lg overflow-hidden shadow-lg bg-white">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by restaurant name, cuisine, or location..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full py-4 px-6 pr-12 text-gray-800 focus:outline-none border-0"
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
          
          {/* Quick filter buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button 
              onClick={() => setFilters(prev => ({...prev, cuisine: 'British', page: 1}))}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm transition duration-300 flex items-center"
            >
              <FaUtensils className="mr-2 text-amber-300" />
              British
            </button>
            <button 
              onClick={() => setFilters(prev => ({...prev, cuisine: 'Gastropub', page: 1}))}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm transition duration-300 flex items-center"
            >
              <RiCupLine className="mr-2 text-amber-300" />
              Gastropub
            </button>
            <button 
              onClick={() => setFilters(prev => ({...prev, cuisine: 'Afternoon Tea', page: 1}))}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm transition duration-300 flex items-center"
            >
              <RiCupLine className="mr-2 text-amber-300" />
              Afternoon Tea
            </button>
            <button 
              onClick={() => setFilters(prev => ({...prev, city: 'London', page: 1}))}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm transition duration-300 flex items-center"
            >
              <FaLocationArrow className="mr-2 text-amber-300" />
              London
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-10">
        {/* Filter Controls */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Compact Search Form */}
            <div className="w-full md:w-auto md:flex-grow">
              <form onSubmit={handleSearch} className="flex w-full rounded-lg overflow-hidden shadow-sm border border-stone-200">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search restaurants..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full py-3 px-4 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 border-0"
                  />
                  <RiSearch2Line className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-500 text-lg" />
                </div>
                <button
                  type="submit"
                  className="bg-amber-700 text-white py-3 px-6 font-medium hover:bg-amber-800 transition duration-300"
                >
                  Search
                </button>
              </form>
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full md:w-auto flex items-center justify-center gap-2 py-3 px-6 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 transition duration-300 shadow-sm"
            >
              <RiFilterLine className="text-amber-700" />
              <span className="font-medium">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 bg-amber-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
          
          {/* Filter Panel */}
          <div className={`mt-4 overflow-hidden transition-all duration-500 ease-in-out ${
            showFilters ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="p-6 bg-white rounded-lg shadow-md border border-stone-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-serif text-amber-900">Refine Your Search</h2>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={clearFilters}
                    className="text-amber-700 hover:text-amber-900 text-sm font-medium"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500 hover:text-gray-700 bg-stone-100 rounded-full p-1"
                  >
                    <RiCloseLine className="text-xl" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Cuisine Filter */}
                <div>
                  <label htmlFor="cuisine" className="block text-sm font-medium text-stone-700 mb-2">
                    Cuisine
                  </label>
                  <div className="relative">
                    <select
                      id="cuisine"
                      name="cuisine"
                      value={filters.cuisine}
                      onChange={handleFilterChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none bg-white text-stone-800"
                    >
                      <option value="">All Cuisines</option>
                      {cuisines.map(cuisine => (
                        <option key={cuisine} value={cuisine}>{cuisine}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* City Filter */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-stone-700 mb-2">
                    City
                  </label>
                  <div className="relative">
                    <select
                      id="city"
                      name="city"
                      value={filters.city}
                      onChange={handleFilterChange}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none bg-white text-stone-800"
                    >
                      <option value="">All Cities</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Amenities Checkboxes */}
                <div className="lg:col-span-2">
                  <p className="block text-sm font-medium text-stone-700 mb-2">
                    Amenities
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex items-center space-x-2 bg-stone-50 px-3 py-2 rounded-lg">
                      <input
                        type="checkbox"
                        id="hasAC"
                        name="hasAC"
                        checked={filters.hasAC}
                        onChange={handleFilterChange}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
                      />
                      <label htmlFor="hasAC" className="text-sm text-stone-800 flex items-center">
                        <FaSnowflake className="mr-2 text-blue-500" />
                        Air Conditioning
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2 bg-stone-50 px-3 py-2 rounded-lg">
                      <input
                        type="checkbox"
                        id="hasRooftop"
                        name="hasRooftop"
                        checked={filters.hasRooftop}
                        onChange={handleFilterChange}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
                      />
                      <label htmlFor="hasRooftop" className="text-sm text-stone-800 flex items-center">
                        <FaUmbrella className="mr-2 text-amber-500" />
                        Rooftop
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2 bg-stone-50 px-3 py-2 rounded-lg">
                      <input
                        type="checkbox"
                        id="hasWifi"
                        name="hasWifi"
                        checked={filters.hasWifi}
                        onChange={handleFilterChange}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
                      />
                      <label htmlFor="hasWifi" className="text-sm text-stone-800 flex items-center">
                        <FaWifi className="mr-2 text-green-500" />
                        Free WiFi
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2 bg-stone-50 px-3 py-2 rounded-lg">
                      <input
                        type="checkbox"
                        id="hasParking"
                        name="hasParking"
                        checked={filters.hasParking}
                        onChange={handleFilterChange}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
                      />
                      <label htmlFor="hasParking" className="text-sm text-stone-800 flex items-center">
                        <FaParking className="mr-2 text-purple-500" />
                        Parking
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Apply Filters Button (Mobile) */}
              <div className="mt-6 md:hidden">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-amber-700 text-white py-3 px-4 rounded-lg hover:bg-amber-800 transition duration-300 font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Active Filters Pills */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.cuisine && (
                <div className="flex items-center bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full text-sm border border-amber-100">
                  <RiPriceTag3Line className="mr-1.5 text-amber-500" />
                  <span>{filters.cuisine}</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, cuisine: '', page: 1 }))}
                    className="ml-2 text-amber-500 hover:text-amber-700"
                  >
                    <RiCloseLine className="text-lg" />
                  </button>
                </div>
              )}
              
              {filters.city && (
                <div className="flex items-center bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full text-sm border border-amber-100">
                  <RiMapPinLine className="mr-1.5 text-amber-500" />
                  <span>{filters.city}</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, city: '', page: 1 }))}
                    className="ml-2 text-amber-500 hover:text-amber-700"
                  >
                    <RiCloseLine className="text-lg" />
                  </button>
                </div>
              )}
              
              {filters.hasAC && (
                <div className="flex items-center bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full text-sm border border-amber-100">
                  <FaSnowflake className="mr-1.5 text-blue-500" />
                  <span>Air Conditioning</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, hasAC: false, page: 1 }))}
                    className="ml-2 text-amber-500 hover:text-amber-700"
                  >
                    <RiCloseLine className="text-lg" />
                  </button>
                </div>
              )}
              
              {filters.hasRooftop && (
                <div className="flex items-center bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full text-sm border border-amber-100">
                  <FaUmbrella className="mr-1.5 text-amber-500" />
                  <span>Rooftop</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, hasRooftop: false, page: 1 }))}
                    className="ml-2 text-amber-500 hover:text-amber-700"
                  >
                    <RiCloseLine className="text-lg" />
                  </button>
                </div>
              )}
              
              {filters.hasWifi && (
                <div className="flex items-center bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full text-sm border border-amber-100">
                  <FaWifi className="mr-1.5 text-green-500" />
                  <span>WiFi</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, hasWifi: false, page: 1 }))}
                    className="ml-2 text-amber-500 hover:text-amber-700"
                  >
                    <RiCloseLine className="text-lg" />
                  </button>
                </div>
              )}
              
              {filters.hasParking && (
                <div className="flex items-center bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full text-sm border border-amber-100">
                  <FaParking className="mr-1.5 text-purple-500" />
                  <span>Parking</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, hasParking: false, page: 1 }))}
                    className="ml-2 text-amber-500 hover:text-amber-700"
                  >
                    <RiCloseLine className="text-lg" />
                  </button>
                </div>
              )}
              
              <button
                onClick={clearFilters}
                className="flex items-center text-stone-600 px-3 py-1.5 rounded-full text-sm underline hover:text-amber-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
        
        {/* Results Count */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-2xl font-serif text-amber-900 mr-3">Restaurants</h2>
            <p className="text-stone-600 bg-stone-100 px-3 py-1 rounded-full text-sm">
              {pagination.total} {pagination.total === 1 ? 'result' : 'results'}
            </p>
          </div>
          
          {/* Sorting dropdown could be added here */}
        </div>
        
        {/* Restaurant Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-52 bg-stone-200"></div>
                <div className="p-5">
                  <div className="h-5 bg-stone-200 rounded-full w-3/4 mb-3"></div>
                  <div className="h-4 bg-stone-200 rounded-full w-1/2 mb-4"></div>
                  <div className="flex space-x-2 mb-3">
                    <div className="h-6 w-16 bg-stone-200 rounded-full"></div>
                    <div className="h-6 w-16 bg-stone-200 rounded-full"></div>
                  </div>
                  <div className="h-10 bg-stone-200 rounded-lg mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {restaurants.map((restaurant) => (
              <div 
                key={restaurant.id} 
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <Link href={`/restaurants/${restaurant.id}`} className="block">
                  <div className="relative h-52 overflow-hidden">
                    {restaurant.images && restaurant.images.length > 0 ? (
                      <Image
                        src={restaurant.images[0].imageUrl}
                        alt={restaurant.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-100">
                        <RiStore2Line className="text-5xl text-stone-300" />
                      </div>
                    )}
                    
                    {restaurant.hasRooftop && (
                      <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                        Rooftop
                      </div>
                    )}
                    
                    {!restaurant.isOpen && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Closed
                      </div>
                    )}
                    
                    {restaurant.rating && (
                      <div className="absolute bottom-3 right-3 bg-white shadow-md rounded-lg px-2 py-1 flex items-center">
                        <RiMapPinLine className="text-amber-500 mr-1" />
                        <span className="font-medium text-amber-900">{restaurant.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-serif text-xl text-amber-900 mb-1">{restaurant.name}</h3>
                    
                    <div className="flex items-center text-stone-600 text-sm mb-3">
                      <RiMapPinLine className="mr-1 text-amber-500" />
                      <span>{restaurant.city}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {restaurant.cuisine?.map((item, index) => (
                        <span 
                          key={index}
                          className="bg-stone-100 text-stone-700 text-xs px-2 py-0.5 rounded"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-4 text-stone-500 text-sm mb-4">
                      <div className="flex items-center">
                        <RiMapPinLine className="mr-1" />
                        <span>{restaurant.openingHours} - {restaurant.closingHours}</span>
                      </div>
                    </div>
                    
                    <button className="w-full mt-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-medium py-2 rounded-lg transition duration-300">
                      View Details
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 bg-white rounded-xl shadow-sm border border-stone-100 text-center px-4">
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-stone-50">
              <RiStore2Line className="text-5xl text-amber-300" />
            </div>
            <h3 className="text-xl font-serif text-amber-900 mb-2">No restaurants found</h3>
            <p className="text-stone-500 max-w-md mx-auto mb-8">
              We couldn't find any restaurants matching your criteria. Try adjusting your filters or search for something else.
            </p>
            <button
              onClick={clearFilters}
              className="bg-amber-700 text-white px-8 py-3 rounded-lg hover:bg-amber-800 transition duration-300 font-medium shadow-sm"
            >
              Clear All Filters
            </button>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && restaurants.length > 0 && pagination.pages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-1">
              <button
                onClick={() => changePage(filters.page - 1)}
                disabled={filters.page === 1}
                className={`px-3 py-2 rounded-lg flex items-center ${
                  filters.page === 1
                    ? 'text-stone-400 cursor-not-allowed'
                    : 'text-amber-700 hover:bg-amber-50 hover:text-amber-900'
                }`}
              >
                <RiArrowLeftSLine className="mr-1" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              
              {[...Array(pagination.pages)].map((_, index) => {
                const pageNumber = index + 1;
                const isCurrentPage = pageNumber === filters.page;
                
                // Show limited pagination buttons for better UX
                if (
                  pageNumber === 1 ||
                  pageNumber === pagination.pages ||
                  (pageNumber >= filters.page - 1 && pageNumber <= filters.page + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => changePage(pageNumber)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors duration-300 ${
                        isCurrentPage
                          ? 'bg-amber-700 text-white shadow-sm'
                          : 'text-stone-700 hover:bg-amber-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                
                // Show ellipsis for skipped pages
                if (
                  (pageNumber === 2 && filters.page > 3) ||
                  (pageNumber === pagination.pages - 1 && filters.page < pagination.pages - 2)
                ) {
                  return <span key={pageNumber} className="px-2 text-stone-500">...</span>;
                }
                
                return null;
              })}
              
              <button
                onClick={() => changePage(filters.page + 1)}
                disabled={filters.page === pagination.pages}
                className={`px-3 py-2 rounded-lg flex items-center ${
                  filters.page === pagination.pages
                    ? 'text-stone-400 cursor-not-allowed'
                    : 'text-amber-700 hover:bg-amber-50 hover:text-amber-900'
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <RiArrowRightSLine className="ml-1" />
              </button>
            </nav>
          </div>
        )}
      </div>
      
      {/* Premium Feature Callout */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif mb-6">Experience the Finest of British Cuisine</h2>
            <p className="text-amber-100 mb-8 text-lg">
              From charming countryside pubs to Michelin-starred establishments, discover the rich tapestry of flavors that make British dining truly special.
            </p>
            <button className="bg-white text-amber-900 px-8 py-3 rounded-lg hover:bg-amber-100 transition duration-300 shadow-md font-medium">
              View Featured Restaurants
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
    </div>
  );
}