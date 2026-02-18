"use client";
import { useState, useEffect } from "react";
import  CategoryFilter  from "@/components/CategoryFilter";
import  SearchBar  from "@/components/SearchBar";
import  BookCard  from "@/components/BookCard";
// import Pagination from "@/components/Pagination";

export default function ExplorePage() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [books, setBooks] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("titre");

    const fetchGoogleBooks = async (searchQuery: string, type: string) => {
        if (!searchQuery) return;
        let q = searchQuery;
        if (type === "author") q = `inauthor:${searchQuery}`;
        else if (type === "series") q = `inpublisher:${searchQuery}`; // Google Books doesn't have "series", so you may want to adjust this
        // Default is title
        try {
            const response = await fetch(`/api/google-books?q=${encodeURIComponent(q)}`);
            const data = await response.json();
            setBooks(data.items || []);
            setTotalPages(1);
        } catch (error) {
            console.error("Erreur lors de la récupération des livres Google Books :", error);
        }
    };

    useEffect(() => {
        if (searchQuery) {
            fetchGoogleBooks(searchQuery, searchType);
        } else {
            setBooks([]);
        }
    }, [selectedCategories, page, searchQuery, searchType]);

    const handleSearch = (q: string, type: string) => {
        setSearchQuery(q);
        setSearchType(type);
        setPage(1);
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Explorer les livres</h1>
            <CategoryFilter selected={selectedCategories} onChange={setSelectedCategories} />
            <SearchBar onSearch={handleSearch} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {books.map((book, idx) => <BookCard key={idx} book={book} />)}
            </div>
            {/* <Pagination page={page} totalPages={totalPages} onPage={setPage} /> */}
        </div>
    );
}