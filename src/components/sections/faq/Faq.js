"use client";
import { useEffect, useState } from "react";
import { apiBaseUrl, apiUrls } from "@/apis";
import CommonFaq from "@/components/shared/ui/CommonFaq";

const Faq = () => {
  const [defaultCategory, setDefaultCategory] = useState("all");

  // When URL contains hash, set the default category
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        const category = hash.replace('#', '');
        setDefaultCategory(category);
      }
    }
  }, []);

  return (
    <CommonFaq
      title="Frequently Asked Questions"
      subtitle="Find answers to your questions about our courses, payment options, and more."
      apiEndpoint={`${apiBaseUrl}${apiUrls.faqs.getAllFaqs}`}
      categoriesEndpoint={`${apiBaseUrl}${apiUrls.faqs.getAllCategories}`}
      theme={{
        primaryColor: "#3b82f6", // Blue 500
        secondaryColor: "#8b5cf6", // Violet 500
        accentColor: "#f59e0b", // Amber 500
        showContactSection: true,
        contactEmail: "info@medh.co",
        contactText: "Have more questions? Contact our support team at"
      }}
      showSearch={true}
      showCategories={true}
      defaultCategory={defaultCategory}
    />
  );
};

export default Faq;
