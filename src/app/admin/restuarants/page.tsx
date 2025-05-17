// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/contexts/authContext';
// import { 
//   RiStore2Line, 
//   RiSearchLine, 
//   RiFilterLine,
//   RiMapPinLine,
//   RiUserLine,
//   RiStarFill,
//   RiCloseLine,
//   RiPhoneLine,
//   RiMailLine,
//   RiFolderLine,
//   RiTableLine
// } from 'react-icons/ri';

// export default function AdminRestaurants() {
//   const { userId } = useAuth();
//   const [restaurants, setRestaurants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [pagination, setPagination] = useState({
//     total: 0,
//     page: 1,
//     limit: 10,
//     pages: 1
//   });
  
//   const [filters, setFilters] = useState({
//     search: '',
//     city: '',
//     status: '',
//     page: 1
//   });
  
//   // New state for the popup
//   const [selectedRestaurant, setSelectedRestaurant] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
  
//   const cityOptions = [
//     'New York', 'Los Angeles', 'Chicago', 'Houston', 
//     'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego',
//     'Dallas', 'Austin', 'San Francisco', 'Seattle',
//     'Denver', 'Boston', 'Atlanta', 'Miami'
//   ];

//   useEffect(() => {
//     const fetchRestaurants = async () => {
//       try {
//         // Build query parameters
//         const params = new URLSearchParams();
        
//         if (filters.search) params.append('search', filters.search);
//         if (filters.city) params.append('city', filters.city);
//         if (filters.status) params.append('status', filters.status);
        
//         params.append('page', filters.page);
//         params.append('limit', pagination.limit);
        
//         // Fixed typo in URL - from "restuarants" to "restaurants"
//         const res = await fetch(`/api/admin/restuarants?${params.toString()}`);
//         const data = await res.json();
        
//         if (data.success) {
//           setRestaurants(data.restaurants);
//           setPagination(data.pagination);
//         }
//       } catch (error) {
//         console.error('Error fetching restaurants:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId) {
//       fetchRestaurants();
//     }
//   }, [userId, filters, pagination.limit]);

//   // New function to fetch restaurant details
//   const fetchRestaurantDetails = async (restaurantId) => {
//     setModalLoading(true);
//     try {
//       // Fixed typo in URL from "restuarants" to "restaurants"
//       const res = await fetch(`/api/admin/restuarants/${restaurantId}`);
//       const data = await res.json();
      
//       if (data.success) {
//         setSelectedRestaurant(data.restaurant);
//         setShowModal(true);
//       }
//     } catch (error) {
//       console.error('Error fetching restaurant details:', error);
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value,
//       page: 1 // Reset to first page when filter changes
//     }));
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     // Search is already applied through the useEffect
//   };

//   const clearFilters = () => {
//     setFilters({
//       search: '',
//       city: '',
//       status: '',
//       page: 1
//     });
//   };

//   const updateRestaurantStatus = async (restaurantId, isOpen) => {
//     try {
//       // Fixed typo in URL from "restuarants" to "restaurants"
//       const res = await fetch(`/api/admin/restuarants/${restaurantId}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ isOpen: !isOpen })
//       });
      
//       const data = await res.json();
      
//       if (data.success) {
//         // Update restaurant in state
//         setRestaurants(prevRestaurants => 
//           prevRestaurants.map(restaurant => 
//             restaurant.id === restaurantId 
//               ? { ...restaurant, isOpen: !isOpen } 
//               : restaurant
//           )
//         );
        
//         // If the modal is open and showing this restaurant, update it there too
//         if (selectedRestaurant && selectedRestaurant.id === restaurantId) {
//           setSelectedRestaurant(prev => ({
//             ...prev,
//             isOpen: !isOpen
//           }));
//         }
//       }
//     } catch (error) {
//       console.error('Error updating restaurant status:', error);
//     }
//   };

//   const changePage = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.pages) {
//       setFilters(prev => ({
//         ...prev,
//         page: newPage
//       }));
//     }
//   };

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString('en-US', options);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedRestaurant(null);
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Restaurants</h1>
//       </div>
      
