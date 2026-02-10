import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-stone-700">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            {icon}
          </div>
        )}
        <input
          className={`
            block w-full rounded-lg border border-stone-300 bg-white 
            ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 
            text-stone-900 placeholder:text-stone-400 
            focus:border-emerald-500 focus:ring-emerald-500 focus:ring-1 focus:outline-none 
            transition-all duration-200
            disabled:bg-stone-50 disabled:text-stone-500
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
