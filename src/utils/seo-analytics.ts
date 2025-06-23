/**
 * SEO Analytics and Performance Tracking for Medh Education Platform
 * Monitors SEO metrics, Core Web Vitals, and search performance
 */

interface SEOMetrics {
  pageUrl: string;
  title: string;
  description: string;
  keywords: string[];
  loadTime: number;
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
  seoScore: number;
  issues: string[];
  recommendations: string[];
}

interface SearchConsoleData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export class SEOAnalytics {
  private baseUrl: string;
  
  constructor(baseUrl: string = 'https://medh.co') {
    this.baseUrl = baseUrl;
  }

  // Analyze page SEO performance
  analyzePage(pageData: any): SEOMetrics {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Title analysis
    const titleLength = pageData.title?.length || 0;
    if (titleLength === 0) {
      issues.push('Missing page title');
      score -= 20;
    } else if (titleLength < 30) {
      issues.push('Title too short (< 30 characters)');
      recommendations.push('Expand title to 50-60 characters');
      score -= 10;
    } else if (titleLength > 60) {
      issues.push('Title too long (> 60 characters)');
      recommendations.push('Shorten title to under 60 characters');
      score -= 5;
    }

    // Description analysis
    const descLength = pageData.description?.length || 0;
    if (descLength === 0) {
      issues.push('Missing meta description');
      score -= 15;
    } else if (descLength < 120) {
      issues.push('Description too short (< 120 characters)');
      recommendations.push('Expand description to 150-160 characters');
      score -= 8;
    } else if (descLength > 160) {
      issues.push('Description too long (> 160 characters)');
      recommendations.push('Shorten description to under 160 characters');
      score -= 5;
    }

    // Keywords analysis
    const keywordCount = pageData.keywords?.length || 0;
    if (keywordCount === 0) {
      issues.push('No keywords specified');
      score -= 10;
    } else if (keywordCount < 5) {
      recommendations.push('Add more relevant keywords (5-15 recommended)');
      score -= 5;
    } else if (keywordCount > 25) {
      issues.push('Too many keywords (> 25)');
      recommendations.push('Focus on 5-15 most relevant keywords');
      score -= 3;
    }

    // Core Web Vitals analysis
    const cwv = pageData.coreWebVitals || {};
    if (cwv.lcp > 2500) {
      issues.push('Poor LCP (> 2.5s)');
      recommendations.push('Optimize images and reduce server response time');
      score -= 15;
    }
    if (cwv.fid > 100) {
      issues.push('Poor FID (> 100ms)');
      recommendations.push('Minimize JavaScript and optimize interactions');
      score -= 10;
    }
    if (cwv.cls > 0.1) {
      issues.push('Poor CLS (> 0.1)');
      recommendations.push('Set explicit dimensions for images and avoid layout shifts');
      score -= 10;
    }

    return {
      pageUrl: pageData.url,
      title: pageData.title,
      description: pageData.description,
      keywords: pageData.keywords || [],
      loadTime: pageData.loadTime || 0,
      coreWebVitals: cwv,
      seoScore: Math.max(0, score),
      issues,
      recommendations
    };
  }

  // Track keyword rankings
  trackKeywordRankings(keywords: string[]): Promise<any[]> {
    // This would integrate with actual ranking tracking APIs
    return Promise.resolve(keywords.map(keyword => ({
      keyword,
      position: Math.floor(Math.random() * 100) + 1,
      change: Math.floor(Math.random() * 20) - 10,
      searchVolume: Math.floor(Math.random() * 10000) + 100,
      difficulty: Math.floor(Math.random() * 100) + 1
    })));
  }

