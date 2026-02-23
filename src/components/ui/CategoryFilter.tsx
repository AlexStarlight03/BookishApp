"use client";
import { useState } from "react";

export default function CategoryFilter({
  categories,
  selected,
  onChange,
}: {
  categories: string[];
  selected: string[];
  onChange: (cats: string[]) => void;
}) {
  const sortedCategories = [...categories].sort((a, b) => a.localeCompare(b));
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4 relative">
      <div className="flex gap-2 flex-wrap mb-2">
        {selected.map((cat) => (
          <span
            key={cat}
            className="flex items-center px-3 py-1 rounded-full bg-[var(--accent)] text-white font-semibold text-sm shadow-md border border-[var(--accent)]"
          >
            {cat}
            <button
              className="ml-2 text-xs font-bold bg-transparent text-white hover:text-[var(--highlight)] focus:outline-none"
              onClick={() => onChange(selected.filter((c) => c !== cat))}
              aria-label={`Retirer ${cat}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <button
        className="px-4 py-2 rounded-full border shadow-md font-semibold text-sm bg-[var(--highlight)] text-[var(--accent-dark)] border-[var(--highlight)] hover:bg-[var(--accent)] hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        Choisir des catégories
        <span className="ml-2">▼</span>
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 max-h-60 overflow-y-auto">
          {sortedCategories.map((cat) => (
            <button
              key={cat}
              className={`w-full text-left px-3 py-2 rounded-md font-medium text-sm transition-all duration-150 focus:outline-none ${
                selected.includes(cat)
                  ? "bg-[var(--accent)] text-white"
                  : "bg-transparent text-[var(--accent-dark)] hover:bg-[var(--highlight)] hover:text-[var(--accent)]"
              }`}
              onClick={() => {
                if (selected.includes(cat)) {
                  onChange(selected.filter((c) => c !== cat));
                } else {
                  onChange([...selected, cat]);
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}