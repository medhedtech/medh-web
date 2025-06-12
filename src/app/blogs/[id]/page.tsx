import { Metadata } from 'next';
import Image from 'next/image';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import { CalendarDays, Clock, User, ArrowLeft, MessageCircle, Share2, Bookmark, ChevronLeft, ArrowRight, Eye, ThumbsUp, Tag, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { IBlog } from '@/apis';
import { apiBaseUrl } from '@/apis';
import { format } from 'date-fns';

// Server-side fetch function for blog data
async function fetchBlogData(id: string): Promise<IBlog | null> {
  try {
    if (!id) return null;
    
    const url = `${apiBaseUrl}/blogs/id/${id}`;
    console.log("Fetching blog from URL:", url);
    
    const response = await fetch(url, { 
      next: { revalidate: 3600 },
      cache: 'force-cache'
    });
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    console.log("Blog data response:", data);
    
    if (data.success && data.data) {
      return data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return null;
  }
}

// Enhanced metadata generation for better SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    
    if (!id) {
      return {
        title: 'Blog Details | Medh - Educational Insights & Expert Knowledge',
        description: 'Explore our comprehensive educational insights, expert knowledge, and learning resources on the Medh blog platform.',
        keywords: ['education', 'learning', 'blog', 'insights', 'knowledge'],
        authors: [{ name: 'Medh Team' }],
        openGraph: {
          title: 'Blog Details | Medh',
          description: 'Explore educational insights and expert knowledge',
          type: 'website',
          siteName: 'Medh',
        },
        twitter: {
          card: 'summary_large_image',
          title: 'Blog Details | Medh',
          description: 'Explore educational insights and expert knowledge',
        },
      };
    }
    
    const blogData = await fetchBlogData(id);
    
    if (!blogData) {
      return {
        title: 'Blog Not Found | Medh',
        description: 'The requested blog post could not be found.',
      };
    }

    const title = `${blogData.title} | Medh Blog`;
    const description = blogData.excerpt || blogData.meta_description || `Read about ${blogData.title} on Medh blog - your source for educational insights and expert knowledge.`;
    const imageUrl = blogData.upload_image || '/images/blog-default.jpg';
    const publishedTime = blogData.createdAt;
    const modifiedTime = blogData.updatedAt || blogData.createdAt;
    const authorName = blogData.author?.name || 'Medh Team';
    
    // Extract keywords from tags and content
    const keywords = [
      ...(blogData.tags || []),
      'education',
      'learning',
      'blog',
      'medh'
    ];

    return {
      title,
      description,
      keywords: keywords.join(', '),
      authors: [{ name: authorName }],
      publisher: 'Medh',
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime,
        modifiedTime,
        authors: [authorName],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: blogData.title,
          }
        ],
        siteName: 'Medh',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
        creator: `@${authorName.replace(/\s+/g, '').toLowerCase()}`,
      },
      alternates: {
        canonical: `/blogs/${id}`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
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

// Enhanced utility functions
const calculateReadTime = (content: string): string => {
  if (!content) return '1 min read';
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};

const formatDate = (dateString: string): string => {
  if (!dateString) return 'Recently published';
  try {
    return format(new Date(dateString), 'MMMM d, yyyy');
  } catch {
    return dateString;
  }
};

const formatDateISO = (dateString: string): string => {
  if (!dateString) return new Date().toISOString();
  try {
    return new Date(dateString).toISOString();
  } catch {
    return new Date().toISOString();
  }
};

// Enhanced content processing for better HTML/Markdown support
const processContent = (content: string): string => {
  if (!content) return '';
  
  // Enhanced HTML processing with better typography and spacing
  let processedContent = content
    // Improve heading styles
    .replace(/<h1([^>]*)>/g, '<h1$1 class="text-4xl font-bold text-gray-900 dark:text-white mt-12 mb-6 leading-tight">')
    .replace(/<h2([^>]*)>/g, '<h2$1 class="text-3xl font-semibold text-gray-900 dark:text-white mt-10 mb-5 leading-tight">')
    .replace(/<h3([^>]*)>/g, '<h3$1 class="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4 leading-tight">')
    .replace(/<h4([^>]*)>/g, '<h4$1 class="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 leading-tight">')
    .replace(/<h5([^>]*)>/g, '<h5$1 class="text-lg font-semibold text-gray-900 dark:text-white mt-5 mb-3 leading-tight">')
    .replace(/<h6([^>]*)>/g, '<h6$1 class="text-base font-semibold text-gray-900 dark:text-white mt-4 mb-2 leading-tight">')
    
    // Improve paragraph styles
    .replace(/<p([^>]*)>/g, '<p$1 class="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">')
    
    // Improve list styles
    .replace(/<ul([^>]*)>/g, '<ul$1 class="list-disc list-inside space-y-2 mb-6 text-gray-700 dark:text-gray-300 ml-4">')
    .replace(/<ol([^>]*)>/g, '<ol$1 class="list-decimal list-inside space-y-2 mb-6 text-gray-700 dark:text-gray-300 ml-4">')
    .replace(/<li([^>]*)>/g, '<li$1 class="text-lg leading-relaxed">')
    
    // Improve link styles
    .replace(/<a([^>]*?)href="([^"]*)"([^>]*)>/g, '<a$1href="$2"$3 class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline decoration-2 underline-offset-2 transition-colors font-medium">')
    
    // Improve blockquote styles
    .replace(/<blockquote([^>]*)>/g, '<blockquote$1 class="border-l-4 border-primary-500 pl-6 py-4 my-8 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg italic text-lg text-gray-700 dark:text-gray-300">')
    
    // Improve code styles
    .replace(/<code([^>]*)>/g, '<code$1 class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-primary-600 dark:text-primary-400">')
    .replace(/<pre([^>]*)>/g, '<pre$1 class="bg-gray-900 dark:bg-gray-950 text-gray-100 p-6 rounded-xl overflow-x-auto my-8 border border-gray-200 dark:border-gray-700">')
    
    // Improve image styles
    .replace(/<img([^>]*?)src="([^"]*)"([^>]*)>/g, '<img$1src="$2"$3 class="rounded-xl shadow-lg my-8 w-full h-auto" loading="lazy">')
    
    // Improve table styles
    .replace(/<table([^>]*)>/g, '<div class="overflow-x-auto my-8"><table$1 class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">')
    .replace(/<\/table>/g, '</table></div>')
    .replace(/<thead([^>]*)>/g, '<thead$1 class="bg-gray-50 dark:bg-gray-800">')
    .replace(/<th([^>]*)>/g, '<th$1 class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">')
    .replace(/<td([^>]*)>/g, '<td$1 class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">')
    
    // Improve strong and em styles
    .replace(/<strong([^>]*)>/g, '<strong$1 class="font-bold text-gray-900 dark:text-white">')
    .replace(/<em([^>]*)>/g, '<em$1 class="italic text-gray-800 dark:text-gray-200">');
  
  return processedContent;
};

