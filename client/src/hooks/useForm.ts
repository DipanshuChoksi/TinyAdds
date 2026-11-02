'use client';
import { useCallback, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

export type Validators<T> = Partial<{ [K in keyof T]: (value: T[K], all: T) => string }>;
export type FormErrors<T> = Partial<Record<keyof T, string>>;
type FieldEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

/** Tiny form hook with per-field validators. */
export function useForm<T extends object>(initialValues: T, validators: Validators<T> = {}) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((e: FieldEvent) => {
    const target = e.target as HTMLInputElement;
    const { name, type, checked, value, files } = target;
    const next = type === 'checkbox' ? checked : type === 'file' ? files?.[0] ?? null : value;
    setValues((v) => ({ ...v, [name]: next }));
    setErrors((er) => (er[name as keyof T] ? { ...er, [name]: '' } : er));
  }, []);

  const validateAll = useCallback((): boolean => {
    const next: FormErrors<T> = {};
    (Object.keys(validators) as (keyof T)[]).forEach((k) => {
      const fn = validators[k] as ((value: unknown, all: T) => string) | undefined;
      const msg = fn ? fn(values[k], values) : '';
      if (msg) next[k] = msg;
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [validators, values]);

  const handleSubmit = useCallback(
    (onValid: (values: T) => void | Promise<void>) => async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateAll()) return;
      setSubmitting(true);
      try {
        await onValid(values);
      } finally {
        setSubmitting(false);
      }
    },
    [validateAll, values]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return { values, errors, submitting, handleChange, handleSubmit, setValues, setErrors, reset };
}
