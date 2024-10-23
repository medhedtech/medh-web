const CategoryFilter = ({ categories, setSelectedCategory, heading }) => {
  return (
    <div className="w-full dark:text-gray-300    rounded-md">
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
     
    </div>
  );
};

export default CategoryFilter;
