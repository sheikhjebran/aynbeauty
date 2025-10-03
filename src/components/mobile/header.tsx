'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  const categories = [
    { name: 'SkinCare', href: '/categories/skincare' },
    { name: 'Lips', href: '/categories/lips' },
    { name: 'Bath & Body', href: '/categories/bath-body' },
    { name: 'Fragrances', href: '/categories/fragrances' },
    { name: 'Eyes', href: '/categories/eyes' },
    { name: 'Nails', href: '/categories/nails' },
    { name: 'Combo Sets', href: '/categories/combo-sets' },
  ]

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        {/* Top Bar */}
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Menu Button */}
            <button
              onClick={toggleMenu}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              {!logoError ? (
                <div className="flex items-center">
                  <Image
                    src="/images/logo.png"
                    alt="AYN Beauty"
                    width={180}
                    height={65}
                    className="h-14 w-auto"
                    priority
                    onError={() => setLogoError(true)}
                  />
                  <span className="ml-2 text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    AYNBeauty
                  </span>
                </div>
              ) : (
                /* Fallback text logo */
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                  <span className="ml-2 text-2xl font-bold gradient-text">AynBeauty</span>
                </div>
              )}
            </Link>

            {/* Header Actions */}
            <div className="flex items-center space-x-2">
              {/* Search Button */}
              <button
                onClick={toggleSearch}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="p-2 text-gray-600 hover:text-gray-900 relative">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              </Link>

              {/* Cart */}
              <Link href="/cart" className="p-2 text-gray-600 hover:text-gray-900 relative">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H21M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v4.01" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar (when expanded) */}
        {isSearchOpen && (
          <div className="px-4 pb-3 border-t border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products, brands..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16"></div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={toggleMenu}></div>

          {/* Menu Panel */}
          <div className="fixed top-0 left-0 bottom-0 w-80 max-w-sm bg-white shadow-xl">
            {/* Menu Header */}
            <div className="px-4 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <span className="ml-2 text-xl font-bold gradient-text">AynBeauty</span>
                </div>
                <button
                  onClick={toggleMenu}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Menu Content */}
            <div className="px-4 py-4">
              {/* User Section */}
              <div className="pb-4 border-b border-gray-200 mb-4">
                <Link href="/login" className="flex items-center p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Sign In / Sign Up</p>
                    <p className="text-sm text-gray-500">Get exclusive offers & rewards</p>
                  </div>
                </Link>
              </div>

              {/* Categories */}
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-900 px-3 py-2">Categories</h3>
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                    onClick={toggleMenu}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-1">
                <Link href="/offers" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                  Offers & Deals
                </Link>
                <Link href="/new-arrivals" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                  New Arrivals
                </Link>
                <Link href="/bestsellers" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                  Bestsellers
                </Link>
                <Link href="/help" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                  Help & Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}