"use client";
import { useState, useEffect, useMemo } from 'react';
import { ApiClient } from '@/apis/apiClient';
import { getStudentWishlist } from '@/apis/wishlist.api';
import { apiBaseUrl } from '@/apis/config';
import { 
  CircleAlert, 
  HeartCrack, 
  Loader2
} from 'lucide-react';
import WishlistCard from '@/components/sections/dashboards/student/WishlistCard';
import StudentDashboardLayout from '@/components/sections/dashboards/StudentDashboardLayout';
import { buildComponent, getEnhancedSemanticColor } from '@/utils/designSystem';

const WishlistPage = () => {
  // State management
  const [wishlistCourses, setWishlistCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalCourses, setTotalCourses] = useState(0);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  
  const pageSize = 12;
  const apiClient = new ApiClient();

  // Fetch wishlist data
  useEffect(() => {
    const fetchWishlist = async () => {
      setIsLoading(true);
      setError(null);
      
      let userId = null;
      let wishlistUrl = null;
      
      try {
        userId = localStorage.getItem('userId');
        
        if (!userId) {
          setError('User not logged in.');
          setIsLoading(false);
          return;
        }

        wishlistUrl = getStudentWishlist(userId, { page, limit: pageSize });
        
        const response = await apiClient.get(wishlistUrl);

        // Type guard for new API structure
        const isSuccess = (resp: any) => resp && (resp.status === 'success' || resp.success);
        
        // Check if response has the expected structure  
        const hasWishlistData = response.data?.wishlist || (response.data as any)?.data?.wishlist || (response as any).wishlist;
        
        if (isSuccess(response) && hasWishlistData) {
          // Try different possible paths for the wishlist data
          const wishlistData = response.data?.wishlist || (response.data as any)?.data?.wishlist || (response as any).wishlist;
          
          const courses = wishlistData.courses || [];
          
          try {
            setWishlistCourses(courses);
            setTotalCourses(wishlistData.totalCourses || courses.length);
          } catch (stateError) {
            console.error('State setting error:', stateError);
          }
          
          // Pagination - try different paths
          const pagination = response.data?.pagination || (response as any).pagination;
          if (pagination) {
            setPage(pagination.currentPage ?? 1);
            setTotalPages(pagination.totalPages ?? 1);
            setHasNextPage(!!pagination.hasNextPage);
            setHasPrevPage(!!pagination.hasPrevPage);
          } else {
            setTotalPages(1);
            setHasNextPage(false);
            setHasPrevPage(false);
          }
          
          // Clear error if we have a successful response
          setError(null);
        } else {
          // Only set error if success is false
          if (!isSuccess(response)) {
            setError(response.message || 'Failed to fetch wishlist.');
          } else {
            // Handle empty wishlist case
            setWishlistCourses([]);
            setTotalCourses(0);
            setError(null);
          }
        }
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        console.error('Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : 'No stack',
          userId: userId,
          wishlistUrl: wishlistUrl
        });
        setError('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [page]);


  // Remove course from wishlist
  const removeFromWishlist = async (courseId: string) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User not logged in.');
      return;
    }

    setIsRemoving(courseId);
    try {
      const removeUrl = `${apiBaseUrl}/students/wishlist/remove`;
      const removeData = {
        studentId: userId,
        courseId: courseId
      };
      
      const response = await apiClient.delete(removeUrl, {
        body: JSON.stringify(removeData),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.status === 'success') {
        // Remove the course from the local state
        setWishlistCourses(prev => prev.filter(course => course.id !== courseId));
        setTotalCourses(prev => Math.max(0, prev - 1));
        
        // If this was the last course on the current page and we're not on page 1, go to previous page
        if (wishlistCourses.length === 1 && page > 1) {
          setPage(prev => prev - 1);
        }
      } else {
        setError(response.message || 'Failed to remove course from wishlist.');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setError('An error occurred while removing the course.');
    } finally {
      setIsRemoving(null);
    }
  };


  // Helper to render course card with remove functionality
  const renderCourseCard = (course: any) => (
    <WishlistCard
      key={course.id}
      course={course}
      onRemove={removeFromWishlist}
      onToggleNotifications={() => {}} // Implement notification toggling if needed
      isRemoving={isRemoving === course.id}
      index={wishlistCourses.indexOf(course)}
    />
  );

  return (
    <StudentDashboardLayout
      userRole="student"
      fullName={localStorage.getItem('fullName') || ''}
      userEmail={localStorage.getItem('email') || ''}
      userImage={''}
      userNotifications={0}
      userSettings={{ theme: 'light', language: 'en', notifications: true }}
    >
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Wishlist Summary */}
          {!isLoading && !error && wishlistCourses.length > 0 && (
            <div className={`${buildComponent.card('minimal')} mb-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalCourses}</div>
                    <div className="text-sm text-blue-500 dark:text-blue-300">Total Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ₹{wishlistCourses.reduce((total, course) => total + (course.pricing?.individual || 0), 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-green-500 dark:text-green-300">Total Value</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(wishlistCourses.map(course => course.category))).map(category => (
                    <span key={category} className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full text-sm font-medium">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-600 dark:text-slate-400">
              <Loader2 className={`h-12 w-12 animate-spin text-${getEnhancedSemanticColor('enrollment', 'dark')}`} />
              <p className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-300">Loading your wishlist...</p>
            </div>
          )}
          {/* Error State */}
          {!isLoading && error && (
            <div className={`${buildComponent.card('minimal')} flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800`}>
              <CircleAlert className="h-16 w-16 mb-4 text-red-700 dark:text-red-300" />
              <h2 className="text-3xl font-bold text-red-800 dark:text-red-200">Error Loading Wishlist</h2>
              <p className="mt-3 text-lg text-red-600 dark:text-red-400">{error}</p>
              <p className="mt-1 text-md text-red-500 dark:text-red-500">Please try again later or contact support if the issue persists.</p>
            </div>
          )}
          {/* Empty Wishlist State */}
          {!isLoading && !error && wishlistCourses.length === 0 && (
            <div className={`${buildComponent.card('minimal')} flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800`}>
              <HeartCrack className="h-16 w-16 mb-4 text-blue-700 dark:text-blue-300" />
              <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-200">Your Wishlist is Empty</h2>
              <p className="mt-3 text-lg text-blue-600 dark:text-blue-400">It looks like you haven't added any courses yet. Start exploring now!</p>
              <p className="mt-1 text-md text-blue-500 dark:text-blue-500">Add courses to your wishlist to keep track of your interests.</p>
              <button
                onClick={() => window.location.href = '/all-courses'}
                className={`${buildComponent.button('primary', 'lg')} mt-8 transition-transform duration-200 hover:scale-105 active:scale-95`}
              >
                Explore Courses
              </button>
            </div>
          )}
          {/* Wishlist Items Grid */}
          {!isLoading && !error && wishlistCourses.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {wishlistCourses.map(renderCourseCard)}
              </div>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-10">
                  <button
                    disabled={!hasPrevPage}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={`${buildComponent.button('secondary', 'md')} disabled:opacity-50`}
                  >
                    Previous
                  </button>
                  <span className="text-slate-700 dark:text-slate-200 font-semibold">Page {page} of {totalPages}</span>
                  <button
                    disabled={!hasNextPage}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className={`${buildComponent.button('secondary', 'md')} disabled:opacity-50`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default WishlistPage;