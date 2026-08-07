

function SearchBar({ handleSearch, setSearchQuery }: { handleSearch: () => void; setSearchQuery: (query: string) => void }) {
    
    
    return(
        <div className="flex items-center justify-center">
            <input
                type="text"
                placeholder="Search..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Search
            </button>
        </div>
    )
}

export default SearchBar;