// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/contexts/authContext';
// import { 
//   RiUser3Line, 
//   RiMailLine, 
//   RiPhoneLine, 
//   RiLockLine,
//   RiInformationLine
// } from 'react-icons/ri';

// export default function ProfilePage() {
//   const { userId, userEmail, checkAuth } = useAuth();
  
//   const [userData, setUserData] = useState({
//     name: '',
//     email: '',
//     phone: ''
//   });
  
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
  
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [changingPassword, setChangingPassword] = useState(false);
//   const [message, setMessage] = useState(null);
  
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const res = await fetch('/api/user/profile');
//         const data = await res.json();
        
//         if (data.success) {
//           setUserData({
//             name: data.user.name || '',
//             email: data.user.email || '',
//             phone: data.user.phone || ''
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching user profile:', error);
//         showMessage('Failed to load profile data', 'error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId) {
//       fetchUserData();
//     }
//   }, [userId]);

//   const handleProfileChange = (e) => {
//     const { name, value } = e.target;
//     setUserData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
    
//     try {
//       const res = await fetch('/api/user/profile', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(userData)
//       });
      
//       const data = await res.json();
      
//       if (data.success) {
//         showMessage('Profile updated successfully', 'success');
        
//         // Update auth context if email changed
//         if (userData.email !== userEmail) {
//           await checkAuth();
//         }
//       } else {
//         showMessage(data.error || 'Failed to update profile', 'error');
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       showMessage('An unexpected error occurred', 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();
//     setChangingPassword(true);
    
//     try {
//       // Validate passwords
//       if (passwordData.newPassword !== passwordData.confirmPassword) {
//         showMessage('New passwords do not match', 'error');
//         setChangingPassword(false);
//         return;
//       }
      
//       if (passwordData.newPassword.length < 8) {
//         showMessage('Password must be at least 8 characters long', 'error');
//         setChangingPassword(false);
//         return;
//       }
      
//       const res = await fetch('/api/user/change-password', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           currentPassword: passwordData.currentPassword,
//           newPassword: passwordData.newPassword
//         })
//       });
      
//       const data = await res.json();
      
//       if (data.success) {
//         showMessage('Password changed successfully', 'success');
//         setPasswordData({
//           currentPassword: '',
//           newPassword: '',
//           confirmPassword: ''
//         });
//       } else {
//         showMessage(data.error || 'Failed to change password', 'error');
//       }
//     } catch (error) {
//       console.error('Error changing password:', error);
//       showMessage('An unexpected error occurred', 'error');
//     } finally {
//       setChangingPassword(false);
//     }
//   };

//   const showMessage = (text, type) => {
//     setMessage({ text, type });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
//       {/* Message notification */}
//       {message && (
//         <div className={`p-4 mb-6 rounded-md ${
//           message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//         }`}>
//           {message.text}
//         </div>
//       )}
      
//       {/* Profile Information */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//         <div className="flex items-center mb-6">
//           <RiUser3Line className="text-blue-500 mr-2" size={20} />
//           <h2 className="text-lg font-semibold">Personal Information</h2>
//         </div>
        
//         <form onSubmit={handleProfileSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Full Name */}
//             <div>
//               <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
//                 Full Name
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <RiUser3Line className="text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={userData.name}
//                   onChange={handleProfileChange}
//                   className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//             </div>
            
//             {/* Email */}
//             <div>
//               <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <RiMailLine className="text-gray-400" />
//                 </div>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={userData.email}
//                   onChange={handleProfileChange}
//                   className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//             </div>
            
//             {/* Phone */}
//             <div>
//               <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
//                 Phone Number
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <RiPhoneLine className="text-gray-400" />
//                 </div>
//                 <input
//                   type="tel"
//                   id="phone"
//                   name="phone"
//                   value={userData.phone}
//                   onChange={handleProfileChange}
//                   className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//           </div>
          
//           <div className="mt-6">
//             <button
//               type="submit"
//               disabled={saving}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
//             >
//               {saving ? 'Saving...' : 'Save Changes'}
//             </button>
//           </div>
//         </form>
//       </div>
      
//       {/* Change Password */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="flex items-center mb-6">
//           <RiLockLine className="text-blue-500 mr-2" size={20} />
//           <h2 className="text-lg font-semibold">Change Password</h2>
//         </div>
        
//         <form onSubmit={handlePasswordSubmit}>
//           {/* Current Password */}
//           <div className="mb-4">
//             <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-2">
//               Current Password
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <RiLockLine className="text-gray-400" />
//               </div>
//               <input
//                 type="password"
//                 id="currentPassword"
//                 name="currentPassword"
//                 value={passwordData.currentPassword}
//                 onChange={handlePasswordChange}
//                 className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//           </div>
          
//           {/* New Password */}
//           <div className="mb-4">
//             <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
//               New Password
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <RiLockLine className="text-gray-400" />
//               </div>
//               <input
//                 type="password"
//                 id="newPassword"
//                 name="newPassword"
//                 value={passwordData.newPassword}
//                 onChange={handlePasswordChange}
//                 className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//                 minLength={8}
//               />
//             </div>
//             <p className="mt-1 text-sm text-gray-500">
//               Password must be at least 8 characters long
//             </p>
//           </div>
          
//           {/* Confirm Password */}
//           <div className="mb-6">
//             <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
//               Confirm New Password
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <RiLockLine className="text-gray-400" />
//               </div>
//               <input
//                 type="password"
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 value={passwordData.confirmPassword}
//                 onChange={handlePasswordChange}
//                 className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//           </div>
          
//           <div>
//             <button
//               type="submit"
//               disabled={changingPassword}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
//             >
//               {changingPassword ? 'Changing Password...' : 'Change Password'}
//             </button>
//           </div>
//         </form>
//       </div>
      
//       {/* Account Security Info */}
//       <div className="mt-6 p-4 bg-blue-50 rounded-md">
//         <div className="flex items-start">
//           <RiInformationLine className="text-blue-500 mt-1 mr-2" />
//           <div>
//             <h3 className="font-medium">Account Security</h3>
//             <p className="text-sm text-gray-600 mt-1">
//               We recommend changing your password regularly and using a strong, unique password that you don't use for other websites.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import { 
  RiUser3Line, 
  RiMailLine, 
  RiPhoneLine, 
  RiLockLine,
  RiInformationLine,
  RiShieldCheckLine,
  RiEditLine
} from 'react-icons/ri';

