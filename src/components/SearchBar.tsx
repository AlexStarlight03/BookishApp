"use client";
import { useState } from "react";

type SearchBarProps = {
    onSearch: (query: string, type: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps ) {
    const [query, setQuery] = useState("");
    const [type, setType] = useState("title");

    return (
        <form
            className="flex gap-2 mb-6"
            onSubmit={e => {
                e.preventDefault();
                onSearch(query, type);
            }}
        >
            <input
                className="border rounded px-2 py-1"
                placeholder="Recherche..."
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
            <button className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 transition-colors duration-200">
                🔎
            </button>
        </form>
    );
}

