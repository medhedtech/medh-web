import BlogsMain from "@/components/layout/main/BlogsMain";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { IBlog } from "@/types/blog.types";
import { Metadata } from "next";
import { Suspense } from "react";
import { defaultMetadata } from "@/app/metadata";
import { notFound } from "next/navigation";
import Link from "next/link";
import { generateBlogListingSEO, generateBlogListingStructuredData } from '@/utils/blog-seo';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Define the SearchParams interface
interface SearchParams {
  category?: string;
  tag?: string;
  featured?: string;
  page?: string;
  search?: string;
  [key: string]: string | undefined;
}

// Blog categories for navigation
const BLOG_CATEGORIES = [
  { id: 'all', name: 'All Articles', description: 'Everything we publish' },
  { id: 'technology', name: 'Technology', description: 'Latest in tech trends' },
  { id: 'career', name: 'Career Growth', description: 'Professional development' },
  { id: 'education', name: 'Education', description: 'Learning resources' },
  { id: 'industry', name: 'Industry Insights', description: 'Market analysis' },
  { id: 'tutorials', name: 'Tutorials', description: 'Step-by-step guides' },
  { id: 'news', name: 'News & Updates', description: 'Latest announcements' }
];

// Optimized data fetching with better error handling and caching
async function fetchBlogsData(params: SearchParams) {
  const {
    category = '',
    tag = '',
    featured = 'false',
    page = '1',
    search = ''
  } = params;

  try {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', '12');
    queryParams.append('page', page);
    queryParams.append('status', 'published');
    queryParams.append('sort_by', 'createdAt');
    queryParams.append('sort_order', 'desc');
    queryParams.append('with_content', 'false');

    let endpoint = '/blogs';
    
    if (featured === 'true') {
      endpoint = '/blogs/featured';
      queryParams.append('limit', '6');
    } else if (category && category !== 'all') {
      queryParams.append('category', category);
    } else if (tag) {
      queryParams.append('tags', tag);
    } else if (search) {
      queryParams.append('search', search);
    }
    
    const url = `${API_BASE_URL}${endpoint}?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      next: { 
        revalidate: featured === 'true' ? 1800 : 900,
        tags: ['blogs', `blogs-${category || tag || 'all'}`]
      },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    return {
      blogs: result.data || [],
      totalBlogs: result.pagination?.total || 0,
      currentPage: parseInt(page),
      totalPages: result.pagination?.pages || 1,
      hasMore: result.pagination ? result.pagination.page < result.pagination.pages : false
    };
  } catch (error) {
    console.error("Error fetching blogs data:", error);
    return {
      blogs: [],
      totalBlogs: 0,
      currentPage: 1,
      totalPages: 1,
      hasMore: false
    };
  }
}



// Enhanced metadata generation with better SEO
export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
  const params = await searchParams;
  const { category, tag, featured, search, page } = params;
  
  return generateBlogListingSEO({
    category,
    tag,
    search,
    page: page ? parseInt(page) : undefined,
    featured: featured === 'true'
  });
}

// Modern Hero Section Component
function BlogHero({ currentCategory, searchTerm }: { currentCategory?: string; searchTerm?: string }) {
  const categoryData = BLOG_CATEGORIES.find(cat => cat.id === currentCategory);
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative container mx-auto px-4 py-16 sm:py-20 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-sm font-medium mb-6">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {searchTerm ? 'Search Results' : categoryData ? categoryData.name : 'Educational Blog'}
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {searchTerm ? (
              <>
                Results for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  "{searchTerm}"
                </span>
              </>
            ) : categoryData && categoryData.id !== 'all' ? (
              <>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  {categoryData.name}
                </span>
                {' '}Articles
              </>
            ) : (
              <>
                Learn, Grow & Excel with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  Expert Insights
                </span>
              </>
            )}
          </h1>
          
          {/* Description */}
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            {searchTerm ? (
              'Find educational content, tutorials, and expert insights related to your search.'
            ) : categoryData && categoryData.id !== 'all' ? (
              categoryData.description
            ) : (
              'Discover expert insights on technology, career growth, education trends, and professional development to accelerate your journey.'
            )}
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Expert Authors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Weekly Updates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Industry Insights</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}





// Loading component for better UX
function BlogsPageLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="animate-pulse">
        {/* Hero skeleton */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="w-32 h-6 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6"></div>
            <div className="w-96 h-12 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-4"></div>
            <div className="w-80 h-6 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
          </div>
        </div>
        
        {/* Categories skeleton */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-6">
          <div className="container mx-auto px-4">
            <div className="flex gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="w-24 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
                <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 rounded-xl mb-4"></div>
                <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="w-1/2 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main blogs page component
const BlogsPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const params = await searchParams;
  
  // Fetch main blogs data
  const { blogs, totalBlogs, currentPage, totalPages, hasMore } = await fetchBlogsData(params);
  
  // If no blogs found and it's not a search, show 404
  if (blogs.length === 0 && !params.search && !params.category && !params.tag && params.featured !== 'true') {
    notFound();
  }
  
  const initialFilters = {
    category: params.category || '',
    tag: params.tag || '',
    featured: params.featured === 'true',
    search: params.search || '',
    page: currentPage
  };

  // Generate structured data for the listing
  const structuredData = generateBlogListingStructuredData(blogs);
  
  return (
    <PageWrapper>
      <main className="min-h-screen bg-white dark:bg-gray-900">
        {/* Enhanced Structured Data for Blog Listing */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        
        <Suspense fallback={<BlogsPageLoading />}>
          {/* Hero Section */}
          <BlogHero 
            currentCategory={params.category} 
            searchTerm={params.search}
          />
          

          
          {/* Main Blog Content */}
          <BlogsMain 
            initialBlogs={blogs} 
            totalBlogs={totalBlogs}
            currentPage={currentPage}
            totalPages={totalPages}
            hasMore={hasMore}
            initialFilters={initialFilters}
          />
        </Suspense>
      </main>
    </PageWrapper>
  );
};

export default BlogsPage;
