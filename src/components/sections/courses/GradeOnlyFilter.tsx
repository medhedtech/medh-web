"use client";
import React from "react";
import { CheckSquare, Square } from "lucide-react";

export interface IGradeOnlyFilterProps {
  grades: string[];
  selectedGrade: string | null;
  setSelectedGrade: (grade: string | null) => void;
  heading?: string;
  hideGradeFilter?: boolean;
}

export const GradeOnlyFilter: React.FC<IGradeOnlyFilterProps> = ({
  grades,
  selectedGrade,
  setSelectedGrade,
  heading,
  hideGradeFilter,
}) => {
  if (hideGradeFilter) return null;

  const handleGradeChange = (grade: string) => {
    if (selectedGrade === grade) {
      setSelectedGrade(null);
    } else {
      setSelectedGrade(grade);
    }
  };

  return (
    <div className="w-full dark:text-gray-300 rounded-md">
      {heading && (
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          {heading}
        </h2>
      )}
      <div className="flex flex-col space-y-2">
        {grades.map((grade) => (
          <div key={grade} className="group">
            <label
              className="flex items-start cursor-pointer group select-none"
              htmlFor={`grade-${grade.replace(/\s+/g, "-").toLowerCase()}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {selectedGrade === grade ? (
                  <CheckSquare
                    size={18}
                    className="text-primary-500 dark:text-primary-400"
                  />
                ) : (
                  <Square
                    size={18}
                    className="text-gray-400 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-500 transition-colors"
                  />
                )}
                <input
                  type="checkbox"
                  id={`grade-${grade.replace(/\s+/g, "-").toLowerCase()}`}
                  className="sr-only"
                  checked={selectedGrade === grade}
                  onChange={() => handleGradeChange(grade)}
                  aria-label={`Filter by ${grade}`}
                />
              </div>
              <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                {grade}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}; 