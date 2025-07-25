#!/usr/bin/env node

/**
 * FAQ Component Migration Script
 * 
 * This script helps migrate existing FAQ components to the new CommonFaq component.
 * It provides guidance on how to convert different types of FAQ components to use the new structure.
 * 
 * Usage: node convert-faqs.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get a list of all the FAQ components in the project
console.log('Scanning for FAQ components...');
const faqFiles = execSync('grep -r -l "Faq\\.js\\|FAQ\\.js\\|Faq\\.tsx\\|FAQ\\.tsx" src/components/sections/')
  .toString()
  .trim()
  .split('\n');

console.log(`Found ${faqFiles.length} FAQ components:`);
console.log(faqFiles.join('\n'));
console.log('\n');

// Helper function to create a conversion example
function createConversionExample(faqFile) {
  try {
    const fileContent = fs.readFileSync(faqFile, 'utf8');
    const fileName = path.basename(faqFile);
    const dirName = path.dirname(faqFile).split('/').pop();
    
    let componentName = fileName.replace('.js', '').replace('.tsx', '');
    
    // Detect if the file contains static FAQ data
    const hasStaticFaqs = fileContent.includes('const faqs =') || fileContent.includes('const faqData =');
    
    // Detect theme colors
    let primaryColor = '#3b82f6'; // Default blue
    if (fileContent.includes('color') && fileContent.includes('#')) {
      const colorMatch = fileContent.match(/#[0-9a-fA-F]{6}\b/);
      if (colorMatch) {
        primaryColor = colorMatch[0];
      }
    }
    
    console.log(`\n=== Converting ${fileName} ===`);
    console.log(`Component name: ${componentName}`);
    console.log(`Directory: ${dirName}`);
    console.log(`Has static FAQs: ${hasStaticFaqs}`);
    console.log(`Primary color: ${primaryColor}`);
    console.log('\nConversion example:');
    
    console.log('```javascript');
    console.log(`"use client";
import React from "react";
import CommonFaq, { IFAQ } from "@/components/shared/ui/CommonFaq";
${hasStaticFaqs ? '// If using icons, import them here' : ''}

const ${componentName} = () => {
  ${hasStaticFaqs ? `// Define your FAQs with the IFAQ interface structure
  const faqs: IFAQ[] = [
    {
      question: "Sample Question 1",
      answer: "Sample Answer 1",
      // icon: <Icon />,  // Optional icon
      // iconBg: "#color", // Optional background color
      // iconColor: "#color", // Optional icon color
    },
    // Add more FAQs as needed
  ];` : ''}

  return (
    <CommonFaq
      title="${dirName.charAt(0).toUpperCase() + dirName.slice(1).replace(/-/g, ' ')} FAQ"
      subtitle="Find answers to frequently asked questions about our ${dirName.replace(/-/g, ' ')}."
      ${hasStaticFaqs ? 'faqs={faqs}' : 'apiEndpoint="${API_ENDPOINT}"'}
      theme={{
        primaryColor: "${primaryColor}",
        ${hasStaticFaqs ? '// secondaryColor: "#secondaryColor", // Optional' : ''}
        ${hasStaticFaqs ? '// accentColor: "#accentColor", // Optional' : ''}
        showContactSection: ${fileContent.includes('mail') || fileContent.includes('contact') ? 'true' : 'false'},
        ${fileContent.includes('mail') || fileContent.includes('contact') ? 'contactEmail: "contact@medh.co",' : '// contactEmail: "contact@medh.co", // Optional'}
        ${fileContent.includes('mail') || fileContent.includes('contact') ? 'contactText: "Have more questions? Contact us at"' : '// contactText: "Have more questions? Contact us at" // Optional'}
      }}
      showSearch={${fileContent.includes('search') ? 'true' : 'false'}}
      showCategories={${fileContent.includes('category') || fileContent.includes('categor') ? 'true' : 'false'}}
      ${fileContent.includes('category') || fileContent.includes('categor') ? 'defaultCategory="all"' : '// defaultCategory="all" // Optional'}
    />
  );
};

export default ${componentName};`);
    console.log('```');
    
    // Provide specific guidance
    console.log('\nMigration steps:');
    console.log('1. Create a new file with the same name but with .tsx extension');
    console.log('2. Copy the example code above and adapt it to your specific FAQ component');
    console.log('3. Copy over any static FAQ data and convert it to the IFAQ interface format');
    console.log('4. Update the theme colors to match your existing design');
    console.log('5. Set the appropriate properties for showSearch and showCategories');
    console.log('6. If using API endpoints, update the apiEndpoint property');
    console.log('7. Test the component to ensure it works correctly');
    console.log('8. Replace the original file with your new component');

  } catch (error) {
    console.error(`Error processing ${faqFile}:`, error);
  }
}

// Generate conversion examples for each FAQ file
faqFiles.forEach(faqFile => {
  createConversionExample(faqFile);
});

console.log('\n=== General Migration Instructions ===');
console.log(`
To migrate all FAQ components to use the new CommonFaq component:

1. First ensure the CommonFaq component is properly set up at src/components/shared/ui/CommonFaq.tsx

2. For each FAQ component:
   - Look at the conversion example provided above
   - Create a new TypeScript version of the component using the structure shown
   - Copy and adapt any static FAQ data or API endpoints
   - Ensure the theme colors match your existing design
   - Test the component to verify it works correctly

3. Common patterns:
   - Static FAQ data: Define faqs array and pass it to the CommonFaq component
   - API-based FAQs: Pass apiEndpoint to the CommonFaq component
   - Categorized FAQs: Set showCategories=true and pass categoriesEndpoint if needed
   - Search functionality: Set showSearch=true
   - Contact section: Set showContactSection=true and provide contactEmail

4. For advanced customization that isn't supported by the CommonFaq component:
   - You may need to modify the CommonFaq component to add additional features
   - Or keep using the original custom FAQ component for special cases

5. After migration, verify that all FAQ components work as expected and maintain their original functionality.
`); 