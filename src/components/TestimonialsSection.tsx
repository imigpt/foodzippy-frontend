import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    quote: 'The subscription tiffin service is a game-changer for hostelers 🍱✨ — fresh, homely food every day without the hassle 👌🏽.',
    name: 'Rahul Verma',
    role: 'MBA Student',
    initials: 'RV'
  },
  {
    quote: 'Late-night study sessions are so much better now with quick and affordable food delivery 🌙📚. Foodzippy actually understands student life 🍔⚡',
    name: 'Priya Sharma',
    role: 'Engineering Student',
    initials: 'PS'
  },
  {
    quote: 'Finally, a food delivery service that doesn’t burn a hole in my pocket. The quality is excellent and the delivery is super fast 😊.',
    name: 'Arjun Singh',
    role: 'Medical Student',
    initials: 'AS'
  }
];

function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-belgiano sm:text-4xl md:text-5xl font-bold text-purple-600 text-center mb-16">
          What Students Say About Us
        </h2>

        <div className="relative">
          <div className="bg-gray-100 rounded-3xl shadow-xl p-8 sm:p-12 md:p-16">
            <Quote size={48} className="text-yellow-500 mb-6 opacity-50" />

            <div className="transition-all duration-500">
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed italic">
                "{testimonials[currentIndex].quote}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {testimonials[currentIndex].initials}
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[currentIndex].role}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={goToPrevious}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-yellow-500 w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
