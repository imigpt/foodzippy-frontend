import { Users, Store, Package, MapPin } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface Stat {
  icon: typeof Users;
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { icon: Users, value: 1500, suffix: '+', label: 'Happy Students' },
  { icon: Store, value: 100, suffix: '+', label: 'Partner Restaurants' },
  { icon: Package, value: 5000, suffix: '+', label: 'Orders Delivered' },
  { icon: MapPin, value: 5, suffix: '', label: 'Cities Going Live Soon' }
];

function StatsSection() {
  const [counts, setCounts] = useState<number[]>(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            const duration = 2000;
            const startTime = performance.now();
            let animationFrameId: number;

            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);

              setCounts(
                stats.map((stat) => Math.floor(stat.value * progress))
              );

              if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
              }
            };

            animationFrameId = requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-[#E82335]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white bg-opacity-100 rounded-full mb-4">
                  <Icon size={32} className="text-red-500" />
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                  {counts[index].toLocaleString()}{stat.suffix}
                </div>
                <div className="text-sm sm:text-base text-white font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
