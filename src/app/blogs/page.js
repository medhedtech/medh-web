import BlogsMain from "@/components/layout/main/BlogsMain";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { apiBaseUrl } from "@/apis";
import { apiUrls } from "@/apis";

export async function generateMetadata({ searchParams }) {
  // Get category or tag from search params
  const category = searchParams?.category || '';
  const tag = searchParams?.tag || '';
  const featured = searchParams?.featured === 'true';
  
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

const Blogs = async ({ searchParams }) => {
  // Get filter parameters for initial server-side fetch
  const category = searchParams?.category || '';
  const tag = searchParams?.tag || '';
  const featured = searchParams?.featured === 'true';

  // Fetch initial blogs server-side for better SEO
  let initialBlogs = [];
  try {
    const apiUrl = featured 
      ? apiUrls.Blogs.getFeaturedBlogs({ limit: 9, type: 'featured' })
      : apiUrls.Blogs.getAllBlogs({
          limit: 9,
          category: category || '',
          tags: tag || '',
          sort_by: 'createdAt',
          sort_order: 'desc',
          status: 'published'
        });
    
    const res = await fetch(`${apiBaseUrl}${apiUrl}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    const data = await res.json();
    
    if (data.success && data.data) {
      initialBlogs = data.data;
    }
  } catch (error) {
    console.error("Error fetching initial blogs:", error);
  }
  
  // Get total blogs count for pagination
  let totalBlogs = 0;
  try {
    const countUrl = apiUrls.Blogs.getAllBlogs({
      count_only: true,
      category: category || '',
      tags: tag || '',
      status: 'published'
    });
    
    const countRes = await fetch(`${apiBaseUrl}${countUrl}`, {
      next: { revalidate: 3600 },
    });
    const countData = await countRes.json();
    
    if (countData.success && countData.data) {
      totalBlogs = countData.data.count || 0;
    }
  } catch (error) {
    console.error("Error fetching blogs count:", error);
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
