"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiBaseUrl, apiUrls } from "@/apis";
import Accordion from "@/components/shared/accordion/Accordion";
import AccordionContent from "@/components/shared/accordion/AccordionContent";
import AccordionController from "@/components/shared/accordion/AccordionController";
import AccordionContainer from "@/components/shared/containers/AccordionContainer";

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}${apiUrls.faqs.getAllCategories}`);
        setCategories(response.data.categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      try {
        let url;
        
        if (selectedCategory !== "all") {
          url = `${apiBaseUrl}${apiUrls.faqs.getFaqsByCategory}/${selectedCategory}`;
        } else {
          url = `${apiBaseUrl}${apiUrls.faqs.getAllFaqs}`;
        }
        
        const response = await axios.get(url);
        setFaqs(response.data.faqs || response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError("Failed to load FAQs");
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <section>
      <div className="container pb-100px">
        <div className="fees faq grid grid-cols-1 lg:grid-cols-12 gap-30px">
          <div className="lg:col-start-1 lg:col-span-3" data-aos="fade-up">
            <div className="lg:-rotate-90 lg:translate-y-3/4 relative">
              <h4 className="text-size-150 lg:text-size-140 2xl:text-size-200 text-lightGrey dark:text-blackColor-dark opacity-50 uppercase font-bold leading-[1]">
                faq
              </h4>
            </div>
          </div>

          {/* Category selection */}
          <div className="lg:col-start-4 lg:col-span-9" data-aos="fade-up">
            <div className="mb-6 flex flex-wrap gap-3">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`px-4 py-2 rounded-md ${
                  selectedCategory === "all"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                All
              </button>
              
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-md ${
                    selectedCategory === category
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Loading state */}
            {loading && (
              <div className="text-center py-8">
                <p>Loading FAQs...</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="text-center py-8 text-red-500">
                <p>{error}</p>
              </div>
            )}

            {/* accordions */}
            {!loading && !error && (
              <AccordionContainer>
                {faqs.length > 0 ? (
                  faqs.map((faq, idx) => (
                    <Accordion
                      key={faq._id || idx}
                      idx={idx}
                      isActive={idx === 0 ? true : false}
                      accordion={"secondaryLg"}
                    >
                      <AccordionController type={"secondaryLg"}>
                        {faq.question}
                      </AccordionController>
                      <AccordionContent>
                        <div className="content-wrapper py-4 px-5">
                          <p className="leading-7 text-contentColor dark:text-contentColor-dark mb-15px">
                            {faq.answer}
                          </p>
                        </div>
                      </AccordionContent>
                    </Accordion>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p>No FAQs found for this category.</p>
                  </div>
                )}
              </AccordionContainer>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
