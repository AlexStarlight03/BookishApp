"use client";
import { useState } from "react";
import { BookshelfCard } from "@/components/ui/BookshelfCard";
import { deleteBookshelf } from "@/app/actions/bookshelf";
import EditBookshelfModal from "@/components/ui/EditBookshelfModal";

export default function DashboardBookshelvesClient({ bookshelves }: { bookshelves: any[] }) {
  const [editingShelf, setEditingShelf] = useState<any | null>(null);

  const handleEdit = (id: number) => {
    const shelf = bookshelves.find((s: any) => s.idBookshelf === id);
    setEditingShelf(shelf);
  };
  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cette étagère ?")) {
      const res = await deleteBookshelf({ id });
      if (res.success) {
        alert("Étagère supprimée avec succès.");
        window.location.reload();
      } else {
        alert(res.message || "Erreur lors de la suppression.");
      }
    }
  };
  const handleUpdated = () => {
    window.location.reload();
  };

  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {bookshelves.map((shelf: any) => (
          <li key={shelf.idBookshelf}>
            <BookshelfCard
              idBookshelf={shelf.idBookshelf}
              name={shelf.name}
              description={shelf.description}
              bookCount={shelf.bookCount}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </li>
        ))}
      </ul>
      {editingShelf && (
        <EditBookshelfModal
          shelf={editingShelf}
          onClose={() => setEditingShelf(null)}
          onUpdated={handleUpdated}
        />
      )}
    </>
  );
}
