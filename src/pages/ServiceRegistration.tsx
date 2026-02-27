import { useState, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ServiceRegistrationForm from '../components/service/ServiceRegistrationForm';
import ValidationErrorModal from '../components/ValidationErrorModal';
import SuccessToast from '../components/SuccessToast';
import ErrorToast from '../components/ErrorToast';

export interface ServiceFormData {
  section7: {
    role?: 'agent' | 'employee';
  };
  section8: {
    // 1. Restaurant Information
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

    // 2. Restaurant Delivery Information
    deliveryChargeType: string;
    fixedCharge: string;
    dynamicCharge: string;
    storeCharge: string;
    deliveryRadius: string;
    minimumOrderPrice: string;

    // 3. Restaurant Admin Commission
    commissionRate: string;

    // 4. Restaurant Payout Information
    bankName: string;
    bankCode: string;
    recipientName: string;
    accountNumber: string;
    paypalId: string;
    upiId: string;

    // 5. Restaurant Address Information (Google Maps)
    searchLocation: string;
    fullAddress: string;
    pincode: string;
    landmark: string;
    latitude: string;
    longitude: string;
    city: string;
    state: string;
    mapType: 'roadmap' | 'satellite';

    // 6. Restaurant Login Information
    loginEmail: string;
    loginPassword: string;

    // 7. Categories
    categories: string[];
  };
}

type FormAction =
  | { type: 'UPDATE_SECTION'; section: keyof ServiceFormData; data: any }
  | { type: 'RESET_FORM' };

function formReducer(state: ServiceFormData, action: FormAction): ServiceFormData {
  switch (action.type) {
    case 'UPDATE_SECTION':
      return {
        ...state,
        [action.section]: {
          ...state[action.section],
          ...action.data,
        },
      };
    case 'RESET_FORM':
      return getInitialState();
    default:
      return state;
  }
}

function getInitialState(): ServiceFormData {
  return {
    section7: {
      role: 'agent',
    },
    section8: {
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
      deliveryChargeType: 'Fixed',
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
    },
  };
}

function ServiceRegistration() {
  const navigate = useNavigate();
  const [formData, dispatch] = useReducer(formReducer, getInitialState());
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sectionErrors, setSectionErrors] = useState<{ [key: number]: any }>({});
  const [isAgentAuthenticated, setIsAgentAuthenticated] = useState(false);
  const [agentLoginError, setAgentLoginError] = useState<string | undefined>(undefined);

  const totalSections = 2; // Only section 7 and section 8

  const updateSection = (section: keyof ServiceFormData, data: any) => {
    dispatch({ type: 'UPDATE_SECTION', section, data });
    // Clear errors for this section
    setSectionErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[currentSection];
      return newErrors;
    });
  };

  const handleAgentLogin = async (username: string, password: string, role: 'agent' | 'employee'): Promise<void> => {
    try {
      setAgentLoginError(undefined);

      const apiUrl = import.meta.env.VITE_API_URL || 'https://foodzippy-backend-h2ju.onrender.com';
      const endpoint = role === 'agent' ? '/api/users/agent/login' : '/api/users/employee/login';
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid credentials');
      }

      const data = await response.json();

      if (data.token) {
        const tokenKey = role === 'agent' ? 'agentToken' : 'employeeToken';
        const otherTokenKey = role === 'agent' ? 'employeeToken' : 'agentToken';
        
        // Clear the other role's token to prevent token conflicts
        localStorage.removeItem(otherTokenKey);
        
        // Set the current user's token
        localStorage.setItem(tokenKey, data.token);
        localStorage.setItem('userRole', role);
        setIsAgentAuthenticated(true);
        setAgentLoginError(undefined);
        
        // Redirect to appropriate dashboard after successful login
        const dashboardRoute = role === 'agent' ? '/agent/dashboard' : '/employee/dashboard';
        navigate(dashboardRoute);
      }
    } catch (error: any) {
      setAgentLoginError(error.message || 'Login failed. Please try again.');
      throw error;
    }
  };

  const validateCurrentSection = (): boolean => {
    let errors: any = {};

    if (currentSection === 1) {
      // Validate section 7

      if (!isAgentAuthenticated) {
        errors._general = 'Please login as agent to proceed';
      }
    } else if (currentSection === 2) {
      // Validate section 8
      if (!formData.section8.restaurantName.trim()) {
        errors.restaurantName = 'Restaurant name is required';
      }
      if (!formData.section8.mobileNumber.trim()) {
        errors.mobileNumber = 'Mobile number is required';
      }
      if (!formData.section8.loginEmail.trim()) {
        errors.loginEmail = 'Login email is required';
      }
      if (!formData.section8.loginPassword.trim()) {
        errors.loginPassword = 'Login password is required';
      }
      if (!formData.section8.fullAddress.trim()) {
        errors.fullAddress = 'Full address is required';
      }
      if (!formData.section8.latitude || !formData.section8.longitude) {
        errors._general = 'Please select a location on the map';
      }
    }

    if (Object.keys(errors).length > 0) {
      setSectionErrors((prev) => ({ ...prev, [currentSection]: errors }));
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentSection()) {
      setCurrentSection((prev) => Math.min(prev + 1, totalSections));
    }
  };

  const handlePrevious = () => {
    setCurrentSection((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateCurrentSection()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://foodzippy-backend-h2ju.onrender.com';
      const token = localStorage.getItem('agentToken');

      // Create FormData for multipart/form-data
      const submitData = new FormData();

      // Add section8 data
      if (formData.section8.restaurantImage) {
        submitData.append('restaurantImage', formData.section8.restaurantImage);
      }

      // Add all other section8 fields as JSON
      const section8Data = {
        restaurantName: formData.section8.restaurantName,
        restaurantStatus: formData.section8.restaurantStatus,
        rating: formData.section8.rating,
        approxDeliveryTime: formData.section8.approxDeliveryTime,
        approxPriceForTwo: formData.section8.approxPriceForTwo,
        certificateCode: formData.section8.certificateCode,
        mobileNumber: formData.section8.mobileNumber,
        shortDescription: formData.section8.shortDescription,
        services: formData.section8.services,
        isPureVeg: formData.section8.isPureVeg,
        isPopular: formData.section8.isPopular,
        deliveryChargeType: formData.section8.deliveryChargeType,
        fixedCharge: formData.section8.fixedCharge,
        dynamicCharge: formData.section8.dynamicCharge,
        storeCharge: formData.section8.storeCharge,
        deliveryRadius: formData.section8.deliveryRadius,
        minimumOrderPrice: formData.section8.minimumOrderPrice,
        commissionRate: formData.section8.commissionRate,
        bankName: formData.section8.bankName,
        bankCode: formData.section8.bankCode,
        recipientName: formData.section8.recipientName,
        accountNumber: formData.section8.accountNumber,
        paypalId: formData.section8.paypalId,
        upiId: formData.section8.upiId,
        fullAddress: formData.section8.fullAddress,
        pincode: formData.section8.pincode,
        landmark: formData.section8.landmark,
        latitude: formData.section8.latitude,
        longitude: formData.section8.longitude,
        city: formData.section8.city,
        state: formData.section8.state,
        loginEmail: formData.section8.loginEmail,
        loginPassword: formData.section8.loginPassword,
        categories: formData.section8.categories,
      };

      Object.keys(section8Data).forEach((key) => {
        const value = (section8Data as any)[key];
        if (Array.isArray(value)) {
          submitData.append(key, JSON.stringify(value));
        } else {
          submitData.append(key, value);
        }
      });

      const response = await fetch(`${apiUrl}/api/vendor/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit service registration');
      }

      // Success
      setShowSuccessToast(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to submit registration. Please try again.');
      setShowErrorToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">


      {/* Progress Indicator */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            {[1, 2].map((section, index) => (
              <div key={section} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentSection === section
                      ? 'bg-red-600 text-white'
                      : currentSection > section
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {section}
                </div>
                {index < 1 && (
                  <div
                    className={`w-24 h-1 mx-2 transition-colors ${
                      currentSection > section ? 'bg-green-500' : 'bg-slate-200'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-slate-600">
              Step {currentSection} of {totalSections}
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <ServiceRegistrationForm
            currentSection={currentSection}
            formData={formData}
            onUpdateSection={updateSection}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
            sectionErrors={sectionErrors}
            onAgentLogin={handleAgentLogin}
            isAgentAuthenticated={isAgentAuthenticated}
            agentLoginError={agentLoginError}
          />
        </div>
      </div>

      {/* Modals and Toasts */}
      <ValidationErrorModal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        errors={validationErrors}
      />
      {showSuccessToast && (
        <SuccessToast
          message="Service registered successfully!"
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

export default ServiceRegistration;
