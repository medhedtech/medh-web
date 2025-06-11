import { Metadata } from 'next';
import Image from 'next/image';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import { CalendarDays, Clock, User, ArrowLeft, MessageCircle, Share2, Bookmark, ChevronLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { IBlog } from '@/apis';
import { apiBaseUrl } from '@/apis';
import { format } from 'date-fns';

// Server-side fetch function for blog data
async function fetchBlogData(id: string): Promise<IBlog | null> {
  try {
    if (!id) return null;
    
    // Direct URL construction without using apiUrls utility
    const url = `${apiBaseUrl}/blogs/id/${id}`;
    console.log("Fetching blog from URL:", url);
    
    const response = await fetch(url, { 
      next: { revalidate: 3600 },
      // Add cache control to help with hydration issues
      cache: 'force-cache'
    });
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    console.log("Blog data response:", data);
    
    // Access the blog data correctly based on the actual response structure
    // The API returns { success: true, data: { blog data... } }
    if (data.success && data.data) {
      return data.data; // Return just the blog data object
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    // Use params directly as it's already properly typed and validated by Next.js
    const { id } = await params;
    
    if (!id) {
      return {
        title: 'Blog Details | Medh',
        description: 'Explore our educational insights and expert knowledge on our blog',
      };
    }
    
    const blogData = await fetchBlogData(id);
    return {
      title: blogData?.title ? `${blogData.title} | Medh Blog` : 'Blog Details | Medh',
      description: blogData?.excerpt || blogData?.meta_description || 'Explore our educational insights and expert knowledge on our blog',
      openGraph: {
        title: blogData?.title || 'Blog Details | Medh',
        description: blogData?.excerpt || 'Explore our educational insights on Medh blog',
        images: [blogData?.upload_image || '/images/blog-default.jpg'],
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Details | Medh',
      description: 'Explore our educational insights and expert knowledge on our blog',
    };
  }
}

interface BlogPageParams {
  id: string;
}

type Props = {
  params: Promise<BlogPageParams>;
}

// Utility function to calculate read time
const calculateReadTime = (content: string): string => {
  if (!content) return '1 min read';
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};

// Utility function to format date
const formatDate = (dateString: string): string => {
  if (!dateString) return 'Recently published';
  try {
    return format(new Date(dateString), 'MMMM d, yyyy');
  } catch {
    return dateString;
  }
};

export default async function BlogDetails({ params }: Props) {
  // Use params directly as it's already properly typed and validated by Next.js
  const { id } = await params;
  
  if (!id) {
    return (
      <PageWrapper>
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center max-w-lg mx-auto p-8 bg-white/80 dark:bg-gray-800/30 backdrop-blur-md shadow-xl rounded-2xl">
              <div className="text-red-500 font-bold text-xl mb-3">Invalid Blog ID</div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                The blog ID is missing or invalid.
              </p>
              <Link 
                href="/blogs" 
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl inline-flex items-center transition-all"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Browse all blogs
              </Link>
            </div>
          </div>
        </main>
      </PageWrapper>
    );
  }
  
  // Fetch blog data
  const blog = await fetchBlogData(id);
  
  if (!blog) {
    return (
      <PageWrapper>
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center max-w-lg mx-auto p-8 bg-white/80 dark:bg-gray-800/30 backdrop-blur-md shadow-xl rounded-2xl">
              <div className="text-amber-600 font-bold text-xl mb-3">Blog not found</div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                The blog post you're looking for doesn't exist or might have been removed.
              </p>
              <Link 
                href="/blogs" 
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl inline-flex items-center transition-all"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Browse all blogs
              </Link>
            </div>
          </div>
        </main>
      </PageWrapper>
    );
  }

  const readTime = calculateReadTime(blog.content);
  const formattedDate = formatDate(blog.createdAt);
  
  return (
    <PageWrapper>
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950" suppressHydrationWarning={true}>
        <div className="relative">
          {/* Hero section with background image */}
          <div className="absolute inset-0 h-[500px] z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-10" />
            <Image
              src={blog.upload_image || '/images/blog-default.jpg'}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Overlapping content */}
          <div className="relative z-10 pt-40 lg:pt-52 px-4">
            {/* Navigation */}
            <div className="max-w-4xl mx-auto mb-8">
              <Link href="/blogs" className="inline-flex items-center text-white hover:text-primary-300 transition-colors font-medium bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blogs
              </Link>
            </div>
            
            {/* Blog Header */}
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 lg:p-12 shadow-xl">
              {/* Category Tag */}
              <div className="mb-6">
                <span className="px-4 py-1.5 text-xs font-medium rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  {blog.categories && blog.categories[0] ? 
                    (typeof blog.categories[0] === 'string' ? 
                      blog.categories[0] : 
                      (blog.categories[0] as any).category_name || 'Education') 
                    : 'Education'}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 mb-10 pb-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-primary-600 text-white rounded-full overflow-hidden mr-3 flex items-center justify-center shadow-md">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {blog.author?.name || 'Medh Author'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Author
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                    <CalendarDays className="w-4 h-4 mr-1.5 text-primary-500" />
                    {formattedDate}
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm mt-1">
                    <Clock className="w-4 h-4 mr-1.5 text-primary-500" />
                    {readTime}
                  </div>
                </div>
                
                <div className="ml-auto flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                      <Bookmark className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Blog Content */}
              <div 
                className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none mb-12 prose-headings:text-primary-900 dark:prose-headings:text-primary-300 prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-img:rounded-xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
              
              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-10 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Tags:</span>
                  {blog.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Engagement Section */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl mt-10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-6">
                    <span className="flex items-center text-gray-700 dark:text-gray-300">
                      <MessageCircle className="w-5 h-5 mr-2 text-primary-500" />
                      {blog.comments?.length || 0} Comments
                    </span>
                    <span className="flex items-center text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5 mr-2 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      {blog.likes || 0} Likes
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Related Posts Placeholder - Could be implemented with actual data in the future */}
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="w-10 h-1 bg-primary-500 mr-3 rounded-full"></span>
                  Related Articles
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 hover:shadow-md transition-all">
                    <p className="text-sm text-primary-600 dark:text-primary-400 mb-2">Education</p>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Discover more content on our blog page
                    </h4>
                    <Link href="/blogs" className="text-primary-600 dark:text-primary-400 font-medium text-sm inline-flex items-center">
                      Browse blogs
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
} 