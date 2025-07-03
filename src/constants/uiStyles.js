/**
 * Reusable UI styles for consistent component styling
 * Used by MobileMenu and potentially other components
 */
export const STYLES = {
  // Layout containers
  gridContainer: "grid grid-cols-4 gap-4 mb-6",
  navContainer: "grid grid-cols-4 gap-3 mt-2 sm:mt-6",
  
  // Action items
  quickActionItem: `
    flex flex-col items-center justify-center p-3
    rounded-xl bg-gray-50 dark:bg-gray-800/50
    hover:bg-gray-100 dark:hover:bg-gray-700/50
    transition-colors duration-200
  `,
  
  quickAction: `
    flex flex-col items-center justify-center p-1 sm:p-2
    rounded-lg bg-gray-50/80 dark:bg-gray-800/50
    hover:bg-white dark:hover:bg-gray-700/50
    border border-gray-100/50 dark:border-gray-700/50
    transition-all duration-200 transform 
    hover:scale-105 hover:shadow-md
  `,
  
  // Menu items
  menuItem: `
    relative group flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl
    bg-gray-50/80 dark:bg-gray-800/50
    hover:bg-white dark:hover:bg-gray-700/50
    border border-gray-200/50 dark:border-gray-700/50
    transition-all duration-300 transform 
    hover:scale-105 hover:shadow-lg
  `,
  
  // Icon containers
  iconWrapper: `
    flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10
    rounded-xl transition-transform duration-300
    group-hover:-translate-y-1
  `,
  
  // Search results
  suggestionItem: `
    flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50
    border-b border-gray-100 dark:border-gray-800 last:border-0
    transition-colors duration-200
  `,
  
  // Headings
  sectionHeading: `
    text-sm font-medium text-gray-500 dark:text-gray-400 
    mb-1 sm:mb-3 px-1
  `,
  
  // Animation classes
  fadeIn: `animate-fadeIn`,
  slideIn: `animate-slideIn`,
  
  // User profile
  userProfile: `
    flex items-center px-4 py-3 mb-4
    bg-gray-50 dark:bg-gray-800/50 rounded-xl
  `,
  
  // Action buttons
  actionButton: `
    flex items-center px-4 py-3 rounded-xl
    text-gray-700 dark:text-gray-300
    hover:bg-gray-100 dark:hover:bg-gray-800
    transition-colors duration-200
  `,
  
  // Primary button
  primaryButton: `
    flex items-center justify-center w-full px-4 py-3
    bg-primary-600 hover:bg-primary-700
    text-white rounded-xl
    transition-all duration-200
    transform hover:scale-[1.02] active:scale-[0.98]
  `,
  
  // Secondary button
  secondaryButton: `
    flex items-center justify-center w-full px-4 py-3
    border border-gray-300 dark:border-gray-700
    text-gray-700 dark:text-gray-300
    hover:bg-gray-50 dark:hover:bg-gray-800
    rounded-xl
    transition-all duration-200
    transform hover:scale-[1.02] active:scale-[0.98]
  `,
  
  // Footer
  stickyFooter: `
    sticky bottom-0 z-50 w-full px-4 py-4
    bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
    border-t border-gray-200 dark:border-gray-800
  `
};

export default STYLES; 