"use client";
import { useEffect, useState } from "react";

export default function ClientAddBookForm({
    googleBooksId,
    onClose,
    onUpdate,
    currentBookshelfId,
    userId,
    bookshelves,
}: {
    googleBooksId: string;
    onClose: () => void;
    onUpdate?: () => void;
    currentBookshelfId?: number;
    userId: string;
    bookshelves: any[];
}) {
    const [selectedShelf, setSelectedShelf] = useState<string>(currentBookshelfId ? String(currentBookshelfId) : "");
    const [showNewShelf, setShowNewShelf] = useState(false);
    const [newShelfName, setNewShelfName] = useState("");
    const [newShelfDesc, setNewShelfDesc] = useState("");

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>X</button>
                <h2 className="text-2xl font-bold mb-4">
                    {currentBookshelfId ? "Changer d'étagère" : "Ajouter à une étagère"}
                </h2>
                <div>
                    {!showNewShelf ? (
                        <>
                            <label className="block mb-2 font-semibold">Choisir une étagère:</label>
                            <select
                                name="selectedShelf"
                                value={selectedShelf}
                                onChange={(e) => setSelectedShelf(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                                required
                            >
                                <option value="">-- Sélectionner --</option>
                                {bookshelves.map((shelf) => (
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
                                name="newShelfName"
                                type="text"
                                value={newShelfName}
                                onChange={(e) => setNewShelfName(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                                required
                            />
                            <label className="block mb-2 font-semibold">Description (optionnelle):</label>
                            <textarea
                                name="newShelfDesc"
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
                    <input type="hidden" name="showNewShelf" value={showNewShelf ? "true" : "false"} />
                    <button type="submit" className="bg-primary text-black px-4 py-2 rounded mt-4">
                        {currentBookshelfId ? "Changer d'étagère" : "Ajouter"}
                    </button>
                </div>
            </div>
        </div>
    );
}
