// City-specific landmark icons (white on gradient background)
const cities = [
  { name: 'Noida', iconSrc: 'https://img.icons8.com/ios-filled/100/ffffff/city-buildings.png' },
  { name: 'Lucknow', iconSrc: 'https://img.icons8.com/ios-filled/100/ffffff/mosque.png' },
  { name: 'Agra', iconSrc: 'https://img.icons8.com/ios-filled/100/ffffff/taj-mahal.png' },
  { name: 'Prayagraj', iconSrc: 'https://img.icons8.com/ios-filled/100/ffffff/water.png' },
  { name: 'Varanasi (Banaras)', iconSrc: 'https://img.icons8.com/ios-filled/100/ffffff/temple.png' },
  { name: 'Ghaziabad', iconSrc: 'https://img.icons8.com/ios-filled/100/ffffff/factory.png' },
];

function CitiesWeServe() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#E82335] mb-3">
            Cities We Serve soon
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are currently delivering in the following cities across Uttar Pradesh
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, index) => {
            return (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#E82335] to-[#F7C150] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={city.iconSrc}
                      alt={`${city.name} icon`}
                      className="w-7 h-7 object-contain"
                      onError={(e: any) => { e.currentTarget.src = '/icons/placeholder-city.png'; }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#E82335] transition-colors duration-300">
                      {city.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Now Available</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CitiesWeServe;
