# Video Compression Guide for Hero2.tsx

## Overview
This guide provides instructions for compressing video files without quality loss for the optimized Hero2.tsx component.

## Video Requirements

### Current Videos
- **Dark Theme**: `1659171_Trapcode_Particles_3840x2160.mp4`
- **Light Theme**: `0_Technology_Abstract_4096x2304.mp4`

### Target Formats
1. **WebM (Primary)** - Better compression, modern browsers
2. **MP4 (Fallback)** - Universal compatibility

### Quality Levels
- **High**: 4K/2K resolution for desktop
- **Medium**: 1080p for mobile/slower connections
- **Poster Images**: WebP format for instant loading

## Compression Commands

### Using FFmpeg (Recommended)

#### 1. WebM Format (VP9 codec)
```bash
# High Quality (4K/2K)
ffmpeg -i input_video.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus -threads 8 -speed 2 -tile-columns 6 -frame-parallel 1 -auto-alt-ref 1 -lag-in-frames 25 -g 999999 -aq-mode 0 -an output_4k_compressed.webm

# Medium Quality (1080p)
ffmpeg -i input_video.mp4 -vf scale=1920:1080 -c:v libvpx-vp9 -crf 32 -b:v 0 -c:a libopus -b:a 96k -threads 8 -speed 4 -tile-columns 6 -frame-parallel 1 -auto-alt-ref 1 -lag-in-frames 25 -g 999999 -aq-mode 0 -an output_1080p_compressed.webm
```

#### 2. MP4 Format (H.264 codec)
```bash
# High Quality (4K/2K)
ffmpeg -i input_video.mp4 -c:v libx264 -preset slow -crf 23 -c:a aac -b:a 128k -movflags +faststart output_4k_compressed.mp4

# Medium Quality (1080p)
ffmpeg -i input_video.mp4 -vf scale=1920:1080 -c:v libx264 -preset slow -crf 25 -c:a aac -b:a 96k -movflags +faststart output_1080p_compressed.mp4
```

#### 3. Poster Images (WebP)
```bash
# Extract frame and convert to WebP
ffmpeg -i input_video.mp4 -ss 00:00:05 -vframes 1 -f webp -quality 85 poster_image.webp
```

### Advanced Compression Settings

#### For Dark Theme Videos
```bash
# Dark theme specific optimization
ffmpeg -i dark_theme_input.mp4 \
  -c:v libvpx-vp9 \
  -crf 28 \
  -b:v 0 \
  -threads 8 \
  -speed 2 \
  -tile-columns 6 \
  -frame-parallel 1 \
  -auto-alt-ref 1 \
  -lag-in-frames 25 \
  -g 999999 \
  -aq-mode 0 \
  -an \
  -vf "eq=brightness=-0.1:contrast=1.1" \
  dark_theme_compressed.webm
```

#### For Light Theme Videos
```bash
# Light theme specific optimization
ffmpeg -i light_theme_input.mp4 \
  -c:v libvpx-vp9 \
  -crf 26 \
  -b:v 0 \
  -threads 8 \
  -speed 2 \
  -tile-columns 6 \
  -frame-parallel 1 \
  -auto-alt-ref 1 \
  -lag-in-frames 25 \
  -g 999999 \
  -aq-mode 0 \
  -an \
  -vf "eq=brightness=0.05:contrast=0.95" \
  light_theme_compressed.webm
```

## File Naming Convention

### Required File Names
```
# Dark Theme Videos
1659171_Trapcode_Particles_3840x2160_compressed.webm
1659171_Trapcode_Particles_3840x2160_compressed.mp4
1659171_Trapcode_Particles_1920x1080_compressed.webm
1659171_Trapcode_Particles_1920x1080_compressed.mp4

# Light Theme Videos
0_Technology_Abstract_4096x2304_compressed.webm
0_Technology_Abstract_4096x2304_compressed.mp4
0_Technology_Abstract_1920x1080_compressed.webm
0_Technology_Abstract_1920x1080_compressed.mp4

# Poster Images
dark_theme_poster.webp
light_theme_poster.webp
```

## Upload Instructions

### 1. CDN Upload
Upload compressed files to your CDN with the following structure:
```
Website/
├── 1659171_Trapcode_Particles_3840x2160_compressed.webm
├── 1659171_Trapcode_Particles_3840x2160_compressed.mp4
├── 1659171_Trapcode_Particles_1920x1080_compressed.webm
├── 1659171_Trapcode_Particles_1920x1080_compressed.mp4
├── 0_Technology_Abstract_4096x2304_compressed.webm
├── 0_Technology_Abstract_4096x2304_compressed.mp4
├── 0_Technology_Abstract_1920x1080_compressed.webm
├── 0_Technology_Abstract_1920x1080_compressed.mp4
├── dark_theme_poster.webp
└── light_theme_poster.webp
```

### 2. CDN Configuration
Ensure your CDN is configured for:
- **Gzip/Brotli compression** for video files
- **Proper MIME types**:
  - `.webm`: `video/webm`
  - `.mp4`: `video/mp4`
  - `.webp`: `image/webp`
- **Long-term caching** (1 year+)
- **Range request support** for video streaming

## Quality Verification

### Check Compression Results
```bash
# Compare file sizes
ls -lh original_video.mp4 compressed_video.webm

# Check video quality
ffplay compressed_video.webm

# Get video information
ffprobe -v quiet -print_format json -show_format -show_streams compressed_video.webm
```

### Expected Compression Ratios
- **WebM**: 40-60% size reduction vs original MP4
- **MP4 (H.264)**: 20-40% size reduction vs original
- **Quality**: Visually lossless at CRF 23-30

## Performance Optimizations

### 1. Video Metadata
Ensure videos have:
- **Duration metadata** for progress tracking
- **Keyframe intervals** every 2-3 seconds
- **Fast start** for web delivery

### 2. Adaptive Loading
The component automatically:
- Detects connection speed
- Loads appropriate quality
- Falls back to poster images on slow connections
- Preloads next theme video intelligently

### 3. Memory Management
- Videos are pooled and reused
- Automatic cleanup on theme switch
- Intersection observer for lazy loading

## Browser Support

### Video Format Support
- **WebM VP9**: Chrome, Firefox, Edge (90%+ coverage)
- **MP4 H.264**: Universal support (99%+ coverage)
- **WebP Images**: Modern browsers (95%+ coverage)

### Fallback Strategy
1. Try WebM format first
2. Fall back to MP4 if WebM fails
3. Show poster image if both fail
4. Graceful degradation for older browsers

## Testing Checklist

- [ ] Videos load on different connection speeds
- [ ] Theme switching works smoothly
- [ ] Memory usage stays stable
- [ ] No video artifacts or stuttering
- [ ] Fallback images work correctly
- [ ] Mobile performance is acceptable

## Troubleshooting

### Common Issues
1. **Large file sizes**: Increase CRF value (lower quality)
2. **Poor quality**: Decrease CRF value (higher quality)
3. **Slow loading**: Create additional lower quality versions
4. **Memory leaks**: Ensure video cleanup is working

### Performance Monitoring
Monitor these metrics:
- **Initial load time**
- **Memory usage over time**
- **Video switch duration**
- **Error rates by browser/device**