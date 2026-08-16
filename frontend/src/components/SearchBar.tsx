type SearchBarProps = {
    handleSearch: () => void;
    setSearchQuery: (query: string) => void;
    searchQuery: string;
};

export const SearchBar = ({ handleSearch, setSearchQuery, searchQuery }: SearchBarProps) => {    
    return(
        <div className="flex items-center gap-1">
            <input
                type="text" 
                value={searchQuery}
                placeholder="Search..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-800 w-0 grow"
            />
            <button onClick={handleSearch} className="bg-blue-800 text-white px-4 py-2 rounded-r hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Search
            </button>
        </div>
    )
}