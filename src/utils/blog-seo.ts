import { IBlog } from '@/types/blog.types';
import { Metadata } from 'next';
import { generateSemanticKeywords, generateAIOptimizedTitle, generateEEATOptimizedDescription } from './enhanced-seo-2025';

interface BlogSEOData {
  blog: IBlog;
  url?: string;
  isIndex?: boolean;
}

export class BlogSEO {
  private blog: IBlog;
  private baseUrl: string;
  private isIndex: boolean;

  constructor(data: BlogSEOData) {
    this.blog = data.blog;
    this.baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co';
    this.isIndex = data.isIndex || false;
  }

  // Generate AI-optimized title with 2025 best practices
  generateTitle(): string {
    let title = this.blog.meta_title || this.blog.title;
    const keywords = this.generateKeywords();
    
    // Add category context for better SEO
    if (this.blog.categories && this.blog.categories.length > 0) {
      const category = typeof this.blog.categories[0] === 'string' 
        ? this.blog.categories[0] 
        : this.blog.categories[0]?.category_name;
      
      if (category && !title.toLowerCase().includes(category.toLowerCase())) {
        title = `${title} - ${category}`;
      }
    }
    
    // Use AI-optimized title generation with semantic keywords
    return generateAIOptimizedTitle(title, keywords);
  }

  // Generate E-E-A-T optimized description with 2025 best practices
  generateDescription(): string {
    let description = this.blog.meta_description || this.blog.description;
    
    if (!description) {
      // Generate description from content with better extraction
      const content = this.blog.content || '';
      const cleanContent = content.replace(/<[^>]*>/g, '').trim();
      const sentences = cleanContent.split(/[.!?]+/).filter(s => s.length > 20);
      description = sentences.slice(0, 2).join('. ') + '.';
    }
    
    // Remove HTML tags and extra whitespace
    description = description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    
    // Use E-E-A-T optimized description generation
    return generateEEATOptimizedDescription(description);
  }

  // Extract and optimize keywords
  generateKeywords(): string[] {
    const keywords = new Set<string>();
    
    // Add explicit tags
    if (this.blog.tags) {
      this.blog.tags.forEach(tag => keywords.add(tag.toLowerCase()));
    }
    
    // Add category-based keywords
    if (this.blog.categories) {
      this.blog.categories.forEach(cat => {
        const categoryName = typeof cat === 'string' ? cat : cat.category_name;
        if (categoryName) {
          keywords.add(categoryName.toLowerCase());
          keywords.add(`${categoryName.toLowerCase()} tutorial`);
          keywords.add(`${categoryName.toLowerCase()} guide`);
        }
      });
    }
    
    // Extract keywords from content
    const contentKeywords = this.extractKeywordsFromContent();
    contentKeywords.forEach(keyword => keywords.add(keyword));
    
    // Add 2025 AI-optimized contextual keywords
    const contextualKeywords = [
      'education',
      'learning',
      'online course',
      'skill development',
      'professional growth',
      'career advancement',
      'medh education',
      'AI-powered learning',
      'personalized education',
      'future skills'
    ];
    
    contextualKeywords.forEach(keyword => keywords.add(keyword));
    
    // Generate semantic keywords for primary topic
    const primaryTopic = this.blog.title.split(' ').slice(0, 2).join(' ');
    const semanticKeywords = generateSemanticKeywords(primaryTopic);
    semanticKeywords.forEach(keyword => keywords.add(keyword));
    
    return Array.from(keywords).slice(0, 20); // Increased limit for better coverage
  }

