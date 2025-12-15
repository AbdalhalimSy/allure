/**
 * Reusable form components to eliminate code duplication
 * Consolidates common form field patterns used across the app
 */

import React, { ChangeEvent, InputHTMLAttributes } from 'react';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'error'> {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  containerClassName?: string;
}

/**
 * Reusable form input wrapper
 * Combines Input component with Label, error, and hint
 */
export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      required,
      hint,
      containerClassName = '',
      ...inputProps
    },
    ref
  ) => {
    return (
      <div className={containerClassName || 'space-y-2'}>
        {label && (
          <Label htmlFor={inputProps.id} required={required}>
            {label}
          </Label>
        )}
        <Input
          ref={ref}
          {...(inputProps as any)}
          required={required}
          error={error}
        />
        {hint && <p className="text-sm text-gray-500">{hint}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

/**
 * Hook for common form change handler pattern
 * Handles generic form state updates
 */
export function useFormHandler<T extends Record<string, any>>(
  initialState: T
): [T, (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void, (updates: Partial<T>) => void] {
  const [state, setState] = React.useState(initialState);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const updateState = (updates: Partial<T>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return [state, handleChange, updateState];
}
