
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/authContext';
import { 
  RiCalendarLine, 
  RiFilter2Line, 
  RiSearchLine,
  RiUser3Line,
  RiCloseLine,
  RiTimeLine,
  RiMapPinLine,
  RiPhoneLine,
  RiMailLine,
  RiRestaurantLine,
  RiInformationLine,
  RiCheckboxCircleLine,
  RiArrowRightSLine,
  RiCalendarEventLine,
  RiFilterLine
} from 'react-icons/ri';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function VendorBookings() {
  const { userId } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    date: null,
    search: ''
  });
  
  // Modal state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Build query string from filters
        const params = new URLSearchParams();
        
        if (filter.status) {
          params.append('status', filter.status);
        }
        
        if (filter.date) {
          params.append('date', filter.date.toISOString().split('T')[0]);
        }
        
        if (filter.search) {
          params.append('search', filter.search);
        }
        
        // Fetch bookings
        const res = await fetch(`/api/vendor/bookings?${params.toString()}`);
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
  }, [userId, filter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFilter(prev => ({ ...prev, date }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Filter is already applied via the useEffect
  };

  const clearFilters = () => {
    setFilter({
      status: '',
      date: null,
      search: ''
    });
  };

  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };
  
  const formatDateTime = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  // View booking details in modal
  const viewBookingDetails = async (bookingId) => {
    try {
      setModalLoading(true);
      setShowModal(true);
      
      const res = await fetch(`/api/vendor/bookings/${bookingId}`);
      const data = await res.json();
      
      if (data.success) {
        setSelectedBooking(data.booking);
      } else {
        console.error('Error fetching booking details:', data.error);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
    } finally {
      setModalLoading(false);
    }
  };
  
  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  // Update booking status
  const updateBookingStatus = async (bookingId, status) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/vendor/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Update booking in state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingId ? { ...booking, status } : booking
          )
        );
        
        // If the modal is open with this booking, update it there too
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking({...selectedBooking, status});
        }
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-serif text-amber-900 mb-4 md:mb-0 flex items-center">
          <RiCalendarEventLine className="mr-3 text-amber-600" />
          Bookings
        </h1>
        
        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              name="search"
              value={filter.search}
              onChange={handleFilterChange}
              placeholder="Search by customer name..."
              className="pl-10 pr-4 py-2 border border-stone-200 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
          </div>
        </form>
      </div>
      
      {/* Filter Toggle Button (Mobile) */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 transition-all duration-300 mb-4 md:hidden"
      >
        <RiFilterLine className="text-amber-600" />
        <span className="font-medium">Filter Options</span>
        {(filter.status || filter.date) && (
          <span className="ml-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {(filter.status ? 1 : 0) + (filter.date ? 1 : 0)}
          </span>
        )}
      </button>
      
      {/* Filters */}
      <div className={`bg-white rounded-lg shadow-md p-4 mb-6 border border-stone-100 md:block ${showFilters ? 'block' : 'hidden'}`}>
        <div className="flex items-center mb-4 pb-2 border-b border-stone-100">
          <RiFilter2Line className="text-amber-600 mr-2" />
          <h2 className="text-lg font-serif text-amber-900">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-stone-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filter.status}
              onChange={handleFilterChange}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          
          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Date
            </label>
            <div className="relative">
              <DatePicker
                selected={filter.date}
                onChange={handleDateChange}
                placeholderText="Select date"
                className="w-full border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <RiCalendarLine className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400 pointer-events-none" />
            </div>
          </div>
          
          {/* Filter actions */}
          <div className="flex items-end space-x-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-stone-200 rounded-lg text-stone-700 hover:bg-stone-50 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {(filter.status || filter.date) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filter.status && (
            <div className="flex items-center bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full text-sm border border-amber-100">
              <span>Status: {filter.status.charAt(0) + filter.status.slice(1).toLowerCase()}</span>
              <button
                onClick={() => setFilter(prev => ({ ...prev, status: '' }))}
                className="ml-2 text-amber-500 hover:text-amber-700"
              >
                <RiCloseLine className="text-lg" />
              </button>
            </div>
          )}
          
          {filter.date && (
            <div className="flex items-center bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full text-sm border border-amber-100">
              <span>Date: {filter.date.toLocaleDateString()}</span>
              <button
                onClick={() => setFilter(prev => ({ ...prev, date: null }))}
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
      
      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-md border border-stone-100">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        ) : bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Details
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
                {bookings.map((booking) => (
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
                      <div className="text-sm text-stone-900 font-medium">{booking.time}</div>
                      <div className="text-sm text-stone-500">{formatDate(booking.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-stone-900">{booking.people} people</div>
                      <div className="text-sm text-stone-500">
                        {booking.table.type} {booking.table.hasAC ? '(AC)' : '(Non-AC)'}
                      </div>
                      {booking.order && (
                        <div className="text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full mt-1 inline-block border border-amber-100">
                          Has food pre-order
                        </div>
                      )}
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
                      <button
                        onClick={() => viewBookingDetails(booking.id)}
                        className="text-amber-600 hover:text-amber-900 mr-3 transition-colors duration-150"
                      >
                        View
                      </button>
                      {booking.status === 'PENDING' && (
                        <button
                          className="text-green-600 hover:text-green-900 mr-3 transition-colors duration-150"
                          onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                        >
                          Confirm
                        </button>
                      )}
                      {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                        <button
                          className="text-red-600 hover:text-red-900 transition-colors duration-150"
                          onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <RiCalendarLine className="text-6xl text-amber-300 mb-4" />
            <h3 className="text-xl font-serif text-amber-900 mb-2">No bookings found</h3>
            <p className="text-stone-600 mb-6">No bookings match your current filters</p>
            {(filter.status || filter.date || filter.search) && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all duration-300 shadow-sm font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Booking Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-stone-100">
              <h2 className="text-xl font-serif text-amber-900">Booking Details</h2>
              <button 
                onClick={closeModal}
                className="text-stone-500 hover:text-stone-700 transition-colors duration-150"
              >
                <RiCloseLine className="text-2xl" />
              </button>
            </div>
            
            {modalLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-600"></div>
              </div>
            ) : selectedBooking ? (
              <div className="p-6">
                {/* Status badge */}
                <div className="mb-6 flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedBooking.status === 'CONFIRMED'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : selectedBooking.status === 'PENDING'
                      ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                      : selectedBooking.status === 'CANCELLED'
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : 'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}>
                    {selectedBooking.status.charAt(0) + selectedBooking.status.slice(1).toLowerCase()}
                  </span>
                  
                  {/* Action buttons */}
                  <div className="space-x-2">
                    {selectedBooking.status === 'PENDING' && (
                      <button
                        onClick={() => updateBookingStatus(selectedBooking.id, 'CONFIRMED')}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-sm"
                      >
                        Confirm Booking
                      </button>
                    )}
                    {(selectedBooking.status === 'PENDING' || selectedBooking.status === 'CONFIRMED') && (
                      <button
                        onClick={() => updateBookingStatus(selectedBooking.id, 'CANCELLED')}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 shadow-sm"
                      >
                        Cancel Booking
                      </button>
                    )}
                    {selectedBooking.status === 'CONFIRMED' && (
                      <button
                        onClick={() => updateBookingStatus(selectedBooking.id, 'COMPLETED')}
                        className="px-3 py-1 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all duration-300 shadow-sm"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Customer information */}
                <div className="mb-6 p-4 bg-stone-50 rounded-lg border border-stone-100">
                  <h3 className="font-medium mb-3 flex items-center text-amber-900">
                    <RiUser3Line className="mr-2 text-amber-600" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <div className="text-amber-500 mr-2">
                        <RiUser3Line />
                      </div>
                      <div>
                        <p className="text-sm text-stone-500">Name</p>
                        <p className="font-medium text-stone-900">{selectedBooking.user.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="text-amber-500 mr-2">
                        <RiMailLine />
                      </div>
                      <div>
                        <p className="text-sm text-stone-500">Email</p>
                        <p className="font-medium text-stone-900">{selectedBooking.user.email}</p>
                      </div>
                    </div>
                    
                    {selectedBooking.user.phone && (
                      <div className="flex items-center">
                        <div className="text-amber-500 mr-2">
                          <RiPhoneLine />
                        </div>
                        <div>
                          <p className="text-sm text-stone-500">Phone</p>
                          <p className="font-medium text-stone-900">{selectedBooking.user.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Booking information */}
                <div className="mb-6 p-4 bg-stone-50 rounded-lg border border-stone-100">
                  <h3 className="font-medium mb-3 flex items-center text-amber-900">
                    <RiCalendarLine className="mr-2 text-amber-600" />
                    Booking Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <div className="text-amber-500 mr-2">
                        <RiCalendarLine />
                      </div>
                      <div>
                        <p className="text-sm text-stone-500">Date</p>
                        <p className="font-medium text-stone-900">{formatDateTime(selectedBooking.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="text-amber-500 mr-2">
                        <RiTimeLine />
                      </div>
                      <div>
                        <p className="text-sm text-stone-500">Time</p>
                        <p className="font-medium text-stone-900">{selectedBooking.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="text-amber-500 mr-2">
                        <RiUser3Line />
                      </div>
                      <div>
                        <p className="text-sm text-stone-500">Number of People</p>
                        <p className="font-medium text-stone-900">{selectedBooking.people} {selectedBooking.people === 1 ? 'person' : 'people'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="text-amber-500 mr-2">
                        <RiRestaurantLine />
                      </div>
                      <div>
                        <p className="text-sm text-stone-500">Table</p>
                        <p className="font-medium text-stone-900">
                          Table #{selectedBooking.table.tableNumber} - 
                          {selectedBooking.table.type} {selectedBooking.table.hasAC ? '(AC)' : '(Non-AC)'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Special Requests */}
                {selectedBooking.specialRequests && (
                  <div className="mb-6 p-4 bg-stone-50 rounded-lg border border-stone-100">
                    <h3 className="font-medium mb-3 flex items-center text-amber-900">
                      <RiInformationLine className="mr-2 text-amber-600" />
                      Special Requests
                    </h3>
                    <p className="text-stone-700">{selectedBooking.specialRequests}</p>
                  </div>
                )}
                
                {/* Food Pre-order */}
                {selectedBooking.order && selectedBooking.order.orderItems && selectedBooking.order.orderItems.length > 0 && (
                  <div className="mb-6 p-4 bg-stone-50 rounded-lg border border-stone-100">
                    <h3 className="font-medium mb-3 flex items-center text-amber-900">
                      <RiRestaurantLine className="mr-2 text-amber-600" />
                      Food Pre-order
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-stone-200">
                        <thead className="bg-stone-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-stone-500 uppercase">
                              Item
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-stone-500 uppercase">
                              Quantity
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-stone-500 uppercase">
                              Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                          {selectedBooking.order.orderItems.map((item) => (
                            <tr key={item.id} className="hover:bg-stone-50">
                              <td className="px-4 py-2">
                                <div className="font-medium text-stone-900">{item.menuItem.name}</div>
                                <div className="text-sm text-stone-500">{item.menuItem.category}</div>
                              </td>
                              <td className="px-4 py-2 text-center text-stone-900">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-2 text-right text-stone-900">
                                £{(item.price * item.quantity).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-amber-50">
                            <td colSpan="2" className="px-4 py-3 font-medium text-right text-amber-900">
                              Total:
                            </td>
                            <td className="px-4 py-3 font-medium text-right text-amber-900">
                              £{selectedBooking.order.totalAmount.toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-2 text-sm">
                      {selectedBooking.order.isPaid ? 
                        <span className="text-green-600 font-medium flex items-center">
                          <RiCheckboxCircleLine className="mr-1" />
                          Pre-order has been paid
                        </span> : 
                        <span className="text-amber-600 font-medium flex items-center">
                          <RiInformationLine className="mr-1" />
                          Payment will be collected at restaurant
                        </span>
                      }
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex justify-end mt-8">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-100 transition-all duration-300 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-stone-500">
                <p>Booking details not found</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Info and Tips */}
      {bookings.length > 0 && (
        <div className="mt-6 p-5 bg-amber-50 rounded-lg border border-amber-100">
          <div className="flex items-start">
            <RiInformationLine className="text-amber-600 mt-1 mr-3 text-xl" />
            <div>
              <h3 className="font-medium text-amber-900 mb-2">Booking Management Tips</h3>
              <p className="text-stone-700">
                Promptly confirm pending bookings to provide better customer service. For bookings with special requests, review them in advance to ensure you can accommodate them. Consider sending reminders to customers a day before their booking.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}