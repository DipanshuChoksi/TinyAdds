"use client";

import BundledEditor from "@/components/BundledEditor";

type Props = { value: string; onChange: (html: string) => void; placeholder?: string };

export default function RichTextEditor({ value, onChange, placeholder = "Write description..." }: Props) {
  return (
    <div className="lb-ca-editor">
      <BundledEditor
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

