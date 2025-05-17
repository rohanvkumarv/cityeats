
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import { 
  RiRestaurantLine, 
  RiInformationLine,
  RiMapPinLine,
  RiTimeLine,
  RiImageAddLine,
  RiAddLine,
  RiDeleteBinLine,
  RiCheckboxCircleLine,
  RiCheckboxBlankLine,
  RiStarFill,
  RiStore2Line,
  RiShieldCheckLine
} from 'react-icons/ri';

export default function VendorSettings() {
  const { userId } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    cuisine: [],
    openingHours: '08:00',
    closingHours: '22:00',
    hasAC: false,
    hasRooftop: false,
    hasWifi: false,
    hasParking: false,
    isOpen: true,
    tables: []
  });
  
  const [newCuisineInput, setNewCuisineInput] = useState('');
  const [showNewTableForm, setShowNewTableForm] = useState(false);
  const [newTable, setNewTable] = useState({
    tableNumber: '',
    capacity: '',
    type: 'INDOOR',
    hasAC: false
  });

  const cuisineOptions = [
    'Italian', 'Chinese', 'Indian', 'Mexican', 
    'Japanese', 'Thai', 'American', 'Mediterranean',
    'French', 'Greek', 'Spanish', 'Korean', 
    'Vietnamese', 'Lebanese', 'Turkish', 'Vegetarian'
  ];
  
  const cityOptions = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 
    'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego',
    'Dallas', 'Austin', 'San Francisco', 'Seattle',
    'Denver', 'Boston', 'Atlanta', 'Miami'
  ];

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch('/api/vendor/restaurant');
        const data = await res.json();
        
        if (data.success) {
          setRestaurant(data.restaurant);
          
          if (data.restaurant) {
            // Initialize form with restaurant data
            setFormData({
              name: data.restaurant.name || '',
              description: data.restaurant.description || '',
              address: data.restaurant.address || '',
              city: data.restaurant.city || '',
              cuisine: data.restaurant.cuisine || [],
              openingHours: data.restaurant.openingHours || '08:00',
              closingHours: data.restaurant.closingHours || '22:00',
              hasAC: data.restaurant.hasAC || false,
              hasRooftop: data.restaurant.hasRooftop || false,
              hasWifi: data.restaurant.hasWifi || false,
              hasParking: data.restaurant.hasParking || false,
              isOpen: data.restaurant.isOpen || true,
              tables: data.restaurant.tables || []
            });
          }
        }
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        showMessage('Failed to load restaurant data', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRestaurant();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCuisineChange = (cuisine) => {
    setFormData(prev => {
      if (prev.cuisine.includes(cuisine)) {
        return {
          ...prev,
          cuisine: prev.cuisine.filter(c => c !== cuisine)
        };
      } else {
        return {
          ...prev,
          cuisine: [...prev.cuisine, cuisine]
        };
      }
    });
  };

  const handleAddNewCuisine = () => {
    if (newCuisineInput.trim() === '') return;
    
    setFormData(prev => ({
      ...prev,
      cuisine: [...prev.cuisine, newCuisineInput.trim()]
    }));
    
    setNewCuisineInput('');
  };

  const handleNewTableChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTable(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTable = () => {
    // Validate table data
    if (!newTable.tableNumber || !newTable.capacity) {
      showMessage('Please fill in all required table fields', 'error');
      return;
    }
    
    // Add table to form data
    setFormData(prev => ({
      ...prev,
      tables: [
        ...prev.tables,
        {
          ...newTable,
          tableNumber: parseInt(newTable.tableNumber),
          capacity: parseInt(newTable.capacity),
          isAvailable: true
        }
      ]
    }));
    
    // Reset new table form
    setNewTable({
      tableNumber: '',
      capacity: '',
      type: 'INDOOR',
      hasAC: false
    });
    
    setShowNewTableForm(false);
  };

  const handleRemoveTable = (index) => {
    setFormData(prev => ({
      ...prev,
      tables: prev.tables.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Validate form data
      if (!formData.name || !formData.address || !formData.city || 
          formData.cuisine.length === 0 || !formData.openingHours || !formData.closingHours) {
        showMessage('Please fill in all required fields', 'error');
        setSaving(false);
        return;
      }
      
      const res = await fetch('/api/vendor/restaurant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        setRestaurant(data.restaurant);
        showMessage('Restaurant settings saved successfully', 'success');
      } else {
        showMessage(data.error || 'Failed to save restaurant settings', 'error');
      }
    } catch (error) {
      console.error('Error saving restaurant settings:', error);
      showMessage('An unexpected error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleRestaurantStatus = async () => {
    try {
      const newStatus = !formData.isOpen;
      
      const res = await fetch('/api/vendor/restaurant', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isOpen: newStatus })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setFormData(prev => ({ ...prev, isOpen: newStatus }));
        setRestaurant(data.restaurant);
        showMessage(
          `Restaurant is now ${newStatus ? 'open' : 'closed'} for bookings`,
          'success'
        );
      } else {
        showMessage(data.error || 'Failed to update restaurant status', 'error');
      }
    } catch (error) {
      console.error('Error updating restaurant status:', error);
      showMessage('An unexpected error occurred', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif text-amber-900 flex items-center">
          <RiStore2Line className="mr-3 text-amber-600" />
          Restaurant Settings
        </h1>
        
        {restaurant && (
          <button
            onClick={toggleRestaurantStatus}
            className={`flex items-center px-4 py-2 rounded-lg ${
              formData.isOpen
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            } transition-all duration-300 shadow-sm font-medium`}
          >
            {formData.isOpen ? 'Close Restaurant' : 'Open Restaurant'}
          </button>
        )}
      </div>
      
      {/* Restaurant Status Card */}
      {restaurant && (
        <div className={`mb-6 p-4 rounded-lg ${
          formData.isOpen ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-full mr-3 ${
              formData.isOpen ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <RiRestaurantLine className={
                formData.isOpen ? 'text-green-700' : 'text-red-700'
              } />
            </div>
            <div>
              <h2 className="font-medium">
                {formData.isOpen ? 'Open for Bookings' : 'Closed for Bookings'}
              </h2>
              <p className="text-sm">
                {formData.isOpen 
                  ? 'Your restaurant is visible to customers and accepting bookings'
                  : 'Your restaurant is not accepting bookings at this time'
                }
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Message notification */}
      {message && (
        <div className={`p-4 mb-6 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <RiShieldCheckLine className="text-green-500 mr-2 text-xl" />
            ) : (
              <RiInformationLine className="text-red-500 mr-2 text-xl" />
            )}
            {message.text}
          </div>
        </div>
      )}
      
      {/* Settings Tabs */}
      <div className="mb-6 border-b border-stone-200">
        <div className="flex space-x-6">
          <button
            className={`pb-3 font-medium transition-all duration-300 ${
              activeTab === 'basic'
                ? 'border-b-2 border-amber-600 text-amber-900'
                : 'text-stone-500 hover:text-amber-700'
            }`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Information
          </button>
          <button
            className={`pb-3 font-medium transition-all duration-300 ${
              activeTab === 'tables'
                ? 'border-b-2 border-amber-600 text-amber-900'
                : 'text-stone-500 hover:text-amber-700'
            }`}
            onClick={() => setActiveTab('tables')}
          >
            Tables
          </button>
          <button
            className={`pb-3 font-medium transition-all duration-300 ${
              activeTab === 'images'
                ? 'border-b-2 border-amber-600 text-amber-900'
                : 'text-stone-500 hover:text-amber-700'
            }`}
            onClick={() => setActiveTab('images')}
          >
            Images
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-stone-100">
            <div className="mb-6 flex items-center pb-2 border-b border-stone-100">
              <RiInformationLine className="text-amber-600 mr-2" size={20} />
              <h2 className="text-lg font-serif text-amber-900">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Restaurant Name */}
              <div>
                <label htmlFor="name" className="block text-stone-700 font-medium mb-2">
                  Restaurant Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              
              {/* City */}
              <div>
                <label htmlFor="city" className="block text-stone-700 font-medium mb-2">
                  City*
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                  required
                >
                  <option value="">Select City</option>
                  {cityOptions.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-stone-700 font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              ></textarea>
            </div>
            
            {/* Address */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <RiMapPinLine className="text-amber-500 mr-2" />
                <label htmlFor="address" className="block text-stone-700 font-medium">
                  Address*
                </label>
              </div>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
                placeholder="Street address"
              />
            </div>
            
            {/* Hours */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <RiTimeLine className="text-amber-500 mr-2" />
                <label className="block text-stone-700 font-medium">
                  Operating Hours*
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="openingHours" className="block text-sm text-stone-600 mb-1">
                    Opening Time
                  </label>
                  <input
                    type="time"
                    id="openingHours"
                    name="openingHours"
                    value={formData.openingHours}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="closingHours" className="block text-sm text-stone-600 mb-1">
                    Closing Time
                  </label>
                  <input
                    type="time"
                    id="closingHours"
                    name="closingHours"
                    value={formData.closingHours}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Cuisine */}
            <div className="mb-6">
              <label className="block text-stone-700 font-medium mb-2">
                Cuisine Types*
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-3">
                {cuisineOptions.map(cuisine => (
                  <div key={cuisine} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`cuisine-${cuisine}`}
                      checked={formData.cuisine.includes(cuisine)}
                      onChange={() => handleCuisineChange(cuisine)}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
                    />
                    <label htmlFor={`cuisine-${cuisine}`} className="ml-2 text-sm text-stone-700">
                      {cuisine}
                    </label>
                  </div>
                ))}
              </div>
              
              {/* Add custom cuisine */}
              <div className="flex mt-2">
                <input
                  type="text"
                  value={newCuisineInput}
                  onChange={(e) => setNewCuisineInput(e.target.value)}
                  placeholder="Add custom cuisine"
                  className="flex-grow px-3 py-2 border border-stone-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddNewCuisine}
                  className="bg-amber-700 text-white px-4 py-2 rounded-r-lg hover:bg-amber-800 transition-all duration-300"
                >
                  Add
                </button>
              </div>
              
              {/* Show selected cuisines */}
              {formData.cuisine.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.cuisine.map(cuisine => (
                    <span 
                      key={cuisine}
                      className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded-md text-sm"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Amenities */}
            <div className="mb-6">
              <label className="block text-stone-700 font-medium mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center bg-stone-50 px-3 py-2 rounded-lg">
                  <input
                    type="checkbox"
                    id="hasAC"
                    name="hasAC"
                    checked={formData.hasAC}
                    onChange={handleChange}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
                  />
                  <label htmlFor="hasAC" className="ml-2 text-stone-700">
                    Air Conditioning
                  </label>
                </div>
                
                <div className="flex items-center bg-stone-50 px-3 py-2 rounded-lg">
                  <input
                    type="checkbox"
                    id="hasRooftop"
                    name="hasRooftop"
                    checked={formData.hasRooftop}
                    onChange={handleChange}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
                  />
                  <label htmlFor="hasRooftop" className="ml-2 text-stone-700">
                    Rooftop Seating
                  </label>
                </div>
                
                <div className="flex items-center bg-stone-50 px-3 py-2 rounded-lg">
                  <input
                    type="checkbox"
                    id="hasWifi"
                    name="hasWifi"
                    checked={formData.hasWifi}
                    onChange={handleChange}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
                  />
                  <label htmlFor="hasWifi" className="ml-2 text-stone-700">
                    Free WiFi
                  </label>
                </div>
                
                <div className="flex items-center bg-stone-50 px-3 py-2 rounded-lg">
                  <input
                    type="checkbox"
                    id="hasParking"
                    name="hasParking"
                    checked={formData.hasParking}
                    onChange={handleChange}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
                  />
                  <label htmlFor="hasParking" className="ml-2 text-stone-700">
                    Parking Available
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Tables Tab */}
        {activeTab === 'tables' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-stone-100">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-stone-100">
              <div className="flex items-center">
                <RiRestaurantLine className="text-amber-600 mr-2" size={20} />
                <h2 className="text-lg font-serif text-amber-900">Tables</h2>
              </div>
              
              <button
                type="button"
                onClick={() => setShowNewTableForm(!showNewTableForm)}
                className="flex items-center text-amber-700 hover:text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 transition-all duration-300"
              >
                {showNewTableForm ? 'Cancel' : (
                  <>
                    <RiAddLine className="mr-1" />
                    Add Table
                  </>
                )}
              </button>
            </div>
            
            {/* Table list */}
            {formData.tables.length > 0 ? (
              <div className="mb-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-stone-200">
                    <thead className="bg-stone-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                          Table #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                          Capacity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                          Air Conditioning
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-stone-200">
                      {formData.tables.map((table, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-stone-900">
                              {table.tableNumber}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-stone-700">
                              {table.capacity} {table.capacity === 1 ? 'person' : 'people'}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              table.type === 'ROOFTOP' 
                                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}>
                              {table.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-stone-700">
                              {table.hasAC ? 'Yes' : 'No'}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => handleRemoveTable(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 mb-6 border-2 border-dashed border-stone-200 rounded-lg">
                <RiRestaurantLine className="mx-auto h-12 w-12 text-stone-300" />
                <h3 className="mt-2 text-lg font-medium text-stone-900">No tables added</h3>
                <p className="mt-1 text-sm text-stone-500">
                  Add tables to allow customers to book specific table types
                </p>
              </div>
            )}
            
            {/* Add new table form */}
            {showNewTableForm && (
              <div className="border border-stone-200 p-5 rounded-lg bg-stone-50 mb-6">
                <h3 className="font-medium mb-4 text-amber-900">Add New Table</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="tableNumber" className="block text-sm font-medium text-stone-700 mb-1">
                      Table Number*
                    </label>
                    <input
                      type="number"
                      id="tableNumber"
                      name="tableNumber"
                      value={newTable.tableNumber}
                      onChange={handleNewTableChange}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-stone-700 mb-1">
                      Capacity*
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={newTable.capacity}
                      onChange={handleNewTableChange}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-stone-700 mb-1">
                      Table Type*
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={newTable.type}
                      onChange={handleNewTableChange}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    >
                      <option value="INDOOR">Indoor</option>
                      <option value="ROOFTOP">Rooftop</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center pt-7">
                    <input
                      type="checkbox"
                      id="newTableHasAC"
                      name="hasAC"
                      checked={newTable.hasAC}
                      onChange={handleNewTableChange}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
                    />
                    <label htmlFor="newTableHasAC" className="ml-2 text-sm text-stone-700">
                      Has Air Conditioning
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewTableForm(false)}
                    className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-100 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddTable}
                    className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all duration-300 shadow-sm"
                  >
                    Add Table
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-stone-100">
            <div className="mb-6 flex items-center pb-2 border-b border-stone-100">
              <RiImageAddLine className="text-amber-600 mr-2" size={20} />
              <h2 className="text-lg font-serif text-amber-900">Restaurant Images</h2>
            </div>
            
            {/* Image upload section (coming soon) */}
            <div className="border-2 border-dashed border-stone-200 rounded-lg p-8 flex flex-col items-center justify-center text-stone-500 mb-6">
              <RiImageAddLine className="text-5xl mb-3 text-amber-300" />
              <p className="mb-2 font-medium text-amber-900">Image upload functionality coming soon</p>
              <p className="text-sm text-center text-stone-600">
                You'll be able to upload multiple images of your restaurant,
                including the interior, exterior, and food photos
              </p>
            </div>
            
            {/* Placeholder for current images */}
            {restaurant?.images && restaurant.images.length > 0 ? (
              <div>
                <h3 className="font-medium mb-3 text-amber-900">Current Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {restaurant.images.map((image, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden h-40 bg-stone-100 border border-stone-200">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-stone-500">Image {index + 1}</span>
                      </div>
                      {image.isMain && (
                        <div className="absolute top-2 right-2 bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-stone-500">
                No images uploaded yet
              </div>
            )}
          </div>
        )}
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all duration-300 disabled:bg-amber-300 shadow-sm font-medium"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}