"use client";
import { useState } from "react";
import { modifyBookshelf } from "@/app/actions/bookshelf";

export default function EditBookshelfModal({ shelf, onClose, onUpdated }: { shelf: any; onClose?: () => void; onUpdated?: (shelf: any) => void; }) {
  const [name, setName] = useState(shelf.name || "");
  const [desc, setDesc] = useState(shelf.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await modifyBookshelf({ id: shelf.idBookshelf }, { name, description: desc });
    setLoading(false);
    if (!res.success) {
      setError(res.message || "Erreur lors de la modification.");
      return;
    }
    if (onUpdated) onUpdated(res.data);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose} type="button">X</button>
        <h2 className="text-2xl font-bold mb-4">Modifier l'étagère</h2>
        {error && <div className="text-red-500 mb-3 text-sm">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold">Nom de l'étagère:</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            required
          />
          <label className="block mb-2 font-semibold">Description (optionnelle):</label>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            rows={3}
          />
          <button
            type="submit"
            className="bg-[var(--accent)] text-white px-4 py-2 rounded mt-4 font-semibold"
            disabled={loading}
          >
            {loading ? "En cours..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
