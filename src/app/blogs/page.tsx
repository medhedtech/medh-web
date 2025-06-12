import BlogsMain from "@/components/layout/main/BlogsMain";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { IBlog } from "@/types/blog.types";
// import BlogsDebug from "@/components/debug/BlogsDebug";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Define the SearchParams interface
interface SearchParams {
  category?: string;
  tag?: string;
  featured?: string;
  [key: string]: string | undefined;
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }) {
  // Get category or tag from search params
  const params = await searchParams;
  const category = params?.category || '';
  const tag = params?.tag || '';
  const featured = params?.featured === 'true';
  
  let title = "Blogs | Medh";
  let description = "Explore our latest educational insights, tips, and industry trends";
  
  // Customize metadata based on filters
  if (category) {
    title = `${category} Blogs | Medh`;
    description = `Explore our latest educational insights about ${category}`;
  } else if (tag) {
    title = `${tag} Articles | Medh`;
    description = `Explore our latest educational insights related to ${tag}`;
  } else if (featured) {
    title = "Featured Blogs | Medh";
    description = "Our selection of must-read articles and educational insights";
  }
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: ['/images/blogs-og.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/blogs-og.jpg'],
    }
  };
}

const Blogs = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  // Get filter parameters for initial server-side fetch
  const params = await searchParams;
  const category = params?.category || '';
  const tag = params?.tag || '';
  const featured = params?.featured === 'true';

  // Fetch initial blogs server-side for better SEO
  let initialBlogs: IBlog[] = [];
  let totalBlogs = 0;
  
  try {
    let endpoint = '/blogs';
    const params = new URLSearchParams();
    
    params.append('limit', '9');
    params.append('page', '1');
    params.append('status', 'published');
    params.append('sort_by', 'createdAt');
    params.append('sort_order', 'desc');
    
    if (featured) {
      endpoint = '/blogs/featured';
    } else if (category) {
      endpoint = `/blogs/category/${encodeURIComponent(category)}`;
    } else if (tag) {
      endpoint = `/blogs/tag/${encodeURIComponent(tag)}`;
    } else {
      if (category) params.append('category', category);
      if (tag) params.append('tags', tag);
    }
    
    const url = `${API_BASE_URL}${endpoint}?${params.toString()}`;
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Server-side blog fetch result:', { success: result.success, dataLength: result.data?.length, pagination: result.pagination });
      if (result.success && result.data) {
        initialBlogs = result.data || [];
        totalBlogs = result.pagination?.total || 0;
      }
    }
  } catch (error) {
    console.error("Error fetching initial blogs:", error);
    // Don't throw error, just log it and continue with empty data
    initialBlogs = [];
    totalBlogs = 0;
  }

  return (
    <PageWrapper>
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
        <BlogsMain 
          initialBlogs={initialBlogs} 
          totalBlogs={totalBlogs}
          initialFilters={{
            category,
            tag,
            featured
          }}
        />
      </main>
    </PageWrapper>
  );
};

export default Blogs;
