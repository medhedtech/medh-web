"use client";
import React, { useState } from "react";
import CommonFaq, { IFAQ, IFAQTheme } from "@/components/shared/ui/CommonFaq";
import { Book, Code, HelpCircle, User, Search, Settings, FileQuestion } from "lucide-react";

const themes: Record<string, IFAQTheme> = {
  blue: {
    primaryColor: "#3b82f6", // Blue
    secondaryColor: "#8b5cf6", // Violet
    accentColor: "#f59e0b", // Amber
    showContactSection: true,
    contactEmail: "support@medh.co",
    contactText: "Have more questions? Contact our support team at"
  },
  green: {
    primaryColor: "#10b981", // Emerald
    secondaryColor: "#06b6d4", // Cyan
    accentColor: "#f59e0b", // Amber
    showContactSection: false
  },
  purple: {
    primaryColor: "#8b5cf6", // Violet
    secondaryColor: "#ec4899", // Pink
    accentColor: "#3b82f6", // Blue
    showContactSection: true,
    contactEmail: "hello@medh.co",
    contactText: "Still have questions? Reach out at"
  },
  amber: {
    primaryColor: "#f59e0b", // Amber
    secondaryColor: "#ef4444", // Red
    accentColor: "#3b82f6", // Blue
    showContactSection: true,
    contactEmail: "info@medh.co",
    contactText: "Need more information? Contact us at"
  }
};

const faqs: IFAQ[] = [
  {
    icon: <HelpCircle strokeWidth={1.75} className="w-5 h-5" />,
    iconColor: "#3b82f6",
    iconBg: "#3b82f6",
    question: "What is the CommonFaq component?",
    answer: "CommonFaq is a reusable FAQ component that standardizes the design and functionality of FAQ sections across the Medh website. It supports various features including search, categorization, custom theming, and more.",
    category: "general"
  },
  {
    icon: <Book strokeWidth={1.75} className="w-5 h-5" />,
    iconColor: "#10b981",
    iconBg: "#10b981",
    question: "How do I install and use the component?",
    answer: "The component is already part of the Medh codebase. Simply import it from '@/components/shared/ui/CommonFaq' and use it in your pages or components. Refer to the documentation for detailed usage examples.",
    category: "usage"
  },
  {
    icon: <Code strokeWidth={1.75} className="w-5 h-5" />,
    iconColor: "#8b5cf6",
    iconBg: "#8b5cf6",
    question: "Can I customize the appearance of the component?",
    answer: "Yes, the component is highly customizable. You can change colors, show/hide features like search and categories, customize icons, and more. Use the theme prop to define your color scheme and other appearance settings.",
    category: "customization"
  },
  {
    icon: <User strokeWidth={1.75} className="w-5 h-5" />,
    iconColor: "#f59e0b",
    iconBg: "#f59e0b",
    question: "How do I add icons to FAQ items?",
    answer: "When defining your FAQ items, include an 'icon' property with a React component. You can also specify 'iconBg' and 'iconColor' to customize the appearance of the icon. The component works well with Lucide icons.",
    category: "customization"
  },
  {
    icon: <Search strokeWidth={1.75} className="w-5 h-5" />,
    iconColor: "#ef4444",
    iconBg: "#ef4444",
    question: "Does the component support search functionality?",
    answer: "Yes, the component has built-in search functionality. Set the 'showSearch' prop to true to enable it. Users can then filter FAQs by typing in the search box, which will match against both questions and answers.",
    category: "features"
  },
  {
    icon: <Settings strokeWidth={1.75} className="w-5 h-5" />,
    iconColor: "#06b6d4",
    iconBg: "#06b6d4",
    question: "Can I load FAQs from an API?",
    answer: "Yes, the component supports loading FAQs from an API. Use the 'apiEndpoint' prop to specify the API URL. If your API supports categories, you can also provide a 'categoriesEndpoint' prop.",
    category: "features"
  },
  {
    icon: <FileQuestion strokeWidth={1.75} className="w-5 h-5" />,
    iconColor: "#ec4899",
    iconBg: "#ec4899",
    question: "How do I organize FAQs into categories?",
    answer: "To use categories, set the 'showCategories' prop to true and include a 'category' property in each FAQ item. You can also set a 'defaultCategory' to specify which category should be selected initially.",
    category: "features"
  }
];

const CommonFaqExample = () => {
  const [currentTheme, setCurrentTheme] = useState<string>("blue");
  const [showSearch, setShowSearch] = useState<boolean>(true);
  const [showCategories, setShowCategories] = useState<boolean>(true);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">CommonFaq Component Examples</h1>
      
      {/* Controls */}
      <div className="mb-12 max-w-3xl mx-auto p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Configuration Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="font-medium mb-2">Theme:</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(themes).map((theme) => (
                <button
                  key={theme}
                  onClick={() => setCurrentTheme(theme)}
                  className={`px-3 py-1 rounded-full text-white text-sm
                    ${currentTheme === theme ? 'ring-2 ring-offset-2' : ''}
                  `}
                  style={{ backgroundColor: themes[theme].primaryColor }}
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <p className="font-medium mb-2">Features:</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showSearch}
                  onChange={() => setShowSearch(!showSearch)}
                  className="rounded text-blue-500"
                />
                Show Search
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showCategories}
                  onChange={() => setShowCategories(!showCategories)}
                  className="rounded text-blue-500"
                />
                Show Categories
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Component */}
      <div className="mb-12">
        <CommonFaq
          title="Frequently Asked Questions"
          subtitle="Learn about the CommonFaq component and how to use it in your project"
          faqs={faqs}
          theme={themes[currentTheme]}
          showSearch={showSearch}
          showCategories={showCategories}
          defaultCategory="all"
        />
      </div>
      
      <div className="mt-12 max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Implementation Code</h2>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
          {`
// Example usage of the CommonFaq component
import CommonFaq from "@/components/shared/ui/CommonFaq";

// Basic usage
return (
  <CommonFaq
    title="Frequently Asked Questions"
    subtitle="Learn about the CommonFaq component and how to use it"
    faqs={faqs}
    theme={{
      primaryColor: "${themes[currentTheme].primaryColor}",
      secondaryColor: "${themes[currentTheme].secondaryColor}",
      accentColor: "${themes[currentTheme].accentColor}",
      showContactSection: ${themes[currentTheme].showContactSection},
      ${themes[currentTheme].contactEmail ? `contactEmail: "${themes[currentTheme].contactEmail}",` : ''}
      ${themes[currentTheme].contactText ? `contactText: "${themes[currentTheme].contactText}"` : ''}
    }}
    showSearch={${showSearch}}
    showCategories={${showCategories}}
    defaultCategory="all"
  />
);
          `}
        </pre>
      </div>
    </div>
  );
};

export default CommonFaqExample; 