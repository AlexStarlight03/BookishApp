"use client";

import { useState } from "react";
import { createBookshelf } from "@/app/actions/bookshelf";
import { getBookById } from "@/app/actions/book";
import { createBookStatus, modifyBookStatus } from "@/app/actions/bookStatus";
import { useUser } from "@stackframe/stack";

export default function AddBookForm({
  googleBooksId,
  onClose,
  onUpdate,
  currentBookshelfId,
  bookshelves: initialBookshelves,
}: {
  googleBooksId: string;
  onClose: () => void;
  onUpdate?: () => void;
  currentBookshelfId?: number;
  bookshelves: any[];
}) {
  const [selectedShelf, setSelectedShelf] = useState<string>(
    currentBookshelfId ? String(currentBookshelfId) : ""
  );
  const [showNewShelf, setShowNewShelf] = useState(false);
  const [newShelfName, setNewShelfName] = useState("");
  const [newShelfDesc, setNewShelfDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();
  const userId = user?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!userId) { setError("Utilisateur non identifié."); setLoading(false); return; }
    if (!googleBooksId) { setError("Identifiant Google Books manquant."); setLoading(false); return; }
    if (!showNewShelf && !selectedShelf) { setError("Veuillez sélectionner une étagère."); setLoading(false); return; }
    if (showNewShelf && !newShelfName) { setError("Veuillez entrer un nom pour la nouvelle étagère."); setLoading(false); return; }

    let shelfId = selectedShelf;

    if (showNewShelf && newShelfName) {
      const shelfRes = await createBookshelf({ name: newShelfName, description: newShelfDesc, idUser: userId });
      if (!shelfRes.success) { setError(shelfRes.message || "Erreur lors de la création de l'étagère."); setLoading(false); return; }
      shelfId = String(shelfRes.bookshelf?.idBookshelf);
    }


    if (currentBookshelfId && shelfId && String(shelfId) !== String(currentBookshelfId)) {
      const bookRes = await getBookById({ googleBooksId });
      const idBook = bookRes.book?.idBook;
      if (!idBook) { setError("Impossible de trouver l'id du livre."); setLoading(false); return; }
      const patchRes = await modifyBookStatus(
        { idBookshelf: currentBookshelfId, idBook },
        { idBookshelf: Number(shelfId) }
      );
      if (!patchRes.success) { setError(patchRes.message || "Erreur lors du changement d'étagère."); setLoading(false); return; }
      if (onUpdate) onUpdate();
      onClose();
      return;
    }

    if (currentBookshelfId && String(shelfId) === String(currentBookshelfId)) {
      onClose();
      return;
    }

    if (shelfId) {
      const bookStatusRes = await createBookStatus({
        googleBooksId,
        idBookshelf: Number(shelfId),
        idUser: userId,
      });
      if (!bookStatusRes.success) { setError(bookStatusRes.message || "Erreur lors de l'ajout du livre."); setLoading(false); return; }
      if (onUpdate) onUpdate();
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose} type="button">X</button>
        <h2 className="text-2xl font-bold mb-4">
          {currentBookshelfId ? "Changer d'étagère" : "Ajouter à une étagère"}
        </h2>
        {error && <div className="text-red-500 mb-3 text-sm">{error}</div>}
        <form onSubmit={handleSubmit}>
          {!showNewShelf ? (
            <>
              <label className="block mb-2 font-semibold">Choisir une étagère:</label>
              <select
                value={selectedShelf}
                onChange={(e) => setSelectedShelf(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                required
              >
                <option value="">-- Sélectionner --</option>
                {initialBookshelves.map((shelf: any) => (
                  <option key={shelf.idBookshelf} value={shelf.idBookshelf}>{shelf.name}</option>
                ))}
              </select>
              <button type="button" className="text-sm text-primary hover:underline" onClick={() => setShowNewShelf(true)}>
                Créer une nouvelle étagère
              </button>
            </>
          ) : (
            <>
              <label className="block mb-2 font-semibold">Nom de l'étagère:</label>
              <input
                type="text"
                value={newShelfName}
                onChange={(e) => setNewShelfName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                required
              />
              <label className="block mb-2 font-semibold">Description (optionnelle):</label>
              <textarea
                value={newShelfDesc}
                onChange={(e) => setNewShelfDesc(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                rows={3}
              />
              <button type="button" className="text-sm text-primary hover:underline" onClick={() => setShowNewShelf(false)}>
                Choisir une étagère existante
              </button>
            </>
          )}
          <button type="submit" disabled={loading} className="bg-primary text-black px-4 py-2 rounded mt-4 w-full">
            {loading ? "En cours..." : currentBookshelfId ? "Changer d'étagère" : "Ajouter"}
          </button>
        </form>
      </div>
    </div>
  );
}