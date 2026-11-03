import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Forgot Password – TinyAdds" };

export default function ForgotPassword() {
  return (
    <main>
      <ForgotPasswordForm />
    </main>
  );
}
