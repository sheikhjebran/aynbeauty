'use client'

import { usePathname } from 'next/navigation'
import { Header } from './header'
import { Footer } from './footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Check if current path is an admin route
  const isAdminRoute = pathname?.startsWith('/admin')
  
  // For admin routes, don't show header and footer
  if (isAdminRoute) {
    return <>{children}</>
  }
  
  // For regular routes, show header and footer
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </>
  )
}