  // Generate SEO report
  generateSEOReport(pages: any[]): object {
    const analyzedPages = pages.map(page => this.analyzePage(page));
    const totalScore = analyzedPages.reduce((sum, page) => sum + page.seoScore, 0);
    const averageScore = totalScore / analyzedPages.length;

    const allIssues = analyzedPages.flatMap(page => page.issues);
    const issueFrequency = allIssues.reduce((acc, issue) => {
      acc[issue] = (acc[issue] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topIssues = Object.entries(issueFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    return {
      summary: {
        totalPages: pages.length,
        averageScore: Math.round(averageScore),
        pagesWithIssues: analyzedPages.filter(page => page.issues.length > 0).length,
        totalIssues: allIssues.length
      },
      topIssues: topIssues.map(([issue, count]) => ({ issue, count })),
      pageAnalysis: analyzedPages,
      recommendations: this.generateGlobalRecommendations(analyzedPages)
    };
  }

  // Generate global recommendations
  private generateGlobalRecommendations(pages: SEOMetrics[]): string[] {
    const recommendations = new Set<string>();

    const lowScorePages = pages.filter(page => page.seoScore < 70).length;
    if (lowScorePages > pages.length * 0.3) {
      recommendations.add('Focus on improving SEO fundamentals across all pages');
    }

    const slowPages = pages.filter(page => page.loadTime > 3000).length;
    if (slowPages > 0) {
      recommendations.add('Implement performance optimizations for faster page loading');
    }

    const missingDescriptions = pages.filter(page => !page.description).length;
    if (missingDescriptions > 0) {
      recommendations.add('Add meta descriptions to all pages');
    }

    const poorCWV = pages.filter(page => 
      page.coreWebVitals.lcp > 2500 || 
      page.coreWebVitals.fid > 100 || 
      page.coreWebVitals.cls > 0.1
    ).length;
    if (poorCWV > 0) {
      recommendations.add('Improve Core Web Vitals scores for better user experience');
    }

    return Array.from(recommendations);
  }

  // Monitor search console performance
  monitorSearchPerformance(data: SearchConsoleData[]): object {
    const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0);
    const totalImpressions = data.reduce((sum, item) => sum + item.impressions, 0);
    const averageCTR = totalClicks / totalImpressions;
    const averagePosition = data.reduce((sum, item) => sum + item.position, 0) / data.length;

    const topQueries = data
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    const lowCTRQueries = data
      .filter(item => item.ctr < 0.02 && item.position < 10)
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 5);

    return {
      overview: {
        totalClicks,
        totalImpressions,
        averageCTR: Math.round(averageCTR * 10000) / 100,
        averagePosition: Math.round(averagePosition * 10) / 10
      },
      topQueries,
      opportunities: {
        lowCTRQueries,
        recommendations: this.generateSearchRecommendations(data)
      }
    };
  }

  // Generate search performance recommendations
  private generateSearchRecommendations(data: SearchConsoleData[]): string[] {
    const recommendations: string[] = [];

    const lowCTRHighPosition = data.filter(item => item.position <= 3 && item.ctr < 0.1);
    if (lowCTRHighPosition.length > 0) {
      recommendations.push('Improve titles and descriptions for high-ranking pages with low CTR');
    }

    const highImpressionLowClick = data.filter(item => item.impressions > 1000 && item.clicks < 50);
    if (highImpressionLowClick.length > 0) {
      recommendations.push('Optimize content for high-impression, low-click queries');
    }

    const positionOpportunities = data.filter(item => item.position > 10 && item.position <= 20);
    if (positionOpportunities.length > 0) {
      recommendations.push('Focus on improving rankings for queries in positions 11-20');
    }

    return recommendations;
  }

  // Track competitor analysis
  analyzeCompetitors(competitors: string[]): Promise<any[]> {
    // This would integrate with competitor analysis tools
    return Promise.resolve(competitors.map(competitor => ({
      domain: competitor,
      estimatedTraffic: Math.floor(Math.random() * 1000000) + 10000,
      keywordCount: Math.floor(Math.random() * 10000) + 1000,
      backlinks: Math.floor(Math.random() * 100000) + 1000,
      domainAuthority: Math.floor(Math.random() * 100) + 1
    })));
  }

  // Generate technical SEO audit
  auditTechnicalSEO(siteData: any): object {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check robots.txt
    if (!siteData.robotsTxt) {
      issues.push('Missing robots.txt file');
      recommendations.push('Create and configure robots.txt file');
    }

    // Check sitemap
    if (!siteData.sitemap) {
      issues.push('Missing XML sitemap');
      recommendations.push('Generate and submit XML sitemap');
    }

    // Check SSL
    if (!siteData.hasSSL) {
      issues.push('Missing SSL certificate');
      recommendations.push('Install SSL certificate for HTTPS');
    }

    // Check mobile friendliness
    if (!siteData.mobileFriendly) {
      issues.push('Not mobile-friendly');
      recommendations.push('Implement responsive design');
    }

    // Check page speed
    if (siteData.pageSpeed < 70) {
      issues.push('Poor page speed score');
      recommendations.push('Optimize images, minify CSS/JS, enable compression');
    }

    // Check structured data
    if (!siteData.hasStructuredData) {
      issues.push('Missing structured data');
      recommendations.push('Implement JSON-LD structured data');
    }

    return {
      score: Math.max(0, 100 - (issues.length * 10)),
      issues,
      recommendations,
      checks: {
        robotsTxt: !!siteData.robotsTxt,
        sitemap: !!siteData.sitemap,
        ssl: !!siteData.hasSSL,
        mobileFriendly: !!siteData.mobileFriendly,
        pageSpeed: siteData.pageSpeed >= 70,
        structuredData: !!siteData.hasStructuredData
      }
    };
  }
}

// Core Web Vitals monitoring
export class CoreWebVitalsMonitor {
  private metrics: Map<string, any[]> = new Map();

  // Record Core Web Vitals
  recordMetrics(url: string, metrics: { lcp: number; fid: number; cls: number }) {
    if (!this.metrics.has(url)) {
      this.metrics.set(url, []);
    }
    
    this.metrics.get(url)!.push({
      ...metrics,
      timestamp: Date.now()
    });
  }

  // Get average metrics for a URL
  getAverageMetrics(url: string): { lcp: number; fid: number; cls: number } | null {
    const urlMetrics = this.metrics.get(url);
    if (!urlMetrics || urlMetrics.length === 0) return null;

    const totals = urlMetrics.reduce(
      (acc, metric) => ({
        lcp: acc.lcp + metric.lcp,
        fid: acc.fid + metric.fid,
        cls: acc.cls + metric.cls
      }),
      { lcp: 0, fid: 0, cls: 0 }
    );

    return {
      lcp: totals.lcp / urlMetrics.length,
      fid: totals.fid / urlMetrics.length,
      cls: totals.cls / urlMetrics.length
    };
  }

  // Get performance grade
  getPerformanceGrade(metrics: { lcp: number; fid: number; cls: number }): string {
    let score = 0;
    
    if (metrics.lcp <= 2500) score += 33;
    else if (metrics.lcp <= 4000) score += 17;
    
    if (metrics.fid <= 100) score += 33;
    else if (metrics.fid <= 300) score += 17;
    
    if (metrics.cls <= 0.1) score += 34;
    else if (metrics.cls <= 0.25) score += 17;

    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}

// Export utility functions
export function createSEOAnalytics(): SEOAnalytics {
  return new SEOAnalytics();
}

export function createCoreWebVitalsMonitor(): CoreWebVitalsMonitor {
  return new CoreWebVitalsMonitor();
}

export default SEOAnalytics; 