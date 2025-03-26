import { format, parseISO } from 'date-fns';

export const formatZoomDateTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export const formatDuration = (duration: string): string => {
  try {
    // Expected format: "2h 30m" or "45m" or "1h"
    const hours = duration.match(/(\d+)h/)?.[1] || '0';
    const minutes = duration.match(/(\d+)m/)?.[1] || '0';
    
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