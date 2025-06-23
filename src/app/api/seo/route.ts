import { NextRequest, NextResponse } from 'next/server';
import SitemapGenerator from '@/utils/sitemap-generator';
import SchemaGenerator from '@/utils/schema-generator';
import SEOAnalytics from '@/utils/seo-analytics';
import ContentOptimizer from '@/utils/content-optimizer';
import LocalSEOOptimizer from '@/utils/local-seo';
import SEOAutomation from '@/utils/seo-automation';

// GET /api/seo - Get SEO status and analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const type = searchParams.get('type');

    switch (action) {
      case 'analytics':
        return await handleAnalytics(searchParams);
      
      case 'sitemap':
        return await handleSitemapGeneration(type);
      
      case 'schema':
        return await handleSchemaGeneration(searchParams);
      
      case 'audit':
        return await handleContentAudit(searchParams);
      
      case 'local':
        return await handleLocalSEO(searchParams);
      
      case 'automation':
        return await handleAutomationStatus();
      
      default:
        return await handleSEOOverview();
    }
  } catch (error) {
    console.error('SEO API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/seo - Create or update SEO configurations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'optimize-meta':
        return await handleMetaOptimization(data);
      
      case 'generate-sitemap':
        return await handleSitemapCreation(data);
      
      case 'schedule-task':
        return await handleTaskScheduling(data);
      
      case 'analyze-content':
        return await handleContentAnalysis(data);
      
      case 'generate-local-content':
        return await handleLocalContentGeneration(data);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('SEO API POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Handle SEO analytics
async function handleAnalytics(searchParams: URLSearchParams) {
  const analytics = new SEOAnalytics();
  const url = searchParams.get('url');
  const pages = searchParams.get('pages');

  if (url) {
    // Analyze single page
    const pageData = {
      url,
      title: searchParams.get('title') || '',
      description: searchParams.get('description') || '',
      keywords: searchParams.get('keywords')?.split(',') || [],
      loadTime: parseInt(searchParams.get('loadTime') || '0'),
      coreWebVitals: {
        lcp: parseFloat(searchParams.get('lcp') || '0'),
        fid: parseFloat(searchParams.get('fid') || '0'),
        cls: parseFloat(searchParams.get('cls') || '0')
      }
    };

    const analysis = analytics.analyzePage(pageData);
    return NextResponse.json({ success: true, analysis });
  }

  if (pages) {
    // Generate comprehensive report
    const pagesData = JSON.parse(pages);
    const report = analytics.generateSEOReport(pagesData);
    return NextResponse.json({ success: true, report });
  }

  return NextResponse.json(
    { error: 'URL or pages data required for analytics' },
    { status: 400 }
  );
}

// Handle sitemap generation
async function handleSitemapGeneration(type: string | null) {
  const generator = new SitemapGenerator();

  switch (type) {
    case 'index':
      const indexSitemap = generator.generateSitemapIndex();
      return new NextResponse(indexSitemap, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600'
        }
      });

    case 'pages':
      const pagesSitemap = generator.generatePagesSitemap();
      return new NextResponse(pagesSitemap, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600'
        }
      });

    case 'categories':
      const categoriesSitemap = generator.generateCategoriesSitemap();
      return new NextResponse(categoriesSitemap, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600'
        }
      });

    default:
      return NextResponse.json({
        success: true,
        availableTypes: ['index', 'pages', 'courses', 'blogs', 'categories', 'images', 'videos']
      });
  }
}

