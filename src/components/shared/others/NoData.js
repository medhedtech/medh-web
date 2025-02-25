import { FileX } from "lucide-react";

const NoData = ({ 
  message = "No data available", 
  icon = <FileX size={48} />,
  description,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="text-gray-300 dark:text-gray-600 mb-4">
        {icon}
      </div>
      
      <h3 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">
        {message}
      </h3>
      
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
          {description}
        </p>
      )}
    </div>
  );
};

export default NoData;
