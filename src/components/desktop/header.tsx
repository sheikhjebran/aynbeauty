'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export function DesktopHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const navigationItems = [
    { 
      name: 'Skincare', 
      href: '/categories/skincare'
    },
    { 
      name: 'Lips', 
      href: '/categories/lips'
    },
    { 
      name: 'Bath & Body', 
      href: '/categories/bath-and-body'
    },
    { 
      name: 'Fragrances', 
      href: '/categories/fragrance'
    },
    { 
      name: 'Eyes', 
      href: '/categories/eyes'
    },
    { 
      name: 'Nails', 
      href: '/categories/nails'
    },
    { 
      name: 'Combo Sets', 
      href: '/categories/combo-sets'
    }
  ]

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white text-center py-2 text-sm">
        <p>Free shipping on orders above ₹299 | Easy 30-day returns</p>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="ml-3 text-2xl font-bold gradient-text">Ayn Beauty</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, categories..."
                className="w-full px-4 py-2 pl-12 pr-4 text-gray-900 placeholder-gray-500 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-6">
            {/* Profile */}
            <Link href="/account" className="text-gray-700 hover:text-primary-500 transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="text-gray-700 hover:text-primary-500 transition-colors relative">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="text-gray-700 hover:text-primary-500 transition-colors relative">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="border-t border-gray-100">
          <div className="flex justify-center lg:space-x-8 md:space-x-4 space-x-2 py-3 flex-wrap">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="text-gray-900 hover:text-primary-500 px-2 lg:px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap"
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}