export interface SessionData {
  session_id: string;
  session_date: string;
  session_end_date: string;
  title: string;
  description?: string;
  batch?: {
    id: string;
    name: string;
    code: string;
  };
  course?: {
    id: string;
    title: string;
  };
  instructor?: {
    _id: string;
    full_name: string;
    email: string;
  };
  zoom_meeting?: {
    meeting_id: string;
    join_url: string;
    topic: string;
    password?: string;
  };
}

export interface GoogleCalendarEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  description: string;
  location: string;
}

/**
 * Formats a date for Google Calendar URL (YYYYMMDDTHHMMSSZ format)
 */
export const formatGoogleCalendarDate = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
};

/**
 * Generates a comprehensive event description for Google Calendar
 */
export const generateEventDescription = (sessionData: SessionData): string => {
  const parts = [
    `📚 Course: ${sessionData.course?.title || 'Course Session'}`,
    '',
    `👨‍🏫 Instructor: ${sessionData.instructor?.full_name || 'Instructor'}`,
    `📖 Batch: ${sessionData.batch?.name || 'N/A'}`,
    `🔢 Batch Code: ${sessionData.batch?.code || 'N/A'}`,
    '',
  ];

  if (sessionData.zoom_meeting) {
    parts.push(
      `💻 Join Meeting: ${sessionData.zoom_meeting.join_url}`,
      `🆔 Meeting ID: ${sessionData.zoom_meeting.meeting_id}`,
    );
    
    if (sessionData.zoom_meeting.password) {
      parts.push(`🔐 Password: ${sessionData.zoom_meeting.password}`);
    }
    
    parts.push('');
  }

  parts.push(
    `📝 Session Details:`,
    sessionData.description || sessionData.title || 'Live class session',
    '',
    `🌐 Platform: ${sessionData.zoom_meeting ? 'Online (Zoom)' : 'In-person'}`,
    '',
    `📧 Instructor Email: ${sessionData.instructor?.email || 'N/A'}`,
  );

  return parts.join('\n');
};

/**
 * Generates Google Calendar URL for a session
 */
export const generateGoogleCalendarUrl = (sessionData: SessionData): string => {
  const startDate = new Date(sessionData.session_date);
  const endDate = new Date(sessionData.session_end_date);

  const startFormatted = formatGoogleCalendarDate(startDate);
  const endFormatted = formatGoogleCalendarDate(endDate);

  const title = encodeURIComponent(sessionData.title || 'Class Session');
  const description = encodeURIComponent(generateEventDescription(sessionData));
  const location = encodeURIComponent(
    sessionData.zoom_meeting 
      ? 'Online - Zoom Meeting'
      : 'Medh Campus'
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFormatted}%2F${endFormatted}&details=${description}&location=${location}&sf=true&output=xml`;
};

/**
 * Opens Google Calendar in a new window with the session details
 */
export const openGoogleCalendar = (sessionData: SessionData): void => {
  const calendarUrl = generateGoogleCalendarUrl(sessionData);
  window.open(calendarUrl, '_blank', 'width=600,height=600,scrollbars=yes,resizable=yes');
};

/**
 * Creates an ICS file download for the session (alternative to Google Calendar)
 */
export const generateICSFile = (sessionData: SessionData): string => {
  const startDate = new Date(sessionData.session_date);
  const endDate = new Date(sessionData.session_end_date);
  
  const formatICSDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, 'Z');
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Medh//Class Session//EN',
    'BEGIN:VEVENT',
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:${sessionData.title || 'Class Session'}`,
    `DESCRIPTION:${generateEventDescription(sessionData).replace(/\n/g, '\\n')}`,
    `LOCATION:${sessionData.zoom_meeting ? 'Online - Zoom Meeting' : 'Medh Campus'}`,
    `UID:${sessionData.session_id}@medh.com`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return icsContent;
};

/**
 * Downloads an ICS file for the session
 */
export const downloadICSFile = (sessionData: SessionData): void => {
  const icsContent = generateICSFile(sessionData);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sessionData.title || 'class-session'}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};