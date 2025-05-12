
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";
// import { useAuth } from '@/contexts/authContext';
// import { RiInformationLine } from 'react-icons/ri';

// export default function BookingForm({ restaurantId, tables, menuItems }) {
//   const { isAuthenticated, userId } = useAuth();
//   const router = useRouter();
  
//   const [formData, setFormData] = useState({
//     date: new Date(new Date().setHours(0, 0, 0, 0) + 86400000), // Tomorrow
//     time: '19:00',
//     people: 2,
//     tableId: '',
//     specialRequests: '',
//     orderItems: []
//   });
  
//   const [filteredTables, setFilteredTables] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [showFoodPreOrder, setShowFoodPreOrder] = useState(false);
  
//   // Group menu items by category
//   const menuByCategory = menuItems?.reduce((acc, item) => {
//     if (!acc[item.category]) {
//       acc[item.category] = [];
//     }
//     acc[item.category].push(item);
//     return acc;
//   }, {}) || {};
  
//   // Filter tables based on people count
//   useEffect(() => {
//     if (tables) {
//       setFilteredTables(
//         tables.filter(table => 
//           table.capacity >= formData.people && 
//           table.isAvailable
//         )
//       );
//     }
//   }, [tables, formData.people]);
  
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };
  
//   const handleDateChange = (date) => {
//     setFormData(prev => ({ ...prev, date }));
//   };
  
//   const handleFoodItemChange = (menuItemId, quantity) => {
//     const parsedQuantity = parseInt(quantity);
    
//     setFormData(prev => {
//       // If quantity is 0, remove the item
//       if (parsedQuantity === 0) {
//         return {
//           ...prev,
//           orderItems: prev.orderItems.filter(item => item.menuItemId !== menuItemId)
//         };
//       }
      
//       // Check if item already exists in order
//       const existingItemIndex = prev.orderItems.findIndex(
//         item => item.menuItemId === menuItemId
//       );
      
//       if (existingItemIndex >= 0) {
//         // Update existing item
//         const updatedItems = [...prev.orderItems];
//         updatedItems[existingItemIndex] = {
//           ...updatedItems[existingItemIndex],
//           quantity: parsedQuantity
//         };
//         return { ...prev, orderItems: updatedItems };
//       } else {
//         // Add new item
//         return {
//           ...prev,
//           orderItems: [
//             ...prev.orderItems,
//             { menuItemId, quantity: parsedQuantity }
//           ]
//         };
//       }
//     });
//   };
  
