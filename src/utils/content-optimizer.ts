/**
 * Content Optimization Utilities for Medh Education Platform
 * Analyzes and optimizes content for SEO and readability
 */

interface ContentAnalysis {
  wordCount: number;
  readingTime: number;
  readabilityScore: number;
  keywordDensity: Record<string, number>;
  headingStructure: HeadingAnalysis;
  seoScore: number;
  issues: string[];
  recommendations: string[];
}

interface HeadingAnalysis {
  h1Count: number;
  h2Count: number;
  h3Count: number;
  hasProperHierarchy: boolean;
  missingHeadings: string[];
}

interface KeywordOptimization {
  primaryKeyword: string;
  secondaryKeywords: string[];
  optimalDensity: number;
  currentDensity: number;
  suggestions: string[];
}

export class ContentOptimizer {
  private stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
  ]);

  // Analyze content comprehensively
  analyzeContent(content: string, targetKeywords: string[] = []): ContentAnalysis {
    const cleanContent = this.cleanHTML(content);
    const wordCount = this.getWordCount(cleanContent);
    const readingTime = this.calculateReadingTime(wordCount);
    const readabilityScore = this.calculateReadabilityScore(cleanContent);
    const keywordDensity = this.analyzeKeywordDensity(cleanContent, targetKeywords);
    const headingStructure = this.analyzeHeadingStructure(content);
    
    const { seoScore, issues, recommendations } = this.calculateSEOScore({
      wordCount,
      readabilityScore,
      keywordDensity,
      headingStructure,
      content: cleanContent
    });

    return {
      wordCount,
      readingTime,
      readabilityScore,
      keywordDensity,
      headingStructure,
      seoScore,
      issues,
      recommendations
    };
  }

  // Optimize content for target keywords
  optimizeForKeywords(content: string, primaryKeyword: string, secondaryKeywords: string[] = []): KeywordOptimization {
    const cleanContent = this.cleanHTML(content);
    const currentDensity = this.calculateKeywordDensity(cleanContent, primaryKeyword);
    const optimalDensity = this.getOptimalKeywordDensity(primaryKeyword);
    
    const suggestions: string[] = [];
    
    if (currentDensity < optimalDensity * 0.5) {
      suggestions.push(`Increase "${primaryKeyword}" usage (current: ${currentDensity.toFixed(2)}%, optimal: ${optimalDensity}%)`);
      suggestions.push(`Add "${primaryKeyword}" to headings and subheadings`);
      suggestions.push(`Include "${primaryKeyword}" in the first and last paragraphs`);
    } else if (currentDensity > optimalDensity * 2) {
      suggestions.push(`Reduce "${primaryKeyword}" usage to avoid keyword stuffing`);
      suggestions.push(`Use synonyms and related terms instead`);
    }

    // Analyze secondary keywords
    secondaryKeywords.forEach(keyword => {
      const density = this.calculateKeywordDensity(cleanContent, keyword);
      if (density < 0.5) {
        suggestions.push(`Consider adding "${keyword}" 2-3 times throughout the content`);
      }
    });

    return {
      primaryKeyword,
      secondaryKeywords,
      optimalDensity,
      currentDensity,
      suggestions
    };
  }

  // Generate content suggestions
  generateContentSuggestions(content: string, targetAudience: string = 'general'): string[] {
    const cleanContent = this.cleanHTML(content);
    const wordCount = this.getWordCount(cleanContent);
    const sentences = this.getSentences(cleanContent);
    const suggestions: string[] = [];

    // Word count suggestions
    if (wordCount < 300) {
      suggestions.push('Content is too short. Aim for at least 300 words for better SEO.');
    } else if (wordCount > 3000) {
      suggestions.push('Content is very long. Consider breaking it into multiple sections or pages.');
    }

    // Sentence length analysis
    const avgSentenceLength = sentences.reduce((sum, sentence) => 
      sum + sentence.split(' ').length, 0) / sentences.length;
    
    if (avgSentenceLength > 25) {
      suggestions.push('Sentences are too long. Break them down for better readability.');
    }

    // Paragraph structure
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const avgParagraphLength = paragraphs.reduce((sum, para) => 
      sum + this.getWordCount(para), 0) / paragraphs.length;
    
    if (avgParagraphLength > 150) {
      suggestions.push('Paragraphs are too long. Keep them under 150 words.');
    }

    // Audience-specific suggestions
    if (targetAudience === 'students') {
      suggestions.push('Use simple language and explain technical terms.');
      suggestions.push('Include practical examples and case studies.');
    } else if (targetAudience === 'professionals') {
      suggestions.push('Include industry-specific terminology and advanced concepts.');
      suggestions.push('Reference current trends and best practices.');
    }

    return suggestions;
  }

  // Improve content readability
  improveReadability(content: string): { improvedContent: string; changes: string[] } {
    let improvedContent = content;
    const changes: string[] = [];

    // Replace complex words with simpler alternatives
    const complexWords = {
      'utilize': 'use',
      'facilitate': 'help',
      'demonstrate': 'show',
      'implement': 'put in place',
      'accommodate': 'fit',
      'commence': 'start',
      'terminate': 'end',
      'sufficient': 'enough',
      'approximately': 'about',
      'consequently': 'so'
    };

    Object.entries(complexWords).forEach(([complex, simple]) => {
      const regex = new RegExp(`\\b${complex}\\b`, 'gi');
      if (regex.test(improvedContent)) {
        improvedContent = improvedContent.replace(regex, simple);
        changes.push(`Replaced "${complex}" with "${simple}" for better readability`);
      }
    });

    // Add transition words if missing
    const sentences = this.getSentences(this.cleanHTML(improvedContent));
    const transitionWords = ['however', 'therefore', 'moreover', 'furthermore', 'additionally'];
    const hasTransitions = transitionWords.some(word => 
      improvedContent.toLowerCase().includes(word)
    );

    if (!hasTransitions && sentences.length > 5) {
      changes.push('Consider adding transition words to improve flow between sentences');
    }

    return { improvedContent, changes };
  }

  // Generate meta description from content
  generateMetaDescription(content: string, maxLength: number = 160): string {
    const cleanContent = this.cleanHTML(content);
    const sentences = this.getSentences(cleanContent);
    
    // Try to use the first meaningful sentence
    let description = sentences[0] || '';
    
    // If first sentence is too long, truncate it
    if (description.length > maxLength) {
      description = description.substring(0, maxLength - 3) + '...';
    }
    
    // If first sentence is too short, add more
    if (description.length < maxLength * 0.7 && sentences.length > 1) {
      const additionalText = ' ' + sentences[1];
      if ((description + additionalText).length <= maxLength) {
        description += additionalText;
      }
    }

    return description.trim();
  }

  // Extract key phrases from content
  extractKeyPhrases(content: string, minLength: number = 2, maxLength: number = 4): string[] {
    const cleanContent = this.cleanHTML(content).toLowerCase();
    const words = cleanContent.split(/\s+/).filter(word => 
      word.length > 2 && !this.stopWords.has(word)
    );

    const phrases: Record<string, number> = {};

    // Generate n-grams
    for (let n = minLength; n <= maxLength; n++) {
      for (let i = 0; i <= words.length - n; i++) {
        const phrase = words.slice(i, i + n).join(' ');
        if (this.isValidPhrase(phrase)) {
          phrases[phrase] = (phrases[phrase] || 0) + 1;
        }
      }
    }

    // Return top phrases by frequency
    return Object.entries(phrases)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([phrase]) => phrase);
  }

  // Private helper methods
  private cleanHTML(content: string): string {
    return content
      .replace(/<[^>]*>/g, '')
      .replace(/&[^;]+;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private getWordCount(content: string): number {
    return content.split(/\s+/).filter(word => word.length > 0).length;
  }

  private calculateReadingTime(wordCount: number): number {
    return Math.ceil(wordCount / 200); // 200 words per minute
  }

  private calculateReadabilityScore(content: string): number {
    const sentences = this.getSentences(content);
    const words = content.split(/\s+/).filter(word => word.length > 0);
    const syllables = words.reduce((sum, word) => sum + this.countSyllables(word), 0);

    if (sentences.length === 0 || words.length === 0) return 0;

    // Flesch Reading Ease Score
    const score = 206.835 - (1.015 * (words.length / sentences.length)) - (84.6 * (syllables / words.length));
    return Math.max(0, Math.min(100, score));
  }

  private getSentences(content: string): string[] {
    return content
      .split(/[.!?]+/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0);
  }

  private countSyllables(word: string): number {
    const vowels = 'aeiouy';
    let count = 0;
    let previousWasVowel = false;

    for (const char of word.toLowerCase()) {
      const isVowel = vowels.includes(char);
      if (isVowel && !previousWasVowel) {
        count++;
      }
      previousWasVowel = isVowel;
    }

    // Handle silent 'e'
    if (word.toLowerCase().endsWith('e')) {
      count--;
    }

    return Math.max(1, count);
  }

  private analyzeKeywordDensity(content: string, keywords: string[]): Record<string, number> {
    const density: Record<string, number> = {};
    
    keywords.forEach(keyword => {
      density[keyword] = this.calculateKeywordDensity(content, keyword);
    });

    return density;
  }

  private calculateKeywordDensity(content: string, keyword: string): number {
    const words = content.toLowerCase().split(/\s+/);
    const keywordWords = keyword.toLowerCase().split(/\s+/);
    let count = 0;

    for (let i = 0; i <= words.length - keywordWords.length; i++) {
      if (keywordWords.every((word, index) => words[i + index] === word)) {
        count++;
      }
    }

    return (count / words.length) * 100;
  }

  private getOptimalKeywordDensity(keyword: string): number {
    // Optimal density varies by keyword length and competition
    const wordCount = keyword.split(' ').length;
    if (wordCount === 1) return 2.5; // Single word: 2-3%
    if (wordCount === 2) return 1.5; // Two words: 1-2%
    return 1.0; // Long-tail: 0.5-1%
  }

  private analyzeHeadingStructure(content: string): HeadingAnalysis {
    const h1Matches = content.match(/<h1[^>]*>/gi) || [];
    const h2Matches = content.match(/<h2[^>]*>/gi) || [];
    const h3Matches = content.match(/<h3[^>]*>/gi) || [];

    const h1Count = h1Matches.length;
    const h2Count = h2Matches.length;
    const h3Count = h3Matches.length;

    const missingHeadings: string[] = [];
    let hasProperHierarchy = true;

    if (h1Count === 0) {
      missingHeadings.push('H1 heading is required');
      hasProperHierarchy = false;
    } else if (h1Count > 1) {
      missingHeadings.push('Multiple H1 headings found (only one recommended)');
      hasProperHierarchy = false;
    }

    if (h2Count === 0 && this.getWordCount(this.cleanHTML(content)) > 500) {
      missingHeadings.push('Consider adding H2 headings for better structure');
    }

    return {
      h1Count,
      h2Count,
      h3Count,
      hasProperHierarchy,
      missingHeadings
    };
  }

  private calculateSEOScore(data: any): { seoScore: number; issues: string[]; recommendations: string[] } {
    let score = 100;
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Word count scoring
    if (data.wordCount < 300) {
      score -= 20;
      issues.push('Content too short (< 300 words)');
      recommendations.push('Expand content to at least 300 words');
    } else if (data.wordCount > 2000) {
      score -= 5;
      recommendations.push('Consider breaking long content into sections');
    }

    // Readability scoring
    if (data.readabilityScore < 30) {
      score -= 15;
      issues.push('Poor readability score');
      recommendations.push('Simplify language and sentence structure');
    } else if (data.readabilityScore < 60) {
      score -= 8;
      recommendations.push('Improve readability with shorter sentences');
    }

    // Heading structure scoring
    if (!data.headingStructure.hasProperHierarchy) {
      score -= 10;
      issues.push('Poor heading structure');
      recommendations.push('Fix heading hierarchy (H1 → H2 → H3)');
    }

    // Keyword density scoring
    const keywordDensities = Object.values(data.keywordDensity) as number[];
    const hasOptimalDensity = keywordDensities.some(density => density >= 1 && density <= 3);
    
    if (!hasOptimalDensity && keywordDensities.length > 0) {
      score -= 12;
      issues.push('Suboptimal keyword density');
      recommendations.push('Adjust keyword usage to 1-3% density');
    }

    return {
      seoScore: Math.max(0, score),
      issues,
      recommendations
    };
  }

  private isValidPhrase(phrase: string): boolean {
    // Filter out phrases with only stop words or very common words
    const words = phrase.split(' ');
    const meaningfulWords = words.filter(word => !this.stopWords.has(word));
    return meaningfulWords.length >= words.length * 0.5;
  }
}

// Export utility functions
export function analyzeContent(content: string, keywords: string[] = []): ContentAnalysis {
  const optimizer = new ContentOptimizer();
  return optimizer.analyzeContent(content, keywords);
}

export function optimizeForKeywords(content: string, primaryKeyword: string, secondaryKeywords: string[] = []): KeywordOptimization {
  const optimizer = new ContentOptimizer();
  return optimizer.optimizeForKeywords(content, primaryKeyword, secondaryKeywords);
}

export function generateMetaDescription(content: string): string {
  const optimizer = new ContentOptimizer();
  return optimizer.generateMetaDescription(content);
}

export function extractKeyPhrases(content: string): string[] {
  const optimizer = new ContentOptimizer();
  return optimizer.extractKeyPhrases(content);
}

export default ContentOptimizer; 