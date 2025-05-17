
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { 
  RiCalendarEventLine, 
  RiMapPin2Line,
  RiTimeLine,
  RiUserLine,
  RiRestaurantLine,
  RiArrowRightSLine,
  RiInformationLine,
  RiStarFill,
  RiCheckboxCircleLine
} from 'react-icons/ri';

export default function MyBookings() {
  const { userId } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [newBookingId, setNewBookingId] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if there's a new booking from URL parameter
    const newId = searchParams.get('new');
    if (newId) {
      setNewBookingId(newId);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const params = new URLSearchParams();
        
        if (activeTab === 'upcoming') {
          params.append('upcoming', 'true');
        } else if (activeTab === 'past') {
          params.append('past', 'true');
        } else if (activeTab === 'cancelled') {
          params.append('status', 'CANCELLED');
        }
        
        const res = await fetch(`/api/bookings?${params.toString()}`);
        const data = await res.json();
        
        if (data.success) {
          setBookings(data.bookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookings();
    }
  }, [userId, activeTab]);

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const cancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Update booking in state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingId ? { ...booking, status: 'CANCELLED' } : booking
          )
        );
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const BookingCard = ({ booking }) => {
    const isNew = booking.id === newBookingId;
    const isPast = new Date(booking.date) < new Date();
    const canCancel = !isPast && booking.status !== 'CANCELLED';
    
    return (
      <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border ${
        isNew ? 'ring-2 ring-amber-500 border-amber-200' : 'border-stone-100'
      }`}>
        {isNew && (
          <div className="bg-amber-600 text-white text-center py-2 font-medium">
            <div className="flex items-center justify-center">
              <RiCheckboxCircleLine className="mr-2" />
              Booking Confirmed!
            </div>
          </div>
        )}
        
        <div className="md:flex">
          {/* Restaurant Image */}
          <div className="md:w-1/3 relative">
            <div className="h-56 md:h-full relative">
              <Image
                src={booking.restaurant.images?.[0]?.imageUrl || '/images/restaurant-placeholder.jpg'}
                alt={booking.restaurant.name}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-700 hover:scale-105"
              />
              
              {booking.restaurant.rating && (
                <div className="absolute top-3 right-3 bg-white shadow-md rounded-full px-2 py-1 flex items-center">
                  <RiStarFill className="text-amber-500 mr-1" />
                  <span className="font-medium text-amber-900">{booking.restaurant.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Booking Details */}
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start">
              <h3 className="font-serif text-xl text-amber-900 mb-1">{booking.restaurant.name}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                booking.status === 'CONFIRMED'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : booking.status === 'PENDING'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : booking.status === 'CANCELLED'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
              </span>
            </div>
            
            <div className="flex items-center text-stone-600 mb-4">
              <RiMapPin2Line className="mr-1 text-amber-500" />
              <span>{booking.restaurant.address}, {booking.restaurant.city}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start">
                <RiCalendarEventLine className="mt-1 mr-2 text-amber-500" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(booking.date)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <RiTimeLine className="mt-1 mr-2 text-amber-500" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{booking.time}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <RiUserLine className="mt-1 mr-2 text-amber-500" />
                <div>
                  <p className="text-sm text-gray-500">Party Size</p>
                  <p className="font-medium">{booking.people} {booking.people === 1 ? 'person' : 'people'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <RiRestaurantLine className="mt-1 mr-2 text-amber-500" />
                <div>
                  <p className="text-sm text-gray-500">Table</p>
                  <p className="font-medium">
                    {booking.table.type} {booking.table.hasAC ? '(AC)' : '(Non-AC)'}
                  </p>
                </div>
              </div>
            </div>
            
            {booking.order && (
              <div className="mb-4 p-4 bg-stone-50 rounded-lg border border-stone-100">
                <h4 className="font-medium mb-3 text-amber-900">Pre-ordered Food</h4>
                <ul className="space-y-2">
                  {booking.order.orderItems.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span>{item.menuItem.name} × {item.quantity}</span>
                      <span className="font-medium">£{(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                  <li className="flex justify-between font-medium pt-3 border-t mt-3 text-amber-900">
                    <span>Total</span>
                    <span>£{booking.order.totalAmount.toFixed(2)}</span>
                  </li>
                </ul>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4 mt-2">
              <Link
                href={`/restaurants/${booking.restaurant.id}`}
                className="inline-flex items-center px-4 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors duration-300 font-medium border border-amber-200"
              >
                <span>View Restaurant</span>
                <RiArrowRightSLine className="ml-1" />
              </Link>
              
              {canCancel && (
                <button
                  onClick={() => cancelBooking(booking.id)}
                  className="px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-300 border border-transparent hover:border-red-200"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-serif text-amber-900 mb-6 flex items-center">
        <RiCalendarEventLine className="text-amber-600 mr-3 text-2xl" />
        My Bookings
      </h1>
      
      {/* Tabs */}
      <div className="flex border-b border-stone-200 mb-6">
        <button
          className={`pb-3 px-6 font-medium transition-all duration-300 ${
            activeTab === 'upcoming'
              ? 'border-b-2 border-amber-600 text-amber-900'
              : 'text-stone-500 hover:text-amber-700'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`pb-3 px-6 font-medium transition-all duration-300 ${
            activeTab === 'past'
              ? 'border-b-2 border-amber-600 text-amber-900'
              : 'text-stone-500 hover:text-amber-700'
          }`}
          onClick={() => setActiveTab('past')}
        >
          Past
        </button>
        <button
          className={`pb-3 px-6 font-medium transition-all duration-300 ${
            activeTab === 'cancelled'
              ? 'border-b-2 border-amber-600 text-amber-900'
              : 'text-stone-500 hover:text-amber-700'
          }`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-600"></div>
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-8">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-stone-100">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-amber-50">
            <RiCalendarEventLine className="text-5xl text-amber-300" />
          </div>
          <h3 className="text-xl font-serif text-amber-900 mb-2">No bookings found</h3>
          <p className="text-stone-600 max-w-md mx-auto mb-8">
            {activeTab === 'upcoming'
              ? "You don't have any upcoming restaurant reservations"
              : activeTab === 'past'
              ? "You don't have any past dining experiences with us yet"
              : "You don't have any cancelled bookings"}
          </p>
          <div className="flex justify-center">
            <Link
              href="/restaurants"
              className="inline-flex items-center justify-center px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all duration-300 font-medium shadow-md"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>
      )}
      
      {/* Tips & Information */}
      {bookings.length > 0 && (
        <div className="mt-10 p-5 bg-amber-50 rounded-lg border border-amber-100">
          <div className="flex items-start">
            <RiInformationLine className="text-amber-600 mt-1 mr-3 text-xl" />
            <div>
              <h3 className="font-medium text-amber-900 mb-2">Booking Information</h3>
              <p className="text-stone-700">
                You can cancel a booking up to 24 hours before your reservation time without any charges. For any assistance with your booking, please contact the restaurant directly.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}