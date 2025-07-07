import { apiClient } from './apiClient';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type TMasterDataType = 'parentCategories' | 'categories' | 'certificates' | 'grades' | 'courseDurations';

export interface IMasterData {
  parentCategories: string[];
  categories: string[];
  certificates: string[];
  grades: string[];
  courseDurations: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IMasterDataStats {
  totalParentCategories: number;
  totalCategories: number;
  totalCertificates: number;
  totalGrades: number;
  totalCourseDurations: number;
  totalMasterDataTypes: number;
  lastUpdated: string;
}

export interface IMasterDataResponse {
  success: boolean;
  message: string;
  data: IMasterData;
}

export interface IMasterDataStatsResponse {
  success: boolean;
  message: string;
  data: IMasterDataStats;
}

export interface IMasterDataArrayResponse {
  success: boolean;
  message: string;
  data: string[];
  count: number;
}

export interface IAddMasterDataItemRequest {
  item: string;
}

export interface IUpdateMasterDataItemsRequest {
  items: string[];
}

export interface IMasterDataValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface IMasterDataErrorResponse {
  success: false;
  message: string;
  errors?: IMasterDataValidationError[];
  error_code?: string;
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export const validateMasterType = (type: TMasterDataType): boolean => {
  const validTypes: TMasterDataType[] = ['parentCategories', 'categories', 'certificates', 'grades', 'courseDurations'];
  return validTypes.includes(type);
};

export const validateAddItem = (item: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!item || typeof item !== 'string') {
    errors.push('Item must be a non-empty string');
  } else if (item.trim().length === 0) {
    errors.push('Item cannot be empty or whitespace only');
  } else if (item.length > 100) {
    errors.push('Item must be 100 characters or less');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUpdateItems = (items: string[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!Array.isArray(items)) {
    errors.push('Items must be an array');
    return { isValid: false, errors };
  }
  
  if (items.length === 0) {
    errors.push('Items array cannot be empty');
  }
  
  items.forEach((item, index) => {
    const itemValidation = validateAddItem(item);
    if (!itemValidation.isValid) {
      errors.push(`Item at index ${index}: ${itemValidation.errors.join(', ')}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateItemParam = (item: string): { isValid: boolean; errors: string[] } => {
  return validateAddItem(item);
};

// ============================================================================
// READ OPERATIONS
// ============================================================================

export const masterDataApi = {
  // Get All Master Data
  getAllMasterData: async (): Promise<IMasterDataResponse> => {
    return apiClient.get('/master-data');
  },

  // Get Master Data Statistics
  getMasterDataStats: async (): Promise<IMasterDataStatsResponse> => {
    return apiClient.get('/master-data/stats');
  },

  // Get Parent Categories
  getParentCategories: async (): Promise<IMasterDataArrayResponse> => {
    return apiClient.get('/master-data/parentCategories');
  },

  // Get Categories
  getCategories: async (): Promise<IMasterDataArrayResponse> => {
    return apiClient.get('/master-data/categories');
  },

  // Get Certificates
  getCertificates: async (): Promise<IMasterDataArrayResponse> => {
    return apiClient.get('/master-data/certificates');
  },

  // Get Grades
  getGrades: async (): Promise<IMasterDataArrayResponse> => {
    return apiClient.get('/master-data/grades');
  },

  // Get Course Durations
  getCourseDurations: async (): Promise<IMasterDataArrayResponse> => {
    return apiClient.get('/master-data/courseDurations');
  },
};

// ============================================================================
// CREATE OPERATIONS
// ============================================================================

export const masterDataCreateApi = {
  // Add Parent Category
  addParentCategory: async (item: string): Promise<IMasterDataArrayResponse> => {
    const validation = validateAddItem(item);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    return apiClient.post('/master-data/parentCategories/add', { item });
  },

  // Add Category
  addCategory: async (item: string): Promise<IMasterDataArrayResponse> => {
    const validation = validateAddItem(item);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    return apiClient.post('/master-data/categories/add', { item });
  },

  // Add Certificate
  addCertificate: async (item: string): Promise<IMasterDataArrayResponse> => {
    const validation = validateAddItem(item);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    return apiClient.post('/master-data/certificates/add', { item });
  },

  // Add Grade
  addGrade: async (item: string): Promise<IMasterDataArrayResponse> => {
    const validation = validateAddItem(item);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    return apiClient.post('/master-data/grades/add', { item });
  },

  // Add Course Duration
  addCourseDuration: async (item: string): Promise<IMasterDataArrayResponse> => {
    const validation = validateAddItem(item);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    return apiClient.post('/master-data/courseDurations/add', { item });
  },
};

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

export const masterDataDeleteApi = {
  // Remove Parent Category
  removeParentCategory: async (item: string): Promise<IMasterDataArrayResponse> => {
    const validation = validateItemParam(item);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    return apiClient.delete(`/master-data/parentCategories/${encodeURIComponent(item)}`);
  },

  // Remove Category
  removeCategory: async (item: string): Promise<IMasterDataArrayResponse> => {
    const validation = validateItemParam(item);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    return apiClient.delete(`/master-data/categories/${encodeURIComponent(item)}`);
  },

  // Remove Certificate
  removeCertificate: async (item: string): Promise<IMasterDataArrayResponse> => {
    const validation = validateItemParam(item);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    return apiClient.delete(`/master-data/certificates/${encodeURIComponent(item)}`);
  },

  // Remove Grade
  removeGrade: async (item: string): Promise<IMasterDataArrayResponse> => {
    const validation = validateItemParam(item);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    return apiClient.delete(`/master-data/grades/${encodeURIComponent(item)}`);
  },

  // Remove Course Duration
  removeCourseDuration: async (item: string): Promise<IMasterDataArrayResponse> => {
    const validation = validateItemParam(item);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    return apiClient.delete(`/master-data/courseDurations/${encodeURIComponent(item)}`);
  },
};

// ============================================================================
// UPDATE OPERATIONS
// ============================================================================

export const masterDataUpdateApi = {
  // Update Parent Categories
  updateParentCategories: async (items: string[]): Promise<IMasterDataArrayResponse> => {
    const validation = validateUpdateItems(items);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    return apiClient.put('/master-data/parentCategories', { items });
  },

  // Update Categories
  updateCategories: async (items: string[]): Promise<IMasterDataArrayResponse> => {
    const validation = validateUpdateItems(items);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    return apiClient.put('/master-data/categories', { items });
  },

  // Update Certificates
  updateCertificates: async (items: string[]): Promise<IMasterDataArrayResponse> => {
    const validation = validateUpdateItems(items);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    return apiClient.put('/master-data/certificates', { items });
  },

  // Update Grades
  updateGrades: async (items: string[]): Promise<IMasterDataArrayResponse> => {
    const validation = validateUpdateItems(items);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    return apiClient.put('/master-data/grades', { items });
  },

  // Update Course Durations
  updateCourseDurations: async (items: string[]): Promise<IMasterDataArrayResponse> => {
    const validation = validateUpdateItems(items);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    return apiClient.put('/master-data/courseDurations', { items });
  },
};

// ============================================================================
// UTILITY OPERATIONS
// ============================================================================

export const masterDataUtilityApi = {
  // Initialize Master Data
  initializeMasterData: async (): Promise<IMasterDataResponse> => {
    return apiClient.post('/master-data/initialize');
  },

  // Reset Master Data
  resetMasterData: async (): Promise<IMasterDataResponse> => {
    return apiClient.post('/master-data/reset');
  },
};

// ============================================================================
// GENERIC OPERATIONS (For dynamic type handling)
// ============================================================================

export const masterDataGenericApi = {
  // Generic Get by Type
  getByType: async (type: TMasterDataType): Promise<IMasterDataArrayResponse> => {
    if (!validateMasterType(type)) {
      throw new Error(`Invalid master data type: ${type}`);
    }
    
    return apiClient.get(`/master-data/${type}`);
  },

  // Generic Add Item by Type
  addItemByType: async (type: TMasterDataType, item: string): Promise<IMasterDataArrayResponse> => {
    if (!validateMasterType(type)) {
      throw new Error(`Invalid master data type: ${type}`);
    }
    
    const validation = validateAddItem(item);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    return apiClient.post(`/master-data/${type}/add`, { item });
  },

  // Generic Remove Item by Type
  removeItemByType: async (type: TMasterDataType, item: string): Promise<IMasterDataArrayResponse> => {
    if (!validateMasterType(type)) {
      throw new Error(`Invalid master data type: ${type}`);
    }
    
    const validation = validateItemParam(item);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    return apiClient.delete(`/master-data/${type}/${encodeURIComponent(item)}`);
  },

  // Generic Update Items by Type
  updateItemsByType: async (type: TMasterDataType, items: string[]): Promise<IMasterDataArrayResponse> => {
    if (!validateMasterType(type)) {
      throw new Error(`Invalid master data type: ${type}`);
    }
    
    const validation = validateUpdateItems(items);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    return apiClient.put(`/master-data/${type}`, { items });
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const formatMasterDataResponse = (response: any): IMasterData => {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response format');
  }
  
  return {
    parentCategories: response.parentCategories || [],
    categories: response.categories || [],
    certificates: response.certificates || [],
    grades: response.grades || [],
    courseDurations: response.courseDurations || [],
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
};

export const formatMasterDataArrayResponse = (response: any): string[] => {
  if (!Array.isArray(response)) {
    throw new Error('Invalid response format: expected array');
  }
  
  return response.filter(item => typeof item === 'string' && item.trim().length > 0);
};

export const validateMasterDataResponse = (response: any): boolean => {
  if (!response || typeof response !== 'object') {
    return false;
  }
  
  const requiredFields: TMasterDataType[] = ['parentCategories', 'categories', 'certificates', 'grades', 'courseDurations'];
  
  return requiredFields.every(field => 
    Array.isArray(response[field]) && 
    response[field].every(item => typeof item === 'string')
  );
};

export const getMasterDataTypeLabel = (type: TMasterDataType): string => {
  const labels: Record<TMasterDataType, string> = {
    parentCategories: 'Parent Categories',
    categories: 'Categories',
    certificates: 'Certificates',
    grades: 'Grades',
    courseDurations: 'Course Durations',
  };
  
  return labels[type] || type;
};

export const getMasterDataTypeDescription = (type: TMasterDataType): string => {
  const descriptions: Record<TMasterDataType, string> = {
    parentCategories: 'Main category classifications for courses',
    categories: 'Detailed course categories synced from Category model',
    certificates: 'Available certificate types for courses',
    grades: 'Educational grade levels',
    courseDurations: 'Standard course duration formats',
  };
  
  return descriptions[type] || 'Master data type';
};

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class MasterDataError extends Error {
  public readonly code: string;
  public readonly field?: string;
  public readonly value?: any;
  
  constructor(message: string, code: string = 'MASTER_DATA_ERROR', field?: string, value?: any) {
    super(message);
    this.name = 'MasterDataError';
    this.code = code;
    this.field = field;
    this.value = value;
  }
}

export const handleMasterDataError = (error: any): MasterDataError => {
  if (error instanceof MasterDataError) {
    return error;
  }
  
  if (error.response?.data) {
    const { message, error_code, errors } = error.response.data;
    return new MasterDataError(
      message || 'Master data operation failed',
      error_code || 'MASTER_DATA_API_ERROR',
      errors?.[0]?.field,
      errors?.[0]?.value
    );
  }
  
  return new MasterDataError(
    error.message || 'Unknown master data error',
    'MASTER_DATA_UNKNOWN_ERROR'
  );
};

// ============================================================================
// EXPORT ALL APIs
// ============================================================================

export const masterApi = {
  read: masterDataApi,
  create: masterDataCreateApi,
  delete: masterDataDeleteApi,
  update: masterDataUpdateApi,
  utility: masterDataUtilityApi,
  generic: masterDataGenericApi,
};

export default masterApi; 