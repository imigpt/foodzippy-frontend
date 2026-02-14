import { ServiceFormData } from '../../pages/ServiceRegistration';
import Section7 from '../franchise/sections/Section7';
import Section8 from '../franchise/sections/Section8';

interface ServiceRegistrationFormProps {
  currentSection: number;
  formData: ServiceFormData;
  onUpdateSection: (section: keyof ServiceFormData, data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  sectionErrors?: { [key: number]: any };
  onAgentLogin: (username: string, password: string, role: 'agent' | 'employee') => Promise<void>;
  isAgentAuthenticated: boolean;
  agentLoginError?: string;
}

function ServiceRegistrationForm({
  currentSection,
  formData,
  onUpdateSection,
  onNext,
  onPrevious,
  onSubmit,
  sectionErrors = {},
  onAgentLogin,
  isAgentAuthenticated,
  agentLoginError,
}: ServiceRegistrationFormProps) {
  const currentErrors = sectionErrors[currentSection] || {};

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <Section7
            data={formData.section7}
            onUpdate={(data: any) => onUpdateSection('section7', data)}
            errors={currentErrors}
            onAgentLogin={onAgentLogin}
            isAgentAuthenticated={isAgentAuthenticated}
            agentLoginError={agentLoginError}
          />
        );
      case 2:
        if (!isAgentAuthenticated) {
          return (
            <div className="text-center py-12">
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Authentication Required</h3>
                <p className="text-slate-600">
                  Please complete agent authentication in Section 1 before proceeding to this section.
                </p>
              </div>
            </div>
          );
        }
        return (
          <Section8
            data={formData.section8}
            onUpdate={(data: any) => onUpdateSection('section8', data)}
            errors={currentErrors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Content */}
      <div>{renderSection()}</div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-slate-200">
        <button
          onClick={onPrevious}
          disabled={currentSection === 1}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            currentSection === 1
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-slate-600 text-white hover:bg-slate-700'
          }`}
        >
          Previous
        </button>

        {currentSection < 2 ? (
          <button
            onClick={onNext}
            disabled={!isAgentAuthenticated && currentSection === 1}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              !isAgentAuthenticated && currentSection === 1
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            Next
          </button>
        ) : (
          <button
            onClick={onSubmit}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Submit Registration
          </button>
        )}
      </div>

      {/* Error message if agent not authenticated */}
      {currentSection === 1 && !isAgentAuthenticated && currentErrors._general && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mt-4">
          <p className="text-red-700 font-medium">{currentErrors._general}</p>
        </div>
      )}
    </div>
  );
}

export default ServiceRegistrationForm;
