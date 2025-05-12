// import { Inter } from 'next/font/google';
// import './globals.css';
// import { AuthProvider } from '@/contexts/authContext';
// import Header from '@/components/common/Header';
// import Footer from '@/components/common/Footer';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'CityEats - Restaurant Booking Platform',
//   description: 'Discover and book the best restaurants in your city',
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <AuthProvider>
//           <div className="flex flex-col min-h-screen">
//             <Header />
//             <main className="flex-grow">{children}</main>
//             <Footer />
//           </div>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }
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