import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { api, FormSection } from '../../utils/api';
import DynamicFormField from '../../components/DynamicFormField';
import VoiceRecorder from '../../components/VoiceRecorder';
import LocationSelector from '../../components/LocationSelector';
import SuccessToast from '../../components/SuccessToast';
import ErrorToast from '../../components/ErrorToast';

export default function VendorEditForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const isEmployee = location.pathname.includes('/employee');
  const requestsRoute = isEmployee ? '/employee/requests' : '/agent/requests';
  
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
  const [existingImage, setExistingImage] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadFormConfig();
    loadVendorData();
  }, [id]);

  const loadFormConfig = async () => {
    try {
      const response = await api.getFormConfig();
      setFormConfig(response.data);
    } catch (error: any) {
      console.error('Failed to load form config:', error);
      setErrorMessage(error.message || 'Failed to load form configuration');
      setShowErrorToast(true);
    }
  };

  const loadVendorData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const role = isEmployee ? 'employee' : 'agent';
      const response = await api.getMyVendorById(id, role);
      const vendor = response.vendor || response.data;

      // Check if edit is approved
      if (!vendor.editApproved) {
        setErrorMessage('Edit not approved by admin. Please request edit permission first.');
        setShowErrorToast(true);
        setTimeout(() => navigate(requestsRoute), 2000);
        return;
      }

      // Load formData
      const loadedFormData: Record<string, any> = {};
      if (vendor.formData) {
        // If formData is already an object
        if (typeof vendor.formData === 'object') {
          Object.assign(loadedFormData, vendor.formData);
        }
      }

      // Ensure core fields are set
      loadedFormData.restaurantName = vendor.restaurantName || loadedFormData.restaurantName;
      loadedFormData.fullAddress = vendor.fullAddress || loadedFormData.fullAddress;
      loadedFormData.latitude = vendor.latitude || loadedFormData.latitude;
      loadedFormData.longitude = vendor.longitude || loadedFormData.longitude;

      setFormData(loadedFormData);
      setExistingImage(vendor.restaurantImage);

      // Load review data
      if (vendor.review) {
        setReviewData(vendor.review);
      }
    } catch (error: any) {
      console.error('Failed to load vendor:', error);
      setErrorMessage(error.message || 'Failed to load vendor data');
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setExistingImage({ secure_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (stepNumber: number) => {
    const newErrors: Record<string, string> = {};
    const sectionsToValidate = formConfig.filter((s) => s.stepNumber === stepNumber);

    sectionsToValidate.forEach((section) => {
      section.fields
        .filter((f) => f.isActive && f.required)
        .forEach((field) => {
          // Skip validation for image field if it already exists
          if (field.fieldKey === 'restaurantImage' && existingImage) {
            return;
          }

          const value = stepNumber === 1 ? formData[field.fieldKey] : reviewData[field.fieldKey];
          
          // Check if value is empty
          if (!value || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0)) {
            newErrors[field.fieldKey] = `${field.label} is required`;
          }
        });
    });

    setErrors(newErrors);
    
    // Log validation errors for debugging
    if (Object.keys(newErrors).length > 0) {
      console.log('Validation errors:', newErrors);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    console.log('Next button clicked, current step:', currentStep);
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      console.log('Validation failed, errors:', errors);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    if (!id) return;

    try {
      setSubmitting(true);

      const submitData = new FormData();
      
      // Add image if changed
      if (imageFile) {
        submitData.append('restaurantImage', imageFile);
      }

      // Add form data
      submitData.append('formData', JSON.stringify(formData));

      // Add review data
      submitData.append('review', JSON.stringify(reviewData));

      const role = isEmployee ? 'employee' : 'agent';
      await api.updateMyVendor(id, submitData, role);

      setShowSuccessToast(true);
      setTimeout(() => {
        navigate(requestsRoute);
      }, 2000);
    } catch (error: any) {
      console.error('Update error:', error);
      setErrorMessage(error.message || 'Failed to update vendor');
      setShowErrorToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading vendor data...</p>
        </div>
      </div>
    );
  }

  const totalSteps = Math.max(...formConfig.map((s) => s.stepNumber));
  const currentSections = formConfig.filter((s) => s.stepNumber === currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(requestsRoute)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Requests</span>
          </button>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Vendor Details</h1>
            <p className="text-gray-600">Update restaurant information</p>
            
            {/* Progress */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round((currentStep / totalSteps) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
          {currentSections.map((section) => (
            <div key={section._id} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{section.sectionLabel}</h2>
              {section.sectionDescription && (
                <p className="text-gray-600 mb-6">{section.sectionDescription}</p>
              )}

              <div className="space-y-6">
                {section.fields
                  .filter((field) => field.isActive)
                  .sort((a, b) => a.order - b.order)
                  .map((field) => {
                    // Handle special fields
                    if (field.fieldKey === 'restaurantImage') {
                      return (
                        <div key={field._id}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          {existingImage && (
                            <div className="mb-4">
                              <img
                                src={existingImage.secure_url || existingImage}
                                alt="Current"
                                className="w-48 h-32 object-cover rounded-lg border-2 border-gray-200"
                              />
                              <p className="text-sm text-gray-500 mt-2">Current image</p>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                          />
                          {field.helpText && (
                            <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
                          )}
                        </div>
                      );
                    }

                    if (field.fieldKey === 'searchLocation') {
                      return (
                        <div key={field._id}>
                          <LocationSelector
                            data={{
                              fullAddress: formData.fullAddress || '',
                              latitude: String(formData.latitude || ''),
                              longitude: String(formData.longitude || ''),
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

                    if (field.fieldType === 'voice') {
                      return (
                        <div key={field._id}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          {reviewData.audioUrl && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-600 mb-1">Current recording:</p>
                              <audio controls src={reviewData.audioUrl} className="w-full" />
                            </div>
                          )}
                          <VoiceRecorder onUploadComplete={handleVoiceUpload} />
                          {field.helpText && (
                            <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
                          )}
                          {errors[field.fieldKey] && (
                            <p className="text-xs text-red-500 mt-1">{errors[field.fieldKey]}</p>
                          )}
                        </div>
                      );
                    }

                    // Regular dynamic fields
                    const value = currentStep === 1 ? formData[field.fieldKey] : reviewData[field.fieldKey];
                    const onChange = currentStep === 1 ? handleFieldChange : handleReviewChange;

                    return (
                      <DynamicFormField
                        key={field._id}
                        field={field}
                        value={value}
                        onChange={onChange}
                        error={errors[field.fieldKey]}
                      />
                    );
                  })}
              </div>
            </div>
          ))}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            {currentStep > 1 ? (
              <button
                onClick={handlePrevious}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Previous
              </button>
            ) : (
              <div />
            )}

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-colors ml-auto"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed ml-auto flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Vendor'
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toasts */}
      {showSuccessToast && (
        <SuccessToast
          message="Vendor updated successfully!"
          onClose={() => setShowSuccessToast(false)}
        />
      )}
      {showErrorToast && (
        <ErrorToast message={errorMessage} onClose={() => setShowErrorToast(false)} />
      )}
    </div>
  );
}
