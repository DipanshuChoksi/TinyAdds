'use client';

/** Label + input/textarea/select with inline validation message. */
export default function FormField({ label, name, error, as = 'input', type = 'text', required, children, className = '', ...rest }) {
  const Tag = as;
  const id = rest.id ?? name;
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
