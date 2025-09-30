'use client'

export function DesktopFeaturedProducts() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-lg text-gray-600">Coming soon...</p>
        </div>
      </div>
    </section>
  )
}

// Export alias for convenience
export { DesktopFeaturedProducts as FeaturedProducts }