"use client";
import ShopSidebar from "@/components/shared/ecommerce/ShopSidebar";
import { useEffect, useRef, useState } from "react";
import TabButtonSecondary from "@/components/shared/buttons/TabButtonSecondary";
import useTab from "@/hooks/useTab";
import TabContentWrapper from "@/components/shared/wrappers/TabContentWrapper";
import TwoColumnContent from "@/components/shared/ecommerce/TwoColumnContent";
import ThreeColumnContent from "@/components/shared/ecommerce/ThreeColumnContent";
import FourColumContent from "@/components/shared/ecommerce/FourColumContent";
import ProductModal from "@/components/shared/products/ProductModal";
import Pagination from "@/components/shared/others/Pagination";
import getAllProducts from "@/libs/getAllProducts";
import SrortFilter from "@/components/shared/products/SrortFilter";
import { useSearchParams } from "next/navigation";
const allProductsBeforeFilter = getAllProducts();
const getAllFilteredProducts = (filterObject, isReset) => {
  const {
    availability: availabilityNew,
    type,
    brand: brandNew,
    color: colorNew,
    size: sizeNew,
    category: newCategory,
  } = filterObject;

  const filteredProducts = isReset
    ? allProductsBeforeFilter
    : allProductsBeforeFilter?.filter(
        ({ availability, productType, brand, color, size, type: category }) =>
          (!availabilityNew?.length ||
            availabilityNew?.includes(availability)) &&
          (!type?.length || type.includes(productType)) &&
          (!brandNew?.length || brandNew?.includes(brand)) &&
          (!colorNew?.length || colorNew?.includes(color)) &&
          (!sizeNew?.length || sizeNew?.includes(size)) &&
          (!newCategory?.length ||
            newCategory?.includes(category.toLowerCase()))
      );
  return filteredProducts;
};
const getSortedProduct = (allProducts, sortInput, priceRange) => {
  switch (sortInput) {
    case "featured":
      return [...allProducts];
    case "best-selling":
      return [...allProducts]?.filter(({ bestSeller }) => bestSeller);
    case "title-ascending":
      return [...allProducts]?.sort((a, b) => a.title.localeCompare(b.title));
    case "title-descending":
      return [...allProducts]?.sort((a, b) => b.title.localeCompare(a.title));
    case "price-ascending":
      return [...allProducts]?.sort((a, b) => a.price - b.price);
    case "price-descending":
      return [...allProducts]?.sort((a, b) => b.price - a.price);
    case "created-descending":
      return [...allProducts]?.sort((a, b) => a.date - b.date);
    case "created-ascending":
      return [...allProducts]?.sort((a, b) => b.date - a.date);
    default:
      return [...allProducts].filter(({ price }) => {
        return price > priceRange[0] && price <= priceRange[1];
      });
  }
};
const ShopPrimary = () => {
  const category = useSearchParams().get("category");
  const [availability, setAvailability] = useState([]);
  const [type, setType] = useState([]);
  const [brand, setBrand] = useState([]);
  const [color, setColor] = useState([]);
  const [size, setSize] = useState([]);
  const [reset, setReset] = useState(false);
  const [sortInput, setSortInput] = useState("featured");
  const [isPriceRange, setIsPriceRange] = useState(false);
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentProducts, setCurrentProducts] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentIdx, handleTabClick } = useTab(1);
  const filterIputs = {
    availability,
    type,
    brand,
    color,
    size,
    category: category ? [category] : [],
  };
  const allProducts = getAllFilteredProducts(filterIputs, reset);
  const products = getSortedProduct(
    allProducts,
    isPriceRange ? "no-input" : sortInput,
    isPriceRange ? [0, 80] : null
  );
  const productsString = JSON.stringify(products);
  const shopRef = useRef(null);
  const totalProducts = products?.length;
  const limit = 12;
  const totalPages = Math.ceil(totalProducts / limit);
  const paginationItems = [...Array(totalPages)];

  // handle current product
  const handleCurrentProduct = (id) => {
    const product = currentProducts.find(({ id: id1 }) => id1 === id);
    setCurrentProduct({ ...product });
  };
  // handle pagination
  const handlePagesnation = (id) => {
    shopRef.current.scrollIntoView({ behavior: "smooth" });
    if (typeof id === "number") {
      setCurrentPage(id);
      setSkip(limit * id);
    } else if (id === "prev") {
      setCurrentPage(currentPage - 1);
      setSkip(skip - limit);
    } else if (id === "next") {
      setCurrentPage(currentPage + 1);
      setSkip(skip + limit);
    }
  };
  // handle filterProduct
  const filterItem = (e, ps, check) => {
    return e.target.checked
      ? [check, ...ps]
      : [...ps.filter((pevCheck, idx) => pevCheck !== check)];
  };

  const handleFilters = (e, inputName, check, isRange) => {
    setReset(false);
    if (isRange) {
      setIsPriceRange(true);
    } else {
      switch (inputName) {
        case "availability":
          return setAvailability((ps) => filterItem(e, ps, check));
        case "productType":
          return setType((ps) => filterItem(e, ps, check));
        case "brand":
          return setBrand((ps) => filterItem(e, ps, check));
        case "color":
          return setColor((ps) => filterItem(e, ps, check));
        case "size":
          return setSize((ps) => filterItem(e, ps, check));
      }
    }
  };

  // set Current products
  useEffect(() => {
    const products = JSON.parse(productsString);
    const productsToShow = [...products].splice(skip, limit);
    setCurrentProduct(products[0]);
    setCurrentProducts(productsToShow);
  }, [skip, limit, productsString]);

  const tabButtons = [
    {
      name: (
        <svg
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 5.5 12.5"
          className="w-5 h-5"
        >
          <defs></defs>
          <defs></defs>
          <g data-name="Layer 2">
            <g data-name="Layer 1">
              <g data-name="shop page">
                <g id="Group-10">
                  <path
                    d="M.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 01.75 0z"
                    className="cls-1"
                  ></path>
                  <path
                    d="M4.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 014.75 0z"
                    className="cls-1"
                    data-name="Rectangle"
                  ></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
      ),
      content: (
        <TwoColumnContent
          products={currentProducts}
          handleCurrentProduct={handleCurrentProduct}
        />
      ),
    },
    {
      name: (
        <svg
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 9.5 12.5"
          className="w-5 h-5"
        >
          <defs></defs>
          <defs>{/* <style>.cls-1 {{ fillRule: "evenodd" }}</style> */}</defs>
          <g data-name="Layer 2">
            <g data-name="Layer 1">
              <g data-name="shop page">
                <g id="Group-16">
                  <path
                    d="M.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 01.75 0z"
                    className="cls-1"
                  ></path>
                  <path
                    d="M4.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 014.75 0z"
                    className="cls-1"
                    data-name="Rectangle"
                  ></path>
                  <path
                    d="M8.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 018.75 0z"
                    className="cls-1"
                    data-name="Rectangle"
                  ></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
      ),
      content: (
        <ThreeColumnContent
          products={currentProducts}
          handleCurrentProduct={handleCurrentProduct}
        />
      ),
    },
    {
      name: (
        <svg
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 13.5 12.5"
          className="w-5 h-5"
        >
          <defs></defs>
          <defs>{/* <style>.cls-1 {{ fillRule: "evenodd" }}</style> */}</defs>
          <g data-name="Layer 2">
            <g data-name="Layer 1">
              <g data-name="shop page">
                <g id="_4_col" data-name="4_col">
                  <path
                    d="M.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 01.75 0z"
                    className="cls-1"
                  ></path>
                  <path
                    d="M4.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 014.75 0z"
                    className="cls-1"
                    data-name="Rectangle"
                  ></path>
                  <path
                    d="M8.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11A.76.76 0 018.75 0z"
                    className="cls-1"
                    data-name="Rectangle"
                  ></path>
                  <path
                    id="Rectangle-4"
                    d="M12.75 0a.76.76 0 01.75.75v11a.76.76 0 01-.75.75.76.76 0 01-.75-.75v-11a.76.76 0 01.75-.75z"
                    className="cls-1"
                    data-name="Rectangle"
                  ></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
      ),
      content: (
        <FourColumContent
          products={currentProducts}
          handleCurrentProduct={handleCurrentProduct}
        />
      ),
    },
  ];
  const handleReset = () => {
    setAvailability([]);
    setType([]);
    setColor([]);
    setBrand([]);
    setSize([]);
    setReset(true);
    setIsPriceRange(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <section className="relative">
      <div className="container-fluid-2 shop py-12 md:py-20" ref={shopRef}>
        {/* Shop Header with trendy gradient background */}
        <div 
          className="relative overflow-hidden mb-8 md:mb-12 rounded-xl shadow-lg"
          data-aos="fade-up"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 opacity-90 animate-gradient"></div>
          <div className="relative z-10 px-6 py-8 md:py-10 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 mumkinMedh">Shop Collection</h2>
            <p className="text-white/80 max-w-2xl">Discover our latest arrivals and bestsellers. Curated just for you.</p>
          </div>
        </div>

        {/* Filter and View Controls */}
        <div 
          className="sticky top-0 z-30 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl p-4 shadow-sm"
          data-aos="fade-up"
        >
          {/* Mobile Filter Toggle */}
          <button
            onClick={toggleSidebar}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filters {availability.length + type.length + brand.length + color.length + size.length > 0 && 
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-purple-600 rounded-full">
                {availability.length + type.length + brand.length + color.length + size.length}
              </span>
            }
          </button>

          {/* View Switcher */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {tabButtons?.map(({ name }, idx) => (
              <TabButtonSecondary
                key={idx}
                name={name}
                button={"icon"}
                currentIdx={currentIdx}
                handleTabClick={handleTabClick}
                idx={idx}
                className={`p-2 ${currentIdx === idx ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-700'} rounded-md transition-all`}
              />
            ))}
          </div>

          {/* Sort and Results Count */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <SrortFilter
              sortInput={sortInput}
              setSortInput={setSortInput}
              setIsPriceRange={setIsPriceRange}
            />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-gray-200">{skip ? skip : skip + 1} - {skip + limit >= totalProducts ? totalProducts : skip + limit}</span> of <span className="font-medium text-gray-900 dark:text-gray-200">{totalProducts}</span> products
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Desktop */}
          {!category && (
            <div className="hidden lg:block lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover-scale">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Filters
                  </h3>
                </div>
                <ShopSidebar
                  handleFilters={handleFilters}
                  size={size}
                  availability={availability}
                  color={color}
                  type={type}
                  brand={brand}
                  handleReset={handleReset}
                  category={category}
                />
                {(availability.length > 0 || type.length > 0 || brand.length > 0 || color.length > 0 || size.length > 0) && (
                  <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                    <button 
                      onClick={handleReset}
                      className="w-full py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors font-medium"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sidebar - Mobile */}
          {!category && isSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={toggleSidebar}></div>
              <div className="absolute top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl overflow-auto animate-slideInRight">
                <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-bold">Filters</h3>
                  <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <ShopSidebar
                  handleFilters={handleFilters}
                  size={size}
                  availability={availability}
                  color={color}
                  type={type}
                  brand={brand}
                  handleReset={handleReset}
                  category={category}
                />
                <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={toggleSidebar}
                      className="py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium"
                    >
                      View Results
                    </button>
                    <button 
                      onClick={handleReset}
                      className="py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          {currentProducts && (
            <div className={`${category ? "col-span-12" : "lg:col-span-9"} modal-container`}>
              {/* Applied Filters */}
              {!category && (availability.length > 0 || type.length > 0 || brand.length > 0 || color.length > 0 || size.length > 0) && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {availability.map((item, index) => (
                      <div key={`availability-${index}`} className="chip bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                        {item}
                        <button 
                          onClick={(e) => handleFilters({target: {checked: false}}, "availability", item)}
                          className="chip-remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {type.map((item, index) => (
                      <div key={`type-${index}`} className="chip bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        {item}
                        <button 
                          onClick={(e) => handleFilters({target: {checked: false}}, "productType", item)}
                          className="chip-remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {brand.map((item, index) => (
                      <div key={`brand-${index}`} className="chip bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        {item}
                        <button 
                          onClick={(e) => handleFilters({target: {checked: false}}, "brand", item)}
                          className="chip-remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {color.map((item, index) => (
                      <div key={`color-${index}`} className="chip bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300">
                        {item}
                        <button 
                          onClick={(e) => handleFilters({target: {checked: false}}, "color", item)}
                          className="chip-remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {size.map((item, index) => (
                      <div key={`size-${index}`} className="chip bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                        {item}
                        <button 
                          onClick={(e) => handleFilters({target: {checked: false}}, "size", item)}
                          className="chip-remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Display */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                {tabButtons?.map(({ content }, idx) => (
                  <TabContentWrapper
                    key={idx}
                    isShow={idx === currentIdx ? true : false}
                  >
                    {content}
                  </TabContentWrapper>
                ))}

                {/* Empty State */}
                {currentProducts && currentProducts.length === 0 && (
                  <div className="py-12 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">No products found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your filters or search terms</p>
                    <button 
                      onClick={handleReset} 
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {totalProducts > 0 && totalProducts > limit && (
                  <div className="mt-8" data-aos="fade-up">
                    <Pagination
                      pages={paginationItems}
                      totalItems={totalProducts}
                      handlePagesnation={handlePagesnation}
                      currentPage={currentPage}
                      skip={skip}
                      limit={limit}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Product Modal */}
      <ProductModal product={currentProduct} />
      
      {/* Scroll to top button */}
      <button 
        onClick={() => shopRef.current.scrollIntoView({ behavior: "smooth" })}
        className="fixed bottom-8 right-8 z-40 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </section>
  );
};

export default ShopPrimary;