  // Extract keywords from content using NLP-like approach
  private extractKeywordsFromContent(): string[] {
    const content = (this.blog.content || this.blog.description || '').toLowerCase();
    const text = content.replace(/<[^>]*>/g, '').replace(/[^\w\s]/g, ' ');
    
    // Common stop words to exclude
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
      'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'have', 'has', 'had',
      'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
      'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
    ]);
    
    const words = text.split(/\s+/)
      .filter(word => word.length > 3 && word.length < 20)
      .filter(word => !stopWords.has(word))
      .filter(word => /^[a-z]+$/.test(word)); // Only alphabetic words
    
    // Count frequency
    const frequency: Record<string, number> = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    // Return top keywords by frequency
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([word]) => word);
  }

  // Generate structured data for blog post
  generateStructuredData(): object {
    const author = this.blog.author || { name: 'Medh Editorial Team' };
    const publishedDate = this.blog.createdAt;
    const modifiedDate = this.blog.updatedAt || this.blog.createdAt;
    const url = `${this.baseUrl}/blogs/${this.blog.slug || this.blog._id}`;
    
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": this.blog.title,
      "description": this.generateDescription(),
      "image": {
        "@type": "ImageObject",
        "url": this.blog.upload_image || `${this.baseUrl}/images/blog-default.jpg`,
        "width": 1200,
        "height": 630
      },
      "author": {
        "@type": "Person",
        "name": author.name,
        "url": `${this.baseUrl}/authors/${author.name?.toLowerCase().replace(/\s+/g, '-')}`
      },
      "publisher": {
        "@type": "Organization",
        "name": "Medh",
        "url": this.baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${this.baseUrl}/images/medh-logo.png`,
          "width": 200,
          "height": 60
        },
        "sameAs": [
          "https://www.facebook.com/medheducation",
          "https://www.linkedin.com/company/medh",
          "https://twitter.com/medheducation"
        ]
      },
      "url": url,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      },
      "datePublished": publishedDate,
      "dateModified": modifiedDate,
      "keywords": this.generateKeywords().join(', '),
      "articleSection": this.getCategoryName() || 'Education',
      "wordCount": this.getWordCount(),
      "timeRequired": this.getReadingTime(),
      "inLanguage": "en-US",
      "isAccessibleForFree": true,
      "creativeWorkStatus": "Published",
      "articleBody": this.getPlainTextContent(),
      "about": {
        "@type": "Thing",
        "name": this.getCategoryName() || 'Education'
      }
    };
  }

  // Generate FAQ structured data if content has Q&A format
  generateFAQStructuredData(): object | null {
    const content = this.blog.content || this.blog.description || '';
    const qaMatches = content.match(/(?:Q:|Question:)(.*?)(?:A:|Answer:)(.*?)(?=Q:|Question:|$)/gis);
    
    if (!qaMatches || qaMatches.length === 0) return null;
    
    const faqData = qaMatches.map(match => {
      const parts = match.split(/A:|Answer:/i);
      if (parts.length >= 2) {
        const question = parts[0].replace(/Q:|Question:/i, '').trim();
        const answer = parts[1].trim();
        
        return {
          "@type": "Question",
          "name": question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": answer
          }
        };
      }
      return null;
    }).filter(Boolean);
    
    if (faqData.length === 0) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData
    };
  }

  // Get category name for SEO
  private getCategoryName(): string {
    if (!this.blog.categories || this.blog.categories.length === 0) return '';
    
    const category = this.blog.categories[0];
    return typeof category === 'string' ? category : category.category_name || '';
  }

  // Calculate reading time
  private getReadingTime(): string {
    const wordsPerMinute = 200;
    const wordCount = this.getWordCount();
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `PT${minutes}M`;
  }

  // Get word count
  private getWordCount(): number {
    const content = this.blog.content || this.blog.description || '';
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.trim().split(/\s+/).length;
  }

  // Get plain text content for structured data
  private getPlainTextContent(): string {
    const content = this.blog.content || this.blog.description || '';
    return content.replace(/<[^>]*>/g, '').trim().substring(0, 1000);
  }

  // Generate breadcrumb structured data
  generateBreadcrumbData(): object {
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blogs' }
    ];
    
    // Add category if available
    const categoryName = this.getCategoryName();
    if (categoryName) {
      breadcrumbs.push({
        name: categoryName,
        url: `/blogs?category=${encodeURIComponent(categoryName.toLowerCase())}`
      });
    }
    
    // Add current page
    breadcrumbs.push({
      name: this.blog.title,
      url: `/blogs/${this.blog.slug || this.blog._id}`
    });
    
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `${this.baseUrl}${item.url}`
      }))
    };
  }

  // Generate complete metadata
  generateMetadata(): Metadata {
    const title = this.generateTitle();
    const description = this.generateDescription();
    const keywords = this.generateKeywords();
    const url = `/blogs/${this.blog.slug || this.blog._id}`;
    const imageUrl = this.blog.upload_image || `${this.baseUrl}/images/blog-default.jpg`;
    
    return {
      title,
      description,
      keywords: keywords.join(', '),
      authors: [{ name: this.blog.author?.name || 'Medh Editorial Team' }],
      creator: 'Medh',
      publisher: 'Medh',
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url: `${this.baseUrl}${url}`,
        siteName: 'Medh',
        type: 'article',
        locale: 'en_US',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: this.blog.title,
          }
        ],
        publishedTime: this.blog.createdAt,
        modifiedTime: this.blog.updatedAt || this.blog.createdAt,
        authors: [this.blog.author?.name || 'Medh Editorial Team'],
        section: this.getCategoryName() || 'Education',
        tags: this.blog.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
        creator: '@medh',
        site: '@medh',
      },
      robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: false,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      other: {
        'article:section': this.getCategoryName() || 'Education',
        'article:tag': keywords.slice(0, 5).join(', '),
        'article:published_time': this.blog.createdAt,
        'article:modified_time': this.blog.updatedAt || this.blog.createdAt,
        'article:author': this.blog.author?.name || 'Medh Editorial Team',
      }
    };
  }
}

// Utility functions for blog listing pages
export const generateBlogListingSEO = (params: {
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
  featured?: boolean;
}): Metadata => {
  const { category, tag, search, page, featured } = params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co';
  
  let title = 'Educational Blog & Articles | Medh';
  let description = 'Discover expert insights on technology, career growth, education, and industry trends. Stay ahead with Medh\'s comprehensive blog.';
  let keywords = ['education blog', 'career guidance', 'technology insights', 'professional development'];
  let url = '/blogs';
  
  if (search) {
    title = `"${search}" - Blog Search Results | Medh`;
    description = `Find educational content about "${search}" on Medh Blog. Expert insights and tutorials.`;
    keywords = [search, ...keywords];
    url += `?search=${encodeURIComponent(search)}`;
  } else if (category) {
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
    title = `${categoryTitle} Articles | Medh Blog`;
    description = `Explore ${categoryTitle.toLowerCase()} articles and expert insights on Medh Blog.`;
    keywords = [categoryTitle.toLowerCase(), ...keywords];
    url += `?category=${category}`;
  } else if (tag) {
    const tagTitle = tag.charAt(0).toUpperCase() + tag.slice(1);
    title = `${tagTitle} Articles | Medh Blog`;
    description = `Discover ${tagTitle.toLowerCase()} content and expert insights on Medh Blog.`;
    keywords = [tagTitle.toLowerCase(), ...keywords];
    url += `?tag=${tag}`;
  } else if (featured) {
    title = 'Featured Articles | Medh Blog';
    description = 'Explore our handpicked selection of must-read educational articles from Medh.';
    keywords = ['featured articles', 'must-read content', ...keywords];
    url += '?featured=true';
  }
  
  if (page && page > 1) {
    title += ` - Page ${page}`;
    url += url.includes('?') ? `&page=${page}` : `?page=${page}`;
  }
  
  return {
    title,
    description,
    keywords: keywords.join(', '),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${url}`,
      type: 'website',
      siteName: 'Medh',
      images: [
        {
          url: `${baseUrl}/images/blog-og.jpg`,
          width: 1200,
          height: 630,
          alt: 'Medh Educational Blog',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/images/blog-og.jpg`],
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
};

// Generate blog listing structured data
export const generateBlogListingStructuredData = (blogs: IBlog[]): object => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co';
  
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Medh Educational Blog",
    "description": "Expert insights on technology, career growth, education, and industry trends",
    "url": `${baseUrl}/blogs`,
    "publisher": {
      "@type": "Organization",
      "name": "Medh",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/medh-logo.png`
      }
    },
    "blogPost": blogs.slice(0, 10).map(blog => ({
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.description || blog.meta_description,
      "url": `${baseUrl}/blogs/${blog.slug || blog._id}`,
      "datePublished": blog.createdAt,
      "dateModified": blog.updatedAt || blog.createdAt,
      "author": {
        "@type": "Person",
        "name": blog.author?.name || "Medh Editorial Team"
      },
      "image": blog.upload_image,
      "publisher": {
        "@type": "Organization",
        "name": "Medh"
      }
    }))
  };
}; 