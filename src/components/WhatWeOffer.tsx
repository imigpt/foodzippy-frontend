import { Truck, CalendarDays, ShoppingBag, Car, Utensils } from 'lucide-react';

const services = [
  {
    icon: <Truck className="w-6 h-6 text-red-500" />,
    title: "Food Delivery",
    description: "Fast delivery to your doorstep",
    image: "/delivery.jpg"
  },
  {
    icon: <CalendarDays className="w-6 h-6 text-red-500" />,
    title: "Subscription Tiffin",
    description: "Daily fresh homemade meals",
    image: "/subscriptionTiffin.jpg"
  },
  {
    icon: <ShoppingBag className="w-6 h-6 text-red-500" />,
    title: "Food Pickup",
    description: "Order and collect at your convenience",
    image: "/delivery2.jpg"
  },
  {
    icon: <Car className="w-6 h-6 text-red-500" />,
    title: "Drive-Thru",
    description: "Quick pickup without leaving your car",
    image: "/drivethru.jpg"
  },
  {
    icon: <Utensils className="w-6 h-6 text-red-500" />,
    title: "Dine In",
    description: "Enjoy meals at our partner restaurants",
    image: "/dinein.jpg"
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-white to-red-50 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden"
              style={{ width: '280px', minHeight: '420px', margin: '0 auto' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {/* Image Section */}
              <div className="relative w-full h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  onError={(e: any) => { e.currentTarget.src = 'https://via.placeholder.com/280x180?text=Image'; }}
                />

                {/* Marble-style overlay to improve contrast and give a professional look */}
                <div className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none">
                  <div
                    style={{
                      height: '100%',
                      background: 'linear-gradient(180deg, rgba(12,12,16,0.54), rgba(250,250,255,0.06) 30%, transparent 70%), radial-gradient(60% 120% at 12% 28%, rgba(255,255,255,0.22), transparent 30%), radial-gradient(40% 90% at 88% 72%, rgba(255,255,255,0.16), transparent 30%)',
                      mixBlendMode: 'overlay',
                    }}
                  />
                </div>

                <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  {service.icon}
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-6 flex flex-col items-center text-center flex-grow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhatWeOffer;
