
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import Link from 'next/link';

export default function LoginForm({ userType = 'CUSTOMER' }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(formData);

      if (result.success) {
        // Extract user type from result
        const userType = result.user?.type || 'CUSTOMER';
        
        // Redirect based on user type
        switch (userType) {
          case 'ADMIN':
            router.push('/admin/dashboard');
            break;
          case 'VENDOR':
            router.push('/vendor/dashboard');
            break;
          case 'CUSTOMER':
            router.push('/my-account/bookings');
            break;
          default:
            router.push('/');
        }
      } else {
        // Check for pending vendor status
        if (result.pendingVendor) {
          setError('Your restaurant account is still under review. You will be notified when approved.');
        } else if (result.rejectedVendor) {
          setError('Your restaurant account application was not approved. Please contact support for more information.');
        } else {
          setError(result.error || 'Login failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {userType === 'ADMIN' ? 'Admin Login' : 
         userType === 'VENDOR' ? 'Restaurant Owner Login' : 'Login'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
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
        
        <div className="mb-6">
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
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      {/* <div className="mt-4 text-center">
        <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
          Forgot your password?
        </Link>
      </div> */}
      {/* <div className="mt-4 text-center">
        <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
          Forgot your password?
        </Link>
      </div> */}
      <div className="mt-4 text-center">
        <Link href="/auth/signup" className="text-sm text-blue-600 hover:underline">
          Vendor Signup
        </Link>
      </div>
      
      {userType === 'CUSTOMER' && (
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Customer   Sign up
            </Link>
          </p>
        </div>
      )}
      
      {userType === 'VENDOR' && (
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Want to list your restaurant?{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}