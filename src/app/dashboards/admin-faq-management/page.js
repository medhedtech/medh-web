"use client";

import { useState, useEffect } from "react";
import ProtectedPage from "@/app/protectedRoutes";


import axios from "axios";
import { apiBaseUrl, apiUrls } from "@/apis";
import { toast } from "react-toastify";
import { PlusCircle, Edit, Trash2, HelpCircle, Save, X, Search, ChevronDown, ChevronRight, Plus } from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";

const AdminFaqManagement = () => {
  const { getQuery } = useGetQuery();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isBulkAdd, setIsBulkAdd] = useState(false);
  const [bulkFaqs, setBulkFaqs] = useState([{ question: "", answer: "" }]);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
  });

  // Group FAQs by category
  const groupedFaqs = faqs.reduce((acc, faq) => {
    const category = faq.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {});

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Handle bulk FAQ input changes
  const handleBulkInputChange = (index, field, value) => {
    const newBulkFaqs = [...bulkFaqs];
    newBulkFaqs[index] = {
      ...newBulkFaqs[index],
      [field]: value
    };
    setBulkFaqs(newBulkFaqs);
  };

  // Add new FAQ row in bulk mode
  const addFaqRow = () => {
    setBulkFaqs([...bulkFaqs, { question: "", answer: "" }]);
  };

  // Remove FAQ row in bulk mode
  const removeFaqRow = (index) => {
    const newBulkFaqs = bulkFaqs.filter((_, i) => i !== index);
    setBulkFaqs(newBulkFaqs);
  };

  // Handle bulk submit
  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    const hasEmptyFields = bulkFaqs.some(faq => !faq.question || !faq.answer);
    if (hasEmptyFields) {
      toast.error("Please fill all questions and answers");
      return;
    }

    try {
      // Create an array of promises for each FAQ
      const promises = bulkFaqs.map(faq => 
        axios.post(`${apiBaseUrl}${apiUrls.faqs.createFaq}`, {
          ...faq,
          category: formData.category
        })
      );

      await Promise.all(promises);
      showToast.success("FAQs added successfully");
      
      // Reset form
      setBulkFaqs([{ question: "", answer: "" }]);
      setFormData({ ...formData, category: "" });
      setIsBulkAdd(false);
      setShowForm(false);
      
      // Refresh FAQs list
      fetchFaqs();
    } catch (err) {
      console.error("Error adding bulk FAQs:", err);
      toast.error("Failed to add FAQs");
    }
  };

  // Fetch FAQs
  useEffect(() => {
    fetchFaqs();
    fetchCategories();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      // Check if the FAQ endpoints are defined
      if (!apiUrls?.faqs?.getAllFaqs) {
        throw new Error("FAQ API endpoints are not configured");
      }

      const response = await axios.get(`${apiBaseUrl}${apiUrls.faqs.getAllFaqs}`);
      console.log("FAQs response:", response);
      
      if (response.data) {
        // Handle different possible response formats
        let fetchedFaqs = [];
        if (Array.isArray(response.data)) {
          fetchedFaqs = response.data;
        } else if (response.data.faqs && Array.isArray(response.data.faqs)) {
          fetchedFaqs = response.data.faqs;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          fetchedFaqs = response.data.data;
        }
        
        setFaqs(fetchedFaqs);
      }
    } catch (err) {
      console.error("Error fetching FAQs:", err);
      setError(err.message || "Failed to load FAQs. Please try again later.");
      toast.error(err.message || "Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      await getQuery({
        url: apiUrls?.categories?.getAllCategories,
        onSuccess: (data) => {
          const fetchedCategories = data.data;
          if (Array.isArray(fetchedCategories)) {
            const normalizedData = fetchedCategories.map((item) => ({
              id: item._id,
              name: item.name || item.category_name || "Unnamed Category",
            }));
            setCategories(normalizedData);
            console.log('Normalized categories: ', normalizedData);
          } else {
            console.error("Unexpected categories response:", data);
            setCategories([]);
          }
        },
        onFail: (error) => {
          console.error("Failed to fetch categories:", error);
          // Use default categories as fallback
          setCategories([
            { id: "general", name: "General" },
            { id: "courses", name: "Courses" },
            { id: "payments", name: "Payments" },
            { id: "technical", name: "Technical" },
            { id: "personality-development", name: "Personality Development" }
          ]);
        },
      });
    } catch (error) {
      console.error("Categories fetch error:", error);
      setCategories([
        { id: "general", name: "General" },
        { id: "courses", name: "Courses" },
        { id: "payments", name: "Payments" },
        { id: "technical", name: "Technical" },
        { id: "personality-development", name: "Personality Development" }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      question: "",
      answer: "",
      category: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.question || !formData.answer || !formData.category) {
      toast.error("Please fill all required fields");
      return;
    }

    // Check if the FAQ endpoints are defined
    if (!apiUrls?.faqs?.createFaq || !apiUrls?.faqs?.updateFaq) {
      toast.error("FAQ API endpoints are not configured");
      return;
    }
    
    try {
      if (editingId) {
        // Update existing FAQ
        await axios.put(`${apiBaseUrl}${apiUrls.faqs.updateFaq}/${editingId}`, formData);
        showToast.success("FAQ updated successfully");
      } else {
        // Create new FAQ
        await axios.post(`${apiBaseUrl}${apiUrls.faqs.createFaq}`, formData);
        showToast.success("FAQ created successfully");
      }
      
      // Refresh FAQs list
      fetchFaqs();
      resetForm();
    } catch (err) {
      console.error("Error saving FAQ:", err);
      toast.error(err.message || (editingId ? "Failed to update FAQ" : "Failed to create FAQ"));
    }
  };

  const handleEdit = (faq) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "",
    });
    setEditingId(faq._id);
    setShowForm(true);
    
    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) {
      return;
    }

    // Check if the FAQ endpoints are defined
    if (!apiUrls?.faqs?.deleteFaq) {
      toast.error("FAQ API endpoints are not configured");
      return;
    }
    
    try {
      await axios.delete(`${apiBaseUrl}${apiUrls.faqs.deleteFaq}/${id}`);
      showToast.success("FAQ deleted successfully");
      // Refresh FAQs list
      fetchFaqs();
    } catch (err) {
      console.error("Error deleting FAQ:", err);
      toast.error(err.message || "Failed to delete FAQ");
    }
  };

  // Filter FAQs based on search term and selected category
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      faq.answer?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      !selectedCategory || 
      faq.category?.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        
          <div className="w-full p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                FAQ Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Create, edit, and manage frequently asked questions
              </p>
            </div>

            {/* Form Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                  {editingId ? "Edit FAQ" : "Add FAQ"}
                </h2>
                {!showForm ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowForm(true);
                        setIsBulkAdd(false);
                      }}
                      className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                    >
                      <PlusCircle size={18} className="mr-1" />
                      Add Single FAQ
                    </button>
                    <button
                      onClick={() => {
                        setShowForm(true);
                        setIsBulkAdd(true);
                      }}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Plus size={18} className="mr-1" />
                      Bulk Add FAQs
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      resetForm();
                      setIsBulkAdd(false);
                      setBulkFaqs([{ question: "", answer: "" }]);
                    }}
                    className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    <X size={18} className="mr-1" />
                    Cancel
                  </button>
                )}
              </div>

              {showForm && (
                <form onSubmit={isBulkAdd ? handleBulkSubmit : handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category*
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border rounded-md appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {isBulkAdd ? (
                    <div className="space-y-4">
                      {bulkFaqs.map((faq, index) => (
                        <div key={index} className="p-4 border rounded-lg dark:border-gray-700">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              FAQ #{index + 1}
                            </h3>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => removeFaqRow(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X size={18} />
                              </button>
                            )}
                          </div>
                          <div className="space-y-3">
                            <div>
                              <input
                                type="text"
                                value={faq.question}
                                onChange={(e) => handleBulkInputChange(index, "question", e.target.value)}
                                placeholder="Question"
                                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                              />
                            </div>
                            <div>
                              <textarea
                                value={faq.answer}
                                onChange={(e) => handleBulkInputChange(index, "answer", e.target.value)}
                                placeholder="Answer"
                                rows={3}
                                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addFaqRow}
                        className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors"
                      >
                        <Plus size={18} className="inline-block mr-1" />
                        Add Another FAQ
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Question*
                        </label>
                        <input
                          type="text"
                          id="question"
                          name="question"
                          value={formData.question}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Enter the question"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="answer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Answer*
                        </label>
                        <textarea
                          id="answer"
                          name="answer"
                          value={formData.answer}
                          onChange={handleInputChange}
                          required
                          rows={5}
                          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Enter the answer"
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setIsBulkAdd(false);
                        setBulkFaqs([{ question: "", answer: "" }]);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
                    >
                      <Save size={18} className="mr-1" />
                      {isBulkAdd ? "Save All FAQs" : (editingId ? "Update FAQ" : "Save FAQ")}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Search and Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-4">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                  FAQ List
                </h2>
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search FAQs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full md:w-64 px-4 py-2 pl-10 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* FAQ List Grouped by Category */}
              {loading ? (
                <div className="text-center py-6">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Loading FAQs...</p>
                </div>
              ) : error ? (
                <div className="text-center py-6 text-red-500 dark:text-red-400">
                  {error}
                </div>
              ) : Object.keys(groupedFaqs).length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No FAQs found. {searchTerm ? "Try adjusting your search." : ""}
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => {
                    const filteredCategoryFaqs = categoryFaqs.filter(faq =>
                      faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      faq.answer?.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    if (filteredCategoryFaqs.length === 0) return null;

                    return (
                      <div key={category} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleCategory(category)}
                          className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 text-left"
                        >
                          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                            {category} ({filteredCategoryFaqs.length})
                          </h3>
                          {expandedCategories[category] ? (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        
                        {expandedCategories[category] && (
                          <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredCategoryFaqs.map((faq) => (
                              <div
                                key={faq._id}
                                className="p-4 bg-white dark:bg-gray-800"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-base font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                    <HelpCircle className="mr-2 flex-shrink-0 h-5 w-5 text-primary" />
                                    {faq.question}
                                  </h4>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleEdit(faq)}
                                      className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                                      title="Edit FAQ"
                                    >
                                      <Edit size={18} />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(faq._id)}
                                      className="p-1.5 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                                      title="Delete FAQ"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line pl-7">
                                  {faq.answer}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        
        
      </div>
    </ProtectedPage>
  );
};

export default AdminFaqManagement; 