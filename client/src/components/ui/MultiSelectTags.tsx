"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

export type TagOption = {
  label: string;
  value: string; // The Tag _id
};

interface MultiSelectTagsProps {
  value: string[]; // Array of selected Tag _ids
  onChange: (selectedIds: string[]) => void;
  options: TagOption[];
  onCreateTag?: (tagName: string) => Promise<TagOption | null>;
  placeholder?: string;
  disabled?: boolean;
}

export default function MultiSelectTags({
  value,
  onChange,
  options,
  onCreateTag,
  placeholder = "Search or select tags...",
  disabled = false,
}: MultiSelectTagsProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectedOptions = useMemo(() => {
    return value
      .map((id) => options.find((opt) => opt.value === id) || { label: id, value: id })
      .filter(Boolean);
  }, [value, options]);

  const trimmedQuery = query.trim().toLowerCase();

  const filteredOptions = useMemo(() => {
    if (!trimmedQuery) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(trimmedQuery));
  }, [options, trimmedQuery]);

  const exactMatchExists = useMemo(() => {
    if (!trimmedQuery) return true;
    return options.some((opt) => opt.label.toLowerCase() === trimmedQuery);
  }, [options, trimmedQuery]);

  const handleToggleOption = (tagId: string) => {
    if (value.includes(tagId)) {
      onChange(value.filter((id) => id !== tagId));
    } else {
      onChange([...value, tagId]);
    }
  };

  const handleRemove = (tagId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((id) => id !== tagId));
  };

  const handleCreateNew = async () => {
    if (!query.trim() || creating || !onCreateTag) return;
    try {
      setCreating(true);
      const newTag = await onCreateTag(query.trim());
      if (newTag) {
        if (!value.includes(newTag.value)) {
          onChange([...value, newTag.value]);
        }
        setQuery("");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!exactMatchExists && query.trim() && onCreateTag) {
        handleCreateNew();
      } else if (filteredOptions.length > 0) {
        handleToggleOption(filteredOptions[0].value);
        setQuery("");
      }
    } else if (e.key === "Backspace" && !query && value.length > 0) {
      onChange(value.slice(0, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={root} className={`position-relative w-100 ${open ? "is-open" : ""}`}>
      {/* Input container box */}
      <div
        className="form-control lb-ca-input d-flex flex-wrap align-items-center gap-1 p-2"
        style={{
          minHeight: "44px",
          background: disabled ? "var(--lb-soft, #f8f6f4)" : "#fff",
          borderColor: open ? "var(--lb-primary, #b84d28)" : undefined,
          boxShadow: open ? "0 0 0 3px rgba(184, 77, 40, 0.12)" : undefined,
          cursor: disabled ? "not-allowed" : "text",
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        }}
        onClick={() => {
          if (!disabled) {
            setOpen(true);
            searchInputRef.current?.focus();
          }
        }}
      >
        {selectedOptions.map((opt) => (
          <span
            key={opt.value}
            className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill"
            style={{
              fontSize: "0.82rem",
              fontWeight: 500,
              backgroundColor: "rgba(184, 77, 40, 0.08)",
              color: "var(--lb-primary, #b84d28)",
              border: "1px solid rgba(184, 77, 40, 0.22)",
            }}
          >
            <span>{opt.label}</span>
            {!disabled && (
              <button
                type="button"
                className="border-0 bg-transparent p-0 ms-1 d-inline-flex align-items-center justify-content-center"
                style={{
                  color: "var(--lb-primary, #b84d28)",
                  cursor: "pointer",
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  opacity: 0.75,
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.75")}
                aria-label={`Remove tag ${opt.label}`}
                onClick={(e) => handleRemove(opt.value, e)}
              >
                <i className="bi bi-x fs-6" style={{ lineHeight: 1 }} />
              </button>
            )}
          </span>
        ))}

        <input
          ref={searchInputRef}
          type="text"
          className="border-0 bg-transparent flex-grow-1 p-1"
          style={{
            outline: "none",
            minWidth: "140px",
            fontSize: "0.88rem",
            color: "var(--lb-ink, #2d2621)",
          }}
          placeholder={value.length === 0 ? placeholder : ""}
          value={query}
          disabled={disabled}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />

        <div className="ms-auto pe-1 text-muted small" style={{ pointerEvents: "none" }}>
          <i
            className={`bi bi-chevron-${open ? "up" : "down"}`}
            style={{ fontSize: "0.75rem", color: "var(--lb-text, #85756c)" }}
          />
        </div>
      </div>

      {/* Dropdown Panel matching .lb-dd-panel styling */}
      {open && !disabled && (
        <div
          className="lb-dd-panel"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "calc(100% + 0.35rem)",
            zIndex: 1050,
            background: "#fff",
            border: "1px solid var(--lb-line, #eadfd7)",
            borderRadius: "0.75rem",
            padding: "0.4rem",
            boxShadow: "0 0.8rem 1.8rem rgba(59, 36, 24, 0.12)",
            maxHeight: "240px",
            overflowY: "auto",
          }}
        >
          {query.trim() && !exactMatchExists && onCreateTag && (
            <div className="mb-1 pb-1 border-bottom" style={{ borderColor: "var(--lb-line, #eadfd7)" }}>
              <button
                type="button"
                className="w-100 text-start btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded"
                style={{
                  background: "rgba(184, 77, 40, 0.06)",
                  color: "var(--lb-primary, #b84d28)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
                onClick={handleCreateNew}
                disabled={creating}
              >
                <i className="bi bi-plus-circle" />
                <span>{creating ? "Creating..." : `Create new tag "${query.trim()}"`}</span>
              </button>
            </div>
          )}

          <ul className="lb-dd-list" role="listbox" id={listId}>
            {filteredOptions.length === 0 && (!query.trim() || exactMatchExists) ? (
              <li className="lb-dd-none">No tags found</li>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = value.includes(opt.value);
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    className="d-flex align-items-center justify-content-between px-3 py-2 rounded"
                    style={{
                      cursor: "pointer",
                      fontSize: "0.88rem",
                      backgroundColor: isSelected ? "rgba(184, 77, 40, 0.08)" : "transparent",
                      color: isSelected ? "var(--lb-primary, #b84d28)" : "var(--lb-ink, #2d2621)",
                      fontWeight: isSelected ? 600 : 400,
                      transition: "background-color 0.12s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "var(--lb-soft, #f8f6f4)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleToggleOption(opt.value);
                    }}
                  >
                    <span className="d-flex align-items-center gap-2">
                      <span
                        className="d-inline-flex align-items-center justify-content-center rounded"
                        style={{
                          width: "18px",
                          height: "18px",
                          border: isSelected
                            ? "1.5px solid var(--lb-primary, #b84d28)"
                            : "1.5px solid #d1c7be",
                          backgroundColor: isSelected ? "var(--lb-primary, #b84d28)" : "#fff",
                          color: "#fff",
                          fontSize: "0.7rem",
                          transition: "all 0.12s ease",
                        }}
                      >
                        {isSelected && <i className="bi bi-check" style={{ strokeWidth: 2 }} />}
                      </span>
                      <span>{opt.label}</span>
                    </span>
                    {isSelected && (
                      <span
                        className="small"
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--lb-primary, #b84d28)",
                          fontWeight: 500,
                        }}
                      >
                        Selected
                      </span>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
