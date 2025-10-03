'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  MagnifyingGlassIcon,
  HeartIcon,
  ShoppingBagIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const router = useRouter()
  
  // Use contexts
  const { user, logout } = useAuth()
  const { totalItems: cartCount } = useCart()
  const { items: wishlistItems } = useWishlist()
  const wishlistCount = wishlistItems.length

  const handleSignOut = () => {
    logout()
    setIsUserMenuOpen(false)
    router.push('/')
  }

  // Categories for navigation
  const categories = [
    { 
      name: 'SkinCare', 
      href: '/categories/skincare',
      subcategories: ['Cleansers', 'Moisturizers', 'Serums', 'Masks', 'Sunscreen']
    },
    { 
      name: 'Lips', 
      href: '/categories/lips',
      subcategories: ['Lipstick', 'Lip Gloss', 'Lip Balm', 'Lip Liner', 'Lip Sets']
    },
    { 
      name: 'Bath & Body', 
      href: '/categories/bath-body',
      subcategories: ['Body Wash', 'Lotions', 'Scrubs', 'Oils', 'Bath Bombs']
    },
    { 
      name: 'Fragrances', 
      href: '/categories/fragrances',
      subcategories: ['Perfume', 'Body Spray', 'Candles', 'Diffusers', 'Gift Sets']
    },
    { 
      name: 'Eyes', 
      href: '/categories/eyes',
      subcategories: ['Mascara', 'Eyeshadow', 'Eyeliner', 'Eyebrows', 'Eye Care']
    },
    { 
      name: 'Nails', 
      href: '/categories/nails',
      subcategories: ['Nail Polish', 'Nail Care', 'Nail Tools', 'Nail Art', 'Base & Top Coats']
    },
    { 
      name: 'Combo Sets', 
      href: '/categories/combo-sets',
      subcategories: ['Gift Sets', 'Travel Kits', 'Value Packs', 'Bundles', 'Limited Edition']
    },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setIsSearchOpen(false)
    }
  }

  useEffect(() => {
    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.user-menu-dropdown')) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center py-4 text-sm">
        <p>✨ Free shipping on orders above ₹499 | Beauty Club members get early access to sales!</p>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-28">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            {!logoError ? (
              <div className="flex items-center">
                <Image
                  src="/images/logo.png"
                  alt="AYN Beauty"
                  width={220}
                  height={80}
                  className="h-16 w-auto md:h-20 md:w-auto"
                  priority
                  onError={() => setLogoError(true)}
                />
                <span className="ml-3 text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  AYN Beauty
                </span>
              </div>
            ) : (
              /* Fallback text logo */
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-2xl">A</span>
                </div>
                <span className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  AYN
                </span>
                <span className="text-3xl font-light text-gray-700 ml-1">Beauty</span>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <div key={category.name} className="relative group">
                <Link
                  href={category.href}
                  className="flex items-center text-gray-700 hover:text-pink-600 font-medium transition-colors"
                >
                  {category.name}
                  {category.subcategories.length > 0 && (
                    <ChevronDownIcon className="h-4 w-4 ml-1 group-hover:rotate-180 transition-transform" />
                  )}
                </Link>
                
                {/* Dropdown Menu - Only show if subcategories exist */}
                {category.subcategories.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="py-2">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          href={`${category.href}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands..."
                  className="w-full px-4 py-2 pr-12 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-pink-600 transition-colors"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button - Mobile */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {/* User Menu */}
            <div className="relative user-menu-dropdown">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center p-2 text-gray-600 hover:text-pink-600 transition-colors"
              >
                <UserIcon className="h-6 w-6" />
                {user && (
                  <span className="ml-2 text-sm font-medium hidden md:block">
                    {user.first_name}
                  </span>
                )}
              </button>
              
              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                  <div className="py-2">
                    {user ? (
                      <>
                        {/* Logged in user menu */}
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                          My Account
                        </Link>
                        <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                          My Orders
                        </Link>
                        <Link href="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                          My Wishlist
                        </Link>
                        <hr className="my-2" />
                        <button 
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Guest user menu */}
                        <Link href="/signin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                          Sign In
                        </Link>
                        <Link href="/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors">
              <HeartIcon className="h-6 w-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors">
              <ShoppingBagIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 mt-4 pt-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands..."
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-pink-600 transition-colors"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4">
            <nav className="space-y-4">
              {categories.map((category) => (
                <div key={category.name}>
                  <Link
                    href={category.href}
                    className="block text-lg font-medium text-gray-900 hover:text-pink-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                  {category.subcategories.length > 0 && (
                    <div className="ml-4 mt-2 space-y-2">
                      {category.subcategories.slice(0, 3).map((sub) => (
                        <Link
                          key={sub}
                          href={`${category.href}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block text-sm text-gray-600 hover:text-pink-600 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}