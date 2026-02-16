import { X } from 'lucide-react';
import { useEffect } from 'react';

interface OurStoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function OurStoryPanel({ isOpen, onClose }: OurStoryPanelProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[640px] md:w-[720px] lg:w-[900px] bg-white shadow-2xl z-50 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Our Story</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={24} className="text-gray-700" />
            </button>
          </div>

          <div className="px-6 py-8 space-y-8">
            <div>
              <div className="w-16 h-16 bg-[#E82335] rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-bold font-century-gothic text-gray-900 mb-3">
                Built for Everyone Who Loves Good Food
              </h3>
              <p className="text-gray-600 font-century-gothic leading-relaxed">
              Great food shouldn’t depend on your schedule, budget, or location. Whether you’re studying late, working overtime, managing a busy household, or simply craving something delicious, Foodzippy is here to make ordering food easy, affordable, and reliable.
              <br></br>
              Foodzippy wasn’t created in a boardroom - it was born from real everyday experiences of people who struggled to find quality food at fair prices. We saw a system where customers paid more while local restaurants earned less. So we chose a different path: fair pricing, minimal commissions, and a platform built to support both customers and food partners.
              <br></br>
              Our goal is simple - make good food accessible to everyone, anytime, anywhere. Because no one should have to compromise between quality, convenience, and affordability.
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-[#E82335] rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🇮🇳</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Proud Indian Startup from Uttar Pradesh
              </h3>
              <p className="text-gray-600 font-century-gothic leading-relaxed">
              Born in the heart of Uttar Pradesh, Foodzippy represents India’s entrepreneurial spirit and the power of local communities. We are committed to empowering neighborhood restaurants, cloud kitchens, and home chefs while serving people across campuses, offices, homes, and cities.
              <br></br>
              Our mission is to make food delivery more accessible, affordable, and dependable while helping small food businesses grow and thrive across India.
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-[#E82335] rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold font-century-gothic text-gray-900 mb-3">
                Lowest Commission Promise
              </h3>
              <p className="text-gray-600 font-century-gothic leading-relaxed">
              Unlike traditional food delivery platforms that charge heavy commissions, Foodzippy operates on one of the lowest commission models in the industry. This allows restaurants to offer better prices while customers enjoy more value for their money.
              <br></br>
              We believe in a fair ecosystem where businesses succeed and customers benefit - creating a win-win experience for everyone.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
              <p className="text-gray-700 text-center font-century-gothic font-medium">
                Join us in our mission to make quality food accessible to every student!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OurStoryPanel;
