export type Validator = (value: unknown, all?: any) => string; // eslint-disable-line


export const required =
  (label: string): Validator =>
  (v) =>
    !String(v ?? '').trim() ? `${label} is required` : '';

export const email: Validator = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v ?? '').trim()) ? '' : 'Enter a valid email address!';

export const minLength =
  (n: number): Validator =>
  (v) =>
    String(v ?? '').length >= n ? '' : `Please ensure password is at least ${n} characters long.`;

export const phone: Validator = (v) =>
  /^[0-9+()\-\s]{7,}$/.test(String(v ?? '').trim()) ? '' : 'Enter a valid phone number!';

export const compose =
  (...fns: Validator[]): Validator =>
  (v, all) => {
    for (const fn of fns) {
      const msg = fn(v, all);
      if (msg) return msg;
    }
    return '';
  };
