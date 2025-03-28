import { format, parse } from 'date-fns';

export const formatZoomDateTime = (dateString: string): string => {
  try {
    // Remove any leading/trailing spaces and handle the format "MMM dd,yyyy"
    const cleanDateString = dateString.trim();
    const date = parse(cleanDateString, 'MMM dd,yyyy', new Date());
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export const formatDuration = (duration: string): string => {
  try {
    // Clean up the input string
    const cleanDuration = duration.trim();
    
    // Extract hours and minutes using regex
    const hours = cleanDuration.match(/(\d+)\s*hr/)?.[1] || '0';
    const minutes = cleanDuration.match(/(\d+)\s*min/)?.[1] || '0';
    
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    
    if (totalMinutes >= 60) {
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return `${h}h${m > 0 ? ` ${m}m` : ''}`;
    }
    
    return `${totalMinutes}m`;
  } catch (error) {
    console.error('Error formatting duration:', error);
    return duration;
  }
}; 