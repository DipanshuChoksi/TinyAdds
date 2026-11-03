import type { Metadata } from "next";
import PostTable from "@/components/client-admin/PostTable";

export const metadata: Metadata = { title: "View Post – TinyAdds" };

export default function ClientViewPost() {
  return (
    <>
      <h6 className="lb-ca-title">View Product</h6>
      <PostTable />
    </>
  );
}
