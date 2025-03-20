import React, { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  icon?: ReactNode;
  helpText?: string;
  children: ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  required = false,
  icon,
  helpText,
  children
}) => {
  return (
    <div>
      <label htmlFor={name} className="flex items-center mb-1 text-sm font-medium text-gray-700">
        {icon && <span className="mr-2 text-green-500">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {helpText && <span className="text-sm text-gray-500 ml-2">({helpText})</span>}
      </label>
      {children}
    </div>
  );
};

export default FormField;