"use client";
import { useState, useEffect } from "react";
import CategoryFilter from "@/components/ui/CategoryFilter";
import SearchBar from "@/components/ui/SearchBar";
import BookCard from "@/components/ui/BookCard";
import Pagination from "@/components/ui/Pagination";

type Category = { name: string; idCategory: number };

export default function ExploreClient({ categories }: { categories: Category[] }) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const PAGE_SIZE = 20;

  const fetchGoogleBooks = async (query: string, currentPage: number) => {
    if (!query) return;
    setLoading(true);
    let q = query;
    if (selectedCategories[0]) {
      q += ` subject:${selectedCategories[0]}`;
    }
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    try {
      const response = await fetch(
        `/api/google-books?q=${encodeURIComponent(q)}&maxResults=${PAGE_SIZE}&startIndex=${startIndex}`
      );
      if (!response.ok) throw new Error("Erreur API");
      const data = await response.json();
      const mappedBooks = (data.items || []).map((item: any) => {
        const info = item.volumeInfo || {};
        return {
          googleBooksId: item.id,
          title: info.title || "Sans titre",
          authors: info.authors || [],
          cover_img_url:
            info.imageLinks?.thumbnail ||
            info.imageLinks?.smallThumbnail ||
            null,
          description: info.description || "",
          nb_pages: info.pageCount || null,
        };
      });
      setBooks(mappedBooks);
      setTotalPages(Math.min(10, Math.max(1, Math.ceil((data.totalItems || 1) / PAGE_SIZE))));
    } catch (error) {
      console.error("Erreur lors de la récupération des livres :", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      fetchGoogleBooks(searchQuery, page);
    } else {
      setBooks([]);
    }
  }, [selectedCategories, page, searchQuery]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setPage(1);
  };

  return (
    <div className="main-block bg-card">
      <h1 className="book-title text-center">Explorer les livres</h1>
      <CategoryFilter
        categories={categories.map((cat) => cat.name)}
        selected={selectedCategories}
        onChange={setSelectedCategories}
      />
      <SearchBar onSearch={handleSearch} />
      {loading && <div className="text-center py-8">Chargement...</div>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {books.map((book, idx) => (
          <BookCard key={book.googleBooksId || idx} book={book} userBookshelves={[]} />
        ))}
      </div>
      {books.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      )}
    </div>
  );
}