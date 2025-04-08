// Define apiBaseUrl in a separate file to avoid circular dependencies
export const apiBaseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'https://api.medh.co/api/v1'; 