// Handle schema generation
async function handleSchemaGeneration(searchParams: URLSearchParams) {
  const generator = new SchemaGenerator();
  const schemaType = searchParams.get('type');
  const data = searchParams.get('data');

  if (!schemaType) {
    return NextResponse.json({
      success: true,
      availableTypes: ['organization', 'course', 'blog', 'faq', 'breadcrumb', 'website', 'video', 'review', 'event']
    });
  }

  let schema;
  const parsedData = data ? JSON.parse(data) : {};

  switch (schemaType) {
    case 'organization':
      schema = generator.generateOrganizationSchema();
      break;
    case 'course':
      schema = generator.generateCourseSchema(parsedData);
      break;
    case 'blog':
      schema = generator.generateBlogPostSchema(parsedData);
      break;
    case 'faq':
      schema = generator.generateFAQSchema(parsedData.faqs || []);
      break;
    case 'breadcrumb':
      schema = generator.generateBreadcrumbSchema(parsedData.breadcrumbs || []);
      break;
    case 'website':
      schema = generator.generateWebsiteSchema();
      break;
    case 'video':
      schema = generator.generateVideoSchema(parsedData.video, parsedData.course);
      break;
    case 'review':
      schema = generator.generateReviewSchema(parsedData.review, parsedData.item);
      break;
    case 'event':
      schema = generator.generateEventSchema(parsedData);
      break;
    default:
      return NextResponse.json(
        { error: `Unknown schema type: ${schemaType}` },
        { status: 400 }
      );
  }

  return NextResponse.json({ success: true, schema });
}

// Handle content audit
async function handleContentAudit(searchParams: URLSearchParams) {
  const optimizer = new ContentOptimizer();
  const content = searchParams.get('content');
  const keywords = searchParams.get('keywords')?.split(',') || [];

  if (!content) {
    return NextResponse.json(
      { error: 'Content parameter required for audit' },
      { status: 400 }
    );
  }

  const analysis = optimizer.analyzeContent(content, keywords);
  const suggestions = optimizer.generateContentSuggestions(content);
  const keyPhrases = optimizer.extractKeyPhrases(content);
  const metaDescription = optimizer.generateMetaDescription(content);

  return NextResponse.json({
    success: true,
    audit: {
      analysis,
      suggestions,
      keyPhrases,
      generatedMetaDescription: metaDescription
    }
  });
}

// Handle local SEO
async function handleLocalSEO(searchParams: URLSearchParams) {
  const localOptimizer = new LocalSEOOptimizer();
  const region = searchParams.get('region');
  const action = searchParams.get('localAction');

  if (!region) {
    return NextResponse.json(
      { error: 'Region parameter required for local SEO' },
      { status: 400 }
    );
  }

  switch (action) {
    case 'landing-page':
      const category = searchParams.get('category');
      const landingPage = localOptimizer.generateLocalLandingPage(region, category || undefined);
      return NextResponse.json({ success: true, landingPage });

    case 'faq':
      const localFAQ = localOptimizer.generateLocalFAQ(region);
      return NextResponse.json({ success: true, faq: localFAQ });

    case 'hreflang':
      const baseUrl = searchParams.get('baseUrl') || 'https://medh.co';
      const regions = searchParams.get('regions')?.split(',') || [region];
      const hreflangTags = localOptimizer.generateHreflangTags(baseUrl, regions);
      return NextResponse.json({ success: true, hreflangTags });

    default:
      return NextResponse.json({
        success: true,
        availableActions: ['landing-page', 'faq', 'hreflang']
      });
  }
}

// Handle automation status
async function handleAutomationStatus() {
  const automation = new SEOAutomation();
  const status = automation.getAutomationStatus();
  
  return NextResponse.json({ success: true, automation: status });
}

// Handle SEO overview
async function handleSEOOverview() {
  return NextResponse.json({
    success: true,
    overview: {
      availableActions: [
        'analytics - SEO performance analysis',
        'sitemap - XML sitemap generation',
        'schema - Structured data generation',
        'audit - Content SEO audit',
        'local - Local SEO optimization',
        'automation - SEO automation status'
      ],
      endpoints: {
        GET: {
          '/api/seo?action=analytics&url=...': 'Analyze single page SEO',
          '/api/seo?action=sitemap&type=index': 'Generate sitemap index',
          '/api/seo?action=schema&type=organization': 'Generate organization schema',
          '/api/seo?action=audit&content=...': 'Audit content SEO',
          '/api/seo?action=local&region=US': 'Local SEO optimization',
          '/api/seo?action=automation': 'Get automation status'
        },
        POST: {
          '/api/seo': 'Create/update SEO configurations'
        }
      }
    }
  });
}

