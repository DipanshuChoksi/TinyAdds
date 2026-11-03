"use client";

import { useEffect, useRef } from "react";

type Props = { value: string; onChange: (html: string) => void; placeholder?: string };

const TOOLS: { cmd: string; icon: string; title: string; arg?: string }[] = [
  { cmd: "bold", icon: "bi-type-bold", title: "Bold" },
  { cmd: "italic", icon: "bi-type-italic", title: "Italic" },
  { cmd: "underline", icon: "bi-type-underline", title: "Underline" },
  { cmd: "insertUnorderedList", icon: "bi-list-ul", title: "Bullet list" },
  { cmd: "insertOrderedList", icon: "bi-list-ol", title: "Numbered list" },
  { cmd: "justifyLeft", icon: "bi-text-left", title: "Align left" },
  { cmd: "justifyCenter", icon: "bi-text-center", title: "Align center" },
  { cmd: "justifyRight", icon: "bi-text-right", title: "Align right" },
  { cmd: "removeFormat", icon: "bi-eraser", title: "Clear formatting" },
];

/** Lightweight rich-text editor (no extra package). Swap with CKEditor/TinyMCE later if needed. */
export default function RichTextEditor({ value, onChange, placeholder = "Write description..." }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // keep DOM in sync when parent resets the value
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value;
  }, [value]);

  const run = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    onChange(ref.current?.innerHTML ?? "");
  };

  const addLink = () => {
    const url = window.prompt("Enter link URL (https://...)");
    if (url) run("createLink", url);
  };

  return (
    <div className="lb-ca-editor">
      <div className="lb-ca-editor-bar">
        {TOOLS.map((t) => (
          <button key={t.cmd} type="button" title={t.title} aria-label={t.title} onMouseDown={(e) => { e.preventDefault(); run(t.cmd, t.arg); }}>
            <i className={`bi ${t.icon}`}></i>
          </button>
        ))}
        <button type="button" title="Insert link" aria-label="Insert link" onMouseDown={(e) => { e.preventDefault(); addLink(); }}><i className="bi bi-link-45deg"></i></button>
      </div>
      <div
        ref={ref}
        className="lb-ca-editor-area"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={() => onChange(ref.current?.innerHTML ?? "")}
      />
    </div>
  );
}
