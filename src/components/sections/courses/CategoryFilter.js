const CategoryFilter = ({ categories, setSelectedCategory }) => {
  return (
    <div className="w-full md:w-1/4 bg-inherit p-4">
      <h2 className="text-xl font-semibold mb-4">Category</h2>
      <div className="flex flex-col">
        {categories.map((category) => (
          <label key={category} className="inline-flex items-center mb-2">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4"
              onChange={() => setSelectedCategory(category)}
            />
            <span className="ml-2">{category}</span>
          </label>
        ))}
      </div>
      <div className="flex items-center border-[#5F2DED] border-2 w-fit px-1 rounded-md mt-4">
        <button className="ml-4 p-1 text-sm text-[#5F2DED]">
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default CategoryFilter;
