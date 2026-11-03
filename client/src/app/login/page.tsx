import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Login – TinyAdds" };

export default function Login() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}
