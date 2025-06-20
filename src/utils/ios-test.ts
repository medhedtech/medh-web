/**
 * iOS Test Utility
 * 
 * This utility provides methods to test and verify iOS optimizations
 * are working correctly to prevent crashes.
 */

import { deviceDetection } from './ios-video-utils';

export const iosTest = {
  // Test if device is iOS
  testDeviceDetection: () => {
    console.log('🔍 Device Detection Test:');
    console.log('- Is iOS:', deviceDetection.isIOS());
    console.log('- Is Safari:', deviceDetection.isSafari());
    console.log('- Is iOS Chrome:', deviceDetection.isIOSChrome());
    console.log('- Is Low Power Mode:', deviceDetection.isLowPowerMode());
    console.log('- iOS Version:', deviceDetection.getIOSVersion());
    console.log('- Memory Info:', deviceDetection.getMemoryInfo());
  },

  // Test video compatibility
  testVideoCompatibility: () => {
    if (typeof window === 'undefined') return false;
    
    const video = document.createElement('video');
    const canPlayMP4 = video.canPlayType('video/mp4');
    const canAutoplay = video.autoplay !== undefined;
    const supportsPlaysinline = 'playsInline' in video;
    
    console.log('📹 Video Compatibility Test:');
    console.log('- Can play MP4:', canPlayMP4);
    console.log('- Supports autoplay attribute:', canAutoplay);
    console.log('- Supports playsinline:', supportsPlaysinline);
    
    return {
      canPlayMP4: canPlayMP4 !== '',
      canAutoplay,
      supportsPlaysinline
    };
  },

  // Test CSS support
  testCSSSupport: () => {
    if (typeof window === 'undefined') return false;
    
    const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(1px)') || 
                                  CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
    const supportsTransform3d = CSS.supports('transform', 'translateZ(0)');
    const supportsWillChange = CSS.supports('will-change', 'transform');
    
    console.log('🎨 CSS Support Test:');
    console.log('- Supports backdrop-filter:', supportsBackdropFilter);
    console.log('- Supports 3D transforms:', supportsTransform3d);
    console.log('- Supports will-change:', supportsWillChange);
    
    return {
      supportsBackdropFilter,
      supportsTransform3d,
      supportsWillChange
    };
  },

  // Run all tests
  runAllTests: () => {
    console.log('🧪 Running iOS Optimization Tests...\n');
    
    iosTest.testDeviceDetection();
    console.log('');
    
    const videoTest = iosTest.testVideoCompatibility();
    console.log('');
    
    const cssTest = iosTest.testCSSSupport();
    console.log('');
    
    // Provide recommendations
    const isIOS = deviceDetection.isIOS();
    if (isIOS) {
      console.log('💡 iOS Device Detected - Recommendations:');
      
      if (!videoTest.supportsPlaysinline) {
        console.log('⚠️  PlaysinIine not supported - video may not work correctly');
      }
      
      if (!cssTest.supportsBackdropFilter) {
        console.log('⚠️  Backdrop-filter not supported - using fallback backgrounds');
      }
      
      if (deviceDetection.isLowPowerMode()) {
        console.log('⚠️  Low power mode detected - animations will be reduced');
      }
      
      const memInfo = deviceDetection.getMemoryInfo();
      if (memInfo.deviceMemory && memInfo.deviceMemory < 3) {
        console.log('⚠️  Low memory device - video may be disabled');
      }
    }
    
    console.log('\n✅ iOS optimization tests completed');
    
    return {
      isIOS,
      videoSupport: videoTest,
      cssSupport: cssTest,
      recommendations: {
        shouldDisableVideo: isIOS && (deviceDetection.isLowPowerMode() || 
                            (deviceDetection.getMemoryInfo().deviceMemory || 0) < 3),
        shouldUseGlassFallback: !cssTest.supportsBackdropFilter,
        shouldReduceAnimations: deviceDetection.isLowPowerMode()
      }
    };
  }
};

export default iosTest; 