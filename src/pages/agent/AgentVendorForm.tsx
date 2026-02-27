import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Section8 from '../../components/franchise/sections/Section8';
import VendorReviewSection, { ReviewData } from '../../components/VendorReviewSection';
import SuccessToast from '../../components/SuccessToast';
import ErrorToast from '../../components/ErrorToast';

interface Section8Data {
  restaurantName: string;
  restaurantImage: File | null;
  restaurantStatus: string;
  rating: string;
  approxDeliveryTime: string;
  approxPriceForTwo: string;
  certificateCode: string;
  mobileNumber: string;
  shortDescription: string;
  services: string[];
  isPureVeg: boolean;
  isPopular: boolean;
  deliveryChargeType: string;
  fixedCharge: string;
  dynamicCharge: string;
  storeCharge: string;
  deliveryRadius: string;
  minimumOrderPrice: string;
  commissionRate: string;
  bankName: string;
  bankCode: string;
  recipientName: string;
  accountNumber: string;
  paypalId: string;
  upiId: string;
  searchLocation: string;
  fullAddress: string;
  pincode: string;
  landmark: string;
  latitude: string;
  longitude: string;
  city: string;
  state: string;
  mapType: 'roadmap' | 'satellite';
  loginEmail: string;
  loginPassword: string;
  categories: string[];
}

function AgentVendorForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEmployee = location.pathname.includes('/employee');
  const tokenKey = isEmployee ? 'employeeToken' : 'agentToken';
  const dashboardRoute = isEmployee ? '/employee/dashboard' : '/agent/dashboard';
  
  const [formData, setFormData] = useState<Section8Data>({
    restaurantName: '',
    restaurantImage: null,
    restaurantStatus: 'Active',
    rating: '4.0',
    approxDeliveryTime: '',
    approxPriceForTwo: '',
    certificateCode: '',
    mobileNumber: '',
    shortDescription: '',
    services: [],
    isPureVeg: false,
    isPopular: false,
    deliveryChargeType: 'fixed',
    fixedCharge: '',
    dynamicCharge: '',
    storeCharge: '',
    deliveryRadius: '',
    minimumOrderPrice: '',
    commissionRate: '',
    bankName: '',
    bankCode: '',
    recipientName: '',
    accountNumber: '',
    paypalId: '',
    upiId: '',
    searchLocation: '',
    fullAddress: '',
    pincode: '',
    landmark: '',
    latitude: '',
    longitude: '',
    city: '',
    state: '',
    mapType: 'roadmap',
    loginEmail: '',
    loginPassword: '',
    categories: [],
  });

  const [reviewData, setReviewData] = useState<ReviewData>({
    followUpDate: '',
    convincingStatus: '',
    behavior: '',
    audioUrl: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [reviewErrors, setReviewErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const updateFormData = (data: Partial<Section8Data>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    // Clear errors for updated fields
    const updatedFields = Object.keys(data);
    setErrors((prev: any) => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => delete newErrors[field]);
      return newErrors;
    });
  };

  const updateReviewData = (data: Partial<ReviewData>) => {
    setReviewData((prev) => ({ ...prev, ...data }));
    // Clear errors for updated fields
    const updatedFields = Object.keys(data);
    setReviewErrors((prev: any) => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => delete newErrors[field]);
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};

    // Only 3 fields are mandatory for vendor basic info
    if (!formData.restaurantName.trim()) {
      newErrors.restaurantName = 'Restaurant name is required';
    }
    if (!formData.restaurantImage) {
      newErrors.restaurantImage = 'Restaurant image is required';
    }
    if (!formData.fullAddress.trim()) {
      newErrors.fullAddress = 'Full address is required';
    }
    if (!formData.latitude || !formData.longitude) {
      newErrors._general = 'Please select a location on the map';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateReview = (): boolean => {
    const newErrors: any = {};

    if (!reviewData.followUpDate) {
      newErrors.followUpDate = 'Follow-up date is required';
    }
    if (!reviewData.convincingStatus) {
      newErrors.convincingStatus = 'Convincing status is required';
    }
    if (!reviewData.behavior) {
      newErrors.behavior = 'Behavior selection is required';
    }

    setReviewErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Validate both vendor form and review section
    const isVendorValid = validateForm();
    const isReviewValid = validateReview();

    if (!isVendorValid || !isReviewValid) {
      setErrorMessage('Please fill all required fields in both sections');
      setShowErrorToast(true);
      // Scroll to first error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const token = localStorage.getItem(tokenKey);
    if (!token) {
      navigate('/service-registration');
      return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      // Create FormData for multipart/form-data
      const submitData = new FormData();

      // Add image if exists
      if (formData.restaurantImage) {
        submitData.append('restaurantImage', formData.restaurantImage);
      }

      // Add all vendor fields
      Object.keys(formData).forEach((key) => {
        if (key !== 'restaurantImage') {
          const value = (formData as any)[key];
          if (Array.isArray(value)) {
            submitData.append(key, JSON.stringify(value));
          } else if (value !== null && value !== undefined && value !== '') {
            submitData.append(key, value.toString());
          }
        }
      });

      // Add review data as JSON string
      submitData.append('review', JSON.stringify(reviewData));

      const response = await fetch(`${apiUrl}/api/vendors/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register vendor');
      }

      setShowSuccessToast(true);
      setTimeout(() => {
        navigate(isEmployee ? '/employee/requests' : '/agent/requests');
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to register vendor. Please try again.');
      setShowErrorToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="shadow-md sticky top-0 z-40" style={{ backgroundColor: '#F7C150' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(dashboardRoute)}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            >
              <img 
                src="/foodzip2.png" 
                alt="Foodzippy Logo" 
                className="h-24 w-auto"
              />
            </button>
            
            <h1 className="text-2xl font-bold text-slate-900 absolute left-1/2 transform -translate-x-1/2">Register Vendor</h1>
            
            <button
              onClick={() => navigate(dashboardRoute)}
              className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors"
            >
              <span className="font-medium">Back to Dashboard</span>
              <ChevronLeft size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Vendor Basic Info Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <div className="border-b-2 border-slate-200 pb-3 mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm">STEP 1</span>
              Restaurant Information
            </h2>
            <p className="text-slate-600 mt-2">
              <span className="text-red-500 font-semibold">Required:</span> Restaurant Name, Image, and Address
              <br />
              <span className="text-slate-500">Fill other fields if you have the information</span>
            </p>
          </div>
          
          <Section8
            data={formData}
            onUpdate={updateFormData}
            errors={errors}
          />
        </div>

        {/* Review Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <VendorReviewSection
            data={reviewData}
            onUpdate={updateReviewData}
            errors={reviewErrors}
          />
        </div>

        {/* Submit Button */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed text-lg shadow-lg"
          >
            {isSubmitting ? 'Registering Vendor...' : 'Submit Vendor Registration'}
          </button>
          <p className="text-center text-sm text-slate-500 mt-3">
            Please review all information before submitting
          </p>
        </div>
      </div>

      {/* Toasts */}
      {showSuccessToast && (
        <SuccessToast
          message="Vendor registered successfully!"
          onClose={() => setShowSuccessToast(false)}
        />
      )}
      {showErrorToast && (
        <ErrorToast
          message={errorMessage}
          onClose={() => setShowErrorToast(false)}
        />
      )}
    </div>
  );
}

export default AgentVendorForm;
