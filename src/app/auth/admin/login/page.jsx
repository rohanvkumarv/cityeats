 
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import LoginForm from '@/components/auth/LoginForm';
import Image from 'next/image';

export default function AdminLoginPage() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && isAdmin && !isLoading) {
      router.push('/admin/dashboard');
    } else if (isAuthenticated && !isAdmin && !isLoading) {
      // If logged in but not an admin
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-1/2 relative hidden md:block">
              <div className="absolute inset-0 bg-gray-800 opacity-80"></div>
              <Image
                src="/images/admin-login-bg.jpg"
                alt="Admin dashboard"
                fill
                style={{ objectFit: 'cover' }}
              />
              <div className="relative z-10 flex flex-col justify-center items-center h-full text-white p-8">
                <h2 className="text-3xl font-bold mb-4">Admin Portal</h2>
                <p className="text-center mb-6">
                  Access the admin dashboard to manage users, restaurants, and platform settings
                </p>
              </div>
            </div>
            
            {/* Form Section */}
            <div className="md:w-1/2 p-8">
              <LoginForm userType="ADMIN" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}