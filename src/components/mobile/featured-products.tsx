'use client'

export function MobileFeaturedProducts() {
  return (
    <section className="px-4 py-6 bg-gray-50">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Products</h2>
        <p className="text-gray-600 text-sm">Handpicked favorites just for you</p>
      </div>
      
      <div className="bg-white rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">🎯</div>
        <h3 className="font-bold text-gray-900 mb-2">Featured Products</h3>
        <p className="text-gray-600 text-sm mb-4">Coming soon with personalized recommendations</p>
        <button className="bg-primary-600 text-white px-6 py-2 rounded-full text-sm font-medium">
          Explore Now
        </button>
      </div>
    </section>
  )
}