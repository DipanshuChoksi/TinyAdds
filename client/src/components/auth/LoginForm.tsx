"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "./AuthShell";
import AuthField from "./AuthField";
import { compose, email, required } from "@/lib/validators";

export default function LoginForm() {
  const router = useRouter();
  const [emailValue, setEmailValue] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const next = {
      email: compose(required("Email"), email)(emailValue),
      password: required("Password")(password),
    };
    setErrors(next);
    if (next.email || next.password) return;
    // TODO: call login API here, then redirect
    router.push("/");
  };

  return (
    <AuthShell
      badge="welcome back"
      title="Login"
      subtitle="Login to manage your ads and enquiries."
      footer={<>Don’t have an account? <Link href="/register" className="lb-link">Create Account</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate>
        <AuthField label="Email Id" name="email" type="email" placeholder="Enter Email Id" autoComplete="email" value={emailValue} error={errors.email} onChange={setEmailValue} />
        <AuthField label="Password" name="password" type="password" placeholder="Enter Password" autoComplete="current-password" value={password} error={errors.password} onChange={setPassword} />
        <div className="d-lg-flex justify-content-between align-items-center mb-4">
          <div className="form-check m-0 mb-2 mb-lg-0">
            <input className="form-check-input" type="checkbox" id="remember" />
            <label className="form-check-label" htmlFor="remember">Remember me</label>
          </div>
          <Link href="/forgot-password" className="lb-link">Forgot Password?</Link>
        </div>
        <button type="submit" className="btn lb-btn-primary w-100">Login</button>
      </form>
    </AuthShell>
  );
}
