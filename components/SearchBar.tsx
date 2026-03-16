'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AreaSelector } from "./AreaSelector";
import { CategorySelector } from "./CategorySelector";

interface SearchBarProps {
  showLabels?: boolean;
  defaultArea?: string;
  defaultCategory?: string;
}

function nameToSlug(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

export function SearchBar({ showLabels = false, defaultArea, defaultCategory }: SearchBarProps) {
  const router = useRouter();
  const [area, setArea] = useState<string>(defaultArea ?? "");
  const [category, setCategory] = useState<string>(defaultCategory ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const areaSlug = area ? nameToSlug(area) : "all";
    const categorySlug = category ? nameToSlug(category) : "all";
    router.push(`/find-a-trade/${areaSlug}/${categorySlug}`);
  };

  return (
    <form
      className="card flex w-full flex-col gap-4 rounded-2xl border-slate-100 bg-white/95 p-4 shadow-lg backdrop-blur md:flex-row md:items-center md:gap-0 md:p-3"
      onSubmit={handleSubmit}
    >
      {/* Area selector */}
      <div className="flex-1 border-slate-100 px-4 py-2 md:border-r">
        {showLabels && (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Where in CV?
          </p>
        )}
        <AreaSelector onChange={setArea} defaultValue={defaultArea} />
      </div>

      {/* Category selector */}
      <div className="flex-1 px-4 py-2">
        {showLabels && (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
            What do you need?
          </p>
        )}
        <CategorySelector onChange={setCategory} defaultValue={defaultCategory} />
      </div>

      {/* Search button */}
      <div className="flex w-full justify-end px-3 py-1 md:w-auto">
        <button type="submit" className="btn-primary w-full px-10 py-3.5 text-base md:w-auto">
          Search
        </button>
      </div>
    </form>
  );
}
