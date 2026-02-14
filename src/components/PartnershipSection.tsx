import { Bike, Store } from 'lucide-react';

interface PartnerCard {
  icon: typeof Bike;
  title: string;
  description: string;
  color: string;
}

const partners: PartnerCard[] = [
  {
    icon: Bike,
    title: 'Join as Delivery Partner',
    description: 'Earn flexible income by delivering happiness to students.',
    color: 'from-blue-400 to-blue-600'
  },
  {
    icon: Store,
    title: 'Join as Restaurant Partner',
    description: 'Reach thousands of students with the lowest commission rates.',
    color: 'from-orange-400 to-red-600'
  }
];

function PartnershipSection() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-belgiano sm:text-4xl md:text-5xl font-bold text-purple-600 mb-4">
            Want to Join us?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Grow your business with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {partners.map((partner, index) => {
            const Icon = partner.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div className={`h-48 bg-gradient-to-br ${partner.color} flex items-center justify-center`}>
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
                    <Icon size={48} className="text-red" />
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {partner.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {partner.description}
                  </p>
                  <button className="bg-yellow-500 text-white px-6 py-3 rounded-full hover:bg-yellow-600 transition-all duration-200 transform hover:scale-105 font-semibold">
                    Learn More
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PartnershipSection;