// Handle meta optimization
async function handleMetaOptimization(data: any) {
  const optimizer = new ContentOptimizer();
  const { content, primaryKeyword, secondaryKeywords = [] } = data;

  if (!content || !primaryKeyword) {
    return NextResponse.json(
      { error: 'Content and primaryKeyword required for meta optimization' },
      { status: 400 }
    );
  }

  const optimization = optimizer.optimizeForKeywords(content, primaryKeyword, secondaryKeywords);
  const metaDescription = optimizer.generateMetaDescription(content);
  const analysis = optimizer.analyzeContent(content, [primaryKeyword, ...secondaryKeywords]);

  return NextResponse.json({
    success: true,
    optimization: {
      keywords: optimization,
      metaDescription,
      analysis,
      recommendations: analysis.recommendations
    }
  });
}

// Handle sitemap creation
async function handleSitemapCreation(data: any) {
  const generator = new SitemapGenerator();
  const { type, content } = data;

  let sitemap;
  switch (type) {
    case 'courses':
      sitemap = generator.generateCoursesSitemap(content.courses || []);
      break;
    case 'blogs':
      sitemap = generator.generateBlogsSitemap(content.blogs || []);
      break;
    case 'images':
      sitemap = generator.generateImagesSitemap(content.courses || [], content.blogs || []);
      break;
    case 'videos':
      sitemap = generator.generateVideosSitemap(content.courses || []);
      break;
    default:
      return NextResponse.json(
        { error: `Unknown sitemap type: ${type}` },
        { status: 400 }
      );
  }

  return NextResponse.json({
    success: true,
    sitemap,
    type,
    itemCount: Array.isArray(content.courses) ? content.courses.length : 0
  });
}

// Handle task scheduling
async function handleTaskScheduling(data: any) {
  const automation = new SEOAutomation();
  const { name, type, schedule, config } = data;

  if (!name || !type || !schedule) {
    return NextResponse.json(
      { error: 'Name, type, and schedule required for task scheduling' },
      { status: 400 }
    );
  }

  const taskId = automation.scheduleSEOTask({
    name,
    type,
    schedule,
    config: config || {},
    status: 'active'
  });

  return NextResponse.json({
    success: true,
    taskId,
    message: `SEO task "${name}" scheduled successfully`
  });
}

// Handle content analysis
async function handleContentAnalysis(data: any) {
  const optimizer = new ContentOptimizer();
  const { content, keywords = [], audience = 'general' } = data;

  if (!content) {
    return NextResponse.json(
      { error: 'Content required for analysis' },
      { status: 400 }
    );
  }

  const analysis = optimizer.analyzeContent(content, keywords);
  const suggestions = optimizer.generateContentSuggestions(content, audience);
  const readabilityImprovement = optimizer.improveReadability(content);
  const keyPhrases = optimizer.extractKeyPhrases(content);

  return NextResponse.json({
    success: true,
    analysis: {
      contentAnalysis: analysis,
      suggestions,
      readabilityImprovement,
      extractedKeyPhrases: keyPhrases,
      generatedMetaDescription: optimizer.generateMetaDescription(content)
    }
  });
}

// Handle local content generation
async function handleLocalContentGeneration(data: any) {
  const localOptimizer = new LocalSEOOptimizer();
  const { baseContent, targetRegion, cities = [] } = data;

  if (!baseContent || !targetRegion) {
    return NextResponse.json(
      { error: 'Base content and target region required' },
      { status: 400 }
    );
  }

  const regionalContent = localOptimizer.generateRegionalContent(baseContent, targetRegion);
  const cityKeywords = cities.length > 0 ? 
    localOptimizer.generateCityKeywords(baseContent.keywords || [], cities) : [];
  const localFAQ = localOptimizer.generateLocalFAQ(targetRegion);

  return NextResponse.json({
    success: true,
    localContent: {
      regionalContent,
      cityKeywords,
      localFAQ,
      region: targetRegion
    }
  });
} 