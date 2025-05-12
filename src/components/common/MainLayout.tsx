'use client'

import { usePathname } from "next/navigation"
import Header from "./Header"
import Footer from "./Footer"

export default function MainLayout({ children }) {
  const pathname = usePathname()
  
  // Check if current route starts with any of these paths
  const hideHeaderFooter = pathname?.startsWith("/my-account") || 
                          pathname?.startsWith("/vendor") || 
                          pathname?.startsWith("/admin")

  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeaderFooter && <Header />}
      <main className="flex-grow">{children}</main>
      {!hideHeaderFooter && <Footer />}
    </div>
  )
}