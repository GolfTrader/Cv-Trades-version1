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

// Convert display name to URL slug e.g. "Leamington Spa" -> "leamington-spa"
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
      className="card -mt-8 flex w-full flex-col gap-3 rounded-full border-slate-100 bg-white/90 p-3 shadow-soft backdrop-blur md:-mt-10 md:flex-row md:items-center md:gap-0 md:p-2"
      onSubmit={handleSubmit}
    >
      <div className="flex-1 rounded-full border-t border-slate-100 px-3 py-1 md:border-l md:border-t-0 md:px-4 md:py-2">
        {showLabels && (
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            Where in CV?
          </p>
        )}
        <AreaSelector onChange={setArea} defaultValue={defaultArea} />
      </div>
      <div className="flex-1 rounded-full px-3 py-1 md:px-4 md:py-2">
        {showLabels && (
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            What do you need?
          </p>
        )}
        <CategorySelector onChange={setCategory} defaultValue={defaultCategory} />
      </div>
      <div className="flex w-full justify-end rounded-full px-2 py-1 md:w-auto md:px-1">
        <button type="submit" className="btn-primary w-full md:w-auto">
          Search
        </button>
      </div>
    </form>
  );
}
