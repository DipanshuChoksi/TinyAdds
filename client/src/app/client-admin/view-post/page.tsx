import type { Metadata } from "next";
import PostTable from "@/components/client-admin/PostTable";

export const metadata: Metadata = { title: "View Post – TinyAdds" };

export default function ClientViewPost() {
  return (
    <PostTable title={<h6 className="lb-ca-title mb-0">View Product</h6>} />
  );
}
