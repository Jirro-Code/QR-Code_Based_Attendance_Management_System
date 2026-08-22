import { SlidersHorizontal, CircleX } from "lucide-react"
import { useState } from "react";

type SearchBarProps = {
    handleSearch: () => void;
    setSearchQuery: (query: string) => void;
    searchQuery: string;
    isOnSearch: boolean;
    handleClearSearch: () => void;
    handleFilterClick: () => void;
};

export const SearchBar = ({ handleSearch, setSearchQuery, searchQuery, isOnSearch, handleClearSearch, handleFilterClick }: SearchBarProps) => {   
    const [isTyping, setIsTyping] = useState<boolean>(false);
    
    return(
        <form className="flex items-center gap-1 relative" onSubmit={(e) => {e.preventDefault(); handleSearch(); setIsTyping(false);}}>
            <input
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                type="text" 
                value={searchQuery}
                placeholder="Search..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-l pl-2 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-blue-800 w-0 grow"
            />
            
            {isOnSearch && (
                <button
                    className="absolute right-22 top-1/2 -translate-y-1/2"
                    type="button"
                    onPointerDown={(e) => e.preventDefault()}
                    onClick={() => {handleClearSearch(); setIsTyping(false);}}
                >
                    <CircleX className="w-5 h-5 text-gray-500 hover:text-gray-600" />
                </button>
            )}
            
            {(!isOnSearch || isTyping) && (
                <button
                    type="submit"
                    onPointerDown={(e) => e.preventDefault()}
                    className="bg-blue-800 text-white px-4 py-2 rounded-r hover:bg-blue-900 focus:outline-none"
                >
                    Search
                </button>
            )}
            
            {isOnSearch && !isTyping && (
                <button 
                    onClick={handleFilterClick}
                    type="button"
                    onPointerDown={(e) => e.preventDefault()}
                    className="bg-gray-200 text-gray-800 px-7 py-2.5 rounded-r hover:bg-gray-300 focus:outline-none"
                >
                    <SlidersHorizontal className="w-5 h-5" />
                </button>
            )}
        </form>
    )
}
