'use client';

import { useState } from "react";
import { AREAS } from "@/lib/data";

interface AreaSelectorProps {
  onChange?: (value: string) => void;
}

export function AreaSelector({ onChange }: AreaSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (area: string) => {
    setSelected(area);
    onChange?.(area);
    setOpen(false);
  };

  return (
    <div className="relative flex items-center gap-2">
      <span className="hidden text-slate-400 sm:inline">📍</span>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-full border border-slate-200 bg-white px-4 py-2 text-left text-sm text-slate-800 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{selected ?? "Select area"}</span>
        <span className="ml-2 text-xs text-slate-400">▾</span>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
          {AREAS.map((area) => (
            <button
              key={area}
              type="button"
              className="flex w-full items-center justify-between px-4 py-2 text-sm text-slate-800 hover:bg-slate-50"
              onClick={() => handleSelect(area)}
            >
              <span>{area}</span>
              {selected === area && (
                <span className="text-xs text-primary">Selected</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

