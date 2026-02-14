import { Truck, CalendarDays, ShoppingBag, Car, Utensils } from 'lucide-react';

const services = [
  {
    icon: <Truck className="w-6 h-6 text-red-500" />,
    title: "Food Delivery",
    description: "Fast delivery to your doorstep"
  },
  {
    icon: <CalendarDays className="w-6 h-6 text-red-500" />,
    title: "Subscription Tiffin",
    description: "Daily fresh homemade meals"
  },
  {
    icon: <ShoppingBag className="w-6 h-6 text-red-500" />,
    title: "Food Pickup",
    description: "Order and collect at your convenience"
  },
  {
    icon: <Car className="w-6 h-6 text-red-500" />,
    title: "Drive-Thru",
    description: "Quick pickup without leaving your car"
  },
  {
    icon: <Utensils className="w-6 h-6 text-red-500" />,
    title: "Dine In",
    description: "Enjoy meals at our partner restaurants"
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
              className="bg-gradient-to-br from-white to-red-50 p-10 rounded-3xl shadow-md hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center"
              style={{ width: '280px', height: '340px', margin: '0 auto' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-500 text-base">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhatWeOffer;
