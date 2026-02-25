import { Gift, Percent, Smartphone, BookOpen, GraduationCap, Star } from 'lucide-react';
import Footer from '../components/Footer';

const benefits = [
  {
    icon: <Percent className="w-8 h-8 text-white" />,
    title: 'Flat 20% Cashback',
    description: 'Get up to 20% cashback on every order you place through our app.',
  },
  {
    icon: <Gift className="w-8 h-8 text-white" />,
    title: 'Welcome Bonus',
    description: 'Earn ₹100 welcome cashback when you sign up with a valid student ID.',
  },
  {
    icon: <Star className="w-8 h-8 text-white" />,
    title: 'Exclusive Deals',
    description: 'Unlock student-only coupons and limited-time flash offers every week.',
  },
  {
    icon: <BookOpen className="w-8 h-8 text-white" />,
    title: 'Exam-Season Specials',
    description: 'Extra discounts during exam weeks to fuel your study sessions.',
  },
];

const steps = [
  {
    step: '1',
    title: 'Download the App',
    description: 'Get the Foodzippy app from Google Play or the App Store.',
  },
  {
    step: '2',
    title: 'Verify Student ID',
    description: 'Sign up and verify with your college email or student ID card.',
  },
  {
    step: '3',
    title: 'Order & Earn',
    description: 'Place orders and cashback is automatically credited to your wallet.',
  },
];

function StudentCashback() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF5F5] via-white to-[#FFFBEB] py-16 sm:py-24">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E82335]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#F7C150]/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#E82335]/10 text-[#E82335] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <GraduationCap className="w-4 h-4" />
                Exclusively for Students
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Save More,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E82335] to-[#F7C150]">
                  Eat Better
                </span>
              </h2>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                Get instant cashback on every food order. Because students deserve great food without breaking the bank!
              </p>

              {/* App download buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-black text-white px-6 py-3.5 rounded-xl hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
                >
                  <img
                    src="https://img.icons8.com/color/48/google-play.png"
                    alt="Google Play"
                    className="w-7 h-7"
                  />
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider opacity-80">Get it on</div>
                    <div className="text-base font-semibold -mt-0.5">Google Play</div>
                  </div>
                </a>

                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-black text-white px-6 py-3.5 rounded-xl hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
                >
                  <img
                    src="https://img.icons8.com/ios-filled/50/ffffff/mac-os.png"
                    alt="App Store"
                    className="w-7 h-7"
                  />
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider opacity-80">Download on the</div>
                    <div className="text-base font-semibold -mt-0.5">App Store</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Right illustration */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                {/* Phone mockup frame */}
                <div className="w-72 h-[520px] bg-gradient-to-br from-[#E82335] to-[#F7C150] rounded-[3rem] p-2 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="w-full h-full bg-white rounded-[2.5rem] flex flex-col items-center justify-center p-6">
                    <Smartphone className="w-16 h-16 text-[#E82335] mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Foodzippy</h3>
                    <p className="text-gray-500 text-center text-sm mb-6">Student Cashback Program</p>
                    <div className="bg-gradient-to-r from-[#E82335] to-[#F7C150] text-white text-3xl font-extrabold px-6 py-3 rounded-2xl shadow-lg">
                      20% OFF
                    </div>
                    <p className="text-gray-400 text-xs mt-4 text-center">On every order</p>
                  </div>
                </div>
                {/* Floating badges */}
                <div className="absolute -top-4 -left-8 bg-white shadow-lg rounded-2xl px-4 py-3 flex items-center gap-2 animate-bounce">
                  <Gift className="w-5 h-5 text-[#E82335]" />
                  <span className="text-sm font-semibold text-gray-700">₹100 Bonus</span>
                </div>
                <div className="absolute -bottom-4 -right-8 bg-white shadow-lg rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#F7C150]" />
                  <span className="text-sm font-semibold text-gray-700">Weekly Deals</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#E82335] mb-3">Why Students Love Us</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Exclusive perks designed for the student lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#E82335] to-[#F7C150] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#E82335] transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#FFF5F5] to-[#FFFBEB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#E82335] mb-3">How It Works</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Start saving in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="relative text-center">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#E82335] to-[#F7C150]" />
                )}
                <div className="relative z-10">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#E82335] to-[#F7C150] rounded-full flex items-center justify-center text-white text-2xl font-extrabold shadow-xl">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#E82335] to-[#F7C150]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-white/90 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Download the app now and get your ₹100 welcome cashback instantly!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl font-semibold"
            >
              <img
                src="https://img.icons8.com/color/48/google-play.png"
                alt="Google Play"
                className="w-7 h-7"
              />
              Google Play
            </a>

            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl font-semibold"
            >
              <img
                src="https://img.icons8.com/ios-filled/50/000000/mac-os.png"
                alt="App Store"
                className="w-7 h-7"
              />
              App Store
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default StudentCashback;
