import { useState, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import RegistrationLanding from '../components/franchise/RegistrationLanding';
import RegistrationForm from '../components/franchise/RegistrationForm';
import ValidationErrorModal from '../components/ValidationErrorModal';
import SuccessToast from '../components/SuccessToast';
import ErrorToast from '../components/ErrorToast';
import { validateSection1, validateSection2, validateSection3, validateSection4, validateSection5, validateSection6, validateSection7, validateSection8 } from '../utils/sectionValidation';
import { API_BASE_URL } from '../utils/api';

export interface FormData {
  section1: {
    restaurantName: string;
    restaurantAddress: string;
    landmark: string;
    gstNumber: string;
    fssaiNumber: string;
    yearStarted: string;
    avgOrdersPerDay: string;
  };
  section2: {
    ownerName: string;
    ownerEmail: string;
    ownerMobile: string;
    additionalMobile: string;
  };
  section3: {
    primaryContactName: string;
    primaryContactMobile: string;
    alternateContactNumber: string;
    preferredOrderMethod: string;
    nextFollowUpDate: string;
  };
  section4: {
    documentSubmissionMethod: string;
  };
  section5: {
    accountHolderName: string;
    bankAccountNumber: string;
    bankName: string;
    ifscCode: string;
  };
  section6: {
    zomatoListed: string;
    zomatoMonths: string;
    swiggyListed: string;
    swiggyMonths: string;
  };
  section7: {
    agentName: string;
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

    // 7. Restaurant Category Information
    categories: string[];
  };
}

type FormAction = 
  | { type: 'UPDATE_SECTION'; section: keyof FormData; data: any }
  | { type: 'RESET' };

const initialFormData: FormData = {
  section1: {
    restaurantName: '',
    restaurantAddress: '',
    landmark: '',
    gstNumber: '',
    fssaiNumber: '',
    yearStarted: '',
    avgOrdersPerDay: '',
  },
  section2: {
    ownerName: '',
    ownerEmail: '',
    ownerMobile: '',
    additionalMobile: '',
  },
  section3: {
    primaryContactName: '',
    primaryContactMobile: '',
    alternateContactNumber: '',
    preferredOrderMethod: '',
    nextFollowUpDate: '',
  },
  section4: {
    documentSubmissionMethod: '',
  },
  section5: {
    accountHolderName: '',
    bankAccountNumber: '',
    bankName: '',
    ifscCode: '',
  },
  section6: {
    zomatoListed: '',
    zomatoMonths: '',
    swiggyListed: '',
    swiggyMonths: '',
  },
  section7: {
    agentName: '',
  },
  section8: {
    // 1. Restaurant Information
    restaurantName: '',
    restaurantImage: null,
    restaurantStatus: '',
    rating: '',
    approxDeliveryTime: '',
    approxPriceForTwo: '',
    certificateCode: '',
    mobileNumber: '',
    shortDescription: '',
    services: [],
    isPureVeg: false,
    isPopular: false,

    // 2. Restaurant Delivery Information
    deliveryChargeType: '',
    fixedCharge: '',
    dynamicCharge: '',
    storeCharge: '',
    deliveryRadius: '',
    minimumOrderPrice: '',

    // 3. Restaurant Admin Commission
    commissionRate: '',

    // 4. Restaurant Payout Information
    bankName: '',
    bankCode: '',
    recipientName: '',
    accountNumber: '',
    paypalId: '',
    upiId: '',

    // 5. Restaurant Address Information (Google Maps)
    searchLocation: '',
    fullAddress: '',
    pincode: '',
    landmark: '',
    latitude: '',
    longitude: '',
    city: '',
    state: '',
    mapType: 'roadmap',

    // 6. Restaurant Login Information
    loginEmail: '',
    loginPassword: '',

    // 7. Restaurant Category Information
    categories: [],
  },
};

function formReducer(state: FormData, action: FormAction): FormData {
  switch (action.type) {
    case 'UPDATE_SECTION':
      return {
        ...state,
        [action.section]: action.data,
      };
    case 'RESET':
      return initialFormData;
    default:
      return state;
  }
}

function FranchiseRegistration() {
  const navigate = useNavigate();
  const [formData, dispatch] = useReducer(formReducer, initialFormData);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);
  const [sectionErrors, setSectionErrors] = useState<{ [key: number]: any }>({});
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Array<{ section: string; fields: string[] }>>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Agent authentication state
  const [isAgentAuthenticated, setIsAgentAuthenticated] = useState(false);
  const [agentToken, setAgentToken] = useState<string | null>(null);
  const [agentLoginError, setAgentLoginError] = useState<string>('');

  const handleStartRegistration = () => {
    setHasStarted(true);
  };

  const handleAgentLogin = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agents/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setAgentToken(result.token);
        setIsAgentAuthenticated(true);
        setAgentLoginError('');
        
        // Clear employee token to prevent token conflicts
        localStorage.removeItem('employeeToken');
        
        // Store token in localStorage for persistence
        localStorage.setItem('agentToken', result.token);
      } else {
        const errorMsg = result.message || 'Invalid username or password';
        setAgentLoginError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Login failed. Please try again.';
      setAgentLoginError(errorMsg);
      throw error;
    }
  };

  const handleUpdateSection = (section: keyof FormData, data: any) => {
    dispatch({ type: 'UPDATE_SECTION', section, data });
  };

  

  const validateCurrentSection = (): boolean => {
    let errors = {};
    
    switch (currentSection) {
      case 1:
        errors = validateSection1(formData.section1);
        break;
      case 2:
        errors = validateSection2(formData.section2);
        break;
      case 3:
        errors = validateSection3(formData.section3);
        break;
      case 4:
        errors = validateSection4(formData.section4);
        break;
      case 5:
        errors = validateSection5(formData.section5);
        break;
      case 6:
        errors = validateSection6(formData.section6);
        break;
      case 7:
        errors = validateSection7(formData.section7);
        break;
      default:
        break;
    }

    const isValid = Object.keys(errors).length === 0;
    
    if (isValid) {
      setSectionErrors((prev) => {
        const updated = { ...prev };
        delete updated[currentSection];
        return updated;
      });
    } else {
      setSectionErrors((prev) => ({ ...prev, [currentSection]: errors }));
    }
    
    return isValid;
  };

  const handleNextSection = () => {
    const isValid = validateCurrentSection();
    
    if (isValid && currentSection < 8) {
      setCurrentSection((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    let allValid = true;
    const allErrors: { [key: number]: any } = {};

    for (let i = 1; i <= 8; i++) {
      let errors = {};
      switch (i) {
        case 1:
          errors = validateSection1(formData.section1);
          break;
        case 2:
          errors = validateSection2(formData.section2);
          break;
        case 3:
          errors = validateSection3(formData.section3);
          break;
        case 4:
          errors = validateSection4(formData.section4);
          break;
        case 5:
          errors = validateSection5(formData.section5);
          break;
        case 6:
          errors = validateSection6(formData.section6);
          break;
        case 7:
          errors = validateSection7(formData.section7);
          break;
        case 8:
          errors = validateSection8(formData.section8);
          break;
        default:
          break;
      }
      if (Object.keys(errors).length > 0) {
        allValid = false;
        allErrors[i] = errors;
      }
    }

    if (!allValid) {
      console.log('=== VALIDATION ERRORS ===');
      console.log(JSON.stringify(allErrors, null, 2));
      console.log('=========================');
      
      // Format errors for the modal
      const formattedErrors: Array<{ section: string; fields: string[] }> = [];
      
      Object.keys(allErrors).forEach((sectionKey) => {
        const sectionNum = parseInt(sectionKey);
        const sectionErrors = allErrors[sectionNum];
        const fields: string[] = [];
        
        Object.keys(sectionErrors).forEach((fieldKey) => {
          const errorText = sectionErrors[fieldKey];
          // Convert camelCase to readable format
          const fieldName = fieldKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
          fields.push(`${fieldName}: ${errorText}`);
        });
        
        formattedErrors.push({
          section: `Section ${sectionNum}`,
          fields
        });
      });
      
      setValidationErrors(formattedErrors);
      setShowValidationModal(true);
      
      setSectionErrors(allErrors);
      const firstErrorSection = Object.keys(allErrors)[0];
      setCurrentSection(parseInt(firstErrorSection));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const section8 = formData.section8;

    console.log('=== SECTION 8 VENDOR REGISTRATION DATA ===');
    console.log(JSON.stringify(section8, null, 2));
    console.log('==========================================');

    try {
      const payload = new FormData();

      // 1. Restaurant Information
      if (section8.restaurantImage) {
        payload.append('restaurantImage', section8.restaurantImage);
      }
      payload.append('restaurantName', section8.restaurantName);
      payload.append('restaurantStatus', section8.restaurantStatus);
      payload.append('rating', section8.rating);
      payload.append('approxDeliveryTime', section8.approxDeliveryTime);
      payload.append('approxPriceForTwo', section8.approxPriceForTwo);
      payload.append('certificateCode', section8.certificateCode);
      payload.append('mobileNumber', section8.mobileNumber);
      payload.append('shortDescription', section8.shortDescription);

      // Services array
      payload.append('services', JSON.stringify(section8.services));

      payload.append('isPureVeg', section8.isPureVeg ? 'true' : 'false');
      payload.append('isPopular', section8.isPopular ? 'true' : 'false');

      // 2. Restaurant Delivery Information
      payload.append('deliveryChargeType', section8.deliveryChargeType);
      payload.append('fixedCharge', section8.fixedCharge);
      payload.append('dynamicCharge', section8.dynamicCharge);
      payload.append('storeCharge', section8.storeCharge);
      payload.append('deliveryRadius', section8.deliveryRadius);
      payload.append('minimumOrderPrice', section8.minimumOrderPrice);

      // 3. Restaurant Admin Commission
      payload.append('commissionRate', section8.commissionRate);

      // 4. Restaurant Payout Information
      payload.append('bankName', section8.bankName);
      payload.append('bankCode', section8.bankCode);
      payload.append('recipientName', section8.recipientName);
      payload.append('accountNumber', section8.accountNumber);
      payload.append('paypalId', section8.paypalId);
      payload.append('upiId', section8.upiId);

      // 5. Restaurant Address Information (Google Maps)
      payload.append('searchLocation', section8.searchLocation);
      payload.append('fullAddress', section8.fullAddress);
      payload.append('pincode', section8.pincode);
      payload.append('landmark', section8.landmark);
      payload.append('latitude', section8.latitude);
      payload.append('longitude', section8.longitude);
      if (section8.city) {
        payload.append('city', section8.city);
      }
      if (section8.state) {
        payload.append('state', section8.state);
      }
      payload.append('mapType', section8.mapType);

      // 6. Restaurant Login Information
      payload.append('loginEmail', section8.loginEmail);
      payload.append('loginPassword', section8.loginPassword);

      // 7. Restaurant Categories
      payload.append('categories', JSON.stringify(section8.categories));

      // 8. Agent Information (Section 7)
      payload.append('agentName', formData.section7.agentName);

      // Submit to backend
      
      console.log('=== SUBMITTING TO BACKEND ===');
      console.log(`Endpoint: ${API_BASE_URL}/api/vendors/register`);
      
      const response = await fetch(`${API_BASE_URL}/api/vendors/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${agentToken}`,
        },
        body: payload,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('✅ Vendor registration successful');
        console.log('Response:', result);
        
        // Show success toast
        setShowSuccessToast(true);
        
        // Navigate to home after toast duration
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        console.error('❌ Registration failed:', result);
        
        // Check for specific error messages
        const errorMsg = result.message || 'Registration failed. Please try again.';
        
        if (errorMsg.toLowerCase().includes('email already registered') || 
            (errorMsg.toLowerCase().includes('email') && errorMsg.toLowerCase().includes('exist'))) {
          setErrorMessage('This email is already registered!\n\nPlease use a different email address to register your restaurant.');
        } else {
          setErrorMessage(errorMsg);
        }
        setShowErrorToast(true);
      }
    } catch (error) {
      console.error('❌ Error during submission:', error);
      setErrorMessage('Network error occurred!\n\nPlease check your internet connection and try again.');
      setShowErrorToast(true);
    }
  };

  if (!hasStarted) {
    return <RegistrationLanding onStart={handleStartRegistration} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">


      {/* Progress bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-3">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentSection / 8) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <RegistrationForm
          currentSection={currentSection}
          formData={formData}
          onUpdateSection={handleUpdateSection}
          onNext={handleNextSection}
          onPrevious={handlePreviousSection}
          onSubmit={handleSubmit}
          sectionErrors={sectionErrors}
          onAgentLogin={handleAgentLogin}
          isAgentAuthenticated={isAgentAuthenticated}
          agentLoginError={agentLoginError}
        />
      </div>

      {/* Validation Error Modal */}
      <ValidationErrorModal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        errors={validationErrors}
      />

      {/* Success Toast */}
      {showSuccessToast && (
        <SuccessToast
          message="Registration submitted successfully! Your vendor request has been received and is pending approval."
          onClose={() => setShowSuccessToast(false)}
        />
      )}

      {/* Error Toast */}
      {showErrorToast && (
        <ErrorToast
          message={errorMessage}
          onClose={() => setShowErrorToast(false)}
        />
      )}
    </div>
  );
}

export default FranchiseRegistration;
