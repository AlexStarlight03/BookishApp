"use client";
import { BookshelfCard } from "@/components/ui/BookshelfCard";

import { useState } from "react";
import { deleteBookshelf, modifyBookshelf } from "@/app/actions/bookshelf";

export default function BookshelvesClient({ bookshelves }: { bookshelves: any[] }) {
  const [editShelf, setEditShelf] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const handleEdit = (id: number) => {
    const shelf = bookshelves.find(s => s.idBookshelf === id);
    setEditShelf(shelf);
    setEditName(shelf?.name || "");
    setEditDesc(shelf?.description || "");
  };
  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cette étagère ?")) {
      await deleteBookshelf({ id });
      window.location.reload();
    }
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editShelf) return;
    await modifyBookshelf({ id: editShelf.idBookshelf }, { name: editName, description: editDesc });
    setEditShelf(null);
    window.location.reload();
  };
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {bookshelves.map(shelf => (
          <BookshelfCard
            key={shelf.idBookshelf}
            idBookshelf={shelf.idBookshelf}
            name={shelf.name}
            description={shelf.description}
            bookCount={shelf.booksBookshelf?.length || 0}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {editShelf && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setEditShelf(null)} type="button">X</button>
            <h2 className="text-2xl font-bold mb-4">Modifier l'étagère</h2>
            <form onSubmit={handleEditSubmit}>
              <label className="block mb-2 font-semibold">Nom:</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                required
              />
              <label className="block mb-2 font-semibold">Description:</label>
              <textarea
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                rows={3}
              />
              <button
                type="submit"
                className="bg-[var(--accent)] text-white px-4 py-2 rounded mt-4 font-semibold"
              >
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