export default function ProfilePage() {
  const { userId, userEmail, checkAuth } = useAuth();
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        
        if (data.success) {
          setUserData({
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        showMessage('Failed to load profile data', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        showMessage('Profile updated successfully', 'success');
        
        // Update auth context if email changed
        if (userData.email !== userEmail) {
          await checkAuth();
        }
      } else {
        showMessage(data.error || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage('An unexpected error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    
    try {
      // Validate passwords
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        showMessage('New passwords do not match', 'error');
        setChangingPassword(false);
        return;
      }
      
      if (passwordData.newPassword.length < 8) {
        showMessage('Password must be at least 8 characters long', 'error');
        setChangingPassword(false);
        return;
      }
      
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        showMessage('Password changed successfully', 'success');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        showMessage(data.error || 'Failed to change password', 'error');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showMessage('An unexpected error occurred', 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-serif text-amber-900 mb-6 flex items-center">
        <RiUser3Line className="text-amber-600 mr-3 text-2xl" />
        My Profile
      </h1>
      
      {/* Message notification */}
      {message && (
        <div className={`p-4 mb-6 rounded-md ${
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
      
      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-stone-100">
        <div className="flex items-center mb-6 pb-2 border-b border-stone-100">
          <RiUser3Line className="text-amber-600 mr-2" size={22} />
          <h2 className="text-lg font-serif text-amber-900">Personal Information</h2>
          <div className="ml-auto bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <RiEditLine className="mr-1" />
            Edit Details
          </div>
        </div>
        
        <form onSubmit={handleProfileSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-stone-700 font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiUser3Line className="text-amber-500" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleProfileChange}
                  className="pl-10 w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-stone-700 font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiMailLine className="text-amber-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleProfileChange}
                  className="pl-10 w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-stone-700 font-medium mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiPhoneLine className="text-amber-500" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleProfileChange}
                  className="pl-10 w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all duration-300 disabled:bg-amber-300 shadow-sm font-medium"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Change Password */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-stone-100">
        <div className="flex items-center mb-6 pb-2 border-b border-stone-100">
          <RiLockLine className="text-amber-600 mr-2" size={22} />
          <h2 className="text-lg font-serif text-amber-900">Change Password</h2>
        </div>
        
        <form onSubmit={handlePasswordSubmit}>
          {/* Current Password */}
          <div className="mb-5">
            <label htmlFor="currentPassword" className="block text-stone-700 font-medium mb-2">
              Current Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiLockLine className="text-amber-500" />
              </div>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="pl-10 w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          {/* New Password */}
          <div className="mb-5">
            <label htmlFor="newPassword" className="block text-stone-700 font-medium mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiLockLine className="text-amber-500" />
              </div>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="pl-10 w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
                minLength={8}
              />
            </div>
            <p className="mt-1 text-sm text-stone-500">
              Password must be at least 8 characters long
            </p>
          </div>
          
          {/* Confirm Password */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-stone-700 font-medium mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiLockLine className="text-amber-500" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="pl-10 w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={changingPassword}
              className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all duration-300 disabled:bg-amber-300 shadow-sm font-medium"
            >
              {changingPassword ? 'Changing Password...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Account Security Info */}
      <div className="mt-8 p-6 bg-amber-50 rounded-lg border border-amber-100">
        <div className="flex items-start">
          <RiShieldCheckLine className="text-amber-600 mt-1 mr-3 text-xl" />
          <div>
            <h3 className="font-medium text-amber-900 mb-2">Account Security</h3>
            <p className="text-stone-700">
              We recommend changing your password regularly and using a strong, unique password that you don't use for other websites. This helps keep your account and dining information secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}