import { Search, ShoppingCart, Clock } from 'lucide-react';
import { useEffect, useRef } from 'react';

const steps = [
  {
    icon: <Search className="w-12 h-12 text-red-500" strokeWidth={1.5} />,
    number: '01',
    title: 'Select Restaurant',
    description: 'Browse through our curated selection of restaurants and explore their delicious menus.'
  },
  {
    icon: <ShoppingCart className="w-12 h-12 text-red-500" strokeWidth={1.5} />,
    number: '02',
    title: 'Select Menu',
    description: 'Choose your favorite dishes, customize your order, and add them to your cart.'
  },
  {
    icon: <Clock className="w-12 h-12 text-red-500" strokeWidth={1.5} />,
    number: '03',
    title: 'Wait for Delivery',
    description: 'Sit back and relax while we prepare and deliver your food fresh and hot to your doorstep.'
  }
];

function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll<HTMLDivElement>('.step-card');
      cards.forEach((card, index) => {
        card.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-500', 'ease-out');
        card.style.transitionDelay = `${index * 150}ms`;
        observer.observe(card);
      });
    }

    return () => {
      if (sectionRef.current) {
        const cards = sectionRef.current.querySelectorAll<HTMLDivElement>('.step-card');
        cards.forEach(card => observer.unobserve(card));
      }
    };
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-belgiano font-bold text-purple-600 mb-3">How It Works</h1>
          <p className="text-lg text-gray-500">Get your favorite food in three simple steps</p>
        </div>
        
        <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="step-card flex flex-col items-center text-center px-4"
            >
              <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <span className="text-5xl font-semibold text-pink-400 mb-2">{step.number}</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
