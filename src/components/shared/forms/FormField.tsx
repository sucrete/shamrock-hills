import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export const inputClass =
  'w-full rounded-[10px] shadow-[inset_0_0_0px_1px_rgba(0,0,0,.06)] bg-white px-4 py-2.5 text-[15px] text-black outline-none transition-colors focus:border-bushwood-600 focus:ring-2 focus:ring-bushwood-600/15 disabled:opacity-50';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string | null;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export const FormField = ({ id, label, error, required, className, children }: FormFieldProps) => (
  <div className={cn('flex flex-col', className)}>
    <label htmlFor={id} className="area-600 text-tagline-3 mb-2 block text-black/85">
      {label}
      {required && <span className="text-bushwood-600"> *</span>}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} className="mt-1 text-[13px] text-red-600">
        {error}
      </p>
    )}
  </div>
);
