# Video Configuration Implementation Guide

This guide outlines the comprehensive video configuration improvements implemented for the Medh Web Platform.

## 📋 Overview

The video configuration system has been enhanced with:

1. **Centralized Configuration** - Single source of truth for all video settings
2. **Performance Optimization** - Adaptive streaming and quality selection
3. **Enhanced Security** - DRM, encryption, and hotlink protection
4. **Mobile-First Design** - Responsive and touch-optimized controls
5. **Analytics Integration** - Comprehensive video analytics tracking
6. **Network Adaptation** - Automatic quality adjustment based on connection

## 🔧 Implementation Steps

### Step 1: Update Existing Video Components

Replace existing ReactPlayer instances with the new VideoPlayerWrapper:

**Before:**
```jsx
<ReactPlayer
  url={selectedVideo}
  controls
  width="100%"
  height="70vh"
  config={{
    file: {
      attributes: {
        controlsList: "nodownload",
      },
    },
  }}
/>
```

**After:**
```jsx
import VideoPlayerWrapper from '@/components/shared/video/video-player-wrapper';

<VideoPlayerWrapper
  url={selectedVideo}
  videoId="course_123_lesson_1"
  optimization="courseContent"
  width="100%"
  height="70vh"
  controls={true}
  allowDownload={false}
  enableAnalytics={true}
  onPlay={() => console.log('Video started')}
  onProgress={(state) => {
    // Track progress for course completion
    updateVideoProgress(state.playedSeconds);
  }}
/>
```

### Step 2: Configure Video Types by Use Case

#### Course Preview Videos
```jsx
<VideoPlayerWrapper
  url={videoUrl}
  videoId={videoId}
  optimization="coursePreview"
  width="100%"
  height="300px"
  controls={true}
  allowDownload={false}
  autoplay={false}
/>
```

#### Full Course Content
```jsx
<VideoPlayerWrapper
  url={videoUrl}
  videoId={videoId}
  optimization="courseContent"
  width="100%"
  height="100%"
  controls={true}
  allowDownload={canDownload}
  enableAnalytics={true}
  onProgress={handleVideoProgress}
  onEnded={handleVideoCompleted}
/>
```

#### Instructor Introduction Videos
```jsx
<VideoPlayerWrapper
  url={videoUrl}
  videoId={videoId}
  optimization="instructorVideo"
  width="100%"
  height="400px"
  controls={true}
  poster={instructorImageUrl}
/>
```

#### Promotional/Hero Videos
```jsx
<VideoPlayerWrapper
  url={videoUrl}
  videoId={videoId}
  optimization="promotional"
  width="100%"
  height="600px"
  autoplay={true}
  muted={true}
  loop={true}
  controls={false}
/>
```

### Step 3: Update Video Upload Components

Enhance existing video upload components to use the new configuration:

```jsx
// In your video upload component
import { getVideoConfig, videoConfigUtils } from '@/config/video.config';

const VideoUploadComponent = () => {
  const config = getVideoConfig();
  
  const handleFileSelect = (file: File) => {
    // Validate using centralized config
    if (!videoConfigUtils.isFormatSupported(file.type)) {
      throw new Error(`Unsupported format: ${file.type}`);
    }
    
    if (file.size > config.upload.maxFileSize) {
      throw new Error(`File too large. Max size: ${config.upload.maxFileSize}`);
    }
    
    // Calculate optimal chunk size
    const chunkSize = videoConfigUtils.calculateOptimalChunkSize(file.size);
    
    // Proceed with upload using new configuration
    startVideoUpload(file, { chunkSize });
  };
  
  // ... rest of component
};
```

### Step 4: Implement Video Analytics

Add comprehensive video analytics tracking:

```jsx
import { trackVideoEvent } from '@/utils/video-optimization';

const CourseVideoComponent = ({ videoId, courseId }) => {
  const handleVideoEvent = (event) => {
    trackVideoEvent({
      videoId,
      action: event.type,
      currentTime: event.currentTime,
      duration: event.duration,
      courseId, // Additional context
    });
  };

  return (
    <VideoPlayerWrapper
      videoId={videoId}
      onPlay={() => handleVideoEvent({ type: 'play' })}
      onPause={() => handleVideoEvent({ type: 'pause' })}
      onEnded={() => handleVideoEvent({ type: 'ended' })}
      onProgress={(state) => {
        // Track progress milestones
        const progress = (state.playedSeconds / state.loadedSeconds) * 100;
        if (progress >= 25 && progress < 26) {
          handleVideoEvent({ type: 'progress_25' });
        }
      }}
    />
  );
};
```

### Step 5: Configure CDN and Security

Update your CDN configuration to match the new structure:

```typescript
// In your environment configuration
const videoConfig = {
  streaming: {
    cdnUrls: {
      primary: process.env.NEXT_PUBLIC_VIDEO_CDN_PRIMARY || 'https://medh-videos.cloudfront.net',
      fallback: [
        process.env.NEXT_PUBLIC_VIDEO_CDN_FALLBACK_1 || 'https://medh-documents.s3.amazonaws.com',
        process.env.NEXT_PUBLIC_VIDEO_CDN_FALLBACK_2 || 'https://medhdocuments.s3.ap-south-1.amazonaws.com'
      ]
    }
  },
  security: {
    hotlinking: {
      enabled: true,
      allowedDomains: [
        'medh.in',
        'www.medh.in',
        'app.medh.in',
        ...(process.env.NODE_ENV === 'development' ? ['localhost:3000'] : [])
      ]
    }
  }
};
```

