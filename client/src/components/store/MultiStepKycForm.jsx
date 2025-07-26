import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStoreOwner from '../../store/useStoreOwner';
import StepOwnerDetails from './kycSteps/StepOwnerDetails';
import StepStoreDetails from './kycSteps/StepStoreDetails';
import StepBusinessDocs from './kycSteps/StepBusinessDocs';
import StepBankPayout from './kycSteps/StepBankPayout';
import StepDeliveryOps from './kycSteps/StepDeliveryOps';
import StepReviewSubmit from './kycSteps/StepReviewSubmit';
import '../../index.css';
import { stepValidators } from '../../utils/kycValidation';
import { submitKyc } from '../../api/store/storeKyc';

const steps = [
  'Owner Details',
  'Store Details',
  'Business Documents',
  'Bank & Payout',
  'Delivery & Operations',
  'Review & Submit',
];

const stepComponents = [
  StepOwnerDetails,
  StepStoreDetails,
  StepBusinessDocs,
  StepBankPayout,
  StepDeliveryOps,
  StepReviewSubmit,
];

const LOCAL_STORAGE_KEY = 'storeKycDraft';
const LOCAL_STORAGE_STEP_KEY = 'storeKycStep';

const MultiStepKycForm = () => {
  // Only initialize kycData from localStorage, always start currentStep at 0
  const [kycData, setKycData] = useState(() => {
    const draft = localStorage.getItem(LOCAL_STORAGE_KEY);
    try {
      return draft ? JSON.parse(draft) : {};
    } catch {
      return {};
    }
  });
  const [currentStep, setCurrentStep] = useState(0);
  const { logoutStoreOwner, storeOwner, isStoreOwnerLoggedIn, refreshProfile } = useStoreOwner();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Save draft to localStorage on kycData change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(kycData));
  }, [kycData]);

  // Save current step to localStorage on step change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_STEP_KEY, String(currentStep));
  }, [currentStep]);

  const handleLogout = async () => {
    await logoutStoreOwner();
    navigate('/store');
  };

  // Handler to update kycData from steps
  const updateKycData = (updates) => {
    setKycData(prev => ({ ...prev, ...updates }));
    setErrors({}); // Clear errors on change
  };

  // Handler for next step with validation
  const handleNextStep = () => {
    const validationErrors = stepValidators[currentStep](kycData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setCurrentStep(currentStep + 1);
  };

  // Handler for submit with validation (on last step)
  const handleSubmit = async () => {
    // Validate all steps before submit
    for (let i = 0; i < stepValidators.length - 1; i++) {
      const validationErrors = stepValidators[i](kycData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setCurrentStep(i);
        return;
      }
    }
    setErrors({});
    setSubmitError('');
    setIsSubmitting(true);
    try {
      await submitKyc(kycData);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(LOCAL_STORAGE_STEP_KEY);
      
      setTimeout(async () => {
        try {
          const { getKycStatus } = await import('../../api/store/storeKyc');
          await getKycStatus();
          await refreshProfile();
          navigate('/store/dashboard/kyc-status', { replace: true });
        } catch (err) {
          navigate('/store/dashboard/kyc-status', { replace: true });
        }
      }, 1000);
      
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepComponent = stepComponents[currentStep];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-80 flex flex-col h-full bg-green-800 text-white custom-scrollbar shadow-lg">
        {/* Top: Logo, tagline, onboarding, info */}
        <div className="p-6 pb-0">
          <div className="flex items-center gap-3 mb-2">
            <img src="/qbd.png" alt="QBD Logo" className="h-10 object-contain rounded bg-white p-1" />
            <div>
              <div className="font-extrabold text-xl leading-tight">store hub</div>
              <div className="text-xs text-green-200 font-medium">by QBD</div>
            </div>
          </div>
          <div className="text-sm leading-relaxed mb-2">
            Grow your business with SwiftCart! Offer your customers the delight of your products and the convenience of fast deliveries.
          </div>
          <div className="bg-green-900/80 rounded-lg p-3 flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-red-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
            <span className="text-xs text-green-100">Cautious of frauds claiming to assist!</span>
          </div>
        </div>
        {/* Stepper: scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 custom-scrollbar">
          <ol className="relative mt-6 mb-2">
            {steps.map((label, idx) => (
              <li key={label} className="flex items-center mb-8 last:mb-0 relative">
                {/* Vertical line */}
                {idx < steps.length - 1 && (
                  <span className={`absolute left-4 top-7 w-0.5 h-10 ${idx < currentStep ? 'bg-green-400' : 'bg-green-700'}`}></span>
                )}
                <div className={`z-10 w-8 h-8 flex items-center justify-center rounded-full border-2 font-bold text-base transition-all duration-200 shadow-md ${idx === currentStep ? 'bg-white text-green-800 border-green-400 scale-110 shadow-lg' : idx < currentStep ? 'bg-green-400 text-white border-green-400' : 'bg-green-700 text-green-200 border-green-700'}`}>{idx + 1}</div>
                <span className={`ml-5 ${idx === currentStep ? 'text-white font-semibold text-lg' : 'text-green-100 text-base'}`}>{label}</span>
              </li>
            ))}
          </ol>
        </div>
        {/* Bottom: Logout/email */}
        <div className="p-6 border-t border-green-700 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" /><path d="M3 21v-2a4 4 0 014-4h10a4 4 0 014 4v2" /></svg>
          <span className="text-xs truncate flex-1">{storeOwner?.email}</span>
          <button
            className="ml-2 px-3 py-1 bg-white text-green-800 cursor-pointer rounded-lg font-semibold shadow hover:bg-green-100 transition text-xs"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>
      {/* Main content */}
      <section className="flex-1 flex flex-col min-h-0 h-full bg-white overflow-y-auto main-content-scrollbar">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 w-full max-w-3xl px-12 pt-16 pb-32 mx-auto">
            {submitError && (
              <div className="text-center text-red-600 font-semibold mb-4">{submitError}</div>
            )}
            <StepComponent
              kycData={kycData}
              updateKycData={updateKycData}
              onSubmit={handleSubmit}
              errors={errors}
            />
          </div>
        </div>
        {/* Sticky footer for action buttons */}
        <div className="sticky bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-end px-12 py-6 z-10">
          {currentStep > 0 && (
            <button
              className="px-6 py-2 rounded cursor-pointer bg-gray-100 text-gray-700 font-semibold mr-4 hover:bg-gray-200 transition"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </button>
          )}
          {currentStep < steps.length - 1 && (
            <button
              className="px-8 py-2 rounded cursor-pointer bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow w-full max-w-xs"
              onClick={handleNextStep}
            >
              Save & Continue
            </button>
          )}
          {currentStep === steps.length - 1 && (
            <button
              className="px-8 py-2 rounded cursor-pointer bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow w-full max-w-xs"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Submit KYC'
              )}
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default MultiStepKycForm; 