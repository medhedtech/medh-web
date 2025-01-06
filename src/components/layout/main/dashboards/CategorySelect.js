import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const CategorySelect = ({ handleCategory, errors, selected, setSelected }) => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const dropdownRef = useRef(null);
  const { getQuery } = useGetQuery();

  const toggleDropdown = (e) => {
    e.preventDefault();
    setDropdownOpen((prev) => !prev);
  };

  const filteredCategories = categories?.filter((category) => {
    return category.category_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    fetchAllCategories();
    console.log("Categories select rendered", selected);
    if (selected) {
      handleCategory(selected);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchTerm]);

  const selectCategory = (categoryName) => {
    console.log("Selected category", categoryName);
    setSelected(categoryName);
    setDropdownOpen(false);
    setSearchTerm("");
    handleCategory(categoryName);
  };

  const fetchAllCategories = () => {
    try {
      getQuery({
        url: apiUrls?.categories?.getAllCategories,
        onSuccess: (res) => {
          setCategories(res.data);
          console.log("All categories", res);
        },
        onFail: (err) => {
          console.error("Failed to fetch categories: ", err);
        },
      });
    } catch (err) {
      console.error("Error fetching categories: ", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-normal mb-1">
        Course Category <span className="text-red-500">*</span>
      </label>
      <div className="p-3 border rounded-lg w-full dark:bg-inherit text-gray-600">
        <button className="w-full text-left" onClick={toggleDropdown}>
          {selected || "Select Category"}
        </button>
        {dropdownOpen && (
          <div className="absolute z-10 left-0 top-20 bg-white border border-gray-600 rounded-lg w-full shadow-xl">
            <input
              type="text"
              className="w-full p-2 border-b focus:outline-none rounded-lg"
              placeholder="Search..."
              value={searchTerm || selectedCategory || ""}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul className="max-h-56 overflow-auto">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <li
                    key={category._id}
                    className="hover:bg-gray-100 rounded-lg cursor-pointer flex gap-3 px-3 py-3"
                    onClick={() => {
                      selectCategory(category.category_name);
                    }}
                  >
                    <Image
                      src={category.category_image || ""}
                      alt={category.category_title}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    {category.category_name}
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500">No results found</li>
              )}
            </ul>
          </div>
        )}
      </div>
      {errors.category && (
        <p className="text-red-500 text-xs">{errors.category.message}</p>
      )}
    </div>
  );
};

export default CategorySelect;
