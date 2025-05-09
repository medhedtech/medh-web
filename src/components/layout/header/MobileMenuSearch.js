import React from "react";
{
  /*  search input  */
}
const MobileMenuSearch = () => {
  return (
    <div className="py-4 px-2">
      <h3 className="text-base font-medium text-gray-800 dark:text-white mb-3 px-3">Search</h3>
      
      {/* Use NavbarSearch with mobile-specific props */}
      <div className="pb-6">
        <NavbarSearch smallScreen={true} isImmersiveInMobileMenu={true} onMobileMenuClose={onClose} />
      </div>
      
      {/* Alternative simple search form */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full h-12 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg pl-10 pr-12 focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white dark:placeholder-gray-400"
          />
          
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isLoading ? (
              <Loader2 size={20} className="text-primary-500 dark:text-primary-400 animate-spin" />
            ) : (
              <Search size={20} className="text-gray-500 dark:text-gray-400" />
            )}
          </div>
          
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-12 pr-2 flex items-center"
            >
              <X size={18} className="text-gray-500 dark:text-gray-400" />
            </button>
          )}
          
          <button
            type="submit"
            disabled={!query.trim()}
            className={`absolute inset-y-0 right-0 px-3 flex items-center ${
              query.trim() 
                ? "text-primary-600 dark:text-primary-400" 
                : "text-gray-400 dark:text-gray-600"
            }`}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </form>
      
      <div className="mt-6 px-3">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Popular searches:</p>
        <div className="flex flex-wrap gap-2">
          {["Python", "Web Development", "Data Science"].map((term, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(term);
                handleSearchSubmit();
              }}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-800 rounded-full text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileMenuSearch;
