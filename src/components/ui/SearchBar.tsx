import { useState } from "react";

type SearchBarProps = {
    onSearch: (query: string, type: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps ) {
    const [query, setQuery] = useState("");
    const [type, setType] = useState("title");

    return (
        <div className="bg-card rounded-lg shadow-sm p-2 flex items-center justify-center mb-6">
            <form
                className="flex gap-2 w-full max-w-md items-center justify-center"
                onSubmit={e => {
                    e.preventDefault();
                    onSearch(query, type);
                }}
            >
                <input
                    className="search-bar border border-gray-300 rounded-md px-3 py-1 text-base focus:outline-none focus:ring-1 focus:ring-purple-300 transition-all bg-white flex-1"
                    placeholder="Recherche..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                <button className="book-button px-4 py-1 text-base rounded-md shadow-sm hover:scale-105 transition-all">
                    🔎
                </button>
            </form>
        </div>
    );
}

