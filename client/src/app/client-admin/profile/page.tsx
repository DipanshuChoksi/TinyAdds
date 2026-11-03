import type { Metadata } from "next";
import ProfileForm from "@/components/client-admin/ProfileForm";

export const metadata: Metadata = { title: "Profile – TinyAdds" };

export default function ClientProfile() {
  return (
    <>
      <h6 className="lb-ca-title">Profile</h6>
      <ProfileForm />
    </>
  );
}
