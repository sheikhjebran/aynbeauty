'use client'

export function MobileTopShelf() {
  return (
    <section className="px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Shelf</h2>
        <p className="text-gray-600 text-sm">Premium luxury beauty products</p>
      </div>
      
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">👑</div>
        <h3 className="font-bold text-gray-900 mb-2">Top Shelf</h3>
        <p className="text-gray-600 text-sm mb-4">Luxury beauty for the ultimate experience</p>
        <button className="bg-primary-600 text-white px-6 py-2 rounded-full text-sm font-medium">
          Explore Luxury
        </button>
      </div>
    </section>
  )
}