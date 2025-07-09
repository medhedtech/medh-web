# Enhanced Video Player Documentation

## Overview

The enhanced VideoPlayer component now includes advanced features like mini player functionality, S3 signed URL support, and improved error handling. This documentation covers all the new features and their usage.

## New Features

### 1. Mini Player
- **Draggable mini player window** that stays on top of other content
- **Seamless transition** between full and mini player modes
- **Persistent playback** during mode transitions
- **Customizable positioning** with viewport constraints

### 2. S3 Signed URL Support
- **Automatic URL expiration detection** for S3 signed URLs
- **URL refresh functionality** with backend integration
- **Graceful fallback** for expired URLs
- **Error handling** for various URL-related issues

### 3. Enhanced Error Handling
- **Specific error messages** for different failure types
- **Retry mechanisms** with intelligent fallback
- **Loading states** for URL refresh operations
- **User-friendly error displays**

## Component Props

### VideoPlayer Props

```typescript
interface VideoPlayerProps {
  // Basic video props
  src: string | null;
  poster?: string;
  autoplay?: boolean;
  quality?: 'auto' | '1080p' | '720p' | '480p' | '360p';
  playbackSpeed?: number;
  
  // Event handlers
  onProgress?: (progress: number, currentTime: number) => void;
  onEnded?: () => void;
  onError?: (error: string) => void;
  onBookmark?: (bookmark: VideoBookmark) => void;
  
  // Mini player functionality
  allowMiniPlayer?: boolean;
  onMiniPlayerToggle?: (isMinimized: boolean) => void;
  
  // S3 URL refresh
  onRefreshUrl?: () => Promise<string>;
  
  // Session integration
  sessionId?: string;
  sessionTitle?: string;
  onClose?: () => void;
  
  // Additional features
  bookmarks?: VideoBookmark[];
  initialTime?: number;
  allowDownload?: boolean;
  transcriptions?: Array<{ time: number; text: string }>;
  chapters?: Array<{ time: number; title: string }>;
}
```

## Usage Examples

### Basic Usage with Mini Player

```tsx
import VideoPlayer from '@/components/shared/lessons/VideoPlayer';

const MyComponent = () => {
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  
  const handleMiniPlayerToggle = (isMinimized: boolean) => {
    setIsMiniPlayer(isMinimized);
    console.log(`Mini player ${isMinimized ? 'activated' : 'deactivated'}`);
  };
  
  return (
    <VideoPlayer
      src="https://example.com/video.mp4"
      allowMiniPlayer={true}
      onMiniPlayerToggle={handleMiniPlayerToggle}
      sessionTitle="React Fundamentals - Session 1"
      autoplay={false}
    />
  );
};
```

### S3 Signed URL with Refresh

```tsx
import VideoPlayer from '@/components/shared/lessons/VideoPlayer';

const SessionVideo = ({ sessionId, initialUrl }) => {
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  
  const refreshS3Url = async (): Promise<string> => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/refresh-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh URL');
      }
      
      const data = await response.json();
      setCurrentUrl(data.url);
      return data.url;
    } catch (error) {
      console.error('Error refreshing S3 URL:', error);
      throw error;
    }
  };
  
  return (
    <VideoPlayer
      src={currentUrl}
      onRefreshUrl={refreshS3Url}
      sessionId={sessionId}
      sessionTitle="Advanced JavaScript Concepts"
      allowMiniPlayer={true}
      onError={(error) => console.error('Video error:', error)}
    />
  );
};
```

### Integration with RecordedSessionsDashboard

