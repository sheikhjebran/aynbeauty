'use client'

export function MobileBrands() {
  const brands = [
    { name: "L'Oreal Paris", logo: '🌟' },
    { name: 'FENTY BEAUTY', logo: '👑' },
    { name: 'Maybelline', logo: '💫' },
    { name: 'MAC', logo: '🎨' },
    { name: 'Huda Beauty', logo: '✨' },
    { name: 'Charlotte Tilbury', logo: '💎' }
  ]

  return (
    <section className="px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Brands</h2>
        <p className="text-gray-600 text-sm">Shop from your favorite beauty brands</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {brands.map((brand) => (
          <div key={brand.name} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">{brand.logo}</div>
            <p className="text-xs font-medium text-gray-900">{brand.name}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-primary-600 font-medium text-sm">View All Brands</button>
      </div>
    </section>
  )
}