//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow-md p-4 mb-6">
//         <div className="flex items-center mb-4">
//           <RiFilterLine className="text-gray-500 mr-2" />
//           <h2 className="text-lg font-semibold">Filters</h2>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//           {/* Search */}
//           <div>
//             <form onSubmit={handleSearch}>
//               <div className="relative">
//                 <input
//                   type="text"
//                   name="search"
//                   value={filters.search}
//                   onChange={handleFilterChange}
//                   placeholder="Search restaurants..."
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               </div>
//             </form>
//           </div>
          
//           {/* City Filter */}
//           <div>
//             <select
//               name="city"
//               value={filters.city}
//               onChange={handleFilterChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Cities</option>
//               {cityOptions.map(city => (
//                 <option key={city} value={city}>{city}</option>
//               ))}
//             </select>
//           </div>
          
//           {/* Status Filter */}
//           <div>
//             <select
//               name="status"
//               value={filters.status}
//               onChange={handleFilterChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Statuses</option>
//               <option value="open">Open</option>
//               <option value="closed">Closed</option>
//             </select>
//           </div>
//         </div>
        
//         {/* Filter actions */}
//         <div className="flex justify-end">
//           <button
//             onClick={clearFilters}
//             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Clear Filters
//           </button>
//         </div>
//       </div>
      
