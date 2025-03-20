import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  nextLabel?: string;
  prevLabel?: string;
  isNextDisabled?: boolean;
  isPrevDisabled?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  nextLabel,
  prevLabel,
  isNextDisabled = false,
  isPrevDisabled = false,
}) => {
  return (
    <div className="flex justify-between mt-6 gap-4">
      {currentStep > 1 && (
        <button
          type="button"
          onClick={onPrev}
          disabled={isPrevDisabled}
          className="py-2 px-4 bg-white font-medium rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
        >
          <ArrowLeft className="mr-1 inline" size={16} />
          {prevLabel || 'Previous'}
        </button>
      )}
      
      {currentStep < totalSteps ? (
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className={`${currentStep === 1 ? 'w-full' : ''} py-2 px-4 bg-white font-medium rounded-full border border-[#4eb7f0] text-[#4eb7f0] hover:bg-[#4eb7f0] hover:text-white transition-colors duration-200 disabled:opacity-50`}
        >
          {nextLabel || `Next: ${currentStep === 1 ? 'Location Information' : 'Contact Information'}`}
          <ArrowRight className="ml-1 inline" size={16} />
        </button>
      ) : (
        <button
          type="submit"
          disabled={isNextDisabled}
          className="py-2 px-4 bg-[#4eb7f0] font-medium rounded-full text-white hover:bg-[#3da7e0] transition-colors duration-200 disabled:opacity-50"
        >
          Submit Report
        </button>
      )}
    </div>
  );
};

export default StepNavigation;