export default async function BlogDetails({ params }: Props) {
  const { id } = await params;
  
  if (!id) {
    return (
      <PageWrapper>
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 border border-gray-100 dark:border-gray-700">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ExternalLink className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Invalid Blog ID</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  The blog ID is missing or invalid. Please check the URL and try again.
                </p>
                <Link 
                  href="/blogs" 
                  className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Browse All Blogs
                </Link>
              </div>
            </div>
          </div>
        </main>
      </PageWrapper>
    );
  }
  
  const blog = await fetchBlogData(id);
  
  if (!blog) {
    return (
      <PageWrapper>
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 border border-gray-100 dark:border-gray-700">
                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Blog Not Found</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  The blog post you're looking for doesn't exist or might have been removed.
                </p>
                <Link 
                  href="/blogs" 
                  className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Browse All Blogs
                </Link>
              </div>
            </div>
          </div>
        </main>
      </PageWrapper>
    );
  }

  const readTime = calculateReadTime(blog.content);
  const formattedDate = formatDate(blog.createdAt);
  const isoDate = formatDateISO(blog.createdAt);
  const processedContent = processContent(blog.content);
  
  // Extract category name properly
  const categoryName = blog.categories && blog.categories[0] ? 
    (typeof blog.categories[0] === 'string' ? 
      blog.categories[0] : 
      (blog.categories[0] as any).category_name || 'Education') 
    : 'Education';

  return (
    <PageWrapper>
      <article className="min-h-screen bg-white dark:bg-gray-900">
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": blog.title,
              "description": blog.excerpt || blog.meta_description,
              "image": blog.upload_image,
              "author": {
                "@type": "Person",
                "name": blog.author?.name || "Medh Team"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Medh",
                "logo": {
                  "@type": "ImageObject",
                  "url": "/images/logo.png"
                }
              },
              "datePublished": isoDate,
              "dateModified": formatDateISO(blog.updatedAt || blog.createdAt),
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `/blogs/${id}`
              },
              "keywords": blog.tags?.join(", ") || "education, learning, blog",
              "articleSection": categoryName,
              "wordCount": blog.content?.split(/\s+/).length || 0
            })
          }}
        />

        {/* Full-Width Hero Section */}
        <header className="relative w-full h-screen min-h-[600px] overflow-hidden">
          {/* Hero Background Image */}
          <div className="absolute inset-0">
            <Image
              src={blog.upload_image || '/images/blog-default.jpg'}
              alt={blog.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={90}
            />
            {/* Gradient Overlays for Better Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
          </div>
          
          {/* Hero Content */}
          <div className="relative z-20 h-full flex flex-col">
            {/* Navigation Bar */}
            <nav className="w-full px-6 sm:px-8 lg:px-12 pt-8 pb-4" aria-label="Breadcrumb">
              <div className="max-w-7xl mx-auto">
                <Link 
                  href="/blogs" 
                  className="inline-flex items-center text-white/90 hover:text-white transition-all duration-200 font-medium bg-black/20 backdrop-blur-md px-8 py-4 rounded-full border border-white/20 hover:bg-black/30 hover:border-white/30"
                >
                  <ArrowLeft className="w-5 h-5 mr-3" />
                  Back to Blogs
                </Link>
              </div>
            </nav>
            
            {/* Hero Title and Meta - Centered */}
            <div className="flex-1 flex items-center justify-center px-6 sm:px-8 lg:px-12">
              <div className="max-w-6xl mx-auto text-center">
                {/* Category Badge */}
                <div className="mb-10">
                  <span className="inline-flex items-center px-8 py-4 text-base font-semibold rounded-full bg-white/15 backdrop-blur-md text-white border border-white/25 shadow-lg">
                    <Tag className="w-5 h-5 mr-3" />
                    {categoryName}
                  </span>
                </div>
                
                {/* Main Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-10 leading-tight tracking-tight px-4">
                  {blog.title}
                </h1>
                
                {/* Excerpt */}
                {blog.excerpt && (
                  <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-16 leading-relaxed max-w-5xl mx-auto font-light px-4">
                    {blog.excerpt}
                  </p>
                )}
              </div>
            </div>
            
            {/* Author and Meta Info Bar - Bottom */}
            <div className="w-full px-6 sm:px-8 lg:px-12 pb-12">
              <div className="max-w-7xl mx-auto">
                <div className="bg-black/20 backdrop-blur-md rounded-3xl border border-white/20 p-8 lg:p-10">
                  <div className="flex flex-wrap items-center justify-between gap-8">
                    {/* Author Info */}
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mr-6 border border-white/30 shadow-lg">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-xl mb-1">
                          {blog.author?.name || 'Medh Team'}
                        </p>
                        <p className="text-sm text-white/70">Author</p>
                      </div>
                    </div>
                    
                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-6 text-white/90">
                      <div className="flex items-center bg-white/10 rounded-full px-6 py-3">
                        <CalendarDays className="w-5 h-5 mr-3 text-white/80" />
                        <time dateTime={isoDate} className="font-medium text-sm">
                          {formattedDate}
                        </time>
                      </div>
                      
                      <div className="flex items-center bg-white/10 rounded-full px-6 py-3">
                        <Clock className="w-5 h-5 mr-3 text-white/80" />
                        <span className="font-medium text-sm">{readTime}</span>
                      </div>
                      
                      <div className="flex items-center bg-white/10 rounded-full px-6 py-3">
                        <Eye className="w-5 h-5 mr-3 text-white/80" />
                        <span className="font-medium text-sm">{blog.views || 0} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Separate from Hero */}
        <main className="w-full relative z-10">
          {/* Action Bar - Full Width */}
          <div className="w-full bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 py-6">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-10">
                  <button className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group">
                    <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
                      <ThumbsUp className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-base">{blog.likes || 0} Likes</span>
                  </button>
                  <button className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group">
                    <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-base">{blog.comments?.length || 0} Comments</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button 
                    className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 shadow-sm hover:shadow-md" 
                    title="Share article"
                  >
                    <Share2 className="w-6 h-6" />
                  </button>
                  <button 
                    className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 shadow-sm hover:shadow-md" 
                    title="Bookmark article"
                  >
                    <Bookmark className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Article Content */}
          <div className="w-full bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
              <div 
                className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-primary-600 dark:prose-code:text-primary-400 prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-blockquote:border-primary-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50 prose-headings:mb-8 prose-headings:mt-12 prose-p:mb-6 prose-p:leading-relaxed prose-li:mb-2 prose-blockquote:py-6 prose-blockquote:px-8 prose-pre:p-6 prose-code:px-2 prose-code:py-1"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </div>
          </div>
          
          {/* Tags Section - Full Width */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="w-full bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 py-16">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Related Topics</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400">Explore more content on these topics</p>
                </div>
                <div className="flex flex-wrap justify-center gap-6">
                  {blog.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-base font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 shadow-sm hover:shadow-md"
                    >
                      <Tag className="w-5 h-5 mr-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Related Articles - Full Width */}
          <section className="w-full bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="text-center mb-20">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8">
                  Continue Your Learning Journey
                </h2>
                <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
                  Discover more insights, expert knowledge, and educational content to expand your understanding
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-16 lg:p-20 border border-gray-100 dark:border-gray-700">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg">
                    <ArrowRight className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                    Explore Our Blog Library
                  </h3>
                  <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Browse our comprehensive collection of educational articles, expert insights, and learning resources designed to help you grow and succeed.
                  </p>
                  <Link 
                    href="/blogs" 
                    className="inline-flex items-center px-12 py-6 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg"
                  >
                    Browse All Articles
                    <ArrowRight className="w-6 h-6 ml-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </article>
    </PageWrapper>
  );
} 