//   const getTotalOrderAmount = () => {
//     return formData.orderItems.reduce((total, orderItem) => {
//       const menuItem = menuItems.find(item => item.id === orderItem.menuItemId);
//       return total + (menuItem?.price || 0) * orderItem.quantity;
//     }, 0);
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!isAuthenticated) {
//       router.push('/auth/login');
//       return;
//     }
    
//     if (!formData.tableId) {
//       setError('Please select a table type');
//       return;
//     }
    
//     setIsSubmitting(true);
//     setError('');
    
//     try {
//       // Create booking
//       const bookingData = {
//         userId,
//         restaurantId,
//         tableId: formData.tableId,
//         date: formData.date.toISOString(),
//         time: formData.time,
//         people: parseInt(formData.people),
//         specialRequests: formData.specialRequests,
//         orderItems: formData.orderItems.length > 0 ? formData.orderItems : undefined
//       };
      
//       const response = await fetch('/api/bookings', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(bookingData),
//       });
      
//       const data = await response.json();
      
//       if (data.success) {
//         router.push(`/my-account/bookings?new=${data.booking.id}`);
//       } else {
//         setError(data.error || 'Failed to create booking. Please try again.');
//       }
//     } catch (err) {
//       setError('An unexpected error occurred. Please try again.');
//       console.error('Booking error:', err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <h2 className="text-xl font-semibold mb-4">Book a Table</h2>
      
//       {error && (
//         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
//           {error}
//         </div>
//       )}
      
//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           {/* Date Picker */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">
//               Date
//             </label>
//             <DatePicker
//               selected={formData.date}
//               onChange={handleDateChange}
//               minDate={new Date()}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
          
//           {/* Time Picker */}
//           <div>
//             <label htmlFor="time" className="block text-gray-700 font-medium mb-1">
//               Time
//             </label>
//             <select
//               id="time"
//               name="time"
//               value={formData.time}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="11:00">11:00 AM</option>
//               <option value="12:00">12:00 PM</option>
//               <option value="13:00">1:00 PM</option>
//               <option value="14:00">2:00 PM</option>
//               <option value="15:00">3:00 PM</option>
//               <option value="18:00">6:00 PM</option>
//               <option value="19:00">7:00 PM</option>
//               <option value="20:00">8:00 PM</option>
//               <option value="21:00">9:00 PM</option>
//             </select>
//           </div>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           {/* Number of People */}
//           <div>
//             <label htmlFor="people" className="block text-gray-700 font-medium mb-1">
//               Number of People
//             </label>
//             <select
//               id="people"
//               name="people"
//               value={formData.people}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
//                 <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
//               ))}
//             </select>
//           </div>
          
//           {/* Table Type */}
//           <div>
//             <label htmlFor="tableId" className="block text-gray-700 font-medium mb-1">
//               Table Type
//             </label>
//             <select
//               id="tableId"
//               name="tableId"
//               value={formData.tableId}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             >
//               <option value="">Select a table type</option>
//               {filteredTables.map(table => (
//                 <option key={table.id} value={table.id}>
//                   {table.type} {table.hasAC ? '(AC)' : '(Non-AC)'} - {table.capacity} People
//                 </option>
//               ))}
//             </select>
            
//             {filteredTables.length === 0 && (
//               <p className="mt-1 text-sm text-red-500 flex items-center">
//                 <RiInformationLine className="mr-1" />
//                 No tables available for {formData.people} people
//               </p>
//             )}
//           </div>
//         </div>
        
//         {/* Special Requests */}
//         <div className="mb-4">
//           <label htmlFor="specialRequests" className="block text-gray-700 font-medium mb-1">
//             Special Requests (optional)
//           </label>
//           <textarea
//             id="specialRequests"
//             name="specialRequests"
//             value={formData.specialRequests}
//             onChange={handleChange}
//             rows="3"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Any special requests or dietary requirements?"
//           ></textarea>
//         </div>
        
//         {/* Pre-order Food Option */}
//         {menuItems && menuItems.length > 0 && (
//           <div className="mb-4">
//             <button
//               type="button"
//               className="text-blue-600 font-medium flex items-center"
//               onClick={() => setShowFoodPreOrder(!showFoodPreOrder)}
//             >
//               {showFoodPreOrder ? '- Hide Pre-order Food' : '+ Pre-order Food (Optional)'}
//             </button>
            
//             {showFoodPreOrder && (
//               <div className="mt-4 border-t pt-4">
//                 <h3 className="text-lg font-medium mb-3">Menu</h3>
                
//                 {Object.entries(menuByCategory).map(([category, items]) => (
//                   <div key={category} className="mb-6">
//                     <h4 className="text-md font-medium mb-2 border-b pb-1">
//                       {category}
//                     </h4>
                    
//                     <div className="space-y-3">
//                       {items.map(item => {
//                         const orderItem = formData.orderItems.find(
//                           oi => oi.menuItemId === item.id
//                         );
//                         const quantity = orderItem?.quantity || 0;
                        
//                         return (
//                           <div key={item.id} className="flex justify-between items-center">
//                             <div>
//                               <p className="font-medium">{item.name}</p>
//                               <p className="text-sm text-gray-600">{item.description}</p>
//                               <p className="text-blue-600">${item.price.toFixed(2)}</p>
//                             </div>
                            
//                             <select
//                               value={quantity}
//                               onChange={(e) => handleFoodItemChange(item.id, e.target.value)}
//                               className="border rounded-md p-1"
//                             >
//                               {[0, 1, 2, 3, 4, 5].map(num => (
//                                 <option key={num} value={num}>
//                                   {num}
//                                 </option>
//                               ))}
//                             </select>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 ))}
                
//                 {formData.orderItems.length > 0 && (
//                   <div className="mt-4 flex justify-between font-medium">
//                     <span>Total Pre-order Amount:</span>
//                     <span>${getTotalOrderAmount().toFixed(2)}</span>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
        
//         <button
//           type="submit"
//           disabled={isSubmitting || filteredTables.length === 0}
//           className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
//         >
//           {isSubmitting ? 'Processing...' : 'Book Now'}
//         </button>
        
//         {!isAuthenticated && (
//           <p className="mt-2 text-sm text-gray-600">
//             You'll need to login to complete your booking.
//           </p>
//         )}
//       </form>
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from '@/contexts/authContext';
import { 
  RiInformationLine,
  RiCalendarEventLine,
  RiTimeLine,
  RiUser3Line,
  RiRestaurantLine,
  RiAddLine,
  RiSubtractLine,
  RiCloseLine,
  RiCheckboxCircleLine,
  RiArrowRightSLine
} from 'react-icons/ri';

export default function BookingForm({ restaurantId, tables, menuItems }) {
  const { isAuthenticated, userId } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    date: new Date(new Date().setHours(0, 0, 0, 0) + 86400000), // Tomorrow
    time: '19:00',
    people: 2,
    tableId: '',
    specialRequests: '',
    orderItems: []
  });
  
  const [filteredTables, setFilteredTables] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showFoodPreOrder, setShowFoodPreOrder] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  
  // Group menu items by category
  const menuByCategory = menuItems?.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {}) || {};
  
  // Set first category as active by default when menu loads
  useEffect(() => {
    if (Object.keys(menuByCategory).length > 0 && !activeCategory) {
      setActiveCategory(Object.keys(menuByCategory)[0]);
    }
  }, [menuByCategory, activeCategory]);
  
  // Filter tables based on people count
  useEffect(() => {
    if (tables) {
      setFilteredTables(
        tables.filter(table => 
          table.capacity >= formData.people && 
          table.isAvailable
        )
      );
    }
  }, [tables, formData.people]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
  };
  
  const handleFoodItemChange = (menuItemId, changeAmount) => {
    setFormData(prev => {
      // Find current item if exists
      const existingItemIndex = prev.orderItems.findIndex(
        item => item.menuItemId === menuItemId
      );
      
      // Calculate new quantity
      let newQuantity = 0;
      if (existingItemIndex >= 0) {
        newQuantity = prev.orderItems[existingItemIndex].quantity + changeAmount;
      } else {
        newQuantity = changeAmount;
      }
      
      // If quantity is 0 or less, remove the item
      if (newQuantity <= 0) {
        return {
          ...prev,
          orderItems: prev.orderItems.filter(item => item.menuItemId !== menuItemId)
        };
      }
      
      // Limit to max of 10 items per dish
      newQuantity = Math.min(newQuantity, 10);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prev.orderItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity
        };
        return { ...prev, orderItems: updatedItems };
      } else {
        // Add new item
        return {
          ...prev,
          orderItems: [
            ...prev.orderItems,
            { menuItemId, quantity: newQuantity }
          ]
        };
      }
    });
    
    // Show order summary when items are added
    if (formData.orderItems.length === 0) {
      setShowOrderSummary(true);
    }
  };
  
  const getTotalOrderAmount = () => {
    return formData.orderItems.reduce((total, orderItem) => {
      const menuItem = menuItems.find(item => item.id === orderItem.menuItemId);
      return total + (menuItem?.price || 0) * orderItem.quantity;
    }, 0);
  };
  
  const getTotalItems = () => {
    return formData.orderItems.reduce((total, item) => total + item.quantity, 0);
  };
  
  const removeOrderItem = (menuItemId) => {
    setFormData(prev => ({
      ...prev,
      orderItems: prev.orderItems.filter(item => item.menuItemId !== menuItemId)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (!formData.tableId) {
      setError('Please select a table type');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Create booking
      const bookingData = {
        userId,
        restaurantId,
        tableId: formData.tableId,
        date: formData.date.toISOString(),
        time: formData.time,
        people: parseInt(formData.people),
        specialRequests: formData.specialRequests,
        orderItems: formData.orderItems.length > 0 ? formData.orderItems : undefined
      };
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        router.push(`/my-account/bookings?new=${data.booking.id}`);
      } else {
        setError(data.error || 'Failed to create booking. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-stone-100">
      <h2 className="text-xl font-serif text-amber-900 mb-4 flex items-center">
        <RiCalendarEventLine className="mr-2 text-amber-600" />
        Book a Table
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 flex items-start">
          <RiInformationLine className="text-red-500 mr-2 text-xl flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Date Picker */}
          <div>
            <label className="block text-stone-700 font-medium mb-1 flex items-center">
              <RiCalendarEventLine className="mr-1 text-amber-500" />
              Date
            </label>
            <DatePicker
              selected={formData.date}
              onChange={handleDateChange}
              minDate={new Date()}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          
          {/* Time Picker */}
          <div>
            <label htmlFor="time" className="block text-stone-700 font-medium mb-1 flex items-center">
              <RiTimeLine className="mr-1 text-amber-500" />
              Time
            </label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="18:00">6:00 PM</option>
              <option value="19:00">7:00 PM</option>
              <option value="20:00">8:00 PM</option>
              <option value="21:00">9:00 PM</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Number of People */}
          <div>
            <label htmlFor="people" className="block text-stone-700 font-medium mb-1 flex items-center">
              <RiUser3Line className="mr-1 text-amber-500" />
              Number of People
            </label>
            <select
              id="people"
              name="people"
              value={formData.people}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
              ))}
            </select>
          </div>
          
          {/* Table Type */}
          <div>
            <label htmlFor="tableId" className="block text-stone-700 font-medium mb-1 flex items-center">
              <RiRestaurantLine className="mr-1 text-amber-500" />
              Table Type
            </label>
            <select
              id="tableId"
              name="tableId"
              value={formData.tableId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                filteredTables.length === 0 ? 'border-red-300 bg-red-50' : 'border-stone-200'
              }`}
              required
            >
              <option value="">Select a table type</option>
              {filteredTables.map(table => (
                <option key={table.id} value={table.id}>
                  {table.type} {table.hasAC ? '(AC)' : '(Non-AC)'} - {table.capacity} People
                </option>
              ))}
            </select>
            
            {filteredTables.length === 0 && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <RiInformationLine className="mr-1" />
                No tables available for {formData.people} people
              </p>
            )}
          </div>
        </div>
        
        {/* Special Requests */}
        <div className="mb-4">
          <label htmlFor="specialRequests" className="block text-stone-700 font-medium mb-1">
            Special Requests (optional)
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Any special requests or dietary requirements?"
          ></textarea>
        </div>
        
        {/* Pre-order Food Option */}
        {menuItems && menuItems.length > 0 && (
          <div className="mb-4">
            <button
              type="button"
              className={`flex items-center py-2 px-4 rounded-lg mb-2 font-medium transition-all duration-300 ${
                showFoodPreOrder 
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              } border border-amber-200`}
              onClick={() => setShowFoodPreOrder(!showFoodPreOrder)}
            >
              <RiRestaurantLine className="mr-2" />
              {showFoodPreOrder ? 'Hide Food Pre-order' : 'Pre-order Food (Optional)'}
            </button>
            
            {/* Order summary mini-card that's always visible when items are selected */}
            {formData.orderItems.length > 0 && (
              <div 
                className={`mb-4 p-3 bg-amber-50 rounded-lg border border-amber-100 cursor-pointer transition-all duration-300 hover:bg-amber-100 ${
                  showFoodPreOrder ? 'hidden' : 'block'
                }`}
                onClick={() => setShowFoodPreOrder(true)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <RiRestaurantLine className="text-amber-600 mr-2" />
                    <span className="font-medium text-amber-900">
                      {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} selected
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-amber-900 mr-2">
                      £{getTotalOrderAmount().toFixed(2)}
                    </span>
                    <RiArrowRightSLine className="text-amber-600" />
                  </div>
                </div>
              </div>
            )}
            
            {showFoodPreOrder && (
              <div className="mt-2 border border-stone-200 rounded-lg overflow-hidden bg-white">
                {/* Category Tabs */}
                <div className="flex overflow-x-auto border-b border-stone-200 bg-stone-50 scrollbar-hide">
                  {Object.keys(menuByCategory).map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`px-4 py-2 whitespace-nowrap font-medium transition-colors duration-300 ${
                        activeCategory === category
                          ? 'border-b-2 border-amber-600 text-amber-900 bg-white'
                          : 'text-stone-600 hover:text-amber-700'
                      }`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                
                {/* Menu Items for Active Category */}
                <div className="p-4">
                  <div className="space-y-4">
                    {activeCategory && menuByCategory[activeCategory]?.map(item => {
                      const orderItem = formData.orderItems.find(
                        oi => oi.menuItemId === item.id
                      );
                      const quantity = orderItem?.quantity || 0;
                      
                      return (
                        <div 
                          key={item.id} 
                          className={`flex justify-between items-center p-3 rounded-lg transition-all duration-200 ${
                            quantity > 0 ? 'bg-amber-50 border border-amber-200' : 'hover:bg-stone-50 border border-transparent'
                          }`}
                        >
                          <div className="flex-grow">
                            <p className="font-medium text-stone-900">{item.name}</p>
                            {item.description && (
                              <p className="text-sm text-stone-600 line-clamp-2">{item.description}</p>
                            )}
                            <p className="text-amber-700 font-medium">£{item.price.toFixed(2)}</p>
                          </div>
                          
                          <div className="flex items-center">
                            {quantity > 0 ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleFoodItemChange(item.id, -1)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors duration-200"
                                >
                                  <RiSubtractLine />
                                </button>
                                <span className="w-5 text-center font-medium text-amber-900">{quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => handleFoodItemChange(item.id, 1)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors duration-200"
                                >
                                  <RiAddLine />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleFoodItemChange(item.id, 1)}
                                className="px-3 py-1 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors duration-200 flex items-center"
                              >
                                <RiAddLine className="mr-1" />
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Order Summary Section */}
                {formData.orderItems.length > 0 && (
                  <div className="border-t border-stone-200 p-4 bg-stone-50">
                    <div 
                      className="flex justify-between items-center cursor-pointer mb-2"
                      onClick={() => setShowOrderSummary(!showOrderSummary)}
                    >
                      <div className="font-medium text-amber-900 flex items-center">
                        <RiRestaurantLine className="mr-2" />
                        Order Summary ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-amber-900 mr-2">
                          £{getTotalOrderAmount().toFixed(2)}
                        </span>
                        {showOrderSummary ? (
                          <RiSubtractLine className="text-amber-600" />
                        ) : (
                          <RiAddLine className="text-amber-600" />
                        )}
                      </div>
                    </div>
                    
                    {showOrderSummary && (
                      <div className="space-y-2 mt-3 pt-3 border-t border-stone-200">
                        {formData.orderItems.map(orderItem => {
                          const menuItem = menuItems.find(item => item.id === orderItem.menuItemId);
                          if (!menuItem) return null;
                          
                          return (
                            <div key={orderItem.menuItemId} className="flex justify-between">
                              <div className="flex items-center">
                                <span className="font-medium text-stone-900">{orderItem.quantity}x</span>
                                <span className="ml-2 text-stone-700">{menuItem.name}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-stone-900 mr-2">
                                  £{(menuItem.price * orderItem.quantity).toFixed(2)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeOrderItem(orderItem.menuItemId)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <RiCloseLine />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting || filteredTables.length === 0}
          className="w-full bg-amber-700 text-white py-3 px-4 rounded-lg hover:bg-amber-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-amber-300 font-medium shadow-sm"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <RiCheckboxCircleLine className="mr-2" />
              Book Now {formData.orderItems.length > 0 && `• £${getTotalOrderAmount().toFixed(2)}`}
            </span>
          )}
        </button>
        
        {!isAuthenticated && (
          <p className="mt-2 text-sm text-stone-600 text-center">
            You'll need to login to complete your booking.
          </p>
        )}
      </form>
    </div>
  );
}