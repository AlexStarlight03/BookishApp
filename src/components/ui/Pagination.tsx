export default function Pagination({ page, totalPages, onPage }: { page: number, totalPages: number, onPage: (p: number) => void }) {
  return (
    <div className="bg-card rounded-xl shadow-md flex gap-4 justify-center items-center py-4 my-6">
      <button
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
        className="book-button bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 text-white font-semibold px-5 py-2 rounded-full shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
      >
        Précédent
      </button>
      <span className="px-4 text-lg font-bold text-primary">
        {page} / {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={() => onPage(page + 1)}
        className="book-button bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-white font-semibold px-5 py-2 rounded-full shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
      >
        Suivant
      </button>
    </div>
  );
}