'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/authContext';

export default function RegisterPage() {
  // Tab switching state
  const [activeTab, setActiveTab] = useState('CUSTOMER');
  
  // Form, loading and error states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    storeName: '',
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { setUser } = useAuth();

  // Handle tab switching
  const switchTab = (tabType) => {
    setActiveTab(tabType);
    setError('');
    setSuccess('');
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate vendor-specific fields
    if (activeTab === 'VENDOR' && !formData.storeName.trim()) {
      setError('Restaurant name is required');
      return;
    }
    
    setIsLoading(true);

    try {
      // Submit registration to our unified API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          type: activeTab,
          ...(activeTab === 'VENDOR' ? { storeName: formData.storeName } : {})
        })
      });

      const result = await response.json();

      if (result.success) {
        if (activeTab === 'VENDOR') {
          // For vendors, show success message
          setSuccess('Your restaurant account has been created and is pending review. You will be able to login once approved.');
          // Reset form
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            storeName: '',
          });
        } else {
          // For customers, they're automatically logged in via cookies
          setUser(result.user);
          router.push('/');
        }
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      {/* Tab Navigation */}
      <div className="flex mb-6 border-b">
        <button
          onClick={() => switchTab('CUSTOMER')}
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'CUSTOMER'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Customer Registration
        </button>
        <button
          onClick={() => switchTab('VENDOR')}
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'VENDOR'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Restaurant Registration
        </button>
      </div>

      <div className="w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {activeTab === 'VENDOR' ? 'Restaurant Registration' : 'Create an Account'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}
        
        {!success ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                {activeTab === 'VENDOR' ? 'Owner Name' : 'Full Name'}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {/* Restaurant Name - only shown for VENDOR */}
            {activeTab === 'VENDOR' && (
              <div className="mb-4">
                <label htmlFor="storeName" className="block text-gray-700 font-medium mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={8}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <Link
              href={activeTab === 'VENDOR' ? '/auth/vendor/login' : '/auth/login'}
              className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
            >
              Go to Login
            </Link>
          </div>
        )}
        
        {!success && (
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                href={activeTab === 'VENDOR' ? '/auth/vendor/login' : '/auth/login'} 
                className="text-blue-600 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}