'use client';
import { useCallback, useState } from 'react';

/**
 * Tiny form hook.
 * validators: { fieldName: (value, allValues) => 'error message' | '' }
 */
export function useForm(initialValues, validators = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateField = useCallback(
    (name, value, all) => (validators[name] ? validators[name](value, all) : ''),
    [validators]
  );

  const handleChange = useCallback(
    (e) => {
      const { name, type, checked, value, files } = e.target;
      const next = type === 'checkbox' ? checked : type === 'file' ? files?.[0] ?? null : value;
      setValues((v) => ({ ...v, [name]: next }));
      setErrors((er) => (er[name] ? { ...er, [name]: '' } : er));
    },
    []
  );

  const validateAll = useCallback(() => {
    const next = {};
    Object.keys(validators).forEach((k) => {
      const msg = validateField(k, values[k], values);
      if (msg) next[k] = msg;
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [validators, validateField, values]);

  const handleSubmit = useCallback(
    (onValid) => async (e) => {
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
