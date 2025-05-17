


// src/app/restaurants/page.tsx
import { Suspense } from 'react';
import RestaurantsPage from '@/components/RestaurantsPage';

export default function page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      < RestaurantsPage/>
    </Suspense>
  );
}