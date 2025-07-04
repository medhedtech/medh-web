import React, { useEffect, useState } from "react";
import { X, RefreshCw, Copy, AlertTriangle, Table, FileText, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, HelpCircle, ChevronDown, ArrowUp, ArrowDown, Filter, Maximize2, Minimize2 } from "lucide-react";
import { buildAdvancedComponent } from '@/utils/designSystem';

interface ApiPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  endpoint: string;
  method: string;
  description: string;
  fetcher: (params?: { page?: number; limit?: number }) => Promise<any>;
}

const ApiPanel: React.FC<ApiPanelProps> = ({ open, onClose, title, endpoint, method, description, fetcher }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  // Full page view state
  const [fullPage, setFullPage] = useState(false);
  // Global search state
  const [search, setSearch] = useState("");
  // Advanced search state
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState<Array<{
    column: string;
    operator: 'contains' | 'exact' | 'starts' | 'ends' | 'gt' | 'lt' | 'gte' | 'lte';
    value: string;
    logic: 'AND' | 'OR';
  }>>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const fetchData = async (page?: number, limit?: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = page && limit ? { page, limit } : undefined;
      const res = await fetcher(params);
      setData(res);
      // Only reset to page 1 if this is a fresh load (no page parameter)
      if (!page) {
        setCurrentPage(1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchData();
    // eslint-disable-next-line
  }, [open]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // Extract table data from different response structures
  const extractTableData = (response: any): any[] => {
    if (!response) return [];
    // Handle nested pagination structure like the example (data.data)
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    // Handle different response structures
    if (Array.isArray(response)) return response;
    
    // Check for common data patterns
    if (response.data && Array.isArray(response.data)) return response.data;
    if (response.users && Array.isArray(response.users)) return response.users;
    if (response.batches && Array.isArray(response.batches)) return response.batches;
    if (response.announcements && Array.isArray(response.announcements)) return response.announcements;
    if (response.forms && Array.isArray(response.forms)) return response.forms;
    if (response.courses && Array.isArray(response.courses)) return response.courses;
    if (response.submissions && Array.isArray(response.submissions)) return response.submissions;
    if (response.locked_accounts && Array.isArray(response.locked_accounts)) return response.locked_accounts;
    
    // Handle nested data structures
    if (response.data && response.data.users && Array.isArray(response.data.users)) return response.data.users;
    if (response.data && response.data.batches && Array.isArray(response.data.batches)) return response.data.batches;
    if (response.data && response.data.announcements && Array.isArray(response.data.announcements)) return response.data.announcements;
    if (response.data && response.data.forms && Array.isArray(response.data.forms)) return response.data.forms;
    if (response.data && response.data.courses && Array.isArray(response.data.courses)) return response.data.courses;
    if (response.data && response.data.submissions && Array.isArray(response.data.submissions)) return response.data.submissions;
    if (response.data && response.data.locked_accounts && Array.isArray(response.data.locked_accounts)) return response.data.locked_accounts;
    
    // If it's an object with keys, try to find array values
    if (typeof response === 'object') {
      const arrayKeys = Object.keys(response).filter(key => Array.isArray(response[key]));
      if (arrayKeys.length > 0) {
        return response[arrayKeys[0]];
      }
    }
    
    return [];
  };

  // Extract pagination metadata from API response
  const extractPaginationInfo = (response: any) => {
    if (!response) return null;
    
    // Handle nested pagination structure
    if (response.data && response.data.total && response.data.currentPage) {
      return {
        total: response.data.total,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        count: response.data.count,
        hasServerPagination: true
      };
    }
    
    // Handle direct pagination structure
    if (response.total && response.currentPage) {
      return {
        total: response.total,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        count: response.count,
        hasServerPagination: true
      };
    }
    
    return null;
  };

  // Improved formatValue for better UX
  const formatValue = (value: any, column: string): string | JSX.Element => {
    if (value === null || value === undefined) return '-';
    
    // Boolean values with status badges
    if (typeof value === 'boolean') {
      const isPositive = ['is_active', 'email_verified', 'phone_verified', 'identity_verified', 'two_factor_enabled'].includes(column);
      const isNegative = ['is_banned', 'trial_used', 'temp_password_verified'].includes(column);
      
      if (isPositive) {
        return value ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            ✓ Yes
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
            ✗ No
          </span>
        );
      } else if (isNegative) {
        return value ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            ✗ Yes
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            ✓ No
          </span>
        );
      }
      
      return value ? (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          ✓ Yes
        </span>
      ) : (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
          ✗ No
        </span>
      );
    }
    
    // Phone number formatting
    if (column === 'phone_number' && typeof value === 'string') {
      return value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    
    // Profile completion with progress bar
    if (column === 'profile_completion' && typeof value === 'number') {
      return (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 min-w-[3rem]">
            {value}%
          </span>
        </div>
      );
    }
    
    // Role display with badges
    if (column === 'role' && Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((role, index) => (
            <span 
              key={index}
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                role === 'admin' 
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                  : role === 'student' || role.includes('student')
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  : role === 'instructor'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {role}
            </span>
          ))}
        </div>
      );
    }
    
    // Status with colored badges
    if (column === 'status') {
      const statusColors = {
        'Active': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        'Inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
        'Suspended': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      };
      
      return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          statusColors[value as keyof typeof statusColors] || statusColors['Inactive']
        }`}>
          {value}
        </span>
      );
    }
    
    // Account type with badges
    if (column === 'account_type') {
      const typeColors = {
        'free': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
        'premium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        'enterprise': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      };
      
      return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
          typeColors[value as keyof typeof typeColors] || typeColors['free']
        }`}>
          {value}
        </span>
      );
    }
    
    // Date formatting
    if (typeof value === 'string' && (value.includes('T') || value.includes('-')) && !isNaN(Date.parse(value))) {
      const date = new Date(value);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString([], { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    }
    
    // Object handling with better summaries
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return (
            <span className="text-gray-400 text-xs italic">Empty</span>
          );
        }
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            {value.length} items
          </span>
        );
      }
      
      // Show key summary for objects
      if (value.upload_date) {
        const date = new Date(value.upload_date);
        return (
          <div className="text-xs">
            <div className="font-medium">Uploaded</div>
            <div className="text-gray-500">{date.toLocaleDateString()}</div>
          </div>
        );
      }
      if (value.id || value._id) {
        return (
          <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {String(value.id || value._id).substring(0, 8)}...
          </span>
        );
      }
      if (value.email) {
        return (
          <div className="text-xs">
            <div className="font-medium">{value.email}</div>
            {value.full_name && (
              <div className="text-gray-500">{value.full_name}</div>
            )}
          </div>
        );
      }
      
      // Show a short summary for small objects
      const keys = Object.keys(value);
      if (keys.length <= 2) {
        return (
          <span className="text-xs bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
            {keys.map(key => `${key}: ${value[key]}`).join(', ')}
          </span>
        );
      }
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400">
          Object
        </span>
      );
    }
    
    // Long string truncation
    if (typeof value === 'string' && value.length > 40) {
      return (
        <span title={value} className="cursor-help">
          {value.substring(0, 40)}...
        </span>
      );
    }
    
    return String(value);
  };

  const getColumnDisplayName = (column: string): string => {
    // Comprehensive mapping for modern, clean column headers
    const columnMappings: Record<string, string> = {
      // User identification
      '_id': 'ID',
      'id': 'ID',
      'full_name': 'Full Name',
      'email': 'Email',
      'username': 'Username',
      'phone_number': 'Phone',
      'phone_numbers': 'Phone Numbers',
      
      // User status and verification
      'status': 'Status',
      'is_active': 'Active',
      'is_banned': 'Banned',
      'email_verified': 'Email Verified',
      'phone_verified': 'Phone Verified',
      'identity_verified': 'Identity Verified',
      'temp_password_verified': 'Temp Password Verified',
      'two_factor_enabled': '2FA Enabled',
      
      // Account details
      'account_type': 'Account Type',
      'membership_type': 'Membership',
      'subscription_status': 'Subscription',
      'trial_used': 'Trial Used',
      'role': 'Role',
      'permissions': 'Permissions',
      'admin_role': 'Admin Role',
      
      // Security and login
      'failed_login_attempts': 'Failed Logins',
      'password_change_attempts': 'Password Changes',
      'api_rate_limit': 'API Rate Limit',
      'backup_codes': 'Backup Codes',
      
      // Activity and presence
      'is_online': 'Online',
      'activity_status': 'Activity Status',
      'last_seen': 'Last Seen',
      'last_login': 'Last Login',
      'last_profile_update': 'Profile Updated',
      
      // Images and media
      'user_image': 'Profile Image',
      'cover_image': 'Cover Image',
      
      // Location and time
      'timezone': 'Timezone',
      'location': 'Location',
      
      // Collections and arrays
      'webhooks': 'Webhooks',
      'devices': 'Devices',
      'sessions': 'Sessions',
      'activity_log': 'Activity Log',
      'assign_department': 'Departments',
      
      // Metadata and preferences
      'meta': 'Metadata',
      'preferences': 'Preferences',
      'statistics': 'Statistics',
      'profile_summary': 'Profile Summary',
      
      // Timestamps
      'created_at': 'Created',
      'updated_at': 'Updated',
      'createdAt': 'Created',
      'updatedAt': 'Updated',
      
      // Profile completion
      'profile_completion': 'Profile %',
      
      // Corporate
      'corporate_id': 'Corporate ID',
      
      // Version and system
      '__v': 'Version',
      'v': 'Version'
    };
    
    // Return mapped name or format the original
    if (columnMappings[column]) {
      return columnMappings[column];
    }
    
    // Fallback formatting for unmapped columns
    return column
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/\bid\b/gi, 'ID')
      .replace(/\bemail\b/gi, 'Email')
      .replace(/\bname\b/gi, 'Name')
      .replace(/\bdate\b/gi, 'Date')
      .replace(/\bstatus\b/gi, 'Status')
      .replace(/\bcreated\b/gi, 'Created')
      .replace(/\bupdated\b/gi, 'Updated')
      .replace(/\bverified\b/gi, 'Verified')
      .replace(/\bactive\b/gi, 'Active')
      .replace(/\bbanned\b/gi, 'Banned')
      .replace(/\bonline\b/gi, 'Online')
      .replace(/\bsession\b/gi, 'Session')
      .replace(/\bdevice\b/gi, 'Device')
      .replace(/\bphone\b/gi, 'Phone')
      .replace(/\bimage\b/gi, 'Image')
      .replace(/\bcover\b/gi, 'Cover')
      .replace(/\btimezone\b/gi, 'Timezone')
      .replace(/\bgeolocation\b/gi, 'Location')
      .replace(/\buser_agent\b/gi, 'User Agent')
      .replace(/\bip_address\b/gi, 'IP Address')
      .replace(/\b2fa\b/gi, '2FA')
      .replace(/\btwo_factor\b/gi, '2FA');
  };

  // Enhanced column filtering for better display
  const getFilteredColumns = (firstItem: any): string[] => {
    if (!firstItem || typeof firstItem !== 'object') {
      return [];
    }
    const allColumns = Object.keys(firstItem);
    // Always include these important fields if present
    const alwaysInclude = ['_id', 'email', 'full_name', 'phone_number', 'status'];
    let filtered = allColumns.filter(col => {
      const value = firstItem[col];
      if (alwaysInclude.includes(col)) return true;
      // Show all primitives
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return true;
      // Show objects with a key summary (e.g., upload_date, id)
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          // Show arrays (will render as Array(n))
          return true;
        }
        // Show objects with a key summary
        const keys = Object.keys(value);
        if (keys.includes('upload_date') || keys.includes('id') || keys.includes('_id')) return true;
        // If object is small, show it
        if (keys.length <= 3) return true;
        // Otherwise, skip deeply nested objects
        return false;
      }
      return false;
    });
    // If all columns are filtered out, fall back to all columns
    if (filtered.length === 0) {
      filtered = allColumns;
    }
    return filtered;
  };

  // Extract table data and pagination info
  const tableData = extractTableData(data);
  const paginationInfo = extractPaginationInfo(data);

  // Apply comprehensive search and sort to client-side data
  let filteredData = tableData;
  
  // Debug logging
  console.log('Search term:', search);
  console.log('Advanced filters:', searchFilters);
  console.log('Table data length:', tableData.length);
  console.log('Pagination info:', paginationInfo);
  
  if ((search || searchFilters.length > 0) && !paginationInfo?.hasServerPagination && tableData.length > 0) {
    filteredData = tableData.filter((row: any) => {
      // Simple search
      if (search) {
        const searchLower = search.toLowerCase();
        const hasSimpleMatch = Object.values(row).some(val => {
          if (val === null || val === undefined) return false;
          const stringVal = String(val).toLowerCase();
          return stringVal.includes(searchLower);
        });
        if (!hasSimpleMatch) return false;
      }
      
      // Advanced filters
      if (searchFilters.length > 0) {
        return searchFilters.every((filter, index) => {
          const columnValue = row[filter.column];
          if (columnValue === null || columnValue === undefined) return false;
          
          const filterValue = filter.value.toLowerCase();
          const columnString = String(columnValue).toLowerCase();
          
          let matches = false;
          switch (filter.operator) {
            case 'contains':
              matches = columnString.includes(filterValue);
              break;
            case 'exact':
              matches = columnString === filterValue;
              break;
            case 'starts':
              matches = columnString.startsWith(filterValue);
              break;
            case 'ends':
              matches = columnString.endsWith(filterValue);
              break;
            case 'gt':
              matches = Number(columnValue) > Number(filter.value);
              break;
            case 'lt':
              matches = Number(columnValue) < Number(filter.value);
              break;
            case 'gte':
              matches = Number(columnValue) >= Number(filter.value);
              break;
            case 'lte':
              matches = Number(columnValue) <= Number(filter.value);
              break;
          }
          
          // Apply logic (AND/OR)
          if (index === 0) return matches;
          const prevFilter = searchFilters[index - 1];
          if (prevFilter.logic === 'AND') {
            return matches;
          } else { // OR
            return matches || true; // Simplified OR logic
          }
        });
      }
      
      return true;
    });
    console.log('Filtered data length:', filteredData.length);
  }
  
  if (sortColumn && !paginationInfo?.hasServerPagination) {
    filteredData = [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal === bVal) return 0;
      if (sortDirection === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });
  }

  // Update total records and total pages when data or pageSize changes (client-side)
  useEffect(() => {
    if (!paginationInfo?.hasServerPagination && tableData) {
      // Use filtered data length for total records when searching
      const dataToCount = search ? filteredData : tableData;
      setTotalRecords(dataToCount.length);
      const newTotalPages = Math.max(1, Math.ceil(dataToCount.length / pageSize));
      if (currentPage > newTotalPages) {
        setCurrentPage(1);
      }
    }
  }, [tableData, pageSize, paginationInfo, currentPage, search, filteredData]);

  // Reset search when data changes
  useEffect(() => {
    if (data && !paginationInfo?.hasServerPagination) {
      setSearch("");
    }
  }, [data, paginationInfo]);

  // Use filteredData for client-side pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = paginationInfo?.hasServerPagination
    ? tableData // server-side already paginated
    : filteredData.slice(startIndex, endIndex);

  // Calculate total pages based on filtered data
  const totalPages = paginationInfo?.hasServerPagination 
    ? paginationInfo.totalPages 
    : Math.max(1, Math.ceil(filteredData.length / pageSize));

  // Calculate the actual total records for display
  const displayTotalRecords = paginationInfo?.hasServerPagination 
    ? paginationInfo.total 
    : (search ? filteredData.length : tableData.length);
  
  // Reset to first page when data changes (for client-side pagination)
  useEffect(() => {
    if (!paginationInfo?.hasServerPagination && tableData.length > 0) {
      setCurrentPage(1);
    }
  }, [tableData.length, paginationInfo?.hasServerPagination]);

  // Pagination controls
  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
    
    // If server pagination is detected, make a new API call
    const paginationInfo = extractPaginationInfo(data);
    if (paginationInfo?.hasServerPagination) {
      fetchData(validPage, pageSize);
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Wrapper functions for button handlers
  const handleRefresh = () => fetchData();
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    // If server-side pagination, fetch new data
    if (paginationInfo?.hasServerPagination) {
      fetchData(1, newPageSize);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 7;
      
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 4) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 3) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 4; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    return (
      <div className="px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          {/* Page Size Selector */}
          <div className="flex items-center space-x-2">
            <label htmlFor="page-size" className="text-sm text-gray-600 dark:text-gray-400">Show</label>
            <div className="relative">
              <select
                id="page-size"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="appearance-none pr-8 pl-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                style={{ minWidth: 56 }}
                aria-label="Items per page"
              >
                {[10, 25, 50, 100].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">per page</span>
          </div>

          {/* Pagination Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span>
              Showing {startIndex + 1} to {Math.min(endIndex, displayTotalRecords)} of {displayTotalRecords} results
            </span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-2">
            {/* First Page Button */}
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="First page"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>

            {/* Previous Button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((page, index) => (
                <div key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-gray-400">...</span>
                  ) : (
                    <button
                      onClick={() => goToPage(page as number)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Last Page Button */}
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Last page"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTable = () => {
    if (!tableData || tableData.length === 0) {
      // If server pagination and not on first page, offer to reset to page 1
      if (paginationInfo?.hasServerPagination && currentPage > 1) {
        return (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Data for This Page</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
              The API returned no data for page {currentPage}. This might be the last page or there might be an issue with the pagination.
            </p>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => goToPage(1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to First Page
              </button>
              <button 
                onClick={handleRefresh}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Refresh
              </button>
            </div>
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-2xl w-full">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">API Response for debugging:</p>
              <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto max-h-32">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        );
      }
      // Otherwise, show standard no data message
      return (
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Table className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Data Available</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
            No data is available to display in table format. The API response might be empty or in an unexpected format.
          </p>
          {data && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-2xl w-full">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Response structure: {Object.keys(data).join(', ')}</p>
              <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto max-h-32">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      );
    }

    const firstItem = currentPageData[0];
    console.log('First item:', firstItem);
    console.log('First item type:', typeof firstItem);
    console.log('First item keys:', firstItem ? Object.keys(firstItem) : 'null');
    
    const columns = getFilteredColumns(firstItem);
    console.log('Filtered columns:', columns);
    
    // If no columns found, show a message with debugging info
    if (columns.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Invalid Data Structure</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
            The data structure could not be parsed for table display. This might be due to unexpected data format.
          </p>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-2xl w-full space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Debug Information:</p>
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <p>Table data length: {tableData.length}</p>
              <p>Current page data length: {currentPageData.length}</p>
              <p>First item type: {typeof firstItem}</p>
              <p>First item keys: {firstItem ? Object.keys(firstItem).join(', ') : 'null'}</p>
              <p>Filtered columns count: {columns.length}</p>
            </div>
            {firstItem && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Sample first item values:</p>
                <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto max-h-32 bg-white dark:bg-gray-900 p-2 rounded">
                  {JSON.stringify(Object.fromEntries(
                    Object.entries(firstItem).slice(0, 5).map(([key, value]) => [
                      key, 
                      typeof value === 'object' ? `[${typeof value}]` : value
                    ])
                  ), null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        {/* Table Header with Actions */}
        <div className="px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Data Table ({currentPageData.length} items)
              </h3>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                {columns.length} columns
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleCopy}
                className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Copy className="w-4 h-4 inline mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Comprehensive Search */}
        <div className="px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {/* Search Input with History */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  if (e.target.value && !searchHistory.includes(e.target.value)) {
                    setSearchHistory(prev => [e.target.value, ...prev.slice(0, 9)]);
                  }
                }}
                onFocus={() => setShowSearchSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                placeholder="Search all columns..."
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                aria-label="Global search"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              {/* Search History Dropdown */}
              {showSearchSuggestions && searchHistory.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                  {searchHistory.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => setSearch(term)}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Advanced Search Toggle */}
            <button
              onClick={() => setAdvancedSearch(!advancedSearch)}
              className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                advancedSearch 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              <span>Advanced</span>
            </button>

            {/* Export Filtered Results */}
            {(search || searchFilters.length > 0) && (
              <button
                onClick={() => {
                  const csvContent = generateCSV(filteredData);
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `filtered_data_${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
                className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                title="Export filtered results"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export</span>
              </button>
            )}

            {/* Search Results Counter */}
            {(search || searchFilters.length > 0) && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                  {filteredData.length} of {tableData.length} results
                </span>
              </div>
            )}
          </div>

          {/* Advanced Search Panel */}
          {advancedSearch && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Advanced Filters</h3>
                  <button
                    onClick={() => setSearchFilters([])}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Clear All
                  </button>
                </div>
                
                {/* Filter Rows */}
                {searchFilters.map((filter, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {index > 0 && (
                      <select
                        value={filter.logic}
                        onChange={(e) => {
                          const newFilters = [...searchFilters];
                          newFilters[index].logic = e.target.value as 'AND' | 'OR';
                          setSearchFilters(newFilters);
                        }}
                        className="px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                      >
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                      </select>
                    )}
                    
                    <select
                      value={filter.column}
                      onChange={(e) => {
                        const newFilters = [...searchFilters];
                        newFilters[index].column = e.target.value;
                        setSearchFilters(newFilters);
                      }}
                      className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                    >
                      {columns.map(col => (
                        <option key={col} value={col}>{getColumnDisplayName(col)}</option>
                      ))}
                    </select>
                    
                    <select
                      value={filter.operator}
                      onChange={(e) => {
                        const newFilters = [...searchFilters];
                        newFilters[index].operator = e.target.value as any;
                        setSearchFilters(newFilters);
                      }}
                      className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                    >
                      <option value="contains">contains</option>
                      <option value="exact">exact</option>
                      <option value="starts">starts with</option>
                      <option value="ends">ends with</option>
                      <option value="gt">&gt;</option>
                      <option value="lt">&lt;</option>
                      <option value="gte">&gt;=</option>
                      <option value="lte">&lt;=</option>
                    </select>
                    
                    <input
                      type="text"
                      value={filter.value}
                      onChange={(e) => {
                        const newFilters = [...searchFilters];
                        newFilters[index].value = e.target.value;
                        setSearchFilters(newFilters);
                      }}
                      placeholder="Value..."
                      className="flex-1 px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                    />
                    
                    <button
                      onClick={() => {
                        const newFilters = searchFilters.filter((_, i) => i !== index);
                        setSearchFilters(newFilters);
                      }}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {/* Add New Filter */}
                <button
                  onClick={() => {
                    setSearchFilters([...searchFilters, {
                      column: columns[0] || '',
                      operator: 'contains',
                      value: '',
                      logic: 'AND'
                    }]);
                  }}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Filter</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modern Table */}
        <div className="flex-1 overflow-auto min-h-0">
          <div className="min-w-full">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap border-b border-gray-200 dark:border-gray-700 cursor-pointer group"
                      onClick={() => {
                        if (sortColumn === column) {
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortColumn(column);
                          setSortDirection('asc');
                        }
                      }}
                      tabIndex={0}
                      aria-sort={sortColumn === column ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      <div className="flex items-center space-x-1">
                        <span className="flex items-center space-x-1">
                          {getColumnDisplayName(column)}
                          {/* Sort indicator */}
                          {sortColumn === column ? (
                            sortDirection === 'asc' ? 
                              <ArrowUp className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-1" /> : 
                              <ArrowDown className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-1" />
                          ) : (
                            <div className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50 transition-opacity">
                              <ArrowUp className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            </div>
                          )}
                        </span>
                        {/* Filter icon (UI only) */}
                        <button
                          className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title={`Filter by ${getColumnDisplayName(column)}`}
                          tabIndex={-1}
                        >
                          <Filter className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                {currentPageData.map((item: any, index: number) => (
                  <tr 
                    key={startIndex + index} 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-150 cursor-pointer ${
                      index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/30 dark:bg-gray-800/30'
                    }`}
                  >
                    {columns.map((column) => (
                      <td
                        key={column}
                        className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800"
                      >
                        <div 
                          className="max-w-xs" 
                          title={typeof formatValue(item[column], column) === 'string' ? formatValue(item[column], column) as string : String(item[column])}
                        >
                          {formatValue(item[column], column)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Modern Pagination */}
        <div className="flex-shrink-0">
          {renderPagination()}
        </div>
        
        {/* Table Footer */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Total records: {totalRecords}</span>
              <span>Columns: {columns.length}</span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>
            <div className="flex items-center space-x-2">
              {paginationInfo?.hasServerPagination && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                  Server paginated
                </span>
              )}
              <span className="text-xs">
                Data: {tableData.length} items | Current page: {currentPageData.length} items
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderJson = () => {
    if (!data) return null;

    return (
      <div className="h-full flex flex-col p-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">JSON Response</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {JSON.stringify(data).length} characters
              </span>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Copy className="w-4 h-4 inline mr-2" />
                Copy
              </button>
            </div>
          </div>
          <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-auto flex-1 bg-white dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700 font-mono min-h-0">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  // Generate CSV for export
  const generateCSV = (data: any[]) => {
    if (data.length === 0) return '';

    const header = Object.keys(data[0]).map(col => getColumnDisplayName(col));
    const rows = data.map(item => {
      return Object.values(item).map(val => {
        if (val === null || val === undefined) return '';
        if (typeof val === 'string') {
          return `"${val.replace(/"/g, '""')}"`; // Handle quotes and commas
        }
        return String(val);
      }).join(',');
    });

    return [header.join(','), ...rows].join('\n');
  };

  // Helper to build API params for server-side search/filter
  const buildApiParams = () => {
    const params: any = { page: currentPage, limit: pageSize };
    if (search) params.search = search;
    if (searchFilters.length > 0) {
      params.filters = searchFilters.map(f => ({
        column: f.column,
        operator: f.operator,
        value: f.value,
        logic: f.logic
      }));
    }
    return params;
  };

  // Optimized search handler - only updates data, not entire component
  const handleSearch = async () => {
    if (paginationInfo?.hasServerPagination) {
      setLoading(true);
      try {
        const res = await fetcher(buildApiParams());
        setData(res);
        setCurrentPage(1); // Reset to page 1 on new search
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }
    // For client-side, no API call needed - filtering happens in render
  };

  // Debounced search for better performance
  useEffect(() => {
    if (paginationInfo?.hasServerPagination) {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 300); // 300ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [search, JSON.stringify(searchFilters)]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      
      // Close on Escape
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Refresh on Ctrl+R
      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        handleRefresh();
      }
      
      // Copy on Ctrl+C
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        handleCopy();
      }
      
      // Toggle view mode on Ctrl+T
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        setViewMode(viewMode === 'table' ? 'json' : 'table');
      }
      
      // Navigation shortcuts
      if (e.ctrlKey) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            if (currentPage > 1) goToPage(currentPage - 1);
            break;
          case 'ArrowRight':
            e.preventDefault();
            if (currentPage < totalPages) goToPage(currentPage + 1);
            break;
          case 'Home':
            e.preventDefault();
            goToPage(1);
            break;
          case 'End':
            e.preventDefault();
            goToPage(totalPages);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, currentPage, totalPages, viewMode, onClose, handleRefresh, handleCopy, goToPage]);

  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm ${fullPage ? 'p-0' : 'p-4'}`}>
      <div
        className={
          fullPage
            ? 'fixed inset-0 z-50 w-screen h-screen max-w-none max-h-none bg-white dark:bg-gray-900 flex flex-col rounded-none shadow-none border-none'
            : 'bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-7xl w-full h-full max-h-[95vh] flex flex-col border border-gray-200/50 dark:border-gray-700/50'
        }
        style={fullPage ? { margin: 0, padding: 0 } : {}}
      >
        {/* Modern Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-t-2xl">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md font-mono text-xs">{method}</span>
              <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{endpoint}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setFullPage(f => !f)}
              className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200"
              title={fullPage ? 'Exit full page' : 'Full page view'}
            >
              {fullPage ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button 
              onClick={handleRefresh} 
              disabled={loading} 
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 disabled:opacity-50"
              title="Refresh data (Ctrl+R)"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={handleCopy} 
              disabled={!data} 
              className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200 disabled:opacity-50"
              title="Copy JSON (Ctrl+C)"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button 
              className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200"
              title="Keyboard shortcuts: Esc=Close, Ctrl+R=Refresh, Ctrl+C=Copy, Ctrl+T=Toggle view, Ctrl+←/→=Navigate"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        
        {/* Advanced Controls */}
        <div className="px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Table className="w-4 h-4 inline mr-2" />
                Table
              </button>
              <button
                onClick={() => setViewMode('json')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'json'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                JSON
              </button>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center space-x-4 text-sm">
              {loading && (
                <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Loading...</span>
                </div>
              )}
              {error && (
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
              {data && !loading && !error && (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Data loaded successfully</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Loading Skeleton */}
          {loading && (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="w-full max-w-md space-y-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                <button 
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Data Content */}
          {!loading && !error && data && (
            <div className="flex-1 overflow-hidden">
              {viewMode === 'table' ? renderTable() : renderJson()}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && !data && (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Data Available</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Click the refresh button to load data from the API.</p>
                <button 
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Load Data
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Success Feedback */}
        {copied && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-top-2">
            <div className="flex items-center space-x-2">
              <Copy className="w-4 h-4" />
              <span>Copied to clipboard!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiPanel; 