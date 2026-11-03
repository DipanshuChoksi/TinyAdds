import type { Metadata } from "next";
import AddPostForm from "@/components/client-admin/AddPostForm";

export const metadata: Metadata = { title: "Add Post – TinyAdds" };

export default function ClientAddPost() {
  return (
    <>
      <h6 className="lb-ca-title">Add Post</h6>
      <AddPostForm />
    </>
  );
}
