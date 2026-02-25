import React from 'react';

function OurStoryPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">Our Story</h1>
        <div className="space-y-8">
          <div>
            <div className="w-16 h-16 bg-[#E82335] rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="text-xl font-bold font-century-gothic text-gray-900 mb-3">
              Built for Everyone Who Loves Good Food
            </h3>
            <p className="text-gray-600 font-century-gothic leading-relaxed">
              Great food shouldn’t depend on your schedule, budget, or location. Whether you’re studying late, working overtime, managing a busy household, or simply craving something delicious, Foodzippy is here to make ordering food easy, affordable, and reliable.
              <br />
              Foodzippy wasn’t created in a boardroom - it was born from real everyday experiences of people who struggled to find quality food at fair prices. We saw a system where customers paid more while local restaurants earned less. So we chose a different path: fair pricing, minimal commissions, and a platform built to support both customers and food partners.
              <br />
              Our goal is simple - make good food accessible to everyone, anytime, anywhere. Because no one should have to compromise between quality, convenience, and affordability.
            </p>
          </div>

          <div>
            <div className="w-16 h-16 bg-[#E82335] rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🇮🇳</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Proud Indian Startup from Uttar Pradesh</h3>
            <p className="text-gray-600 font-century-gothic leading-relaxed">
              Born in the heart of Uttar Pradesh, Foodzippy represents India’s entrepreneurial spirit and the power of local communities. We are committed to empowering neighborhood restaurants, cloud kitchens, and home chefs while serving people across campuses, offices, homes, and cities.
              <br />
              Our mission is to make food delivery more accessible, affordable, and dependable while helping small food businesses grow and thrive across India.
            </p>
          </div>

          <div>
            <div className="w-16 h-16 bg-[#E82335] rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-bold font-century-gothic text-gray-900 mb-3">Lowest Commission Promise</h3>
            <p className="text-gray-600 font-century-gothic leading-relaxed">
              Unlike traditional food delivery platforms that charge heavy commissions, Foodzippy operates on one of the lowest commission models in the industry. This allows restaurants to offer better prices while customers enjoy more value for their money.
              <br />
              We believe in a fair ecosystem where businesses succeed and customers benefit - creating a win-win experience for everyone.
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
            <p className="text-gray-700 text-center font-century-gothic font-medium">Join us in our mission to make quality food accessible to every student!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurStoryPage;
