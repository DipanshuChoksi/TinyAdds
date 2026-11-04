"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "./AuthShell";
import AuthField from "./AuthField";
import { compose, email, required } from "@/lib/validators";
import http from "@/lib/http";
import { useToast } from "@/components/ui/UiProvider";

export default function LoginForm() {
  const router = useRouter();
  const toast = useToast();
  const [emailValue, setEmailValue] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next = {
      email: compose(required("Email"), email)(emailValue),
      password: required("Password")(password),
    };
    setErrors(next);
    if (next.email || next.password) return;
    setSubmitting(true);
    try {
      await http.post("/auth/login", { email: emailValue, password });
      toast.success("Login successful");
      router.push("/client-admin/add-post");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to log in");
    } finally {
      setSubmitting(false);
    }
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
        <button type="submit" className="btn lb-btn-primary w-100" disabled={submitting}>{submitting ? "Logging in..." : "Login"}</button>
      </form>
    </AuthShell>
  );
}
