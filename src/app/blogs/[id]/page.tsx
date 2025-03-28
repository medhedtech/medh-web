import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiBaseUrl, apiUrls } from '@/apis';
import BlogDetailsMain from '@/components/layout/main/BlogDetailsMain';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import { BlogData } from '@/hooks/useBlog.hook';

interface BlogPageParams {
  id: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Fetch blog data by ID or slug with proper error handling
 */
async function fetchBlogData(idOrSlug: string): Promise<ApiResponse<BlogData> | null> {
  try {
    // First try to fetch by ID
    let res = await fetch(`${apiBaseUrl}${apiUrls.Blogs.getBlogById(idOrSlug)}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Handle 401 Unauthorized errors specifically for static generation
    if (res.status === 401 && process.env.NODE_ENV === 'production') {
      console.log('Authorization required for blog API, continuing with static generation');
      // Return mock data for static generation
      return {
        success: true,
        data: {
          _id: idOrSlug,
          title: "Blog Post",
          description: "This is a placeholder for the blog content during build.",
          content: "<p>Content will be loaded dynamically during runtime.</p>",
          blog_link: null,
          upload_image: "/images/blog-placeholder.jpg",
          author: "Medh Team",
          categories: [],
          tags: [],
          status: "published",
          featured: false,
          views: 0,
          likes: 0,
          comments: [],
          meta_title: "Blog Post",
          meta_description: "Blog post description",
          reading_time: 5,
          slug: idOrSlug,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __v: 0,
          commentCount: 0
        }
      };
    }

    let data = await res.json();
    
    // If ID fetch fails, try by slug
    if (!res.ok || !data.success) {
      console.log('Blog ID fetch failed, trying slug:', idOrSlug);
      res = await fetch(`${apiBaseUrl}${apiUrls.Blogs.getBlogBySlug(idOrSlug)}`, {
        next: { revalidate: 3600 },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      // Handle 401 Unauthorized errors specifically for static generation
      if (res.status === 401 && process.env.NODE_ENV === 'production') {
        console.log('Authorization required for blog API, continuing with static generation');
        // Return mock data for static generation
        return {
          success: true,
          data: {
            _id: idOrSlug,
            title: "Blog Post",
            description: "This is a placeholder for the blog content during build.",
            content: "<p>Content will be loaded dynamically during runtime.</p>",
            blog_link: null,
            upload_image: "/images/blog-placeholder.jpg",
            author: "Medh Team",
            categories: [],
            tags: [],
            status: "published",
            featured: false,
            views: 0,
            likes: 0,
            comments: [],
            meta_title: "Blog Post",
            meta_description: "Blog post description",
            reading_time: 5,
            slug: idOrSlug,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            __v: 0,
            commentCount: 0
          }
        };
      }
      
      data = await res.json();
    }

    if (!res.ok) {
      console.error('Blog API Error:', { status: res.status, statusText: res.statusText });
      return null;
    }

    if (!data.success || !data.data) {
      console.error('Invalid blog data:', data);
      return null;
    }

    return data as ApiResponse<BlogData>;
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return null;
  }
}

/**
 * Fetch related blogs with proper error handling
 */
async function fetchRelatedBlogs(blogData: BlogData): Promise<BlogData[]> {
  try {
    // Only proceed if we have tags or categories
    if (!blogData.tags.length && !blogData.categories.length) {
      return [];
    }
    
    const relatedRes = await fetch(`${apiBaseUrl}${apiUrls.Blogs.getRelatedBlogs({
      blogId: blogData._id,
      limit: 3,
      tags: blogData.tags.join(','),
      category: Array.isArray(blogData.categories) 
        ? blogData.categories[0] 
        : blogData.categories
    })}`, {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    // Handle 401 Unauthorized errors specifically for static generation
    if (relatedRes.status === 401 && process.env.NODE_ENV === 'production') {
      console.log('Authorization required for related blogs API, continuing with static generation');
      return []; // Return empty array for related blogs during build
    }
    
    const relatedData = await relatedRes.json();
    if (!relatedRes.ok || !relatedData.success) {
      console.warn("Failed to fetch related blogs");
      return [];
    }
    
    return relatedData.data as BlogData[];
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    return [];
  }
}

// Dynamic metadata generation based on blog data
export async function generateMetadata({
  params,
}: {
  params: Promise<BlogPageParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchBlogData(id);
  
  if (!data?.success) {
    return {
      title: "Blog Details | Medh",
      description: "Explore educational insights and articles from Medh",
    };
  }
  
  const blog = data.data;

  // Fetch author data
  let authorName = "Medh Team"; // Default author name
  try {
    const authorRes = await fetch(`${apiBaseUrl}/api/users/${blog.author}`, {
      next: { revalidate: 3600 },
    });
    const authorData = await authorRes.json();
    if (authorData.success && authorData.data?.name) {
      authorName = authorData.data.name;
    }
  } catch (error) {
    console.error("Error fetching author data:", error);
  }
  
  return {
    title: `${blog.title} | Medh Blog`,
    description: blog.meta_description || blog.description || `Read our latest blog post about ${blog.title}`,
    openGraph: {
      title: blog.meta_title || blog.title,
      description: blog.meta_description || blog.description || `Read our latest blog post about ${blog.title}`,
      images: [blog.upload_image],
      type: 'article',
      publishedTime: blog.createdAt,
      authors: [authorName],
      tags: blog.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.meta_title || blog.title,
      description: blog.meta_description || blog.description || `Read our latest blog post about ${blog.title}`,
      images: [blog.upload_image],
    },
  };
}

type Props = {
  params: Promise<BlogPageParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogDetails(props: Props) {
  const { id } = await props.params;
  const data = await fetchBlogData(id);
  
  if (!data?.success || !data.data) {
    notFound();
  }
  
  // Fetch related blogs
  const relatedBlogs = await fetchRelatedBlogs(data.data);
  
  return (
    <PageWrapper>
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <BlogDetailsMain blog={data.data} relatedBlogs={relatedBlogs} />
        </div>
      </main>
    </PageWrapper>
  );
}

export async function generateStaticParams(): Promise<{ id: string }[]> {
  try {
    // Only fetch published blogs for static generation
    const res = await fetch(`${apiBaseUrl}${apiUrls.Blogs.getAllBlogs({
      limit: 100,
      status: 'published'
    })}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error("Error fetching blogs for static generation:", res.status, res.statusText);
      // Return fallback paths if API call fails
      return [
        { id: 'transforming-software-development-with-devops' },
        { id: 'musk-family' }
      ];
    }
    
    const data = await res.json();
    
    if (!data.success || !Array.isArray(data.data)) {
      console.error("Invalid blog data for static generation:", data);
      // Return fallback paths if data structure is invalid
      return [
        { id: 'transforming-software-development-with-devops' },
        { id: 'musk-family' }
      ];
    }
    
    // Only generate routes from blog IDs, not from slugs
    return data.data
      .filter((blog: BlogData) => blog && blog._id)
      .map((blog: BlogData): { id: string } => {
        return { id: String(blog._id) };
      });
  } catch (error) {
    console.error("Error generating static blog paths:", error);
    // Return fallback paths on exception
    return [
      { id: 'transforming-software-development-with-devops' },
      { id: 'musk-family' }
    ];
  }
}