## 🎯 Performance Optimizations

### Network Adaptation
The system automatically detects network quality and adjusts video settings:

```typescript
// Automatic quality adjustment based on network
const optimization = calculateOptimalVideoSettings();

// Manual quality override for specific scenarios
const customOptimization: IVideoOptimization = {
  recommendedQuality: '720p',
  preloadStrategy: 'metadata',
  bufferSize: 30,
  adaptiveBitrate: true,
  useCdn: true,
  enableHls: true
};
```

### Preloading Strategy
Implement smart preloading for better user experience:

```typescript
import { preloadVideoResources } from '@/utils/video-optimization';

// Preload next video in course sequence
const preloadNextVideo = (nextVideoId: string) => {
  preloadVideoResources(nextVideoId, {
    recommendedQuality: '720p',
    preloadStrategy: 'metadata',
    bufferSize: 20,
    adaptiveBitrate: true,
    useCdn: true,
    enableHls: true
  });
};
```

### Performance Monitoring
Enable automatic performance monitoring:

```jsx
import { VideoPerformanceMonitor } from '@/utils/video-optimization';

const MonitoredVideoComponent = () => {
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const monitor = new VideoPerformanceMonitor(
        videoElement,
        (suggestion) => {
          if (suggestion === 'downgrade') {
            // Handle quality downgrade
            setVideoQuality('480p');
          } else if (suggestion === 'upgrade') {
            // Handle quality upgrade
            setVideoQuality('720p');
          }
        }
      );

      return () => monitor.destroy();
    }
  }, []);

  // ... rest of component
};
```

## 📱 Mobile Optimization

### Touch Gestures
The new configuration includes touch-optimized controls:

```typescript
const mobileVideoConfig = {
  mobile: {
    adaptiveControls: true,
    touchGestures: true,
    pictureInPicture: true,
    backgroundPlayback: false
  }
};
```

### Responsive Design
Videos automatically adapt to screen size:

```jsx
<VideoPlayerWrapper
  url={videoUrl}
  className="w-full h-auto"
  containerClassName="aspect-video rounded-lg overflow-hidden"
  optimization="courseContent"
/>
```

## 🔒 Security Implementation

### Content Protection
Enable DRM for premium content:

```typescript
// For premium courses
const premiumVideoConfig = {
  security: {
    drm: {
      enabled: true,
      provider: 'widevine',
      licenseUrl: 'https://api.medh.in/drm/license'
    },
    encryption: {
      enabled: true,
      algorithm: 'AES-256-GCM'
    }
  }
};
```

### Hotlink Protection
Configure domain restrictions:

```typescript
const securityConfig = {
  hotlinking: {
    enabled: true,
    allowedDomains: ['medh.in', 'www.medh.in', 'app.medh.in'],
    referrerCheck: true
  }
};
```

## 📊 Analytics and Monitoring

### Video Analytics Dashboard
Create a comprehensive analytics dashboard:

```jsx
const VideoAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    // Fetch video analytics
    fetchVideoAnalytics().then(setAnalytics);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Total Views</h3>
        <p className="text-3xl font-bold text-blue-600">{analytics?.totalViews}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Completion Rate</h3>
        <p className="text-3xl font-bold text-green-600">{analytics?.completionRate}%</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Average Watch Time</h3>
        <p className="text-3xl font-bold text-purple-600">{analytics?.avgWatchTime}</p>
      </div>
    </div>
  );
};
```

## 🚀 Migration Checklist

- [ ] Replace all ReactPlayer instances with VideoPlayerWrapper
- [ ] Update video upload components to use new configuration
- [ ] Configure CDN URLs in environment variables
- [ ] Implement video analytics tracking
- [ ] Test video playback on different devices and networks
- [ ] Configure security settings (DRM, hotlink protection)
- [ ] Set up performance monitoring
- [ ] Update video quality presets
- [ ] Test mobile video experience
- [ ] Configure video thumbnails and posters
- [ ] Implement video preloading strategy
- [ ] Test video analytics dashboard
- [ ] Configure video download permissions
- [ ] Test error handling and retry mechanisms
- [ ] Update video SEO and metadata

## 🐛 Common Issues and Solutions

### Issue: Videos not loading on mobile
**Solution:** Ensure `playsInline` is enabled and check CORS headers

### Issue: Poor video quality on slow connections
**Solution:** Verify adaptive bitrate streaming is enabled and test quality fallbacks

### Issue: Analytics not tracking
**Solution:** Check that `enableAnalytics` is true and analytics service is configured

### Issue: Videos taking too long to start
**Solution:** Optimize preload strategy and check CDN performance

### Issue: Download protection not working
**Solution:** Verify `allowDownload` setting and check browser security headers

## 📞 Support

For additional support with video configuration:

1. Check the configuration in `src/config/video.config.ts`
2. Review optimization utilities in `src/utils/video-optimization.ts`
3. Test with the VideoPlayerWrapper component
4. Monitor performance using the built-in analytics
5. Refer to the Next.js video optimization documentation

## 🔄 Future Enhancements

Planned improvements include:

- **AI-powered quality selection** based on user behavior
- **Advanced DRM integration** for enterprise clients
- **Video compression optimization** for faster uploads
- **Real-time video collaboration** features
- **Enhanced video search** and discovery
- **Video thumbnail generation** from video content
- **Subtitle and closed caption** support
- **Video watermarking** for brand protection 