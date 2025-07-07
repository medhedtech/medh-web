/**
 * Shared constants for enrollment related components
 */

// Centralized grade options configuration
export const GRADE_OPTIONS = [
  { id: 'Preschool', label: 'Pre-school', description: 'Early learning foundation' },
  { id: 'Grade 1-2', label: 'Grade 1-2', description: 'Primary education basics' },
  { id: 'Grade 3-4', label: 'Grade 3-4', description: 'Elementary fundamentals' },
  { id: 'Grade 5-6', label: 'Grade 5-6', description: 'Upper elementary concepts' },
  { id: 'Grade 7-8', label: 'Grade 7-8', description: 'Middle school advancement' },
  { id: 'Grade 9-10', label: 'Grade 9-10', description: 'High school preparation' },
  { id: 'Grade 11-12', label: 'Grade 11-12', description: 'College preparation' },
  { id: 'UG - Graduate - Professionals', label: 'UG - Grad - Prof', description: 'University level' }
];

// Grade mapping for filtering and validation
export const GRADE_MAP = {
  'Preschool': ['preschool', 'pre-school', 'pre school'],
  'Grade 1-2': ['Grade 1', 'Grade 2', 'Grade 1', 'Grade 2', 'Grade 1-2', 'Grade 1-2'],
  'Grade 3-4': ['Grade 3', 'Grade 4', 'Grade 3', 'Grade 4', 'Grade 3-4', 'Grade 3-4'],
  'Grade 5-6': ['Grade 5', 'Grade 6', 'Grade 5', 'Grade 6', 'Grade 5-6', 'Grade 5-6'],
  'Grade 7-8': ['Grade 7', 'Grade 8', 'Grade 7', 'Grade 8', 'Grade 7-8', 'Grade 7-8'],
  'Grade 9-10': ['Grade 9', 'Grade 10', 'Grade 9', 'Grade 10', 'Grade 9-10', 'Grade 9-10'],
  'Grade 11-12': ['Grade 11', 'Grade 12', 'Grade 11', 'Grade 12', 'Grade 11-12', 'Grade 11-12'],
  'UG - Graduate - Professionals': ['Undergraduate', 'UG', 'Bachelors', 'UG - Graduate', 'UG - Graduate - Professionals']
};

// Helper to get grade label by ID
export const getGradeLabel = (gradeId) => {
  return GRADE_OPTIONS.find(grade => grade.id === gradeId)?.label || gradeId;
};

// Helper to get grade description by ID
export const getGradeDescription = (gradeId) => {
  return GRADE_OPTIONS.find(grade => grade.id === gradeId)?.description || '';
};

// Helper to validate grade ID
export const isValidGrade = (gradeId) => {
  return GRADE_OPTIONS.some(grade => grade.id === gradeId);
}; 