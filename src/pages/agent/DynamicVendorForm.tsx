import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { api, FormSection } from '../../utils/api';
import DynamicFormField from '../../components/DynamicFormField';
import VoiceRecorder from '../../components/VoiceRecorder';
import LocationSelector from '../../components/LocationSelector';
import SuccessToast from '../../components/SuccessToast';
import ErrorToast from '../../components/ErrorToast';

export default function DynamicVendorForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEmployee = location.pathname.includes('/employee');
  const dashboardRoute = isEmployee ? '/employee/dashboard' : '/agent/dashboard';
  const typeSelectionRoute = isEmployee ? '/employee/vendor-type' : '/agent/vendor-type';
  
  // Get vendor type from navigation state
  const vendorType = location.state?.vendorType || 'restaurant';
  const vendorTypeName = location.state?.vendorTypeName || 'Restaurant';
  
  const [formConfig, setFormConfig] = useState<FormSection[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [reviewData, setReviewData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  useEffect(() => {
    // If no vendor type selected, redirect to type selection
    if (!location.state?.vendorType) {
      navigate(typeSelectionRoute, { replace: true });
      return;
    }
    loadFormConfig();
  }, [vendorType]);

  const loadFormConfig = async () => {
    try {
      setLoading(true);
      // Pass vendor type to get dynamic labels
      const response = await api.getFormConfig(undefined, vendorType);
      console.log('Form config loaded:', response);
      setFormConfig(response.data);
    } catch (error: any) {
      console.error('Failed to load form config:', error);
      setErrorMessage(error.message || 'Failed to load form configuration');
      setShowErrorToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldKey: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
    
    // Clear error for this field
    if (errors[fieldKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  };

  const handleReviewChange = (fieldKey: string, value: any) => {
    setReviewData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));

    if (errors[fieldKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  };

  const handleVoiceUpload = (url: string) => {
    setReviewData((prev) => ({
      ...prev,
      audioUrl: url,
    }));
  };

  const validateStep = (stepNumber: number) => {
    const newErrors: Record<string, string> = {};
    const sectionsToValidate = formConfig.filter((s) => s.stepNumber === stepNumber);

    sectionsToValidate.forEach((section) => {
      section.fields
        .filter((f) => f.isActive && f.required)
        .forEach((field) => {
          const value = stepNumber === 1 ? formData[field.fieldKey] : reviewData[field.fieldKey];
          
          if (!value || (Array.isArray(value) && value.length === 0)) {
            newErrors[field.fieldKey] = `${field.label} is required`;
          }

          // Additional validation
          if (value && field.validation) {
            if (field.validation.minLength && value.length < field.validation.minLength) {
              newErrors[field.fieldKey] = `Minimum ${field.validation.minLength} characters required`;
            }
            if (field.validation.maxLength && value.length > field.validation.maxLength) {
              newErrors[field.fieldKey] = `Maximum ${field.validation.maxLength} characters allowed`;
            }
            if (field.validation.min && parseFloat(value) < field.validation.min) {
              newErrors[field.fieldKey] = `Minimum value is ${field.validation.min}`;
            }
            if (field.validation.max && parseFloat(value) > field.validation.max) {
              newErrors[field.fieldKey] = `Maximum value is ${field.validation.max}`;
            }
          }
        });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(1)) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrorMessage('Please fill in all required fields');
      setShowErrorToast(true);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(2)) {
      setErrorMessage('Please complete all required fields in the review section');
      setShowErrorToast(true);
      return;
    }

    try {
      setSubmitting(true);

      // Prepare form data for submission
      const submitFormData = new FormData();

      // Add restaurant image (required)
      if (formData.restaurantImage) {
        submitFormData.append('restaurantImage', formData.restaurantImage);
      } else {
        throw new Error(`${vendorTypeName} image is required`);
      }

      // Add vendor type
      submitFormData.append('vendorType', vendorType);

      // Add all other form data as JSON
      const formDataPayload: Record<string, any> = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'restaurantImage') {
          formDataPayload[key] = value;
        }
      });
      submitFormData.append('formData', JSON.stringify(formDataPayload));

      // Add review data
      const reviewPayload = {
        ...reviewData,
      };
      submitFormData.append('review', JSON.stringify(reviewPayload));

      // Submit with correct role to ensure proper token is used
      const role = isEmployee ? 'employee' : 'agent';
      const response = await api.registerVendor(submitFormData, role);
      console.log('Vendor registered:', response);

      setShowSuccessToast(true);
      
      // Navigate immediately instead of waiting
      setTimeout(() => {
        navigate(dashboardRoute, { replace: true });
      }, 1500);
    } catch (error: any) {
      console.error('Submission error:', error);
      console.error('Error details:', error.response);
      
      // Show more detailed error message
      let errorMsg = error.message || 'Failed to submit vendor registration';
      if (error.missingFields && error.missingFields.length > 0) {
        errorMsg += '\nMissing fields: ' + error.missingFields.join(', ');
      }
      setErrorMessage(errorMsg);
      setShowErrorToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b35] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  const step1Sections = formConfig.filter((s) => s.stepNumber === 1);
  const step2Sections = formConfig.filter((s) => s.stepNumber === 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
            
            <h1 className="text-2xl font-bold text-slate-900 absolute left-1/2 transform -translate-x-1/2">{vendorTypeName} Registration</h1>
            
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{vendorTypeName} Registration</h1>
          <p className="text-gray-600 mt-2">
            {currentStep === 1 ? `Fill in ${vendorTypeName.toLowerCase()} details` : 'Complete review and follow-up information'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8 flex items-center gap-4">
          <div className={`flex items-center gap-2 ${currentStep === 1 ? 'text-[#ff6b35]' : 'text-green-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 1 ? 'bg-[#ff6b35] text-white' : 'bg-green-600 text-white'
            }`}>
              {currentStep === 1 ? '1' : '✓'}
            </div>
            <span className="font-medium">{vendorTypeName} Details</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-300"></div>
          <div className={`flex items-center gap-2 ${currentStep === 2 ? 'text-[#ff6b35]' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 2 ? 'bg-[#ff6b35] text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
            <span className="font-medium">Review & Follow-up</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Restaurant Details */}
          {currentStep === 1 && (
            <div className="space-y-8">
              {step1Sections.map((section) => {
                // Check if this is the address/location section
                const isLocationSection = section.sectionKey === 'address_info';

                if (isLocationSection) {
                  return (
                    <div key={section._id} className="bg-white rounded-xl shadow-sm p-6">
                      <LocationSelector
                        data={{
                          fullAddress: formData.fullAddress || '',
                          latitude: formData.latitude || '',
                          longitude: formData.longitude || '',
                          pincode: formData.pincode || '',
                          landmark: formData.landmark || '',
                          city: formData.city || '',
                          state: formData.state || '',
                          searchLocation: formData.searchLocation || '',
                        }}
                        onUpdate={(updates) => {
                          Object.entries(updates).forEach(([key, value]) => {
                            handleFieldChange(key, value);
                          });
                        }}
                        mapType={mapType}
                        onMapTypeChange={setMapType}
                        errors={{
                          fullAddress: errors.fullAddress,
                          latitude: errors.latitude,
                          longitude: errors.longitude,
                        }}
                      />
                    </div>
                  );
                }

                return (
                  <div key={section._id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="border-l-4 border-[#ff6b35] pl-4 mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">{section.sectionLabel}</h2>
                      {section.sectionDescription && (
                        <p className="text-sm text-gray-600 mt-1">{section.sectionDescription}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {section.fields
                        .filter((f) => f.isActive)
                        .sort((a, b) => a.order - b.order)
                        .map((field) => (
                          <div
                            key={field._id}
                            className={field.fieldType === 'textarea' ? 'md:col-span-2' : ''}
                          >
                            <DynamicFormField
                              field={field}
                              value={formData[field.fieldKey]}
                              onChange={handleFieldChange}
                              error={errors[field.fieldKey]}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-[#ff6b35] text-white rounded-lg hover:bg-[#ff5722] transition-colors font-medium"
                >
                  Next: Review & Follow-up →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Review & Follow-up */}
          {currentStep === 2 && (
            <div className="space-y-8">
              {step2Sections.map((section) => (
                <div key={section._id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="border-l-4 border-green-500 pl-4 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">{section.sectionLabel}</h2>
                    {section.sectionDescription && (
                      <p className="text-sm text-gray-600 mt-1">{section.sectionDescription}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {section.fields
                      .filter((f) => f.isActive && f.fieldType !== 'voice')
                      .sort((a, b) => a.order - b.order)
                      .map((field) => (
                        <div
                          key={field._id}
                          className={field.fieldType === 'textarea' ? 'md:col-span-2' : ''}
                        >
                          <DynamicFormField
                            field={field}
                            value={reviewData[field.fieldKey]}
                            onChange={handleReviewChange}
                            error={errors[field.fieldKey]}
                          />
                        </div>
                      ))}
                  </div>

                  {/* Voice Recorder */}
                  {section.fields.some((f) => f.fieldType === 'voice' && f.isActive) && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Voice Note (Optional)
                      </label>
                      <VoiceRecorder
                        onUploadComplete={handleVoiceUpload}
                        initialUrl={reviewData.audioUrl}
                      />
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Registration'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </main>

      {/* Toast Notifications */}
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
