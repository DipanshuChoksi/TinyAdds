"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "./AuthShell";
import AuthField from "./AuthField";
import { compose, email, minLength, required } from "@/lib/validators";
import http from "@/lib/http";
import { useToast } from "@/components/ui/UiProvider";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

/** Steps: 1 = email, 2 = OTP verify, 3 = new password. */
export default function ForgotPasswordForm() {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [emailValue, setEmailValue] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({ email: "", otp: "", password: "", confirm: "" });
  const [seconds, setSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const sendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    const msg = compose(required("Email"), email)(emailValue);
    setErrors((e) => ({ ...e, email: msg }));
    if (msg) return;
    setSubmitting(true);
    try {
      await http.post("/auth/forgot-password", { email: emailValue });
      toast.success("If the account exists, an OTP has been sent to your email");
      setSeconds(RESEND_SECONDS);
      setStep(2);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send OTP");
    } finally {
      setSubmitting(false);
    }
  };

  const resendOtp = async () => {
    setSubmitting(true);
    try {
      await http.post("/auth/forgot-password", { email: emailValue });
      toast.success("A new OTP has been sent");
      setOtp(Array(OTP_LENGTH).fill(""));
      setSeconds(RESEND_SECONDS);
      boxes.current[0]?.focus();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to resend OTP");
    } finally {
      setSubmitting(false);
    }
  };

  const changeDigit = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setOtp((prev) => prev.map((d, i) => (i === index ? digit : d)));
    if (digit && index < OTP_LENGTH - 1) boxes.current[index + 1]?.focus();
  };

  const keyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) boxes.current[index - 1]?.focus();
  };

  const paste = (e: React.ClipboardEvent) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!digits) return;
    e.preventDefault();
    setOtp(Array.from({ length: OTP_LENGTH }, (_, i) => digits[i] ?? ""));
    boxes.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
  };

  const verifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    const msg = otp.join("").length < OTP_LENGTH ? `Enter the ${OTP_LENGTH}-digit OTP` : "";
    setErrors((e) => ({ ...e, otp: msg }));
    if (msg) return;
    setSubmitting(true);
    try {
      await http.post("/auth/verify-otp", { email: emailValue, otp: otp.join("") });
      toast.success("Email verified successfully");
      setStep(3);
    } catch (error) {
      const message = error instanceof Error ? error.message : "OTP verification failed";
      setErrors((e) => ({ ...e, otp: message }));
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    const next = {
      password: compose(required("Password"), minLength(6))(password),
      confirm: confirm !== password ? "Passwords do not match" : required("Confirm password")(confirm),
    };
    setErrors((e) => ({ ...e, ...next }));
    if (next.password || next.confirm) return;
    setSubmitting(true);
    try {
      await http.post("/auth/reset-password", { email: emailValue, password });
      toast.success("Password updated successfully");
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update password");
    } finally {
      setSubmitting(false);
    }
  };

  const subtitles = {
    1: "Enter your registered email and we’ll send you an OTP.",
    2: `We sent a ${OTP_LENGTH}-digit OTP to ${emailValue}`,
    3: "OTP verified. Set your new password.",
  } as const;

  return (
    <AuthShell
      badge="reset password"
      title="Forgot Password"
      subtitle={subtitles[step]}
      footer={<>Remember your password? <Link href="/login" className="lb-link">Back to Login</Link></>}
    >
      <ol className="lb-auth-steps" aria-label="Progress">
        {[1, 2, 3].map((n) => <li key={n} className={n <= step ? "on" : ""}></li>)}
      </ol>

      {step === 1 && (
        <form onSubmit={sendOtp} noValidate>
          <AuthField label="Email Id" name="email" type="email" placeholder="Enter Email Id" autoComplete="email" value={emailValue} error={errors.email} onChange={setEmailValue} />
          <button type="submit" className="btn lb-btn-primary w-100" disabled={submitting}>{submitting ? "Sending..." : "Send OTP"}</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifyOtp} noValidate>
          <div className="lb-otp" onPaste={paste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { boxes.current[i] = el; }}
                className={`form-control${errors.otp ? " is-invalid" : ""}`}
                inputMode="numeric"
                maxLength={1}
                value={digit}
                aria-label={`OTP digit ${i + 1}`}
                autoFocus={i === 0}
                onChange={(e) => changeDigit(i, e.target.value)}
                onKeyDown={(e) => keyDown(i, e)}
              />
            ))}
          </div>
          {errors.otp && <p className="lb-auth-error text-center">{errors.otp}</p>}
          <p className="lb-auth-resend">
            Didn’t receive the code?{" "}
            {seconds > 0 ? <span>Resend in {seconds}s</span> : <button type="button" className="btn btn-link p-0 lb-link" onClick={resendOtp} disabled={submitting}>Resend OTP</button>}
          </p>
          <button type="submit" className="btn lb-btn-primary w-100" disabled={submitting}>{submitting ? "Verifying..." : "Verify OTP"}</button>
          <button type="button" className="btn btn-link w-100 mt-2 lb-link" onClick={() => setStep(1)}>Change email</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={resetPassword} noValidate>
          <AuthField label="New Password" name="password" type="password" placeholder="Enter New Password" autoComplete="new-password" value={password} error={errors.password} onChange={setPassword} />
          <AuthField label="Confirm Password" name="confirm" type="password" placeholder="Confirm Password" autoComplete="new-password" value={confirm} error={errors.confirm} onChange={setConfirm} />
          <button type="submit" className="btn lb-btn-primary w-100" disabled={submitting}>{submitting ? "Updating..." : "Update Password"}</button>
        </form>
      )}
    </AuthShell>
  );
}
