"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if(query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="search-bar">
            <input 
                type="text" 
                placeholder="Buscar película o serie..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">🔍</button>
        </form>
    );
}
