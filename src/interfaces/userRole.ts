// Define user roles as enum for type safety throughout the app
export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  PARENT = 'parent',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

// Helper function to check if a role string matches any UserRole
export const isValidRole = (role: string): boolean => {
  return Object.values(UserRole).includes(role as UserRole);
};

// Helper to convert string to proper user role
export const stringToUserRole = (role: string): UserRole | null => {
  if (isValidRole(role)) {
    return role as UserRole;
  }
  
  // Try to handle common variations
  const normalizedRole = role.toLowerCase();
  if (normalizedRole === 'superadmin' || normalizedRole === 'super-admin') {
    return UserRole.SUPER_ADMIN;
  }
  
  return null;
}; 