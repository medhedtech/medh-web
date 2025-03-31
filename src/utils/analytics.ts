// Define a type for event parameters
interface EventParams {
  [key: string]: string | number | boolean;
}

// Check if window and gtag are available (only in browser environment)
const isClient = typeof window !== 'undefined';

/**
 * Track a page view in Google Analytics
 * @param url The URL to track
 */
export const pageView = (url: string) => {
  if (!isClient || !window.gtag) return;

  window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
    page_path: url,
  });
};

/**
 * Track an event in Google Analytics
 * @param action The action name
 * @param params Additional parameters to track
 */
export const event = (action: string, params: EventParams = {}) => {
  if (!isClient || !window.gtag) return;
  
  window.gtag('event', action, params);
};

// Predefined events for common actions
export const events = {
  // Auth events
  login: (method: string) => event('login', { method }),
  signup: (method: string) => event('sign_up', { method }),
  
  // Course events
  viewCourse: (courseId: string, courseName: string) => 
    event('view_course', { course_id: courseId, course_name: courseName }),
  enrollCourse: (courseId: string, courseName: string, price?: number) => 
    event('enroll_course', { 
      course_id: courseId, 
      course_name: courseName,
      ...(price !== undefined && { value: price, currency: 'USD' })
    }),
  completeCourse: (courseId: string, courseName: string) => 
    event('complete_course', { course_id: courseId, course_name: courseName }),
  
  // Video events
  startVideo: (videoId: string, videoTitle: string) => 
    event('start_video', { video_id: videoId, video_title: videoTitle }),
  completeVideo: (videoId: string, videoTitle: string, percentage: number) => 
    event('complete_video', { 
      video_id: videoId, 
      video_title: videoTitle,
      percentage
    }),
  
  // Interaction events
  submitForm: (formName: string) => event('submit_form', { form_name: formName }),
  clickButton: (buttonName: string) => event('click_button', { button_name: buttonName }),
  
  // E-commerce events
  addToCart: (itemId: string, itemName: string, price: number) => 
    event('add_to_cart', { 
      item_id: itemId, 
      item_name: itemName,
      value: price,
      currency: 'USD'
    }),
  purchase: (transactionId: string, value: number, items: any[]) => 
    event('purchase', { 
      transaction_id: transactionId,
      value,
      currency: 'USD',
      items
    }),
};

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      actionOrTarget: string,
      params?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
} 