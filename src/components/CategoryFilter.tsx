"use client";

const categories = ["Fiction", "Non-Fiction", "Romance", "Sci-Fi", "Fantasy"];

export default function CategoryFilter({ selected, onChange }: { selected: string[], onChange: (cats: string[]) => void }) {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {categories.map(cat => (
        <button
          key={cat}
          className={`px-3 py-1 rounded-full border ${selected.includes(cat) ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() =>
            onChange(selected.includes(cat) ? selected.filter(c => c !== cat) : [...selected, cat])
          }
        >
          {cat}
        </button>
      ))}
    </div>
  );
}