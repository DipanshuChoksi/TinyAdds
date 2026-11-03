import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Register – TinyAdds" };

export default function Register() {
  return (
    <main>
      <RegisterForm />
    </main>
  );
}
