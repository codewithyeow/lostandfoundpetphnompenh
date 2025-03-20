import React, { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  required = false,
  icon,
  children,
}) => {
  return (
    <div className="w-full">
      <label className="flex items-center mb-1 text-sm font-medium text-gray-700">
        {icon && <span className="mr-2 text-green-500">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
};
