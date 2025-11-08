'use client'

import Link from 'next/link'

export function MobileFooter() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Track Order', href: '/track-order' },
    { name: 'Help Center', href: '/help' },
    { name: 'Returns', href: '/returns' },
    { name: 'Shipping Info', href: '/shipping' }
  ]

  const categories = [
    { name: 'Skincare', href: '/categories/skincare' },
    { name: 'Lips', href: '/categories/lips' },
    { name: 'Bath & Body', href: '/categories/bath-and-body' },
    { name: 'Fragrances', href: '/categories/fragrance' },
    { name: 'Eyes', href: '/categories/eyes' },
    { name: 'Nails', href: '/categories/nails' },
    { name: 'Combo Sets', href: '/categories/combo-sets' }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="px-4 py-8 border-b border-gray-800">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
          <p className="text-gray-400 text-sm mb-6">
            Get exclusive offers and beauty tips
          </p>
          <div className="flex max-w-sm mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 rounded-l-full bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-400 text-sm"
            />
            <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-r-full font-semibold transition-colors text-sm">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Categories</h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* App Download */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <h4 className="font-semibold text-white mb-3 text-sm">Download Our App</h4>
          <div className="flex space-x-3">
            <button className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-3 hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <div className="text-2xl mr-3">📱</div>
                <div className="text-left">
                  <p className="text-xs text-gray-400">Download on</p>
                  <p className="font-semibold text-sm">App Store</p>
                </div>
              </div>
            </button>
            <button className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-3 hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <div className="text-2xl mr-3">🤖</div>
                <div className="text-left">
                  <p className="text-xs text-gray-400">Get it on</p>
                  <p className="font-semibold text-sm">Google Play</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h5 className="font-semibold text-white text-sm mb-1">100% Authentic</h5>
              <p className="text-gray-400 text-xs">Direct from brands</p>
            </div>
            <div>
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h5 className="font-semibold text-white text-sm mb-1">Free Shipping</h5>
              <p className="text-gray-400 text-xs">On orders ₹299+</p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <h4 className="font-semibold text-white mb-3 text-sm">Follow Us</h4>
          <div className="flex space-x-4 justify-center">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.756-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 px-4 py-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="ml-2 text-lg font-bold gradient-text">AynBeauty</span>
          </div>
          <p className="text-gray-400 text-xs mb-3">
            © {currentYear} AynBeauty. All rights reserved.| developer: sheikhjebran@gmail.com
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <Link href="/privacy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}