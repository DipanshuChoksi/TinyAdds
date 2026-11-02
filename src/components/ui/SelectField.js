'use client';

export default function SelectField({ id, label, value, onChange, options, placeholder, className = '', inline = false }) {
  return (
    <div className={`${inline ? 'd-flex align-items-center gap-2' : ''} ${className}`}>
      {label && <label htmlFor={id} className={`form-label ${inline ? 'mb-0 text-nowrap' : ''}`}>{label}</label>}
      <select id={id} className="form-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const opt = typeof o === 'string' ? { value: o, label: o } : o;
          return <option key={opt.value} value={opt.value}>{opt.label}</option>;
        })}
      </select>
    </div>
  );
}
