'use client'

export function DesktopTopShelf() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Top Shelf</h2>
          <p className="text-lg text-gray-600">Premium collection coming soon...</p>
        </div>
      </div>
    </section>
  )
}

// Export alias for convenience
export { DesktopTopShelf as TopShelf }