import BlogDetailsMain from "@/components/layout/main/BlogDetailsMain";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { notFound } from "next/navigation";
import { apiBaseUrl } from "@/apis";
import { apiUrls } from "@/apis";

// Dynamic metadata generation based on blog data
export async function generateMetadata({ params }) {
  const { id } = params;
  
  try {
    const res = await fetch(`${apiBaseUrl}${apiUrls.Blogs.getBlogById(id)}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    const data = await res.json();
    
    if (!data.success) {
      return {
        title: "Blog Details | Medh",
        description: "Explore educational insights and articles from Medh",
      };
    }
    
    const blog = data.data;
    
    return {
      title: `${blog.title} | Medh Blog`,
      description: blog.excerpt || `Read our latest blog post about ${blog.title}`,
      openGraph: {
        title: blog.title,
        description: blog.excerpt || `Read our latest blog post about ${blog.title}`,
        images: [blog.upload_image || '/images/blog/default.png'],
        type: 'article',
        article: {
          publishedTime: blog.createdAt,
          authors: [blog.author || 'Medh Team'],
          tags: blog.tags || [],
        },
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.excerpt || `Read our latest blog post about ${blog.title}`,
        images: [blog.upload_image || '/images/blog/default.png'],
      },
    };
  } catch (error) {
    console.error("Error fetching blog metadata:", error);
    return {
      title: "Blog Details | Medh",
      description: "Explore educational insights and articles from Medh",
    };
  }
}

const Blog_details = async ({ params }) => {
  const { id } = params;
  
  // Fetch blog data from API
  try {
    const res = await fetch(`${apiBaseUrl}${apiUrls.Blogs.getBlogById(id)}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    const data = await res.json();
    
    if (!data.success || !data.data) {
      notFound();
    }
    
    // Increment view count (could be moved to a separate API call)
    // This would typically be done from a separate endpoint or client-side

    // Fetch related blogs
    let relatedBlogs = [];
    try {
      const relatedRes = await fetch(`${apiBaseUrl}${apiUrls.Blogs.getRelatedBlogs({
        blogId: id,
        limit: 3,
        match_by: 'tags'
      })}`, {
        next: { revalidate: 3600 },
      });
      const relatedData = await relatedRes.json();
      if (relatedData.success) {
        relatedBlogs = relatedData.data;
      }
    } catch (error) {
      console.error("Error fetching related blogs:", error);
    }
    
    // Pass the blog data to BlogDetailsMain component
    return (
      <PageWrapper>
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
          <BlogDetailsMain blog={data.data} relatedBlogs={relatedBlogs} />
        </main>
      </PageWrapper>
    );
  } catch (error) {
    console.error("Error fetching blog details:", error);
    notFound();
  }
};

export async function generateStaticParams() {
  try {
    // Fetch blog IDs from API for static generation
    const res = await fetch(`${apiBaseUrl}${apiUrls.Blogs.getStaticBlogPaths()}`);
    const data = await res.json();
    
    if (!data.success || !data.data) {
      return [];
    }
    
    // Transform API response to format needed for Next.js static paths
    return data.data.map(blog => ({
      id: blog.id.toString()
    }));
  } catch (error) {
    console.error("Error generating static blog paths:", error);
    return [];
  }
}

export default Blog_details;
