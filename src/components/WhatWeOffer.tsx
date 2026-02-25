import { Truck, CalendarDays, ShoppingBag, Car, Utensils } from 'lucide-react';

const services = [
  {
    icon: <Truck className="w-6 h-6 text-red-500" />,
    title: "Food Delivery",
    description: "Fast delivery to your doorstep",
    image: "/delivery.png"
  },
  {
    icon: <CalendarDays className="w-6 h-6 text-red-500" />,
    title: "Subscription",
    description: "Daily fresh homemade meals",
    image: "/Tiffin.png"
  },
  {
    icon: <ShoppingBag className="w-6 h-6 text-red-500" />,
    title: "Take away",
    description: "Order and collect at your convenience",
    image: "/foodpickup.png"
  },
  {
    icon: <Car className="w-6 h-6 text-red-500" />,
    title: "Drive-Thru",
    description: "Quick pickup without leaving your car",
    image: "/drivethru.png"
  },
  {
    icon: <Utensils className="w-6 h-6 text-red-500" />,
    title: "Dine In",
    description: "Enjoy meals at our partner restaurants",
    image: "/dinein.png"
  }
];

function WhatWeOffer() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-belgiano font-bold text-purple-600 mb-3">What We Offer</h2>
          <p className="text-lg text-gray-500">Multiple ways to enjoy delicious food - all in one app</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-white to-red-50 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden w-full"
              style={{ minHeight: '420px', maxWidth: '280px', margin: '0 auto' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {/* Full-image card: image fills whole card, title/description removed */}
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  onError={(e: any) => { e.currentTarget.src = 'https://via.placeholder.com/280x420?text=Image'; }}
                />

                <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  {service.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhatWeOffer;