"use client";

import { Editor } from "@tinymce/tinymce-react";

type Props = { value: string; onChange: (html: string) => void; placeholder?: string };

export default function RichTextEditor({ value, onChange, placeholder = "Write description..." }: Props) {
  const apiKey = process.env.VITE_TINYMCE_API_KEY ?? "";

  return (
    <div className="lb-ca-editor">
      <Editor
        apiKey={apiKey}
        tinymceScriptSrc={`https://cdn.tiny.cloud/1/${apiKey}/tinymce/7/tinymce.min.js`}
        value={value}
        onEditorChange={onChange}
        init={{
          height: 320,
          menubar: false,
          branding: false,
          promotion: false,
          placeholder,
          plugins: "lists link table code",
          toolbar: "undo redo | blocks | bold italic underline | bullist numlist | alignleft aligncenter alignright | link table | removeformat code",
        }}
      />
    </div>
  );
}
