import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, User, Mail, Phone, FileText } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

interface FormData {
  name: string;
  email: string;
  phone: string;
  description: string;
}

function FranchiseInquiry() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  
  // Background image selection:
  const [bgSrc, setBgSrc] = useState('/franchise.png');

  useEffect(() => {
    const img = new Image();
    img.src = '/franchise.jpg';
    img.onload = () => setBgSrc('/franchise.png');
    img.onerror = () => setBgSrc('/franchise.png');
  }, []);

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

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
      const response = await fetch(`${API_BASE_URL}/api/franchise-inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Log form data to console
        console.log('Franchise Inquiry Submitted:', formData);
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
      console.error('Error submitting franchise inquiry:', error);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
          backgroundImage: `url(${bgSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Semi-transparent overlay for better readability (reduced opacity, no blur) */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-white/10 to-red-50/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">

      {/* Page Title Section */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-century gothic">
            Franchise Inquiry
          </h1>
          <p className="text-gray-600 mt-2">
            Join the <span className="brand-font">Foodzippy</span> family! Fill out the form below and we'll get back to you soon.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto px-4 py-12">
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
                <h3 className="text-2xl font-bold text-gray-800 font-century gothic">
                  Thank You!
                </h3>
                <p className="text-gray-600 mt-2">
                  We've received your inquiry. Our team will contact you soon!
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  Redirecting to home page...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-[#E82335] mb-2 font-century gothic">
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
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 font-century gothic ${
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
                  <label className="block text-sm font-medium text-[#E82335] mb-2 font-century gothic">
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
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 font-century gothic ${
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
                  <label className="block text-sm font-medium text-[#E82335] mb-2 font-century gothic">
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
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 font-century gothic ${
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

                {/* Description Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-[#E82335] mb-2 font-century gothic">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText
                      size={18}
                      className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[#E82335] transition-colors"
                    />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder={"Tell us about yourself and why you're interested in a " + 'Foodzippy' + " franchise..."}
                      rows={5}
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 resize-none font-century gothic ${
                        errors.description
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-gray-200 focus:border-[#E82335]'
                      }`}
                    />
                  </div>
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1 animate-shake">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#E82335] to-[#F7C150] text-white py-4 rounded-xl font-semibold font-century gothic hover:shadow-lg hover:shadow-orange-200 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
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
          <h3 className="text-lg font-bold text-gray-800 font-century gothic mb-3">
            Why Partner with <span className="brand-font">Foodzippy</span>?
          </h3>
          <ul className="space-y-2 text-gray-600 font-century gothic">
            <li className="flex items-start gap-2">
              <span className="text-[#E82335] font-bold">✓</span>
              <span>Proven business model with strong ROI</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E82335] font-bold">✓</span>
              <span>Comprehensive training and support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E82335] font-bold">✓</span>
              <span>Marketing and brand recognition</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E82335] font-bold">✓</span>
              <span>Technology-driven operations</span>
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

export default FranchiseInquiry;
