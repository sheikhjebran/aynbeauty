'use client'

import React from 'react'

const TypographyDemo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12 bg-white">
      {/* Hero Section with New Typography */}
      <section className="text-center space-y-6">
        <h1 className="heading-xl text-gray-900">
          AYN Beauty
        </h1>
        <p className="luxury-heading text-2xl">
          For every day, for every mood, for every you
        </p>
        <p className="body-lg text-gray-600 max-w-2xl mx-auto">
          Discover premium beauty products from top brands. Experience luxury cosmetics 
          with our advanced AI recommendations and virtual try-on technology.
        </p>
      </section>

      {/* Typography Showcase */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="heading-lg text-gray-900 mb-4">Typography Showcase</h2>
          <p className="body-md text-gray-600">
            Beautiful fonts that convey elegance and luxury for your beauty brand
          </p>
        </div>

        {/* Headings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="heading-md text-gray-900">Headings (Playfair Display)</h3>
            <div className="space-y-3">
              <h1 className="heading-xl text-gray-800">Heading XL</h1>
              <h2 className="heading-lg text-gray-800">Heading Large</h2>
              <h3 className="heading-md text-gray-800">Heading Medium</h3>
              <h4 className="heading-sm text-gray-800">Heading Small</h4>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="heading-md text-gray-900">Body Text (Poppins)</h3>
            <div className="space-y-3">
              <p className="body-lg text-gray-700">
                Large body text - Perfect for important descriptions and product details.
              </p>
              <p className="body-md text-gray-700">
                Medium body text - Ideal for general content and product information.
              </p>
              <p className="body-sm text-gray-700">
                Small body text - Great for fine print and secondary information.
              </p>
            </div>
          </div>
        </div>

        {/* Special Typography */}
        <div className="space-y-6 text-center">
          <h3 className="heading-md text-gray-900">Special Typography Effects</h3>
          
          <div className="space-y-4">
            <h2 className="elegant-text text-3xl text-gray-800">
              Elegant Beauty Collection
            </h2>
            
            <h2 className="luxury-heading text-4xl">
              Premium Luxury Line
            </h2>
            
            <p className="font-heading text-2xl font-light tracking-widest text-gray-700">
              SIGNATURE SERIES
            </p>
          </div>
        </div>

        {/* Product Card Example */}
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8">
          <h3 className="heading-md text-gray-900 mb-6">Sample Product Card</h3>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="space-y-4">
              <h4 className="font-heading text-xl font-semibold text-gray-900">
                Luminous Glow Foundation
              </h4>
              
              <p className="elegant-text text-lg text-pink-600">
                Premium Collection
              </p>
              
              <p className="body-md text-gray-600">
                Experience flawless coverage with our revolutionary foundation formula. 
                Enriched with natural ingredients for a luminous, healthy glow that lasts all day.
              </p>
              
              <div className="flex items-center justify-between">
                <span className="font-heading text-2xl font-bold text-gray-900">₹45.00</span>
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full font-body font-medium hover:from-pink-600 hover:to-purple-700 transition-all">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Example */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="heading-md text-white mb-4">Navigation Typography</h3>
          
          <nav className="space-y-3">
            <div className="flex flex-wrap gap-6">
              <a href="#" className="font-body text-white hover:text-pink-300 transition-colors">Makeup</a>
              <a href="#" className="font-body text-white hover:text-pink-300 transition-colors">Skincare</a>
              <a href="#" className="font-body text-white hover:text-pink-300 transition-colors">Fragrance</a>
              <a href="#" className="font-body text-white hover:text-pink-300 transition-colors">Hair Care</a>
              <a href="#" className="font-body text-white hover:text-pink-300 transition-colors">Tools & Brushes</a>
            </div>
          </nav>
        </div>

        {/* Feature Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <h4 className="font-heading text-lg font-semibold text-gray-900">Elegant & Readable</h4>
            <p className="body-sm text-gray-600">Playfair Display adds sophistication to headings while Poppins ensures excellent readability</p>
          </div>
          
          <div className="text-center space-y-3">
            <h4 className="font-heading text-lg font-semibold text-gray-900">Beauty Brand Perfect</h4>
            <p className="body-sm text-gray-600">Typography choices that convey luxury, elegance, and trust - perfect for beauty industry</p>
          </div>
          
          <div className="text-center space-y-3">
            <h4 className="font-heading text-lg font-semibold text-gray-900">Fast & Reliable</h4>
            <p className="body-sm text-gray-600">Local font loading with system fallbacks ensures fast loading and reliability</p>
          </div>
        </div>
      </section>

      {/* Usage Guide */}
      <section className="bg-gray-50 rounded-xl p-6">
        <h3 className="heading-md text-gray-900 mb-4">How to Use These Fonts</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <code className="bg-gray-200 px-2 py-1 rounded text-pink-600 font-mono">className="heading-xl"</code>
            <span className="text-gray-600">- Large hero headings</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <code className="bg-gray-200 px-2 py-1 rounded text-pink-600 font-mono">className="luxury-heading"</code>
            <span className="text-gray-600">- Special gradient headings</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <code className="bg-gray-200 px-2 py-1 rounded text-pink-600 font-mono">className="elegant-text"</code>
            <span className="text-gray-600">- Elegant product names/categories</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <code className="bg-gray-200 px-2 py-1 rounded text-pink-600 font-mono">className="body-md"</code>
            <span className="text-gray-600">- Regular content and descriptions</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <code className="bg-gray-200 px-2 py-1 rounded text-pink-600 font-mono">className="font-heading"</code>
            <span className="text-gray-600">- Apply Playfair Display to any element</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <code className="bg-gray-200 px-2 py-1 rounded text-pink-600 font-mono">className="font-body"</code>
            <span className="text-gray-600">- Apply Poppins to any element</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TypographyDemo