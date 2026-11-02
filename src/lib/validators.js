export const required = (label) => (v) => (!String(v ?? '').trim() ? `${label} is required` : '');

export const email = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v ?? '').trim()) ? '' : 'Enter a valid email address!';

export const minLength = (n) => (v) =>
  String(v ?? '').length >= n ? '' : `Please ensure password is at least ${n} characters long.`;

export const phone = (v) =>
  /^[0-9+()\-\s]{7,}$/.test(String(v ?? '').trim()) ? '' : 'Enter a valid phone number!';

export const compose = (...fns) => (v, all) => {
  for (const fn of fns) {
    const msg = fn(v, all);
    if (msg) return msg;
  }
  return '';
};
