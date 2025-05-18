
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  RiStarFill, 
  RiMapPin2Line, 
  RiTimeLine, 
  RiPhoneLine, 
  RiWifiLine, 
  RiParkingBoxLine, 
  RiSnowflakeLine,
  RiArrowLeftLine,
  RiShieldCheckLine
} from 'react-icons/ri';
import { FaUmbrella, FaCocktail, FaLeaf, FaWineGlassAlt } from 'react-icons/fa';
import BookingForm from '@/components/restaurant/BookingForm';

export default function RestaurantDetail({ params }) {
  const pathname = usePathname();
  const id = pathname.split('/').pop(); // Extract ID from pathname

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for floating header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 250);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        // Fetch restaurant details
        const restaurantRes = await fetch(`/api/restaurants/${id}`);
        
        if (!restaurantRes.ok) {
          if (restaurantRes.status === 404) {
            setError('Restaurant not found');
            setLoading(false);
            return;
          }
          throw new Error(`Failed to fetch restaurant: ${restaurantRes.status}`);
        }
        
        const restaurantData = await restaurantRes.json();
        
        if (!restaurantData.success) {
          throw new Error(restaurantData.error || 'Failed to fetch restaurant');
        }
        
        setRestaurant(restaurantData.restaurant);
        
        // Fetch menu items
        const menuRes = await fetch(`/api/restaurants/${id}/menu`);
        if (menuRes.ok) {
          const menuData = await menuRes.json();
          if (menuData.success) {
            setMenuItems(menuData.menuItems);
          }
        }
        
        // Fetch tables
        const tablesRes = await fetch(`/api/restaurants/${id}/tables`);
        if (tablesRes.ok) {
          const tablesData = await tablesRes.json();
          if (tablesData.success) {
            setTables(tablesData.tables);
          }
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 border-t-4 border-r-4 border-amber-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-amber-800 font-serif">Setting the table...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <Image 
            src="/images/empty-plate.svg" 
            alt="Empty plate" 
            width={120} 
            height={120}
            className="mx-auto mb-6"
          />
          <h1 className="text-3xl font-serif text-amber-900 mb-4">Restaurant Not Found</h1>
          <p className="text-stone-600 mb-8 font-light">
            {error || "The restaurant you're looking for doesn't exist or has been removed."}
          </p>
          <Link 
            href="/restaurants" 
            className="inline-flex items-center text-amber-700 hover:text-amber-900 border-b-2 border-amber-500 pb-1 transition duration-300"
          >
            <RiArrowLeftLine className="mr-2" />
            Return to all restaurants
          </Link>
        </div>
      </div>
    );
  }

  const { 
    name, 
    description, 
    address, 
    city, 
    cuisine, 
    openingHours, 
    closingHours,
    hasAC, 
    hasRooftop, 
    hasWifi, 
    hasParking, 
    isOpen,
    rating,
    images = []
  } = restaurant;

  // Group menu items by category
  const menuByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-stone-50 min-h-screen pb-16">
      {/* Floating Header - Appears when scrolling */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-md transform transition-all duration-300 ${
          isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="font-serif text-xl font-medium text-amber-900">{name}</h1>
            {rating && (
              <div className="flex items-center ml-4 bg-amber-50 px-2 py-1 rounded-md">
                <RiStarFill className="text-amber-500 mr-1" />
                <span className="font-medium text-amber-800">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <button 
            className="bg-amber-700 text-white px-6 py-2 rounded-md hover:bg-amber-800 transition duration-300 shadow-sm font-medium"
            onClick={() => document.querySelector('#booking-form').scrollIntoView({behavior: 'smooth'})}
          >
            Book Now
          </button>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh]">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <Image
          src={images.length > 0 ? images[activeImage]?.imageUrl : '/images/restaurant-placeholder.jpg'}
          alt={name}
          fill
          priority
          style={{ objectFit: 'cover' }}
          className="transition-all duration-700"
        />
        
        <div className="absolute inset-0 z-20 flex flex-col justify-end">
          <div className="container mx-auto px-4 pb-16">
            <Link 
              href="/restaurants" 
              className="inline-flex items-center text-white/90 hover:text-white mb-4 border-b border-white/40 pb-1 transition duration-300"
            >
              <RiArrowLeftLine className="mr-2" />
              Back to all restaurants
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-3">{name}</h1>
            
            <div className="flex flex-wrap gap-3 mb-6">
              {cuisine?.map((item, index) => (
                <span 
                  key={index}
                  className="bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
            
            <div className="flex items-center mb-2">
              <RiMapPin2Line className="text-amber-300 mr-2" />
              <span className="text-white/90">{address}, {city}</span>
            </div>
            
            <div className="flex items-center">
              <RiTimeLine className="text-amber-300 mr-2" />
              <span className="text-white/90">{openingHours} - {closingHours}</span>
              
              {!isOpen && (
                <span className="ml-4 bg-red-500/90 text-white px-3 py-1 rounded-full text-sm">
                  Currently Closed
                </span>
              )}
              {isOpen && (
                <span className="ml-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm">
                  Open Now
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Image Carousel */}
        {images.length > 1 && (
          <div className="mb-10">
            <h3 className="font-serif text-xl text-amber-900 mb-4 border-b border-amber-200 pb-2">Gallery</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-300">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`relative w-24 h-24 rounded-md overflow-hidden cursor-pointer flex-shrink-0 transition duration-300 ${
                    activeImage === index ? 'ring-3 ring-amber-500 scale-105' : 'opacity-80 hover:opacity-100'
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={image.imageUrl}
                    alt={`${name} image ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Amenities */}
        <div className="mb-10">
          <h3 className="font-serif text-xl text-amber-900 mb-4 border-b border-amber-200 pb-2">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hasAC && (
              <div className="flex items-center bg-stone-100 rounded-lg p-4 hover:bg-stone-200 transition duration-300">
                <RiSnowflakeLine className="text-blue-500 text-xl mr-3" />
                <span className="text-stone-800">Air Conditioning</span>
              </div>
            )}
            
            {hasRooftop && (
              <div className="flex items-center bg-stone-100 rounded-lg p-4 hover:bg-stone-200 transition duration-300">
                <FaUmbrella className="text-amber-500 text-xl mr-3" />
                <span className="text-stone-800">Rooftop Seating</span>
              </div>
            )}
            
            {hasWifi && (
              <div className="flex items-center bg-stone-100 rounded-lg p-4 hover:bg-stone-200 transition duration-300">
                <RiWifiLine className="text-green-500 text-xl mr-3" />
                <span className="text-stone-800">Free WiFi</span>
              </div>
            )}
            
            {hasParking && (
              <div className="flex items-center bg-stone-100 rounded-lg p-4 hover:bg-stone-200 transition duration-300">
                <RiParkingBoxLine className="text-purple-500 text-xl mr-3" />
                <span className="text-stone-800">Parking Available</span>
              </div>
            )}
            
            {/* Additional amenities - this is just for design, replace or remove as needed */}
            <div className="flex items-center bg-stone-100 rounded-lg p-4 hover:bg-stone-200 transition duration-300">
              <FaCocktail className="text-rose-500 text-xl mr-3" />
              <span className="text-stone-800">Full Bar</span>
            </div>
            
            <div className="flex items-center bg-stone-100 rounded-lg p-4 hover:bg-stone-200 transition duration-300">
              <FaLeaf className="text-green-600 text-xl mr-3" />
              <span className="text-stone-800">Vegetarian Options</span>
            </div>
            
            <div className="flex items-center bg-stone-100 rounded-lg p-4 hover:bg-stone-200 transition duration-300">
              <RiShieldCheckLine className="text-blue-600 text-xl mr-3" />
              <span className="text-stone-800">COVID Safe</span>
            </div>
            
            <div className="flex items-center bg-stone-100 rounded-lg p-4 hover:bg-stone-200 transition duration-300">
              <FaWineGlassAlt className="text-red-700 text-xl mr-3" />
              <span className="text-stone-800">Wine Selection</span>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-8">
          <div className="inline-flex bg-stone-200 rounded-lg p-1">
            <button
              className={`px-6 py-2 rounded-md font-medium transition duration-300 ${
                activeTab === 'about'
                  ? 'bg-amber-700 text-white shadow-md'
                  : 'text-stone-700 hover:bg-stone-300'
              }`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
            <button
              className={`px-6 py-2 rounded-md font-medium transition duration-300 ${
                activeTab === 'menu'
                  ? 'bg-amber-700 text-white shadow-md'
                  : 'text-stone-700 hover:bg-stone-300'
              }`}
              onClick={() => setActiveTab('menu')}
            >
              Menu
            </button>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Content */}
          <div className="lg:col-span-2">
            {activeTab === 'about' && (
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-serif text-amber-900 mb-6 pb-3 border-b border-amber-100">About {name}</h2>
                <div className="prose max-w-none mb-8">
                  <p className="text-stone-700 leading-relaxed">
                    {description || `Welcome to ${name}, where we combine the finest ingredients with traditional British cooking techniques to create unforgettable dining experiences. Our chefs draw inspiration from classic UK cuisine while adding contemporary twists that delight and surprise.`}
                  </p>
                </div>
                
                <h3 className="text-xl font-serif text-amber-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-4 bg-stone-50 rounded-lg border border-stone-100">
                    <RiPhoneLine className="text-amber-600 text-xl mr-3" />
                    <span className="text-stone-800">+1 (123) 456-7890</span>
                  </div>
                  <div className="flex items-center p-4 bg-stone-50 rounded-lg border border-stone-100">
                    <RiMapPin2Line className="text-amber-600 text-xl mr-3" />
                    <span className="text-stone-800">{address}, {city}</span>
                  </div>
                </div>
                
                <div className="mt-8 bg-amber-50 rounded-lg p-4 border-l-4 border-amber-500">
                  <h4 className="font-medium text-amber-800 mb-2">A taste of British tradition</h4>
                  <p className="text-amber-700 text-sm">
                    Our ingredients are sourced from local farms and suppliers, ensuring the freshest seasonal produce for our dishes. We pride ourselves on our authentic recipes passed down through generations.
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'menu' && (
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-serif text-amber-900 mb-6 pb-3 border-b border-amber-100">Our Menu</h2>
                
                {Object.keys(menuByCategory).length > 0 ? (
                  Object.entries(menuByCategory).map(([category, items]) => (
                    <div key={category} className="mb-10">
                      <h3 className="text-xl font-serif text-amber-800 mb-6 pb-2 border-b border-amber-200 inline-block">
                        {category}
                      </h3>
                      
                      <div className="space-y-6">
                        {items.map(item => (
                          <div key={item.id} className="flex justify-between items-start hover:bg-stone-50 p-3 rounded-lg transition duration-300">
                            <div>
                              <h4 className="font-medium text-stone-900">{item.name}</h4>
                              {item.description && (
                                <p className="text-stone-600 text-sm mt-1 pr-4">{item.description}</p>
                              )}
                            </div>
                            <div className="text-amber-800 font-serif font-medium text-lg ml-4 bg-amber-50 px-3 py-1 rounded">
                              ${item.price.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <div className="text-amber-800 text-6xl mb-4">🍽️</div>
                    <p className="text-stone-500">
                      Our menu is being updated. Please check back soon or contact us for today's specials.
                    </p>
                  </div>
                )}
                
                <div className="mt-8 bg-stone-100 rounded-lg p-4 border border-stone-200 text-sm text-stone-600">
                  <p>Prices are inclusive of VAT. A discretionary service charge of 12.5% will be added to your bill.</p>
                  <p className="mt-2">Please inform your server of any allergies or dietary requirements before ordering.</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Booking Form */}
          <div id="booking-form" className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8 sticky top-28">
              <h2 className="text-2xl font-serif text-amber-900 mb-6 pb-3 border-b border-amber-100">Reserve Your Table</h2>
              <BookingForm 
                restaurantId={id} 
                tables={tables}
                menuItems={menuItems}
              />
            </div>
          </div>
        </div>
      </div>
      
      
    </div>
  );
}