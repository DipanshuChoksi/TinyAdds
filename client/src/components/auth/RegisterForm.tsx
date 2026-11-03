"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "./AuthShell";
import AuthField from "./AuthField";
import { compose, email, minLength, phone, required } from "@/lib/validators";

const EMPTY = { firstName: "", lastName: "", email: "", mobile: "", password: "", confirm: "" };
type Values = typeof EMPTY;

export default function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Values>(EMPTY);

  const set = (key: keyof Values) => (value: string) => setValues((v) => ({ ...v, [key]: value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Values = {
      firstName: required("First name")(values.firstName),
      lastName: required("Last name")(values.lastName),
      email: compose(required("Email"), email)(values.email),
      mobile: compose(required("Mobile no"), phone)(values.mobile),
      password: compose(required("Password"), minLength(6))(values.password),
      confirm: values.confirm !== values.password ? "Passwords do not match" : required("Confirm password")(values.confirm),
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    // TODO: call register API here
    router.push("/login");
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
        <button type="submit" className="btn lb-btn-primary px-5">Submit</button>
      </form>
    </AuthShell>
  );
}
