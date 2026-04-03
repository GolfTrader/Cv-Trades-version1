'use client';

import { useState, useRef, useEffect } from "react";
import { AREAS } from "@/lib/data";

interface AreaSelectorProps {
  onChange?: (value: string) => void;
  defaultValue?: string;
}

export function AreaSelector({ onChange, defaultValue }: AreaSelectorProps) {
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

  const handleSelect = (area: string) => {
    setSelected(area);
    onChange?.(area);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative flex items-center gap-3">
      {/* Pin icon */}
      <svg className="hidden sm:block flex-shrink-0 text-slate-400" width="18" height="18" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.375 4.5 8.5 4.5 8.5S12.5 9.375 12.5 6c0-2.485-2.015-4.5-4.5-4.5zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="currentColor"/>
      </svg>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-base text-slate-800 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={selected ? "text-slate-800" : "text-slate-400"}>{selected ?? "Select area"}</span>
        <span className="ml-2 text-sm text-slate-400">▾</span>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-[200] mt-2 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
          <button
            type="button"
            className="flex w-full items-center px-4 py-3 text-sm text-slate-400 hover:bg-slate-50"
            onClick={() => handleSelect("")}
          >
            All areas
          </button>
          {AREAS.map((area) => (
            <button
              key={area}
              type="button"
              className="flex w-full items-center justify-between px-4 py-3 text-sm text-slate-800 hover:bg-slate-50"
              onClick={() => handleSelect(area)}
            >
              <span>{area}</span>
              {selected === area && <span className="text-xs text-primary">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
