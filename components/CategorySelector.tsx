'use client';

import { useState, useRef, useEffect } from "react";
import { CATEGORIES } from "@/lib/data";

interface CategorySelectorProps {
  onChange?: (value: string) => void;
  defaultValue?: string;
}

export function CategorySelector({ onChange, defaultValue }: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(defaultValue ?? null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (categoryLabel: string) => {
    setSelected(categoryLabel);
    onChange?.(categoryLabel);
    setOpen(false);
  };

  const selectedLabel =
    CATEGORIES.find((c) => c.label === selected)?.label ?? "Select trade category";

  return (
    <div ref={ref} className="relative flex items-center gap-3">
      {/* Wrench icon */}
      <svg className="hidden sm:block flex-shrink-0 text-slate-400" width="18" height="18" viewBox="0 0 16 16" fill="none">
        <path d="M10.5 2a3.5 3.5 0 00-3.3 4.6L2.4 11.4a1.4 1.4 0 002 2L9.4 8.6A3.5 3.5 0 1010.5 2zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="currentColor"/>
      </svg>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-base text-slate-800 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={selected ? "text-slate-800" : "text-slate-400"}>{selectedLabel}</span>
        <span className="ml-2 text-sm text-slate-400">▾</span>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-[200] mt-2 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
          <button
            type="button"
            className="flex w-full items-center px-4 py-3 text-sm text-slate-400 hover:bg-slate-50"
            onClick={() => handleSelect("")}
          >
            All categories
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              className="flex w-full items-center justify-between px-4 py-3 text-sm text-slate-800 hover:bg-slate-50"
              onClick={() => handleSelect(category.label)}
            >
              <span>{category.label}</span>
              {selected === category.label && <span className="text-xs text-primary">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
