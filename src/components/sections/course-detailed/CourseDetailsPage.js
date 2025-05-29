{curriculum && curriculum.length > 0 ? (
  curriculum.map((item, index) => (
    <div key={index} className="transition-all duration-200">
      <motion.button
        className="w-full px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        onClick={() => toggleAccordion(index)}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center flex-1 min-w-0">
          <motion.div 
            className={`flex-shrink-0 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-4 ${
              openAccordions === index 
                ? `bg-${getCategoryColorClasses().primaryColor}-100 dark:bg-${getCategoryColorClasses().primaryColor}-900/50 text-${getCategoryColorClasses().primaryColor}-600 dark:text-${getCategoryColorClasses().primaryColor}-400` 
                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            }`}
            whileHover={{ 
              scale: [1, 1.1, 1],
              transition: { duration: 0.5 }
            }}
          >
            {openAccordions === index ? (
              <BookOpen size={16} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" fillOpacity={0.2} />
            ) : (
              <Calendar size={16} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" fillOpacity={0.2} />
            )}
          </motion.div>
          <span className={`text-xs sm:text-sm md:text-base font-medium truncate ${
            openAccordions === index 
              ? `text-${getCategoryColorClasses().primaryColor}-700 dark:text-${getCategoryColorClasses().primaryColor}-400` 
              : "text-gray-800 dark:text-gray-200"
          }`}>
            {item.weekTitle}
          </span>
        </div>
        <motion.div 
          className={`flex-shrink-0 ml-2 sm:ml-3 p-1 sm:p-1.5 rounded-full ${
            openAccordions === index 
              ? `bg-${getCategoryColorClasses().primaryColor}-100 dark:bg-${getCategoryColorClasses().primaryColor}-900/50 text-${getCategoryColorClasses().primaryColor}-600 dark:text-${getCategoryColorClasses().primaryColor}-400` 
              : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          }`}
          animate={openAccordions === index ? { rotate: 180 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={14} className="sm:w-4 sm:h-4" fill="currentColor" fillOpacity={0.2} />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {openAccordions === index && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={`px-3 sm:px-6 py-3 sm:py-5 bg-${getCategoryColorClasses().primaryColor}-50/50 dark:bg-${getCategoryColorClasses().primaryColor}-900/10 border-t border-gray-200 dark:border-gray-700`}>
              <div className="pl-6 sm:pl-10 space-y-4 sm:space-y-6">
                {item.weekDescription && (
                  <div className="space-y-4">
                    {item.weekDescription.split('\n\n').map((section, sectionIndex) => {
                      if (section.startsWith('Overview')) {
                        return (
                          <div key={sectionIndex} className="mb-4">
                            <h4 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-100 mb-2">Overview</h4>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                              {section.replace('Overview\n', '')}
                            </p>
                          </div>
                        );
                      } else if (section.startsWith('Relevance')) {
                        return (
                          <div key={sectionIndex}>
                            <h4 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-100 mb-2">Relevance</h4>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                              {section.replace('Relevance\n', '')}
                            </p>
                          </div>
                        );
                      } else {
                        return (
                          <p key={sectionIndex} className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {section}
                          </p>
                        );
                      }
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ))
) : (
  <div className="text-center py-8">
    <p className="text-gray-500 dark:text-gray-400">No curriculum available</p>
  </div>
)} 