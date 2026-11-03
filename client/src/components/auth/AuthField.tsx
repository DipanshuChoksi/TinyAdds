"use client";

import { useState } from "react";

type Props = {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "password";
  placeholder: string;
  value: string;
  error?: string;
  autoComplete?: string;
  maxLength?: number;
  onChange: (value: string) => void;
};

/** Label + input + inline error. `type="password"` gets a show/hide eye button. */
export default function AuthField({ label, name, type = "text", placeholder, value, error, autoComplete, maxLength, onChange }: Props) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="lb-auth-field">
      <label htmlFor={name} className="lb-auth-label">{label}<span>*</span></label>
      <div className="lb-auth-input-wrap">
        <input
          id={name}
          name={name}
          type={isPassword && show ? "text" : type}
          className={`form-control lb-auth-input${error ? " is-invalid" : ""}`}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
        />
        {isPassword && (
          <button type="button" className="lb-auth-eye" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}>
            <i className={`bi ${show ? "bi-eye-slash" : "bi-eye"}`}></i>
          </button>
        )}
      </div>
      {error && <p className="lb-auth-error">{error}</p>}
    </div>
  );
}
