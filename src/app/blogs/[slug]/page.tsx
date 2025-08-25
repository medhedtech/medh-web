import { Metadata } from 'next';
import Image from 'next/image';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import { CalendarDays, Clock, User, ArrowLeft, MessageCircle, ChevronLeft, ArrowRight, Eye, ThumbsUp, Tag, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { IBlog } from '@/types/blog.types';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { defaultMetadata } from '@/app/metadata';
import { generateSEOMetadata, generateStructuredData, generateBreadcrumbData } from '@/utils/seo';
import { BlogSEO } from '@/utils/blog-seo';
import BlogInteractiveButtons from './BlogInteractiveButtons';
// Blog post content will be rendered inline

// Import the API base URL from our centralized config
import { apiBaseUrl as API_BASE_URL } from '../../../../apis/config';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Fetch individual blog post with full content
async function fetchBlogPost(slugOrId: string): Promise<IBlog | null> {
  try {
    // Try fetching by slug first with content parameter
    let url = `${API_BASE_URL}/blogs/${slugOrId}?with_content=true`;
    let response = await fetch(url, {
      next: { revalidate: 3600 }, // Revalidate every hour
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // If slug-based fetch fails, try ID-based fetch with content
    if (!response.ok) {
      url = `${API_BASE_URL}/blogs/id/${slugOrId}?with_content=true`;
      response = await fetch(url, {
        next: { revalidate: 3600 },
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }
    
    if (!response.ok) {
      console.error(`Failed to fetch blog: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const result = await response.json();
    console.log('Blog data received:', {
      title: result.data?.title,
      hasDescription: !!result.data?.description,
      descriptionLength: result.data?.description?.length,
      hasContent: !!result.data?.content,
      contentLength: result.data?.content?.length,
      hasMetaDescription: !!result.data?.meta_description,
      metaDescriptionLength: result.data?.meta_description?.length
    });
    
    return result.data || result;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

// Fetch related blogs
async function fetchRelatedBlogs(blogId: string, categories: string[], tags: string[]): Promise<IBlog[]> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', '3');
    queryParams.append('status', 'published');
    queryParams.append('exclude_ids', blogId);
    
    if (categories.length > 0) {
      queryParams.append('category', categories[0]);
    } else if (tags.length > 0) {
      queryParams.append('tags', tags[0]);
    }
    
    const url = `${API_BASE_URL}/blogs?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.data || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return [];
  }
}

// Enhanced generateMetadata using BlogSEO class
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchBlogPost(slug);
  
  if (!blog) {
    return {
      title: 'Blog Post Not Found | Medh',
      description: 'The requested blog post could not be found.',
      robots: 'noindex, nofollow',
    };
  }

  // Use the BlogSEO class for optimized metadata
  const blogSEO = new BlogSEO({ blog });
  return blogSEO.generateMetadata();
}

// Generate static params for static generation (optional)
export async function generateStaticParams() {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs?limit=100&status=published`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      return [];
    }
    
    const result = await response.json();
    const blogs = result.data || result || [];
    
    return blogs.map((blog: IBlog) => ({
      slug: blog.slug || blog._id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Main blog post page component
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const blog = await fetchBlogPost(slug);
  
  if (!blog) {
    notFound();
  }
  
  // Initialize BlogSEO for comprehensive SEO
  const blogSEO = new BlogSEO({ blog });
  
  // Fetch related blogs
  const relatedBlogs = await fetchRelatedBlogs(
    blog._id, 
    blog.categories?.map(cat => 
      typeof cat === 'string' ? cat : cat.category_name || ''
    ) || [], 
    blog.tags || []
  );
  
  const readTime = calculateReadTime(blog.content || blog.description || '');
  const publishedDate = formatDate(blog.createdAt);
  const publishedDateISO = formatDateISO(blog.createdAt);
  
  // Generate all structured data using BlogSEO
  const blogStructuredData = blogSEO.generateStructuredData();
  const breadcrumbData = blogSEO.generateBreadcrumbData();
  const faqData = blogSEO.generateFAQStructuredData();
  
  return (
    <PageWrapper>
      {/* Enhanced Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogStructuredData)
        }}
      />
      
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />
      
      {/* FAQ Structured Data (if applicable) */}
      {faqData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqData)
          }}
        />
      )}
      
      <main className="min-h-screen bg-white dark:bg-gray-900">
        {/* Navigation with enhanced SEO */}
        <nav 
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40"
          aria-label="Blog navigation"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
                  <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <Link 
                      href="/"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      itemProp="item"
                    >
                      <span itemProp="name">Home</span>
                    </Link>
                    <meta itemProp="position" content="1" />
                  </li>
                  <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
                  <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <Link 
                      href="/blogs"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      itemProp="item"
                    >
                      <span itemProp="name">Blog</span>
                    </Link>
                    <meta itemProp="position" content="2" />
                  </li>
                  <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
                  <li className="text-gray-900 dark:text-white font-medium truncate max-w-xs" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <span itemProp="name">{blog.title}</span>
                    <meta itemProp="position" content="3" />
                  </li>
                </ol>
              </nav>
              
              <BlogInteractiveButtons 
                title={blog.title}
                description={blog.description || blog.meta_description}
              />
            </div>
          </div>
        </nav>

        <article className="container mx-auto px-4 py-12" itemScope itemType="https://schema.org/BlogPosting">
          <div className="max-w-4xl mx-auto">
            {/* Article Header with enhanced SEO */}
            <header className="mb-8">
              {(blog.categories && blog.categories.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {blog.categories.map((category, index) => {
                    const categoryName = typeof category === 'string' ? category : category.category_name;
                    return (
                      <Link
                        key={index}
                        href={`/blogs?category=${encodeURIComponent(categoryName)}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors"
                      >
                        <Tag className="w-3 h-3" />
                        {categoryName}
                      </Link>
                    );
                  })}
                </div>
              )}

              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                itemProp="headline"
              >
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8">
                <div className="flex items-center gap-2" itemScope itemType="https://schema.org/Person">
                  <User className="w-4 h-4" />
                  <span className="font-medium" itemProp="name">{blog.author?.name || 'Medh Team'}</span>
                  <meta itemProp="author" content={blog.author?.name || 'Medh Team'} />
                </div>
                
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  <time dateTime={publishedDateISO} itemProp="datePublished">
                    {publishedDate}
                  </time>
                  <meta itemProp="dateModified" content={formatDateISO(blog.updatedAt || blog.createdAt)} />
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span itemProp="timeRequired">{readTime}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{blog.views || 0} views</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{blog.likes || 0} likes</span>
                </div>
              </div>
            </header>

            {blog.upload_image && (
              <figure className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] mb-12 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={blog.upload_image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                  priority
                  itemProp="image"
                />
                <figcaption className="sr-only">{blog.title}</figcaption>
              </figure>
            )}

            {/* Enhanced Blog Content with SEO optimization */}
            <div 
              className="prose prose-xl dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-green-600 dark:prose-a:text-green-400 prose-blockquote:border-green-500 prose-code:text-green-600 dark:prose-code:text-green-400"
              itemProp="articleBody"
            >
              
              {(() => {
                // Smart content detection with SEO optimization
                const contentFields = [
                  { field: 'content', value: blog.content },
                  { field: 'description', value: blog.description },
                  { field: 'meta_description', value: blog.meta_description },
                ];
                
                const availableContent = contentFields
                  .filter(item => item.value && item.value.trim().length > 0)
                  .sort((a, b) => (b.value?.length || 0) - (a.value?.length || 0));
                
                if (availableContent.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
                        <p className="text-yellow-800 dark:text-yellow-300 mb-2">
                          ⚠️ No content available for this article
                        </p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                          This article may be a placeholder or the content is being updated.
                        </p>
                      </div>
                    </div>
                  );
                }
                
                const primaryContent = availableContent[0];
                
                return (
                  <div 
                    className="blog-content"
                    dangerouslySetInnerHTML={{ 
                      __html: enhancedProcessContent(primaryContent.value || '') 
                    }} 
                  />
                );
              })()}
              
            </div>

            {/* Article Footer with SEO tags */}
            <footer className="mt-12">
              {blog.tags && blog.tags.length > 0 && (
                <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Related Topics
                  </h3>
                  <div className="flex flex-wrap gap-2" itemProp="keywords">
                    {blog.tags.map((tag, index) => (
                      <Link
                        key={index}
                        href={`/blogs?tag=${encodeURIComponent(tag)}`}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        itemProp="about"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </footer>
          </div>
        </article>

        {/* Related Articles Section with enhanced SEO */}
        {relatedBlogs.length > 0 && (
          <section 
            className="bg-gray-50 dark:bg-gray-800/50 py-16"
            aria-label="Related articles"
          >
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                  Related Articles
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedBlogs.map((relatedBlog) => (
                    <article
                      key={relatedBlog._id}
                      className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                      itemScope
                      itemType="https://schema.org/BlogPosting"
                    >
                      <Link href={`/blogs/${relatedBlog.slug || relatedBlog._id}`}>
                        {relatedBlog.upload_image && (
                          <div className="relative w-full h-48 overflow-hidden">
                            <Image
                              src={relatedBlog.upload_image}
                              alt={relatedBlog.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              loading="lazy"
                              itemProp="image"
                            />
                          </div>
                        )}
                        
                        <div className="p-6">
                          <h3 
                            className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2"
                            itemProp="headline"
                          >
                            {relatedBlog.title}
                          </h3>
                          
                          {relatedBlog.description && (
                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3" itemProp="description">
                              {relatedBlog.description.replace(/<[^>]*>/g, '').substring(0, 120)}...
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <time dateTime={formatDateISO(relatedBlog.createdAt)} itemProp="datePublished">
                              {formatDate(relatedBlog.createdAt)}
                            </time>
                            <span>{calculateReadTime(relatedBlog.description || '')}</span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </PageWrapper>
  );
}

// Enhanced utility functions
const calculateReadTime = (content: string): string => {
  if (!content) return '1 min read';
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};

const extractKeywordsFromContent = (content: string): string[] => {
  if (!content) return [];
  
  const words = content
    .toLowerCase()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && word.length < 20);
  
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([word]) => word);
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

// Enhanced content processing for better formatting
const enhancedProcessContent = (content: string): string => {
  if (!content) return '';
  
  // First, clean up any HTML artifacts and code blocks
  let processedContent = content
    .replace(/```html\s*/gi, '')
    .replace(/```\s*/g, '')
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<html[^>]*>[\s\S]*?<\/html>/gi, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
    .replace(/<body[^>]*>/gi, '')
    .replace(/<\/body>/gi, '')
    .replace(/<header[^>]*>/gi, '')
    .replace(/<\/header>/gi, '')
    .replace(/<footer[^>]*>/gi, '')
    .replace(/<\/footer>/gi, '')
    .replace(/<section[^>]*>/gi, '')
    .replace(/<\/section>/gi, '')
    .replace(/<meta[^>]*>/gi, '')
    .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
    .trim();
  
  // Convert markdown to HTML if content appears to be markdown
  if (processedContent.includes('##') || processedContent.includes('**')) {
    processedContent = convertMarkdownToHtml(processedContent);
  }
  
  // Then apply enhanced styling
  processedContent = processedContent
    // Enhanced paragraph styling with better spacing
    .replace(/<p([^>]*)>/g, '<p$1 class="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">')
    
    // Enhanced heading styles with better hierarchy
    .replace(/<h1([^>]*)>/g, '<h1$1 class="text-4xl font-bold text-gray-900 dark:text-white mt-12 mb-8 leading-tight border-b border-gray-200 dark:border-gray-700 pb-4">')
    .replace(/<h2([^>]*)>/g, '<h2$1 class="text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-6 leading-tight">')
    .replace(/<h3([^>]*)>/g, '<h3$1 class="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4 leading-tight">')
    .replace(/<h4([^>]*)>/g, '<h4$1 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3 leading-tight">')
    .replace(/<h5([^>]*)>/g, '<h5$1 class="text-lg font-medium text-gray-800 dark:text-gray-200 mt-5 mb-3 leading-tight">')
    .replace(/<h6([^>]*)>/g, '<h6$1 class="text-base font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2 leading-tight">')
    
    // Enhanced list styling with better spacing
    .replace(/<ul([^>]*)>/g, '<ul$1 class="list-disc list-outside ml-6 mb-6 space-y-3">')
    .replace(/<ol([^>]*)>/g, '<ol$1 class="list-decimal list-outside ml-6 mb-6 space-y-3">')
    .replace(/<li([^>]*)>/g, '<li$1 class="text-lg leading-relaxed text-gray-700 dark:text-gray-300">')
    
    // Enhanced link styling
    .replace(/<a([^>]*)>/g, '<a$1 class="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 underline decoration-2 underline-offset-2 hover:decoration-green-500 transition-all duration-200 font-medium">')
    
    // Enhanced blockquote styling
    .replace(/<blockquote([^>]*)>/g, '<blockquote$1 class="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 pl-6 pr-4 py-4 my-8 italic text-lg text-gray-700 dark:text-gray-300 rounded-r-lg shadow-sm">')
    
    // Enhanced code styling
    .replace(/<code([^>]*)>/g, '<code$1 class="bg-gray-100 dark:bg-gray-800 text-green-600 dark:text-green-400 px-2 py-1 rounded text-sm font-mono border border-gray-200 dark:border-gray-700">')
    .replace(/<pre([^>]*)>/g, '<pre$1 class="bg-gray-900 dark:bg-gray-800 text-gray-100 dark:text-gray-200 p-6 rounded-lg overflow-x-auto my-8 border border-gray-200 dark:border-gray-700 shadow-sm">')
    
    // Enhanced table styling
    .replace(/<table([^>]*)>/g, '<table$1 class="w-full border-collapse border border-gray-300 dark:border-gray-600 my-8 rounded-lg overflow-hidden shadow-sm">')
    .replace(/<th([^>]*)>/g, '<th$1 class="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">')
    .replace(/<td([^>]*)>/g, '<td$1 class="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">')
    
    // Enhanced image styling
    .replace(/<img([^>]*)>/g, '<img$1 class="rounded-lg shadow-lg my-8 max-w-full h-auto border border-gray-200 dark:border-gray-700">')
    
    // Enhanced emphasis styling
    .replace(/<strong([^>]*)>/g, '<strong$1 class="font-bold text-gray-900 dark:text-white">')
    .replace(/<em([^>]*)>/g, '<em$1 class="italic text-gray-800 dark:text-gray-200">')
    
    // Enhanced horizontal rule
    .replace(/<hr([^>]*)>/g, '<hr$1 class="my-12 border-gray-300 dark:border-gray-600 border-t-2">')
    
    // Add proper spacing for divs and sections
    .replace(/<div([^>]*)>/g, '<div$1 class="mb-4">')
    .replace(/<section([^>]*)>/g, '<section$1 class="mb-8">');
  
  return processedContent;
};

// Convert markdown to HTML
const convertMarkdownToHtml = (markdown: string): string => {
  if (!markdown) return '';
  
  let html = markdown
    // Convert headings (order matters - do ### before ##)
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    
    // Convert bold text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    
    // Convert line breaks to paragraphs
    .split('\n\n')
    .map(paragraph => {
      const trimmed = paragraph.trim();
      if (!trimmed) return '';
      
      // Don't wrap headings in paragraphs
      if (trimmed.startsWith('<h')) {
        return trimmed;
      }
      
      // Wrap other content in paragraphs
      return `<p>${trimmed.replace(/\n/g, ' ')}</p>`;
    })
    .filter(p => p)
    .join('\n');
  
  return html;
};