import { FormData } from '../../pages/FranchiseRegistration';
import Section1 from './sections/Section1';
import Section2 from './sections/Section2';
import Section3 from './sections/Section3';
import Section4 from './sections/Section4';
import Section5 from './sections/Section5';
import Section6 from './sections/Section6';
import Section7 from './sections/Section7';
import Section8 from './sections/Section8';

interface RegistrationFormProps {
  currentSection: number;
  formData: FormData;
  onUpdateSection: (section: keyof FormData, data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  sectionErrors?: { [key: number]: any };
  onAgentLogin: (username: string, password: string) => Promise<void>;
  isAgentAuthenticated: boolean;
  agentLoginError?: string;
}

function RegistrationForm({
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
}: RegistrationFormProps) {
  const currentErrors = sectionErrors[currentSection] || {};

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <Section1
            data={formData.section1}
            onUpdate={(data: any) => onUpdateSection('section1', data)}
            errors={currentErrors}
          />
        );
      case 2:
        return (
          <Section2
            data={formData.section2}
            onUpdate={(data: any) => onUpdateSection('section2', data)}
            errors={currentErrors}
          />
        );
      case 3:
        return (
          <Section3
            data={formData.section3}
            onUpdate={(data: any) => onUpdateSection('section3', data)}
            errors={currentErrors}
          />
        );
      case 4:
        return (
          <Section4
            data={formData.section4}
            onUpdate={(data: any) => onUpdateSection('section4', data)}
            errors={currentErrors}
          />
        );
      case 5:
        return (
          <Section5
            data={formData.section5}
            onUpdate={(data: any) => onUpdateSection('section5', data)}
            errors={currentErrors}
          />
        );
      case 6:
        return (
          <Section6
            data={formData.section6}
            onUpdate={(data: any) => onUpdateSection('section6', data)}
            errors={currentErrors}
          />
        );
      case 7:
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
      case 8:
        if (!isAgentAuthenticated) {
          return (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-yellow-900 mb-3">Authentication Required</h3>
              <p className="text-yellow-800">
                Please complete agent authentication in Section 7 before accessing this section.
              </p>
            </div>
          );
        }
        return (
          <Section8
            data={formData.section8 as any}
            onUpdate={(data: any) => onUpdateSection('section8', data)}
            errors={currentErrors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      {renderSection()}

      <div className="flex gap-4 mt-12">
        {currentSection > 1 && (
          <button
            onClick={onPrevious}
            className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Back
          </button>
        )}
        {currentSection < 8 && (
          <button
            onClick={onNext}
            disabled={currentSection === 7 && !isAgentAuthenticated}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-orange-600 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Next
          </button>
        )}
        {currentSection === 8 && (
          <button
            type="button"
            onClick={onSubmit}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 active:scale-95"
          >
            Submit Registration
          </button>
        )}
      </div>
    </div>
  );
}

export default RegistrationForm;
