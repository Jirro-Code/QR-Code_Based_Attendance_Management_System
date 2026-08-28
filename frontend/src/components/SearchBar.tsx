import { SlidersHorizontal, X } from "lucide-react"
import { useRef, useState } from "react";

type SearchBarProps = {
    handleSearch: () => void;
    setSearchQuery: (query: string) => void;
    searchQuery: string;
    isOnSearch: boolean;
    handleClearSearch: () => void;
    handleFilterClick: () => void;
};

export const SearchBar = ({ handleSearch, setSearchQuery, searchQuery, isOnSearch, handleClearSearch, handleFilterClick }: SearchBarProps) => {   
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const preventBlur = (e: React.PointerEvent) => e.preventDefault();
    
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch();
        setIsFocused(false);
        inputRef.current?.blur();
    };
    
    return(
        <form 
            className="flex items-center gap-1 relative" 
            onSubmit={onSubmit}
        >
            <input
                ref={inputRef}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                type="text" 
                value={searchQuery}
                placeholder="Search..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-l pl-2 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-gray-500 w-0 grow"
            />
            
            {isOnSearch && (
                <button
                    className="absolute right-22 top-1/2 -translate-y-1/2"
                    type="button"
                    onPointerDown={preventBlur}
                    onClick={handleClearSearch}
                >
                    <span className="flex items-center justify-center w-5 h-5 rounded-2xl bg-gray-400 hover:text-gray-600">
                        <X className="text-white" size={14} />
                    </span>
                </button>
            )}
            
            {(!isOnSearch || isFocused) && (
                <button
                    type="submit"
                    onPointerDown={preventBlur}
                    className="bg-blue-800 text-white px-4 py-2 rounded-r hover:bg-blue-900 focus:outline-none"
                >
                    Search
                </button>
            )}
            
            {isOnSearch && !isFocused && (
                <button 
                    onClick={handleFilterClick}
                    type="button"
                    onPointerDown={preventBlur}
                    className="bg-gray-200 text-gray-800 px-7 py-2.5 rounded-r hover:bg-gray-300 focus:outline-none"
                >
                    <SlidersHorizontal className="w-5 h-5" />
                </button>
            )}
        </form>
    )
}