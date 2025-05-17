
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/authContext';
import MainLayout from '@/components/common/MainLayout';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CityEats - Restaurant Booking Platform',
  description: 'Discover and book the best restaurants in your city',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
       
        
        <AuthProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}