import Link from "next/link";

type BookshelfCardProps = {
  idBookshelf: number;
  name: string;
  description?: string;
  bookCount: number;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
};

const DEFAULT_SHELVES = ["À lire", "En cours", "Terminés"];

export function BookshelfCard({ idBookshelf, name, description, bookCount, onEdit, onDelete }: BookshelfCardProps) {
  const isDefault = DEFAULT_SHELVES.includes(name);
  return (
    <div className="bookshelf-card group relative bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:border-purple-400 hover:shadow-xl transition-all cursor-pointer">
      <Link href={`/by-bookshelf/${idBookshelf}`} className="absolute inset-0 z-10" tabIndex={-1} aria-label={`Voir l'étagère ${name}`}></Link>
      <div className="bookshelf-header flex items-center justify-between">
        <h3 className="font-bold text-lg text-purple-700 truncate">{name}</h3>
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">{bookCount} livres</span>
      </div>
      {description && <p className="bookshelf-description text-gray-500 mt-2 text-sm line-clamp-2">{description}</p>}
      {!isDefault && (
        <div className="flex gap-2 mt-4 justify-end z-20 relative">
          <button
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white font-bold shadow hover:scale-105 hover:bg-yellow-500 transition-all"
            onClick={e => { e.stopPropagation(); e.preventDefault(); onEdit && onEdit(idBookshelf); }}
          >
            Modifier
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-400 via-pink-400 to-purple-500 text-white font-bold shadow hover:scale-105 hover:bg-red-500 transition-all"
            onClick={e => { e.stopPropagation(); e.preventDefault(); onDelete && onDelete(idBookshelf); }}
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}