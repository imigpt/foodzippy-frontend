import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, User, Mail, Phone, MapPin, Building2, ArrowLeft, IndianRupee } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  companyName: string;
  investorAmount: string;
}

function InvestorInquiry() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    companyName: '',
    investorAmount: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  
  // Background colors (RED first, YELLOW second) - same as main navbar
  const colors = ['#E82335', '#F7C150'];
  const [bgIndex, setBgIndex] = useState(0);

  // AUTO CHANGE BG
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((i) => (i + 1) % colors.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // AUTO TEXT COLOR (RED BG → WHITE TEXT, YELLOW BG → BLACK TEXT)
  const textColor = bgIndex === 0 ? "text-white" : "text-black";

  // Pick the correct logo based on background color
  const logoSrc = bgIndex === 1 ? "/foodzip2.png" : "/foodzip1.png";

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    // Investment amount (required, INR format)
    if (!formData.investorAmount || !formData.investorAmount.trim()) {
      newErrors.investorAmount = 'Investment amount is required';
    } else {
      const amt = formData.investorAmount.replace(/[^\d.]/g, '');
      if (!/^\d+(\.\d{1,2})?$/.test(amt)) {
        newErrors.investorAmount = 'Please enter a valid amount in INR';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Submit to backend API
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/investor-inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Log form data to console
        console.log('Investor Inquiry Submitted:', formData);
        console.log('Response:', data);

        setIsSubmitted(true);

        // Auto redirect to home after success message
        setTimeout(() => {
          navigate('/');
        }, 2500);
      } else {
        throw new Error(data.message || 'Failed to submit inquiry');
      }
    } catch (error) {
      console.error('Error submitting investor inquiry:', error);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/investor.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Semi-transparent overlay for readability (reduced opacity) */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-white/10 to-red-50/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navbar - Same as Home Page */}
        <nav
          className="sticky top-0 z-50 transition-colors duration-500"
          style={{ backgroundColor: colors[bgIndex] }}
        >
        <div className="max-w-8xl mx-auto px-6 sm:px-7 lg:px-9">
          <div className="flex justify-between items-center h-24 py-2">
            {/* LOGO */}
            <div className="flex-shrink-0">
              <img
                src={logoSrc}
                alt="Foodzippy logo"
                className="h-28 sm:h-32 md:h-40 w-auto object-contain transition-all duration-300 cursor-pointer"
                loading="lazy"
                onClick={() => navigate('/')}
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement;
                  el.onerror = null;
                  el.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="48" viewBox="0 0 160 48"><rect width="100%" height="100%" fill="%23F59E0B" rx="8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="18" fill="white">Foodzippy</text></svg>'
                  );
                }}
              />
            </div>

            {/* Back to Home Button */}
            <button
              onClick={() => navigate('/')}
              className={`${textColor} hover:bg-white/20 px-6 py-3 rounded-full transition-all duration-300 font-montserrat font-medium flex items-center gap-2`}
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Page Title Section */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-montserrat">
            Investor Inquiry
          </h1>
          <p className="text-gray-600 mt-2 font-montserrat">
            Interested in investing with Foodzippy? Fill out the form below and our team will get in touch with you.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Decorative Top */}
          <div className="h-2 bg-gradient-to-r from-[#E82335] to-[#F7C150]" />

          {/* Form Body */}
          <div className="p-6 md:p-10">
            {isSubmitted ? (
              <div className="text-center py-8 animate-fade-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
                  <svg
                    className="w-10 h-10 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 font-montserrat">
                  Thank You!
                </h3>
                <p className="text-gray-600 mt-2">
                  We've received your inquiry. Our investment team will contact you soon!
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  Redirecting to home page...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-[#E82335] mb-2 font-montserrat">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E82335] transition-colors"
                    />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 font-montserrat ${
                        errors.name
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-gray-200 focus:border-[#E82335]'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 animate-shake">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-[#E82335] mb-2 font-montserrat">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E82335] transition-colors"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 font-montserrat ${
                        errors.email
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-gray-200 focus:border-[#E82335]'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 animate-shake">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-[#E82335] mb-2 font-montserrat">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E82335] transition-colors"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 font-montserrat ${
                        errors.phone
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-gray-200 focus:border-[#E82335]'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 animate-shake">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* City and State in Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* City Field */}
                  <div className="group">
                    <label className="block text-sm font-medium text-[#E82335] mb-2 font-montserrat">
                      City <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E82335] transition-colors"
                      />
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Your city"
                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 font-montserrat ${
                          errors.city
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-gray-200 focus:border-[#E82335]'
                        }`}
                      />
                    </div>
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1 animate-shake">
                        {errors.city}
                      </p>
                    )}
                  </div>

                  {/* State Field */}
                  <div className="group">
                    <label className="block text-sm font-medium text-[#E82335] mb-2 font-montserrat">
                      State <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E82335] transition-colors"
                      />
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Your state"
                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 font-montserrat ${
                          errors.state
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-gray-200 focus:border-[#E82335]'
                        }`}
                      />
                    </div>
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1 animate-shake">
                        {errors.state}
                      </p>
                    )}
                  </div>
                </div>

                {/* Company Name Field (Optional) */}
                <div className="group">
                  <label className="block text-sm font-medium text-[#E82335] mb-2 font-montserrat">
                    Company Name <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Building2
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E82335] transition-colors"
                    />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Your company name (if applicable)"
                      className="w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 font-montserrat border-gray-200 focus:border-[#E82335]"
                    />
                  </div>
                </div>

                {/* Investor Amount Field (Required, INR) */}
                <div className="group">
                  <label className="block text-sm font-medium text-[#E82335] mb-2 font-montserrat">
                    Investment Amount <span className="text-red-500">*</span> <span className="text-gray-400 text-xs"></span>
                  </label>
                  <div className="relative">
                    <IndianRupee
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E82335] transition-colors"
                    />
                    <input
                      type="text"
                      name="investorAmount"
                      value={formData.investorAmount}
                      onChange={handleChange}
                      placeholder="Intended investment amount (INR ₹)"
                      className="w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 font-montserrat border-gray-200 focus:border-[#E82335]"
                    />
                  </div>
                  {errors.investorAmount && (
                    <p className="text-red-500 text-sm mt-1 animate-shake">
                      {errors.investorAmount}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#E82335] to-[#F7C150] text-white py-4 rounded-xl font-semibold font-montserrat hover:shadow-lg hover:shadow-orange-200 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 font-montserrat mb-3">
            Why Invest with Foodzippy?
          </h3>
          <ul className="space-y-2 text-gray-600 font-montserrat">
            <li className="flex items-start gap-2">
              <span className="text-[#E82335] font-bold">✓</span>
              <span>Rapidly growing food delivery market</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E82335] font-bold">✓</span>
              <span>Innovative technology platform</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E82335] font-bold">✓</span>
              <span>Proven business model with strong returns</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E82335] font-bold">✓</span>
              <span>Expanding network across multiple cities</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
      </div>
    </div>
  );
}

export default InvestorInquiry;
