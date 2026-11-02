'use client';
import type { ChangeEvent, ElementType, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

type Base = {
  label?: string;
  name: string;
  error?: string;
  as?: 'input' | 'textarea' | 'select';
  type?: string;
  required?: boolean;
  className?: string;
  children?: ReactNode;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};

type FormFieldProps = Base &
  Omit<InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement> & SelectHTMLAttributes<HTMLSelectElement>, keyof Base>;

/** Label + input/textarea/select with inline validation message. */
export default function FormField({ label, name, error, as = 'input', type = 'text', required, children, className = '', ...rest }: FormFieldProps) {
  const Tag = as as ElementType;
  const id = (rest.id as string | undefined) ?? name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <Tag
        id={id}
        name={name}
        type={as === 'input' ? type : undefined}
        className={`${as === 'select' ? 'form-select' : 'form-control'} ${error ? 'is-invalid' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      >
        {children}
      </Tag>
      {error && <div id={`${id}-error`} className="invalid-feedback">{error}</div>}
    </div>
  );
}