```tsx
// VideoPlayerModal component usage
const VideoPlayerModal = ({ currentVideo, onClose, onMiniPlayerToggle }) => {
  const refreshS3Url = async (): Promise<string> => {
    const response = await fetch(`/api/sessions/${currentVideo.session.id}/refresh-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    
    const data = await response.json();
    return data.url;
  };
  
  return (
    <VideoPlayer
      src={currentVideo.session.url}
      onRefreshUrl={refreshS3Url}
      onMiniPlayerToggle={onMiniPlayerToggle}
      sessionId={currentVideo.session.id}
      sessionTitle={currentVideo.session.title}
      allowMiniPlayer={true}
      autoplay={true}
    />
  );
};
```

## Mini Player Features

### Draggable Functionality
- **Drag handle**: Click and drag anywhere on the mini player header
- **Viewport constraints**: Automatically constrained to screen boundaries
- **Smooth animations**: Powered by Framer Motion for fluid transitions

### Controls
- **Expand button**: Returns to full player mode
- **Close button**: Closes the mini player completely
- **Play/pause**: Basic playback control in mini mode
- **Progress bar**: Shows current playback position

### Positioning
- **Default position**: Top-right corner of the screen
- **Persistent position**: Remembers last position during session
- **Responsive sizing**: 320x240px fixed size for consistency

## S3 URL Management

### URL Expiration Detection
The component automatically detects expired S3 URLs by:
- Checking URL parameters for expiration timestamps
- Monitoring video loading errors
- Identifying specific error codes (MEDIA_ERR_SRC_NOT_SUPPORTED)

### Refresh Mechanism
When a URL expires:
1. **Automatic detection** triggers refresh UI
2. **User can manually refresh** via settings panel
3. **Background refresh** preserves playback position
4. **Fallback handling** for refresh failures

### Error Handling
- **Specific error messages** for different failure types
- **Retry buttons** with appropriate actions
- **Loading states** during refresh operations
- **Graceful degradation** when refresh fails

## API Integration

### Refresh URL Endpoint

```typescript
// POST /api/sessions/[sessionId]/refresh-url
interface RefreshUrlResponse {
  success: boolean;
  url?: string;
  error?: string;
  expiresAt?: string;
}
```

### Implementation Example

```typescript
// In your API route (Next.js example)
export async function POST(request: NextRequest, { params }) {
  const { sessionId } = params;
  
  // Validate user access
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  
  // Generate new signed URL
  const signedUrl = await generateSignedUrl(sessionId);
  
  return NextResponse.json({
    success: true,
    url: signedUrl,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString()
  });
}
```

## Keyboard Shortcuts

The enhanced player supports all standard keyboard shortcuts:
- **Space/K**: Play/pause
- **Left/Right arrows**: Seek backward/forward (10 seconds)
- **Up/Down arrows**: Volume up/down
- **M**: Mute/unmute
- **F**: Fullscreen (not available in mini player mode)

## Best Practices

### 1. URL Management
- Always implement URL refresh for S3 signed URLs
- Set appropriate expiration times (1-6 hours recommended)
- Handle refresh failures gracefully
- Monitor URL expiration in your backend

### 2. Mini Player UX
- Provide clear visual feedback for mini player activation
- Ensure mini player doesn't interfere with navigation
- Consider auto-activating mini player when user navigates away
- Test across different screen sizes

### 3. Error Handling
- Implement comprehensive error logging
- Provide user-friendly error messages
- Offer retry mechanisms for recoverable errors
- Monitor error rates for system health

### 4. Performance
- Preload video metadata when possible
- Implement lazy loading for large video lists
- Consider video quality selection based on connection
- Monitor loading times and buffering events

## Security Considerations

### URL Obfuscation
The component includes URL obfuscation for additional security:
- URLs are encoded before storage
- Decoded only during playback
- Prevents direct URL access from developer tools

### Access Control
- Implement proper session validation
- Verify user permissions before URL refresh
- Use secure token-based authentication
- Log access attempts for monitoring

## Browser Compatibility

### Supported Browsers
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Feature Support
- **Mini Player**: All supported browsers
- **S3 URLs**: All supported browsers
- **Keyboard Shortcuts**: All supported browsers
- **Drag & Drop**: All supported browsers with pointer events

## Troubleshooting

### Common Issues

1. **Mini player not appearing**
   - Check `allowMiniPlayer` prop is set to `true`
   - Verify `onMiniPlayerToggle` callback is provided
   - Ensure parent component handles mini player state

2. **S3 URL refresh failing**
   - Verify API endpoint is correctly implemented
   - Check authentication token is valid
   - Confirm user has access to the session
   - Monitor backend logs for errors

3. **Video not playing**
   - Check if URL is properly decoded
   - Verify video format is supported
   - Ensure CORS headers are configured
   - Check browser console for errors

### Debug Mode
Enable debug logging by adding to your component:
```typescript
const DEBUG = process.env.NODE_ENV === 'development';
if (DEBUG) {
  console.log('VideoPlayer debug info:', {
    src,
    sessionId,
    allowMiniPlayer,
    hasRefreshCallback: !!onRefreshUrl
  });
}
```

## Migration Guide

### From Previous Version
1. Update component imports
2. Add new props for mini player functionality
3. Implement S3 URL refresh endpoint
4. Update error handling logic
5. Test mini player functionality

### Breaking Changes
- `onMiniPlayerToggle` is now required if `allowMiniPlayer` is true
- Error handling has been enhanced (check error message formats)
- URL refresh requires backend implementation

## Contributing

When contributing to the video player:
1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Test across multiple browsers
5. Consider accessibility implications

## License

This enhanced video player is part of the MEDH platform and follows the same licensing terms as the main project. 