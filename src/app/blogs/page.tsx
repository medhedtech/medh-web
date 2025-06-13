import BlogsMain from "@/components/layout/main/BlogsMain";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { IBlog } from "@/types/blog.types";
import { Metadata } from "next";
import { Suspense } from "react";
import { defaultMetadata } from "@/app/metadata";
// import BlogsLoading from "./loading";
import { notFound } from "next/navigation";

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
    queryParams.append('with_content', 'false'); // Optimize: don't fetch full content for listing

    let endpoint = '/blogs';
    
    if (featured === 'true') {
      endpoint = '/blogs/featured';
      queryParams.append('limit', '6');
    } else if (category) {
      queryParams.append('category', category);
    } else if (tag) {
      queryParams.append('tags', tag);
    } else if (search) {
      queryParams.append('search', search);
    }
    
    const url = `${API_BASE_URL}${endpoint}?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      next: { 
        revalidate: featured === 'true' ? 1800 : 900, // 30min for featured, 15min for others
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
  
  let title = "Educational Blogs & Articles | Medh";
  let description = "Explore our comprehensive collection of educational insights, career guidance, industry trends, and expert knowledge to accelerate your learning journey.";
  let keywords = "education blogs, career guidance, skill development, industry insights, learning resources, professional development";
  
  // Customize metadata based on filters
  if (search) {
    title = `Search Results for "${search}" | Medh Blogs`;
    description = `Find educational content about "${search}" on Medh. Discover insights, tips, and resources related to your search.`;
    keywords = `${search}, education, learning, ${keywords}`;
  } else if (category) {
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
    title = `${categoryTitle} Articles & Insights | Medh Blog`;
    description = `Explore comprehensive ${categoryTitle.toLowerCase()} articles, insights, and expert knowledge on Medh. Stay updated with the latest trends and developments.`;
    keywords = `${categoryTitle.toLowerCase()}, ${keywords}`;
  } else if (tag) {
    const tagTitle = tag.charAt(0).toUpperCase() + tag.slice(1);
    title = `${tagTitle} Content & Resources | Medh Blog`;
    description = `Discover valuable ${tagTitle.toLowerCase()} content, resources, and expert insights on Medh. Learn from industry professionals and accelerate your growth.`;
    keywords = `${tagTitle.toLowerCase()}, ${keywords}`;
  } else if (featured === 'true') {
    title = "Featured Articles & Must-Read Content | Medh Blog";
    description = "Discover our handpicked selection of must-read articles, featuring the most valuable educational insights, career guidance, and industry expertise.";
    keywords = `featured articles, must-read content, ${keywords}`;
  }
  
  // Add page number to title and description for pagination
  if (page && parseInt(page) > 1) {
    title = `${title} - Page ${page}`;
    description = `${description} Browse page ${page} of our educational content.`;
  }
  
  const canonical = `/blogs${category ? `?category=${category}` : ''}${tag ? `?tag=${tag}` : ''}${featured === 'true' ? '?featured=true' : ''}${search ? `?search=${search}` : ''}${page && parseInt(page) > 1 ? `${category || tag || search || featured === 'true' ? '&' : '?'}page=${page}` : ''}`;
  
  return {
    ...defaultMetadata,
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      url: canonical,
      type: 'website',
    },
         twitter: {
       ...defaultMetadata.twitter,
       title,
       description,
     }
  };
}

// Loading component for better UX
function BlogsPageLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="bg-gray-100 dark:bg-gray-800 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
              <div className="w-48 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
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
  
  // Fetch data on server side for better SEO
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

  return (
    <PageWrapper>
      <main className="min-h-screen bg-white dark:bg-gray-900">
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "Medh Educational Blog",
              "description": "Educational insights, career guidance, and industry expertise",
              "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co'}/blogs`,
              "publisher": {
                "@type": "Organization",
                "name": "Medh",
                "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co'
              },
              "blogPost": blogs.slice(0, 5).map((blog: IBlog) => ({
                "@type": "BlogPosting",
                "headline": blog.title,
                "description": blog.description || blog.meta_description,
                "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co'}/blogs/${blog.slug}`,
                "datePublished": blog.createdAt,
                "dateModified": blog.updatedAt,
                "author": {
                  "@type": "Person",
                  "name": blog.author?.name || "Medh Team"
                },
                "image": blog.upload_image,
                "publisher": {
                  "@type": "Organization",
                  "name": "Medh"
                }
              }))
            })
          }}
        />
        
        <Suspense fallback={<BlogsPageLoading />}>
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
