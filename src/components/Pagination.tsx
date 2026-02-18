"use client";

export default function Pagination({ page, totalPages, onPage }: { page: number, totalPages: number, onPage: (p: number) => void }) {
  return (
    <div className="flex gap-2 justify-center my-4">
      <button disabled={page === 1} onClick={() => onPage(page - 1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Précédent</button>
      <span className="px-2">{page} / {totalPages}</span>
      <button disabled={page === totalPages} onClick={() => onPage(page + 1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Suivant</button>
    </div>
  );
}