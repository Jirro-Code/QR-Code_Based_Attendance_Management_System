type SearchBarProps = {
    handleSearch: () => void;
    setSearchQuery: (query: string) => void;
};

function SearchBar({ handleSearch, setSearchQuery }: SearchBarProps) {    
    return(
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleSearch}>
                Search
            </button>
        </div>
    )
}

export default SearchBar;