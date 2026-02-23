"use client";

import { useEffect, useState, use } from "react";
import BookCard from "@/components/ui/BookCard";
import { useUser } from "@stackframe/stack";
import { getBookshelfById } from "@/app/actions/bookshelf";
import { getBooksFromBookshelf } from "@/app/actions/bookStatus";
import { getBookshelvesByUserId, modifyBookshelf, deleteBookshelf } from "@/app/actions/bookshelf";

const DEFAULT_SHELVES = ["À lire", "En cours", "Terminé"];

export default function BookshelfPage(context : { params: Promise<{ idBookshelf: string }> }) {
  const {idBookshelf} = use(context.params);
  if (!idBookshelf) return null;
  const [bookshelf, setBookshelf] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const [allBookshelves, setAllBookshelves] = useState<any[]>([]);
  const user = useUser();
  const userId = user?.id;

  useEffect(() => {
    async function fetchAllShelves() {
      if (!userId) return;
      const result = await getBookshelvesByUserId({ idUser: userId });
      setAllBookshelves(result?.data || []);
    }
    fetchAllShelves();
  }, [userId]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const shelfResult = await getBookshelfById({ id: Number(idBookshelf) });
        if (!shelfResult.success || !shelfResult.data) {
          setBookshelf(null);
          setLoading(false);
          return;
        }
        setBookshelf(shelfResult.data);
        setName(shelfResult.data.name);
        setDescription(shelfResult.data.description || "");
        const booksResult = await getBooksFromBookshelf({ idBookshelf: Number(idBookshelf) });
         setBooks(booksResult?.data || []);
      } catch (error) {
        alert("Erreur lors du chargement de l'étagère.");
        setBookshelf(null);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [idBookshelf]);

  const isDefault = bookshelf && DEFAULT_SHELVES.includes(bookshelf.name);

  const handleDelete = async () => {
    if (confirm("Voulez-vous vraiment supprimer cette étagère ?")) {
      await deleteBookshelf({ id: Number(idBookshelf) });
      window.location.href = "/dashboard";
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    await modifyBookshelf({ id: Number(idBookshelf) }, { name, description });
    setEditMode(false);
    setBookshelf({ ...bookshelf, name, description });
  };

  if (loading) return <div>Chargement...</div>;
  if (!bookshelf) return <div>Étagère introuvable.</div>;

  return (
    <div className="main-block bg-card">
      <div className="mb-6 flex items-center gap-4">
        {editMode ? (
          <form onSubmit={handleEdit} className="flex flex-col gap-2">
            <input
              className="border rounded px-2 py-1"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <textarea
              className="border rounded px-2 py-1"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description"
            />
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">Enregistrer</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>Annuler</button>
            </div>
          </form>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-bold">{bookshelf.name}</h1>
              {bookshelf.description && <p className="text-gray-600">{bookshelf.description}</p>}
            </div>
            {!isDefault && (
              <div className="ml-auto flex gap-2">
                <button className="btn btn-warning" onClick={() => setEditMode(true)}>Modifier</button>
                <button className="btn btn-danger" onClick={handleDelete}>Supprimer</button>
              </div>
            )}
          </>
        )}
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {books.length > 0 ? (
          books
            .filter(bookStatus => bookStatus.book && bookStatus.bookshelf)
            .map((bookStatus, idx) => (
              <li key={bookStatus.book.idBook}>
                <BookCard
                  book={bookStatus}
                  userBookshelves={allBookshelves}
                  onUpdate={() => window.location.reload()}
                />
              </li>
            ))
        ) : (
          <div>Aucun livre dans cette étagère.</div>
        )}
      </ul>
    </div>
  );
}