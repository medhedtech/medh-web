import { Star } from "lucide-react";

const Reviews5Star = ({ reviews, type, rating = 5 }) => {
  // Convert rating to a number between 0-5
  const numRating = Math.min(5, Math.max(0, Number(rating) || 5));
  
  return (
    <div className="flex items-center gap-1.5">
      {/* Generate 5 stars */}
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={type === "lg" ? 18 : 14}
          className={`${
            index < numRating 
              ? "text-yellow-400 fill-yellow-400" 
              : "text-gray-300 dark:text-gray-600"
          } transition-colors`}
          strokeWidth={1.5}
        />
      ))}
      
      {/* Review count */}
      <span
        className={`ml-1 ${
          type === "lg"
            ? "text-gray-700 dark:text-gray-200 text-sm"
            : "text-xs text-gray-500 dark:text-gray-400"
        }`}
        aria-label={`${reviews} reviews`}
      >
        ({reviews})
      </span>
    </div>
  );
};

export default Reviews5Star;
