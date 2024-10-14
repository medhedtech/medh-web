const CategoryFilter = ({ categories, setSelectedCategory, heading }) => {
  return (
    <div className="w-full  bg-white p-4 rounded-md">
      <h2 className="text-2xl font-semibold mb-4 text-black">{heading}</h2>
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
      {/* <div className="flex items-center border-[#5F2DED] border-2 w-fit px-1 rounded-md mt-4">
        <button className="ml-4 p-1 text-sm text-[#5F2DED]">
          Clear All Filters
        </button>
      </div> */}
    </div>
  );
};

export default CategoryFilter;
