// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/contexts/authContext';
// import { 
//   RiUser3Line, 
//   RiSearchLine, 
//   RiFilterLine,
//   RiMailLine,
//   RiPhoneLine,
//   RiTimeLine,
//   RiStore2Line,
//   RiShieldUserLine,
//   RiUserSettingsLine,
//   RiCloseLine,
//   RiCalendarCheckLine,
//   RiEditLine,
//   RiShoppingBagLine,
//   RiInformationLine
// } from 'react-icons/ri';

// export default function AdminUsers() {
//   const { userId } = useAuth();
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [pagination, setPagination] = useState({
//     total: 0,
//     page: 1,
//     limit: 10,
//     pages: 1
//   });
  
//   const [filters, setFilters] = useState({
//     search: '',
//     type: '',
//     page: 1
//   });
  
//   // New state for the popup
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         // Build query parameters
//         const params = new URLSearchParams();
        
//         if (filters.search) params.append('search', filters.search);
//         if (filters.type) params.append('type', filters.type);
        
//         params.append('page', filters.page);
//         params.append('limit', pagination.limit);
        
//         const res = await fetch(`/api/admin/users?${params.toString()}`);
//         const data = await res.json();
        
//         if (data.success) {
//           setUsers(data.users);
//           setPagination(data.pagination);
//         }
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId) {
//       fetchUsers();
//     }
//   }, [userId, filters, pagination.limit]);
  
//   // New function to fetch user details
//   const fetchUserDetails = async (userId) => {
//     setModalLoading(true);
//     try {
//       const res = await fetch(`/api/admin/users/${userId}`);
//       const data = await res.json();
      
//       if (data.success) {
//         setSelectedUser(data.user);
//         setShowModal(true);
//       }
//     } catch (error) {
//       console.error('Error fetching user details:', error);
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
//       type: '',
//       page: 1
//     });
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
//     setSelectedUser(null);
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Users</h1>
//       </div>
      
//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow-md p-4 mb-6">
//         <div className="flex items-center mb-4">
//           <RiFilterLine className="text-gray-500 mr-2" />
//           <h2 className="text-lg font-semibold">Filters</h2>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           {/* Search */}
//           <div>
//             <form onSubmit={handleSearch}>
//               <div className="relative">
//                 <input
//                   type="text"
//                   name="search"
//                   value={filters.search}
//                   onChange={handleFilterChange}
//                   placeholder="Search by name or email..."
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               </div>
//             </form>
//           </div>
          
//           {/* User Type Filter */}
//           <div>
//             <select
//               name="type"
//               value={filters.type}
//               onChange={handleFilterChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Users</option>
//               <option value="ADMIN">Admin</option>
//               <option value="VENDOR">Vendor</option>
//               <option value="CUSTOMER">Customer</option>
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
      
//       {/* Users Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : users.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     User
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Phone
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Type
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Created
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {users.map((user) => (
//                   <tr key={user.id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
//                           <RiUser3Line className="h-6 w-6 text-gray-500" />
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">
//                             {user.name}
//                           </div>
//                           {user.type === 'VENDOR' && user.vendor && (
//                             <div className="text-xs text-gray-500">
//                               {user.vendor.storeName}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <RiMailLine className="text-gray-400 mr-2" />
//                         <div className="text-sm text-gray-900">
//                           {user.email}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {user.phone ? (
//                         <div className="flex items-center">
//                           <RiPhoneLine className="text-gray-400 mr-2" />
//                           <div className="text-sm text-gray-900">
//                             {user.phone}
//                           </div>
//                         </div>
//                       ) : (
//                         <span className="text-xs text-gray-500">Not provided</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
//                         user.type === 'ADMIN' 
//                           ? 'bg-purple-100 text-purple-800' 
//                           : user.type === 'VENDOR' 
//                           ? 'bg-blue-100 text-blue-800'
//                           : 'bg-green-100 text-green-800'
//                       }`}>
//                         {user.type === 'ADMIN' ? (
//                           <RiShieldUserLine className="mr-1" />
//                         ) : user.type === 'VENDOR' ? (
//                           <RiStore2Line className="mr-1" />
//                         ) : (
//                           <RiUser3Line className="mr-1" />
//                         )}
//                         {user.type}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <RiTimeLine className="text-gray-400 mr-2" />
//                         <div className="text-sm text-gray-900">
//                           {formatDate(user.createdAt)}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex space-x-3">
//                         {/* Changed from Link to button */}
//                         <button
//                           onClick={() => fetchUserDetails(user.id)}
//                           className="text-blue-600 hover:text-blue-900"
//                         >
//                           View
//                         </button>
//                         <button
//                           onClick={() => window.location.href=`/admin/users/${user.id}/edit`}
//                           className="text-green-600 hover:text-green-900"
//                         >
//                           Edit
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
//             <RiUserSettingsLine className="text-5xl text-gray-300 mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
//             <p className="text-gray-500">Try adjusting your search filters</p>
//           </div>
//         )}
//       </div>
      
//       {/* Pagination */}
//       {!loading && users.length > 0 && pagination.pages > 1 && (
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
      
//       {/* User Details Modal */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
//             {modalLoading ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
//               </div>
//             ) : selectedUser ? (
//               <div>
//                 {/* Modal Header */}
//                 <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//                   <h2 className="text-xl font-bold">User Details</h2>
//                   <button
//                     onClick={closeModal}
//                     className="text-gray-500 hover:text-gray-700 focus:outline-none"
//                   >
//                     <RiCloseLine className="h-6 w-6" />
//                   </button>
//                 </div>
                
//                 {/* Modal Body */}
//                 <div className="px-6 py-4">
//                   {/* User Profile */}
//                   <div className="flex items-center mb-6">
//                     <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
//                       <RiUser3Line className="h-8 w-8 text-gray-500" />
//                     </div>
//                     <div className="ml-4">
//                       <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
//                       <div className="flex items-center mt-1">
//                         <span className={`px-2 py-1 inline-flex items-center text-xs font-semibold rounded-full ${
//                           selectedUser.type === 'ADMIN' 
//                             ? 'bg-purple-100 text-purple-800' 
//                             : selectedUser.type === 'VENDOR' 
//                             ? 'bg-blue-100 text-blue-800'
//                             : 'bg-green-100 text-green-800'
//                         }`}>
//                           {selectedUser.type === 'ADMIN' ? (
//                             <RiShieldUserLine className="mr-1" />
//                           ) : selectedUser.type === 'VENDOR' ? (
//                             <RiStore2Line className="mr-1" />
//                           ) : (
//                             <RiUser3Line className="mr-1" />
//                           )}
//                           {selectedUser.type}
//                         </span>
//                         <span className="ml-2 text-xs text-gray-500">
//                           Member since {formatDate(selectedUser.createdAt)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Contact Information */}
//                   <div className="mb-6">
//                     <h3 className="text-md font-semibold mb-3">Contact Information</h3>
//                     <div className="space-y-2 bg-gray-50 p-4 rounded-md">
//                       <div className="flex items-center">
//                         <RiMailLine className="text-gray-400 mr-3 flex-shrink-0" />
//                         <div>
//                           <p className="text-sm font-medium">Email</p>
//                           <p className="text-sm text-gray-800">{selectedUser.email}</p>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center">
//                         <RiPhoneLine className="text-gray-400 mr-3 flex-shrink-0" />
//                         <div>
//                           <p className="text-sm font-medium">Phone</p>
//                           <p className="text-sm text-gray-800">
//                             {selectedUser.phone || "Not provided"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Vendor Information (if applicable) */}
//                   {selectedUser.type === 'VENDOR' && selectedUser.vendor && (
//                     <div className="mb-6">
//                       <h3 className="text-md font-semibold mb-3">Vendor Information</h3>
//                       <div className="space-y-2 bg-gray-50 p-4 rounded-md">
//                         <div className="flex items-center">
//                           <RiStore2Line className="text-gray-400 mr-3 flex-shrink-0" />
//                           <div>
//                             <p className="text-sm font-medium">Store Name</p>
//                             <p className="text-sm text-gray-800">{selectedUser.vendor.storeName}</p>
//                           </div>
//                         </div>
                        
//                         <div className="flex items-center">
//                           <RiInformationLine className="text-gray-400 mr-3 flex-shrink-0" />
//                           <div>
//                             <p className="text-sm font-medium">Status</p>
//                             <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
//                               selectedUser.vendor.status === 'APPROVED' 
//                                 ? 'bg-green-100 text-green-800' 
//                                 : selectedUser.vendor.status === 'PENDING' 
//                                 ? 'bg-yellow-100 text-yellow-800'
//                                 : 'bg-red-100 text-red-800'
//                             }`}>
//                               {selectedUser.vendor.status}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
                  
//                   {/* Recent Bookings (if available) */}
//                   {selectedUser.bookings && selectedUser.bookings.length > 0 && (
//                     <div className="mb-6">
//                       <h3 className="text-md font-semibold mb-3">Recent Bookings</h3>
//                       <div className="bg-gray-50 p-4 rounded-md">
//                         <div className="space-y-3">
//                           {selectedUser.bookings.map(booking => (
//                             <div key={booking.id} className="border-b border-gray-200 pb-2 last:border-0 last:pb-0">
//                               <div className="flex justify-between items-start">
//                                 <div className="flex items-start">
//                                   <RiCalendarCheckLine className="text-gray-400 mr-2 mt-1 flex-shrink-0" />
//                                   <div>
//                                     <p className="text-sm font-medium">{booking.restaurant.name}</p>
//                                     <p className="text-xs text-gray-500">{booking.restaurant.city}</p>
//                                     <div className="flex items-center mt-1">
//                                       <p className="text-xs text-gray-700">
//                                         {new Date(booking.date).toLocaleDateString()} at {booking.time}
//                                       </p>
//                                       <span className="mx-1">•</span>
//                                       <p className="text-xs text-gray-700">{booking.people} people</p>
//                                     </div>
//                                   </div>
//                                 </div>
//                                 <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
//                                   booking.status === 'CONFIRMED' 
//                                     ? 'bg-green-100 text-green-800' 
//                                     : booking.status === 'PENDING' 
//                                     ? 'bg-yellow-100 text-yellow-800'
//                                     : booking.status === 'COMPLETED'
//                                     ? 'bg-blue-100 text-blue-800'
//                                     : 'bg-red-100 text-red-800'
//                                 }`}>
//                                   {booking.status}
//                                 </span>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
                
//                 {/* Modal Footer */}
//                 <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
//                   <button
//                     onClick={() => window.location.href=`/admin/users/${selectedUser.id}/edit`}
//                     className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:border-blue-800 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150 mr-2"
//                   >
//                     <RiEditLine className="mr-1" />
//                     Edit User
//                   </button>
//                   <button
//                     onClick={closeModal}
//                     className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:border-gray-400 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-12">
//                 <p className="text-gray-500">User not found</p>
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
  RiUser3Line, 
  RiSearchLine, 
  RiFilterLine,
  RiMailLine,
  RiPhoneLine,
  RiTimeLine,
  RiStore2Line,
  RiShieldUserLine,
  RiUserSettingsLine,
  RiCloseLine,
  RiCalendarCheckLine,
  RiEditLine,
  RiSaveLine,
  RiInformationLine,
  RiCloseFill
} from 'react-icons/ri';

export default function AdminUsers() {
  const { userId } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });
  
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    page: 1
  });
  
  // State for the popup
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // State for form editing
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'CUSTOMER',
    vendor: {
      storeName: '',
      status: 'PENDING'
    }
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Build query parameters
        const params = new URLSearchParams();
        
        if (filters.search) params.append('search', filters.search);
        if (filters.type) params.append('type', filters.type);
        
        params.append('page', filters.page);
        params.append('limit', pagination.limit);
        
        const res = await fetch(`/api/admin/users?${params.toString()}`);
        const data = await res.json();
        
        if (data.success) {
          setUsers(data.users);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUsers();
    }
  }, [userId, filters, pagination.limit]);
  
  // Function to fetch user details
  const fetchUserDetails = async (userId) => {
    setModalLoading(true);
    setIsEditMode(false);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      const data = await res.json();
      
      if (data.success) {
        setSelectedUser(data.user);
        // Initialize edit form with user data
        setEditForm({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || '',
          type: data.user.type,
          vendor: data.user.vendor 
            ? {
                storeName: data.user.vendor.storeName,
                status: data.user.vendor.status
              }
            : {
                storeName: '',
                status: 'PENDING'
              }
        });
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setModalLoading(false);
    }
  };
  
  // Function to update user details
  const updateUser = async () => {
    // Validate form
    const errors = {};
    if (!editForm.name.trim()) errors.name = 'Name is required';
    if (!editForm.email.trim()) errors.email = 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(editForm.email)) errors.email = 'Valid email is required';
    if (editForm.type === 'VENDOR' && !editForm.vendor.storeName.trim()) {
      errors.storeName = 'Store name is required for vendors';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Update the user in the local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === selectedUser.id ? data.user : user
          )
        );
        
        // Update selected user and return to view mode
        setSelectedUser(data.user);
        setIsEditMode(false);
        setFormErrors({});
      } else {
        setFormErrors({ general: data.message || 'Error updating user' });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setFormErrors({ general: 'Error updating user. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filter changes
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already applied through the useEffect
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      page: 1
    });
  };

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setFilters(prev => ({
        ...prev,
        page: newPage
      }));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setIsEditMode(false);
    setFormErrors({});
  };
  
  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle vendor form field changes
  const handleVendorInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      vendor: {
        ...prev.vendor,
        [name]: value
      }
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center mb-4">
          <RiFilterLine className="text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Search */}
          <div>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </form>
          </div>
          
          {/* User Type Filter */}
          <div>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Users</option>
              <option value="ADMIN">Admin</option>
              <option value="VENDOR">Vendor</option>
              <option value="CUSTOMER">Customer</option>
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
      
      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <RiUser3Line className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          {user.type === 'VENDOR' && user.vendor && (
                            <div className="text-xs text-gray-500">
                              {user.vendor.storeName}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <RiMailLine className="text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.phone ? (
                        <div className="flex items-center">
                          <RiPhoneLine className="text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {user.phone}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Not provided</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                        user.type === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-800' 
                          : user.type === 'VENDOR' 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.type === 'ADMIN' ? (
                          <RiShieldUserLine className="mr-1" />
                        ) : user.type === 'VENDOR' ? (
                          <RiStore2Line className="mr-1" />
                        ) : (
                          <RiUser3Line className="mr-1" />
                        )}
                        {user.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <RiTimeLine className="text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {formatDate(user.createdAt)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => fetchUserDetails(user.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            fetchUserDetails(user.id).then(() => {
                              setIsEditMode(true);
                            });
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Edit
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
            <RiUserSettingsLine className="text-5xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {!loading && users.length > 0 && pagination.pages > 1 && (
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
      
      {/* User Details/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            {modalLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : selectedUser ? (
              <div>
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold">
                    {isEditMode ? 'Edit User' : 'User Details'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <RiCloseLine className="h-6 w-6" />
                  </button>
                </div>
                
                {/* Modal Body */}
                <div className="px-6 py-4">
                  {/* Form error message */}
                  {formErrors.general && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                      {formErrors.general}
                    </div>
                  )}
                
                  {/* View Mode */}
                  {!isEditMode ? (
                    <>
                      {/* User Profile */}
                      <div className="flex items-center mb-6">
                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <RiUser3Line className="h-8 w-8 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                          <div className="flex items-center mt-1">
                            <span className={`px-2 py-1 inline-flex items-center text-xs font-semibold rounded-full ${
                              selectedUser.type === 'ADMIN' 
                                ? 'bg-purple-100 text-purple-800' 
                                : selectedUser.type === 'VENDOR' 
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {selectedUser.type === 'ADMIN' ? (
                                <RiShieldUserLine className="mr-1" />
                              ) : selectedUser.type === 'VENDOR' ? (
                                <RiStore2Line className="mr-1" />
                              ) : (
                                <RiUser3Line className="mr-1" />
                              )}
                              {selectedUser.type}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
                              Member since {formatDate(selectedUser.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact Information */}
                      <div className="mb-6">
                        <h3 className="text-md font-semibold mb-3">Contact Information</h3>
                        <div className="space-y-2 bg-gray-50 p-4 rounded-md">
                          <div className="flex items-center">
                            <RiMailLine className="text-gray-400 mr-3 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium">Email</p>
                              <p className="text-sm text-gray-800">{selectedUser.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <RiPhoneLine className="text-gray-400 mr-3 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium">Phone</p>
                              <p className="text-sm text-gray-800">
                                {selectedUser.phone || "Not provided"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Vendor Information (if applicable) */}
                      {selectedUser.type === 'VENDOR' && selectedUser.vendor && (
                        <div className="mb-6">
                          <h3 className="text-md font-semibold mb-3">Vendor Information</h3>
                          <div className="space-y-2 bg-gray-50 p-4 rounded-md">
                            <div className="flex items-center">
                              <RiStore2Line className="text-gray-400 mr-3 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">Store Name</p>
                                <p className="text-sm text-gray-800">{selectedUser.vendor.storeName}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <RiInformationLine className="text-gray-400 mr-3 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">Status</p>
                                <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                                  selectedUser.vendor.status === 'APPROVED' 
                                    ? 'bg-green-100 text-green-800' 
                                    : selectedUser.vendor.status === 'PENDING' 
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {selectedUser.vendor.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Recent Bookings (if available) */}
                      {selectedUser.bookings && selectedUser.bookings.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-md font-semibold mb-3">Recent Bookings</h3>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <div className="space-y-3">
                              {selectedUser.bookings.map(booking => (
                                <div key={booking.id} className="border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-start">
                                      <RiCalendarCheckLine className="text-gray-400 mr-2 mt-1 flex-shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium">{booking.restaurant.name}</p>
                                        <p className="text-xs text-gray-500">{booking.restaurant.city}</p>
                                        <div className="flex items-center mt-1">
                                          <p className="text-xs text-gray-700">
                                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                          </p>
                                          <span className="mx-1">•</span>
                                          <p className="text-xs text-gray-700">{booking.people} people</p>
                                        </div>
                                      </div>
                                    </div>
                                    <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                                      booking.status === 'CONFIRMED' 
                                        ? 'bg-green-100 text-green-800' 
                                        : booking.status === 'PENDING' 
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : booking.status === 'COMPLETED'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {booking.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Edit Mode */
                    <div className="space-y-6">
                      {/* Basic Information */}
                      <div>
                        <h3 className="text-md font-semibold mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={editForm.name}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {formErrors.name && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                            )}
                          </div>
                          
                          {/* Email */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={editForm.email}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {formErrors.email && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                            )}
                          </div>
                          
                          {/* Phone */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone (optional)
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={editForm.phone}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          
                          {/* User Type */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              User Type
                            </label>
                            <select
                              name="type"
                              value={editForm.type}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="CUSTOMER">Customer</option>
                              <option value="VENDOR">Vendor</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      {/* Vendor Information (if applicable) */}
                      {editForm.type === 'VENDOR' && (
                        <div>
                          <h3 className="text-md font-semibold mb-4">Vendor Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Store Name */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Store Name
                              </label>
                              <input
                                type="text"
                                name="storeName"
                                value={editForm.vendor.storeName}
                                onChange={handleVendorInputChange}
                                className={`w-full px-3 py-2 border ${formErrors.storeName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              />
                              {formErrors.storeName && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.storeName}</p>
                              )}
                            </div>
                            
                            {/* Vendor Status */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                              </label>
                              <select
                                name="status"
                                value={editForm.vendor.status}
                                onChange={handleVendorInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                  {isEditMode ? (
                    <>
                      <button
                        onClick={() => setIsEditMode(false)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-50 focus:outline-none focus:border-blue-300 focus:ring ring-blue-200 active:bg-gray-100 disabled:opacity-25 transition ease-in-out duration-150 mr-2"
                        disabled={isSaving}
                      >
                        <RiCloseFill className="mr-1" />
                        Cancel
                      </button>
                      <button
                        onClick={updateUser}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:border-blue-800 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <RiSaveLine className="mr-1" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditMode(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:border-blue-800 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150 mr-2"
                      >
                        <RiEditLine className="mr-1" />
                        Edit User
                      </button>
                      <button
                        onClick={closeModal}
                        className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:border-gray-400 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                      >
                        Close
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500">User not found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}