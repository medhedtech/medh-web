// Define instructor interface
interface Instructor {
  id: string;
  name: string;
  designation: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  image?: string;
  imageLg?: string;
  description?: string;
  courses?: number;
  students?: number;
  reviews?: number;
  rating?: number;
}

/**
 * Get all instructors data
 * Temporarily returns an empty array until actual data is implemented
 */
const getAllInstructors = (): Instructor[] => {
  // This is a temporary implementation that returns an empty array
  // to fix build errors
  return [];
  
  // TODO: Implement actual instructor data fetching from API or static data
  // This would replace the commented-out code from the original implementation
};

export default getAllInstructors;
