"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

type Option = string | { label: string; value: string };

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  /** Show the placeholder as the first selectable item (lets the user clear the value). */
  allowEmpty?: boolean;
  /** Search box inside the list. Default: automatic when there are more than 8 options. */
  searchable?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
};

/** Custom themed select (replaces the browser's default <select>). */
export default function Dropdown({ value, onChange, options, placeholder = "-- Select --", allowEmpty = false, searchable, disabled, ariaLabel }: Props) {
  const items = useMemo(() => options.map((o) => (typeof o === "string" ? { label: o, value: o } : o)), [options]);
  const canSearch = searchable ?? items.length > 8;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [up, setUp] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? items.filter((i) => i.label.toLowerCase().includes(q)) : items;
    return allowEmpty && !q ? [{ label: placeholder, value: "" }, ...filtered] : filtered;
  }, [items, query, allowEmpty, placeholder]);

  const selected = items.find((i) => i.value === value);

  const openMenu = () => {
    if (disabled) return;
    const rect = root.current?.getBoundingClientRect();
    if (rect) {
      const below = window.innerHeight - rect.bottom;
      setUp(below < 300 && rect.top > below);
    }
    setActive(Math.max(0, visible.findIndex((i) => i.value === value)));
    setOpen(true);
  };

  const closeMenu = () => { setOpen(false); setQuery(""); };

  const choose = (v: string) => { onChange(v); closeMenu(); };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) closeMenu(); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => { if (open && canSearch) searchRef.current?.focus(); }, [open, canSearch]);

  useEffect(() => {
    if (open) (list.current?.children[active] as HTMLElement | undefined)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); openMenu(); }
      return;
    }
    if (e.key === "Escape") { e.preventDefault(); closeMenu(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, visible.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (visible[active]) choose(visible[active].value); }
    else if (e.key === "Tab") closeMenu();
  };

  return (
    <div className={`lb-dd${open ? " is-open" : ""}${up ? " is-up" : ""}`} ref={root} onKeyDown={onKeyDown}>
      <button type="button" className="lb-dd-trigger" disabled={disabled} aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} aria-label={ariaLabel} onClick={() => (open ? closeMenu() : openMenu())}>
        <span className={selected && selected.value ? "" : "lb-dd-placeholder"}>{selected && selected.value ? selected.label : placeholder}</span>
        <i className="bi bi-chevron-down"></i>
      </button>

      {open && (
        <div className="lb-dd-panel">
          {canSearch && (
            <div className="lb-dd-search">
              <i className="bi bi-search"></i>
              <input ref={searchRef} type="text" placeholder="Search..." value={query} onChange={(e) => { setQuery(e.target.value); setActive(0); }} />
            </div>
          )}
          <ul className="lb-dd-list" role="listbox" id={listId} ref={list}>
            {visible.map((item, i) => (
              <li
                key={`${item.value}-${i}`}
                role="option"
                aria-selected={item.value === value}
                className={`lb-dd-item${item.value === value ? " selected" : ""}${i === active ? " active" : ""}${item.value === "" ? " is-empty" : ""}`}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => { e.preventDefault(); choose(item.value); }}
              >
                <span>{item.label}</span>
                {item.value === value && item.value !== "" && <i className="bi bi-check2"></i>}
              </li>
            ))}
            {visible.length === 0 && <li className="lb-dd-none">No result found</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
