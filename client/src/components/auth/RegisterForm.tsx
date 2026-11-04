"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "./AuthShell";
import AuthField from "./AuthField";
import { compose, email, minLength, phone, required } from "@/lib/validators";
import http from "@/lib/http";
import { useToast } from "@/components/ui/UiProvider";

const EMPTY = { firstName: "", lastName: "", email: "", mobile: "", password: "", confirm: "" };
type Values = typeof EMPTY;

export default function RegisterForm() {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Values>(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof Values) => (value: string) => setValues((v) => ({ ...v, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: Values = {
      firstName: required("First name")(values.firstName),
      lastName: required("Last name")(values.lastName),
      email: compose(required("Email"), email)(values.email),
      mobile: compose(required("Mobile no"), phone)(values.mobile),
      password: compose(required("Password"), minLength(8))(values.password),
      confirm: values.confirm !== values.password ? "Passwords do not match" : required("Confirm password")(values.confirm),
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    setSubmitting(true);
    try {
      await http.post("/auth/register", {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        mobile: values.mobile,
        password: values.password,
      });
      toast.success("Account created successfully");
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      wide
      badge="join tinyadds"
      title="Register"
      subtitle="Create your free account in a minute."
      footer={<>Already have an account? <Link href="/login" className="lb-link">Login</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="row gx-4">
          <div className="col-md-6"><AuthField label="First Name" name="firstName" placeholder="Enter First Name" autoComplete="given-name" value={values.firstName} error={errors.firstName} onChange={set("firstName")} /></div>
          <div className="col-md-6"><AuthField label="Last Name" name="lastName" placeholder="Enter Last Name" autoComplete="family-name" value={values.lastName} error={errors.lastName} onChange={set("lastName")} /></div>
          <div className="col-md-6"><AuthField label="Email Id" name="email" type="email" placeholder="Enter Email Id" autoComplete="email" value={values.email} error={errors.email} onChange={set("email")} /></div>
          <div className="col-md-6"><AuthField label="Mobile No" name="mobile" type="tel" placeholder="Enter Mobile No" autoComplete="tel" maxLength={15} value={values.mobile} error={errors.mobile} onChange={set("mobile")} /></div>
          <div className="col-md-6"><AuthField label="Password" name="password" type="password" placeholder="Enter Password" autoComplete="new-password" value={values.password} error={errors.password} onChange={set("password")} /></div>
          <div className="col-md-6"><AuthField label="Confirm Password" name="confirm" type="password" placeholder="Enter Password" autoComplete="new-password" value={values.confirm} error={errors.confirm} onChange={set("confirm")} /></div>
        </div>
        <button type="submit" className="btn lb-btn-primary px-5" disabled={submitting}>{submitting ? "Creating account..." : "Submit"}</button>
      </form>
    </AuthShell>
  );
}
