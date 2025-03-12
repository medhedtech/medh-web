/**
 * Shared constants for enrollment related components
 */

// Centralized grade options configuration
export const GRADE_OPTIONS = [
  { id: 'preschool', label: 'Pre-school', description: 'Early learning foundation' },
  { id: 'grade+1-2', label: 'Grade 1-2', description: 'Primary education basics' },
  { id: 'grade+3-4', label: 'Grade 3-4', description: 'Elementary fundamentals' },
  { id: 'grade+5-6', label: 'Grade 5-6', description: 'Upper elementary concepts' },
  { id: 'grade+7-8', label: 'Grade 7-8', description: 'Middle school advancement' },
  { id: 'grade+9-10', label: 'Grade 9-10', description: 'High school preparation' },
  { id: 'grade+11-12', label: 'Grade 11-12', description: 'College preparation' },
  { id: 'graduate', label: 'UG - Graduate-Professional', description: 'University level' }
];

// Grade mapping for filtering and validation
export const GRADE_MAP = {
  'preschool': ['preschool', 'pre-school', 'pre school'],
  'grade+1-2': ['grade 1', 'grade 2', 'grade1', 'grade2', 'grade 1-2', 'grade+1-2'],
  'grade+3-4': ['grade 3', 'grade 4', 'grade3', 'grade4', 'grade 3-4', 'grade+3-4'],
  'grade+5-6': ['grade 5', 'grade 6', 'grade5', 'grade6', 'grade 5-6', 'grade+5-6'],
  'grade+7-8': ['grade 7', 'grade 8', 'grade7', 'grade8', 'grade 7-8', 'grade+7-8'],
  'grade+9-10': ['grade 9', 'grade 10', 'grade9', 'grade10', 'grade 9-10', 'grade+9-10'],
  'grade+11-12': ['grade 11', 'grade 12', 'grade11', 'grade12', 'grade 11-12', 'grade+11-12'],
  'undergraduate': ['undergraduate', 'ug', 'bachelors', 'ug - graduate', 'ug - graduate - professionals'],
  'graduate': ['graduate', 'professional', 'pg', 'masters', 'ug - graduate - professionals']
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