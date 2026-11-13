import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create an Account",
  robots: { index: false, follow: false },
};

export default function Register() {
  return (
    <main>
      <RegisterForm />
    </main>
  );
}
