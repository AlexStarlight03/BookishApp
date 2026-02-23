"use client";

import { createBookshelf } from "@/app/actions/bookshelf";

export default function CreateBookshelfForm({
  userId,
  onCreated,
  onClose,
}: {
  userId: string;
  onCreated?: (shelf: any) => void;
  onClose?: () => void;
}) {


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const desc = (form.elements.namedItem("desc") as HTMLTextAreaElement).value;

    if (!userId) {
      alert("Utilisateur non identifié.");
      return;
    }
    if (!name.trim()) {
      alert("Veuillez entrer un nom pour l'étagère.");
      return;
    }
    const shelfData = await createBookshelf({
      name,
      description: desc,
      idUser: userId,
    });
    if (!shelfData.success) {
      alert(shelfData.message || "Erreur lors de la création de l'étagère.");
      return;
    }
    if (onCreated) onCreated(shelfData.bookshelf);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose}
          type="button"
        >
          X
        </button>
        <h2 className="text-2xl font-bold mb-4">Créer une nouvelle étagère</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold">Nom de l'étagère:</label>
          <input
            type="text"
            name="name"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            required
          />
          <label className="block mb-2 font-semibold">Description (optionnelle):</label>
          <textarea
            name="desc"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            rows={3}
          />
          <button
            type="submit"
            className="bg-[var(--accent)] text-white px-4 py-2 rounded mt-4 font-semibold"
          >
            Créer
          </button>
        </form>
      </div>
    </div>
  );
}