//       {/* Restaurant Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : restaurants.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Restaurant
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Owner
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Location
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Cuisine
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Rating
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {restaurants.map((restaurant) => (
//                   <tr key={restaurant.id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
//                           <RiStore2Line className="h-6 w-6 text-gray-500" />
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">
//                             {restaurant.name}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             Added {formatDate(restaurant.createdAt)}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <RiUserLine className="text-gray-400 mr-2" />
//                         <div className="text-sm text-gray-900">
//                           {restaurant.vendor?.user?.name}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <RiMapPinLine className="text-gray-400 mr-2" />
//                         <div className="text-sm text-gray-900">
//                           {restaurant.city}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex flex-wrap gap-1">
//                         {restaurant.cuisine?.slice(0, 2).map((cuisine, index) => (
//                           <span 
//                             key={index}
//                             className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
//                           >
//                             {cuisine}
//                           </span>
//                         ))}
//                         {restaurant.cuisine?.length > 2 && (
//                           <span className="text-xs text-gray-500">
//                             +{restaurant.cuisine.length - 2} more
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {restaurant.rating ? (
//                         <div className="flex items-center">
//                           <RiStarFill className="text-yellow-500 mr-1" />
//                           <span className="text-sm">{restaurant.rating.toFixed(1)}</span>
//                         </div>
//                       ) : (
//                         <span className="text-xs text-gray-500">No ratings</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                       }`}>
//                         {restaurant.isOpen ? 'Open' : 'Closed'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex space-x-3">
//                         {/* Changed from Link to button */}
//                         <button
//                           onClick={() => fetchRestaurantDetails(restaurant.id)}
//                           className="text-blue-600 hover:text-blue-900"
//                         >
//                           View
//                         </button>
//                         <button
//                           onClick={() => updateRestaurantStatus(restaurant.id, restaurant.isOpen)}
//                           className={restaurant.isOpen ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
//                         >
//                           {restaurant.isOpen ? 'Close' : 'Open'}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center py-12">
//             <RiStore2Line className="text-5xl text-gray-300 mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
//             <p className="text-gray-500">Try adjusting your search filters</p>
//           </div>
//         )}
//       </div>
      
//       {/* Pagination */}
//       {!loading && restaurants.length > 0 && pagination.pages > 1 && (
//         <div className="mt-6 flex justify-center">
//           <nav className="flex items-center space-x-2">
//             <button
//               onClick={() => changePage(filters.page - 1)}
//               disabled={filters.page === 1}
//               className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Previous
//             </button>
            
//             {[...Array(pagination.pages)].map((_, index) => {
//               const pageNumber = index + 1;
              
//               // Show limited pagination buttons for better UX
//               if (
//                 pageNumber === 1 ||
//                 pageNumber === pagination.pages ||
//                 (pageNumber >= filters.page - 1 && pageNumber <= filters.page + 1)
//               ) {
//                 return (
//                   <button
//                     key={pageNumber}
//                     onClick={() => changePage(pageNumber)}
//                     className={`px-3 py-1 rounded-md ${
//                       pageNumber === filters.page
//                         ? 'bg-blue-600 text-white'
//                         : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
//                     }`}
//                   >
//                     {pageNumber}
//                   </button>
//                 );
//               }
              
//               // Show ellipsis for skipped pages
//               if (
//                 (pageNumber === 2 && filters.page > 3) ||
//                 (pageNumber === pagination.pages - 1 && filters.page < pagination.pages - 2)
//               ) {
//                 return <span key={pageNumber} className="px-2">...</span>;
//               }
              
//               return null;
//             })}
            
//             <button
//               onClick={() => changePage(filters.page + 1)}
//               disabled={filters.page === pagination.pages}
//               className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//             </button>
//           </nav>
//         </div>
//       )}
      
//       {/* Restaurant Details Modal */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
//             {modalLoading ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
//               </div>
//             ) : selectedRestaurant ? (
//               <div>
//                 {/* Modal Header */}
//                 <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//                   <h2 className="text-xl font-bold">{selectedRestaurant.name}</h2>
//                   <button
//                     onClick={closeModal}
//                     className="text-gray-500 hover:text-gray-700 focus:outline-none"
//                   >
//                     <RiCloseLine className="h-6 w-6" />
//                   </button>
//                 </div>
                
//                 {/* Modal Body */}
//                 <div className="px-6 py-4">
//                   {/* Restaurant Status */}
//                   <div className="mb-6 flex justify-between items-center">
//                     <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
//                       selectedRestaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                     }`}>
//                       {selectedRestaurant.isOpen ? 'Open' : 'Closed'}
//                     </span>
                    
//                     <button
//                       onClick={() => updateRestaurantStatus(selectedRestaurant.id, selectedRestaurant.isOpen)}
//                       className={`px-3 py-1 rounded-md text-sm ${
//                         selectedRestaurant.isOpen 
//                           ? 'bg-red-100 text-red-800 hover:bg-red-200' 
//                           : 'bg-green-100 text-green-800 hover:bg-green-200'
//                       }`}
//                     >
//                       {selectedRestaurant.isOpen ? 'Close Restaurant' : 'Open Restaurant'}
//                     </button>
//                   </div>
                  
//                   {/* Basic Info */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                     <div>
//                       <h3 className="text-md font-semibold mb-3">Details</h3>
//                       <div className="space-y-2">
//                         <div className="flex items-start">
//                           <RiMapPinLine className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
//                           <div>
//                             <p className="text-sm text-gray-800">{selectedRestaurant.address}</p>
//                             <p className="text-sm text-gray-800">{selectedRestaurant.city}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center">
//                           <RiStore2Line className="text-gray-400 mr-2" />
//                           <p className="text-sm text-gray-800">
//                             Hours: {selectedRestaurant.openingHours} - {selectedRestaurant.closingHours}
//                           </p>
//                         </div>
//                         <div className="flex items-center">
//                           <RiStarFill className="text-yellow-500 mr-2" />
//                           <p className="text-sm text-gray-800">
//                             {selectedRestaurant.rating ? 
//                               `${selectedRestaurant.rating.toFixed(1)} / 5.0` : 
//                               'No ratings'}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <h3 className="text-md font-semibold mb-3">Owner Information</h3>
//                       <div className="space-y-2">
//                         <div className="flex items-center">
//                           <RiUserLine className="text-gray-400 mr-2" />
//                           <p className="text-sm text-gray-800">
//                             {selectedRestaurant.vendor?.user?.name}
//                           </p>
//                         </div>
//                         <div className="flex items-center">
//                           <RiMailLine className="text-gray-400 mr-2" />
//                           <p className="text-sm text-gray-800">
//                             {selectedRestaurant.vendor?.user?.email}
//                           </p>
//                         </div>
//                         {selectedRestaurant.vendor?.user?.phone && (
//                           <div className="flex items-center">
//                             <RiPhoneLine className="text-gray-400 mr-2" />
//                             <p className="text-sm text-gray-800">
//                               {selectedRestaurant.vendor?.user?.phone}
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Description */}
//                   {selectedRestaurant.description && (
//                     <div className="mb-6">
//                       <h3 className="text-md font-semibold mb-2">Description</h3>
//                       <p className="text-sm text-gray-800">{selectedRestaurant.description}</p>
//                     </div>
//                   )}
                  
//                   {/* Amenities */}
//                   <div className="mb-6">
//                     <h3 className="text-md font-semibold mb-2">Amenities</h3>
//                     <div className="flex flex-wrap gap-2">
//                       {selectedRestaurant.hasAC && (
//                         <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
//                           Air Conditioning
//                         </span>
//                       )}
//                       {selectedRestaurant.hasWifi && (
//                         <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
//                           Free Wi-Fi
//                         </span>
//                       )}
//                       {selectedRestaurant.hasParking && (
//                         <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
//                           Parking Available
//                         </span>
//                       )}
//                       {selectedRestaurant.hasRooftop && (
//                         <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
//                           Rooftop Seating
//                         </span>
//                       )}
//                     </div>
//                   </div>
                  
//                   {/* Cuisine */}
//                   <div className="mb-6">
//                     <h3 className="text-md font-semibold mb-2">Cuisine</h3>
//                     <div className="flex flex-wrap gap-2">
//                       {selectedRestaurant.cuisine?.map((type, index) => (
//                         <span 
//                           key={index}
//                           className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
//                         >
//                           {type}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
                  
//                   {/* Tabs for Menu and Tables */}
//                   <div className="mt-6">
//                     <div className="border-b border-gray-200">
//                       <nav className="-mb-px flex space-x-8" aria-label="Tabs">
//                         <button
//                           className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
//                         >
//                           <div className="flex items-center">
//                             <RiFolderLine className="mr-2" />
//                             Menu Items ({selectedRestaurant.menuItems?.length || 0})
//                           </div>
//                         </button>
//                         <button 
//                           className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
//                         >
//                           <div className="flex items-center">
//                             <RiTableLine className="mr-2" />
//                             Tables ({selectedRestaurant.tables?.length || 0})
//                           </div>
//                         </button>
//                       </nav>
//                     </div>
                    
//                     {/* Menu Items List */}
//                     <div className="mt-4">
//                       {selectedRestaurant.menuItems?.length > 0 ? (
//                         <div className="overflow-x-auto">
//                           <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                               <tr>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                   Item
//                                 </th>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                   Category
//                                 </th>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                   Price
//                                 </th>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                   Status
//                                 </th>
//                               </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                               {selectedRestaurant.menuItems.map((item) => (
//                                 <tr key={item.id}>
//                                   <td className="px-4 py-2 whitespace-nowrap">
//                                     <div className="text-sm font-medium text-gray-900">{item.name}</div>
//                                     {item.description && (
//                                       <div className="text-xs text-gray-500">{item.description}</div>
//                                     )}
//                                   </td>
//                                   <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
//                                     {item.category}
//                                   </td>
//                                   <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
//                                     ${item.price.toFixed(2)}
//                                   </td>
//                                   <td className="px-4 py-2 whitespace-nowrap">
//                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                                       item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                                     }`}>
//                                       {item.isAvailable ? 'Available' : 'Unavailable'}
//                                     </span>
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       ) : (
//                         <div className="text-center py-4 text-gray-500">
//                           No menu items available
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-12">
//                 <p className="text-gray-500">Restaurant not found</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import { 
  RiStore2Line, 
  RiSearchLine, 
  RiFilterLine,
  RiMapPinLine,
  RiUserLine,
  RiStarFill,
  RiCloseLine,
  RiPhoneLine,
  RiMailLine,
  RiFolderLine,
  RiTableLine
} from 'react-icons/ri';

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });
  
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    status: '',
    page: 1
  });
  
  // New state for the popup
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  
  const cityOptions = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 
    'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego',
    'Dallas', 'Austin', 'San Francisco', 'Seattle',
    'Denver', 'Boston', 'Atlanta', 'Miami'
  ];

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // Build query parameters
        const params = new URLSearchParams();
        
        if (filters.search) params.append('search', filters.search);
        if (filters.city) params.append('city', filters.city);
        if (filters.status) params.append('status', filters.status);
        
        params.append('page', String(filters.page));
        params.append('limit', String(pagination.limit));
        
        const res = await fetch(`/api/admin/restaurants?${params.toString()}`);
        const data = await res.json();
        
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
  }, [filters, pagination.limit]);
  // useEffect(() => {
  //   const fetchRestaurants = async () => {
  //     try {
  //       // Build query parameters
  //       const params = new URLSearchParams();
        
  //       if (filters.search) params.append('search', filters.search);
  //       if (filters.city) params.append('city', filters.city);
  //       if (filters.status) params.append('status', filters.status);
        
  //       params.append('page', filters.page);
  //       params.append('limit', pagination.limit);
        
  //       // Fixed typo in URL - from "restuarants" to "restaurants"
  //       const res = await fetch(`/api/admin/restaurants?${params.toString()}`);
  //       const data = await res.json();
        
  //       if (data.success) {
  //         setRestaurants(data.restaurants);
  //         setPagination(data.pagination);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching restaurants:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchRestaurants();
  // }, [filters, pagination.limit]);

  // New function to fetch restaurant details
  const fetchRestaurantDetails = async (restaurantId:any) => {
    setModalLoading(true);
    try {
      // Fixed typo in URL from "restuarants" to "restaurants"
      const res = await fetch(`/api/admin/restaurants/${restaurantId}`);
      const data = await res.json();
      
      if (data.success) {
        setSelectedRestaurant(data.restaurant);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleFilterChange = (e:any) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filter changes
    }));
  };

  const handleSearch = (e:any) => {
    e.preventDefault();
    // Search is already applied through the useEffect
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      city: '',
      status: '',
      page: 1
    });
  };

  const updateRestaurantStatus = async (restaurantId:any, isOpen:any) => {
    try {
      // Fixed typo in URL from "restuarants" to "restaurants"
      const res = await fetch(`/api/admin/restaurants/${restaurantId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isOpen: !isOpen })
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Update restaurant in state
        setRestaurants(prevRestaurants => 
          prevRestaurants.map(restaurant => 
            restaurant.id === restaurantId 
              ? { ...restaurant, isOpen: !isOpen } 
              : restaurant
          )
        );
        
        // If the modal is open and showing this restaurant, update it there too
        if (selectedRestaurant && selectedRestaurant.id === restaurantId) {
          setSelectedRestaurant(prev => ({
            ...prev,
            isOpen: !isOpen
          }));
        }
      }
    } catch (error) {
      console.error('Error updating restaurant status:', error);
    }
  };

  const changePage = (newPage:any) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setFilters(prev => ({
        ...prev,
        page: newPage
      }));
    }
  };

  const formatDate = (dateString: any) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRestaurant(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Restaurants</h1>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center mb-4">
          <RiFilterLine className="text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Search */}
          <div>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search restaurants..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </form>
          </div>
          
          {/* City Filter */}
          <div>
            <select
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Cities</option>
              {cityOptions.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          
          {/* Status Filter */}
          <div>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
        
        {/* Filter actions */}
        <div className="flex justify-end">
          <button
            onClick={clearFilters}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      {/* Restaurant Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : restaurants.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Restaurant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cuisine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <RiStore2Line className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {restaurant.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Added {formatDate(restaurant.createdAt)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <RiUserLine className="text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {restaurant.vendor?.user?.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <RiMapPinLine className="text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {restaurant.city}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {restaurant.cuisine?.slice(0, 2).map((cuisine, index) => (
                          <span 
                            key={index}
                            className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                          >
                            {cuisine}
                          </span>
                        ))}
                        {restaurant.cuisine?.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{restaurant.cuisine.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {restaurant.rating ? (
                        <div className="flex items-center">
                          <RiStarFill className="text-yellow-500 mr-1" />
                          <span className="text-sm">{restaurant.rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">No ratings</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {restaurant.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        {/* Changed from Link to button */}
                        <button
                          onClick={() => fetchRestaurantDetails(restaurant.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => updateRestaurantStatus(restaurant.id, restaurant.isOpen)}
                          className={restaurant.isOpen ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                        >
                          {restaurant.isOpen ? 'Close' : 'Open'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <RiStore2Line className="text-5xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {!loading && restaurants.length > 0 && pagination.pages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => changePage(filters.page - 1)}
              disabled={filters.page === 1}
              className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(pagination.pages)].map((_, index) => {
              const pageNumber = index + 1;
              
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
                    className={`px-3 py-1 rounded-md ${
                      pageNumber === filters.page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
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
                return <span key={pageNumber} className="px-2">...</span>;
              }
              
              return null;
            })}
            
            <button
              onClick={() => changePage(filters.page + 1)}
              disabled={filters.page === pagination.pages}
              className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
      
      {/* Restaurant Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            {modalLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : selectedRestaurant ? (
              <div>
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold">{selectedRestaurant.name}</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <RiCloseLine className="h-6 w-6" />
                  </button>
                </div>
                
                {/* Modal Body */}
                <div className="px-6 py-4">
                  {/* Restaurant Status */}
                  <div className="mb-6 flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedRestaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedRestaurant.isOpen ? 'Open' : 'Closed'}
                    </span>
                    
                    <button
                      onClick={() => updateRestaurantStatus(selectedRestaurant.id, selectedRestaurant.isOpen)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedRestaurant.isOpen 
                          ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {selectedRestaurant.isOpen ? 'Close Restaurant' : 'Open Restaurant'}
                    </button>
                  </div>
                  
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-md font-semibold mb-3">Details</h3>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <RiMapPinLine className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-800">{selectedRestaurant.address}</p>
                            <p className="text-sm text-gray-800">{selectedRestaurant.city}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <RiStore2Line className="text-gray-400 mr-2" />
                          <p className="text-sm text-gray-800">
                            Hours: {selectedRestaurant.openingHours} - {selectedRestaurant.closingHours}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <RiStarFill className="text-yellow-500 mr-2" />
                          <p className="text-sm text-gray-800">
                            {selectedRestaurant.rating ? 
                              `${selectedRestaurant.rating.toFixed(1)} / 5.0` : 
                              'No ratings'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-semibold mb-3">Owner Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <RiUserLine className="text-gray-400 mr-2" />
                          <p className="text-sm text-gray-800">
                            {selectedRestaurant.vendor?.user?.name}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <RiMailLine className="text-gray-400 mr-2" />
                          <p className="text-sm text-gray-800">
                            {selectedRestaurant.vendor?.user?.email}
                          </p>
                        </div>
                        {selectedRestaurant.vendor?.user?.phone && (
                          <div className="flex items-center">
                            <RiPhoneLine className="text-gray-400 mr-2" />
                            <p className="text-sm text-gray-800">
                              {selectedRestaurant.vendor?.user?.phone}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  {selectedRestaurant.description && (
                    <div className="mb-6">
                      <h3 className="text-md font-semibold mb-2">Description</h3>
                      <p className="text-sm text-gray-800">{selectedRestaurant.description}</p>
                    </div>
                  )}
                  
                  {/* Amenities */}
                  <div className="mb-6">
                    <h3 className="text-md font-semibold mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRestaurant.hasAC && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Air Conditioning
                        </span>
                      )}
                      {selectedRestaurant.hasWifi && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Free Wi-Fi
                        </span>
                      )}
                      {selectedRestaurant.hasParking && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Parking Available
                        </span>
                      )}
                      {selectedRestaurant.hasRooftop && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Rooftop Seating
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Cuisine */}
                  <div className="mb-6">
                    <h3 className="text-md font-semibold mb-2">Cuisine</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRestaurant.cuisine?.map((type, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tabs for Menu and Tables */}
                  <div className="mt-6">
                    <div className="border-b border-gray-200">
                      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                          className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                        >
                          <div className="flex items-center">
                            <RiFolderLine className="mr-2" />
                            Menu Items ({selectedRestaurant.menuItems?.length || 0})
                          </div>
                        </button>
                        <button 
                          className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                        >
                          <div className="flex items-center">
                            <RiTableLine className="mr-2" />
                            Tables ({selectedRestaurant.tables?.length || 0})
                          </div>
                        </button>
                      </nav>
                    </div>
                    
                    {/* Menu Items List */}
                    <div className="mt-4">
                      {selectedRestaurant.menuItems?.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Item
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Category
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedRestaurant.menuItems.map((item) => (
                                <tr key={item.id}>
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                    {item.description && (
                                      <div className="text-xs text-gray-500">{item.description}</div>
                                    )}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                    {item.category}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                    ${item.price.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {item.isAvailable ? 'Available' : 'Unavailable'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No menu items available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500">Restaurant not found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}