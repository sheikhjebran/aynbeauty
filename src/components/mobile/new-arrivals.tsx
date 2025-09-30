'use client'

export function MobileNewArrivals() {
  return (
    <section className="px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">New Arrivals</h2>
        <p className="text-gray-600 text-sm">Be the first to try the latest products</p>
      </div>
      
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">🆕</div>
        <h3 className="font-bold text-gray-900 mb-2">New Arrivals</h3>
        <p className="text-gray-600 text-sm mb-4">Fresh products arriving daily</p>
        <button className="bg-primary-600 text-white px-6 py-2 rounded-full text-sm font-medium">
          See What's New
        </button>
      </div>
    </section>
  )
}