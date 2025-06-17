# Enhanced AI Content Generation API

## Overview

The `/api/improve-content` endpoint provides advanced AI-powered content enhancement using OpenAI's GPT-4o model with built-in web search capabilities. This API can transform basic content into comprehensive, well-researched articles with current data and trends.

## Features

### 🔍 **Real-time Web Search**
- OpenAI's built-in web search automatically finds the latest information
- No additional API keys required for web search functionality
- Searches for current statistics, trends, and industry developments
- Integrates findings naturally into the enhanced content

### ✍️ **Intelligent Content Enhancement**
- Transforms basic content into comprehensive articles
- Improves structure with proper HTML hierarchy
- Adds relevant examples and case studies
- Includes current industry statistics and data
- Optimizes for SEO while maintaining readability

### 🎯 **Customizable Options**
- Control HTML structure generation
- Include/exclude facts and figures
- Set target word count
- Enable/disable web search
- Add custom search context

## API Endpoint

```
POST /api/improve-content
```

## Request Body

```json
{
  "content": "string (required)",
  "topic": "string (required)",
  "requireHtmlStructure": "boolean (optional, default: true)",
  "includeFactsAndFigures": "boolean (optional, default: true)",
  "ensureProperHierarchy": "boolean (optional, default: true)",
  "targetWordCount": "number (optional, default: 1500-2500)",
  "includeCurrentData": "boolean (optional, default: true)",
  "searchContext": "string (optional)"
}
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `content` | string | **required** | Original content to enhance |
| `topic` | string | **required** | Main topic/title for the content |
| `requireHtmlStructure` | boolean | `true` | Generate proper HTML structure with semantic tags |
| `includeFactsAndFigures` | boolean | `true` | Include relevant statistics and data points |
| `ensureProperHierarchy` | boolean | `true` | Create logical content hierarchy with clear sections |
| `targetWordCount` | number | `1500-2500` | Target word count for the enhanced content |
| `includeCurrentData` | boolean | `true` | Enable web search for current information |
| `searchContext` | string | `null` | Additional context to guide web search |

## Response

### Success Response (200)

```json
{
  "success": true,
  "enhancedContent": "string",
  "originalLength": "number",
  "enhancedLength": "number",
  "improvementRatio": "string",
  "timestamp": "string",
  "searchEnabled": "boolean",
  "webSearchUsed": "boolean",
  "message": "string"
}
```

### Error Response (400/500)

```json
{
  "success": false,
  "error": "string",
  "message": "string",
  "details": "string"
}
```

## Usage Examples

### Basic Enhancement with Web Search

```javascript
const response = await fetch('/api/improve-content', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: "Machine learning is changing how we work.",
    topic: "Machine Learning in the Workplace",
    includeCurrentData: true
  })
});

const result = await response.json();
console.log(result.enhancedContent);
```

### Custom Enhancement with Specific Context

```javascript
const response = await fetch('/api/improve-content', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: "AI tools are becoming popular.",
    topic: "AI Tools for Content Creation",
    targetWordCount: 2000,
    searchContext: "latest AI tools 2024, content creation trends",
    includeCurrentData: true,
    requireHtmlStructure: true
  })
});
```

### Quick Enhancement without Web Search

```javascript
const response = await fetch('/api/improve-content', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: "React is a popular framework.",
    topic: "React Development Best Practices",
    includeCurrentData: false,
    targetWordCount: 1200
  })
});
```

## Web Search Capabilities

When `includeCurrentData` is enabled (default), the AI will automatically search for:

1. **Latest Industry Statistics** - Current market data and trends
2. **Recent Developments** - New tools, technologies, and methodologies
3. **Expert Opinions** - Current best practices and insights
4. **Real-world Examples** - Case studies and practical applications
5. **Current Tools** - Up-to-date software and platform information

## Content Enhancement Features

### HTML Structure
- Semantic HTML tags (`h1`, `h2`, `h3`, `p`, `ul`, `ol`, `blockquote`)
- Proper heading hierarchy
- Well-structured paragraphs and lists
- SEO-optimized markup

### Content Quality
- Professional writing tone
- Logical flow and organization
- Engaging introductions and conclusions
- Actionable insights and takeaways
- Current and accurate information

### SEO Optimization
- Proper heading structure
- Keyword optimization
- Meta-friendly content
- Readable and scannable format

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Missing required parameters
- **500 Internal Server Error**: OpenAI API errors or processing failures

All errors include descriptive messages to help with debugging.

## Rate Limiting

The API respects OpenAI's rate limits. For high-volume usage, consider:

- Implementing request queuing
- Adding retry logic with exponential backoff
- Monitoring usage and implementing caching

## Environment Variables

Required environment variables:

```env
OPENAI_API_KEY="sk-your-openai-api-key-here"
```

Optional configuration:

```env
NODE_ENV="development"
LOG_LEVEL="info"
ENABLE_API_LOGGING="true"
```

## Integration with EditBlog Component

The API is integrated with the EditBlog component providing:

- **Custom prompts** for specific content requirements
- **Quick actions** for common enhancement types
- **Real-time feedback** during content generation
- **Progress indicators** with web search status
- **Error handling** with user-friendly messages

## Best Practices

1. **Provide Clear Topics**: Specific topics yield better search results
2. **Use Search Context**: Add relevant keywords for targeted searches
3. **Set Appropriate Word Counts**: Match target length to content type
4. **Enable Web Search**: For current and accurate information
5. **Review Generated Content**: Always review and edit AI-generated content

## Troubleshooting

### Common Issues

1. **Empty Response**: Check OpenAI API key and model availability
2. **Slow Response**: Web search adds processing time (30-60 seconds)
3. **Rate Limits**: Implement proper error handling and retry logic
4. **Content Quality**: Provide more specific topics and context

### Debugging

Enable detailed logging by setting:

```env
LOG_LEVEL="debug"
ENABLE_API_LOGGING="true"
```

This will log request details, search queries, and response information.

## Future Enhancements

Planned improvements:

- Content caching for faster responses
- Multiple language support
- Custom search domain filtering
- Content templates and presets
- Batch processing capabilities

---

For more information or support, please refer to the project documentation or contact the development team. 