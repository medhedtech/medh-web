import axios from 'axios';

export interface CalendarEvent {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  timeZone?: string;
  location?: string;
  attendees?: Array<{ email: string; name?: string }>;
  zoomMeetingLink?: string;
  zoomMeetingId?: string;
  zoomPassword?: string;
}

/**
 * Abstract calendar service interface
 */
export interface CalendarService {
  createEvent(event: CalendarEvent): Promise<any>;
  updateEvent(eventId: string, event: CalendarEvent): Promise<any>;
  deleteEvent(eventId: string): Promise<void>;
  listEvents(startDate: Date, endDate: Date): Promise<any[]>;
}

/**
 * Google Calendar integration service
 */
export class GoogleCalendarService implements CalendarService {
  private accessToken: string;
  private calendarId: string;

  constructor(accessToken: string, calendarId: string = 'primary') {
    this.accessToken = accessToken;
    this.calendarId = calendarId;
  }

  /**
   * Create a new event in Google Calendar
   */
  async createEvent(event: CalendarEvent): Promise<any> {
    try {
      // Prepare the event body for Google Calendar API
      const googleEvent = {
        summary: event.title,
        description: this.formatDescription(event),
        start: {
          dateTime: event.startTime.toISOString(),
          timeZone: event.timeZone || 'UTC',
        },
        end: {
          dateTime: event.endTime.toISOString(),
          timeZone: event.timeZone || 'UTC',
        },
        location: event.location || (event.zoomMeetingLink ? 'Zoom Meeting' : ''),
        attendees: event.attendees?.map(attendee => ({
          email: attendee.email,
          displayName: attendee.name,
        })),
        conferenceData: event.zoomMeetingLink
          ? {
              createRequest: {
                requestId: `zoom-${event.zoomMeetingId || Date.now()}`,
                conferenceSolutionKey: {
                  type: 'addOn',
                },
              },
              entryPoints: [
                {
                  entryPointType: 'video',
                  uri: event.zoomMeetingLink,
                  label: 'Zoom Meeting',
                },
              ],
            }
          : undefined,
      };

      // Make the API request
      const response = await axios.post(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
          this.calendarId
        )}/events`,
        googleEvent,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          params: {
            conferenceDataVersion: 1,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      throw new Error(`Failed to create Google Calendar event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing event in Google Calendar
   */
  async updateEvent(eventId: string, event: CalendarEvent): Promise<any> {
    try {
      // Prepare the event body for Google Calendar API
      const googleEvent = {
        summary: event.title,
        description: this.formatDescription(event),
        start: {
          dateTime: event.startTime.toISOString(),
          timeZone: event.timeZone || 'UTC',
        },
        end: {
          dateTime: event.endTime.toISOString(),
          timeZone: event.timeZone || 'UTC',
        },
        location: event.location || (event.zoomMeetingLink ? 'Zoom Meeting' : ''),
        attendees: event.attendees?.map(attendee => ({
          email: attendee.email,
          displayName: attendee.name,
        })),
      };

      // Make the API request
      const response = await axios.patch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
          this.calendarId
        )}/events/${eventId}`,
        googleEvent,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error updating Google Calendar event:', error);
      throw new Error(`Failed to update Google Calendar event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete an event from Google Calendar
   */
  async deleteEvent(eventId: string): Promise<void> {
    try {
      await axios.delete(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
          this.calendarId
        )}/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error('Error deleting Google Calendar event:', error);
      throw new Error(`Failed to delete Google Calendar event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * List events within a date range
   */
  async listEvents(startDate: Date, endDate: Date): Promise<any[]> {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
          this.calendarId
        )}/events`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          params: {
            timeMin: startDate.toISOString(),
            timeMax: endDate.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
          },
        }
      );

      return response.data.items || [];
    } catch (error) {
      console.error('Error listing Google Calendar events:', error);
      throw new Error(`Failed to list Google Calendar events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Format the description to include Zoom meeting details
   */
  private formatDescription(event: CalendarEvent): string {
    let description = event.description || '';

    if (event.zoomMeetingLink) {
      description += `\n\n---\n\nZoom Meeting Information:\n`;
      description += `- Meeting Link: ${event.zoomMeetingLink}\n`;
      
      if (event.zoomMeetingId) {
        description += `- Meeting ID: ${event.zoomMeetingId}\n`;
      }
      
      if (event.zoomPassword) {
        description += `- Password: ${event.zoomPassword}\n`;
      }
    }

    return description;
  }
}

/**
 * Microsoft Graph/Outlook Calendar integration service
 */
export class OutlookCalendarService implements CalendarService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Create a new event in Outlook Calendar
   */
  async createEvent(event: CalendarEvent): Promise<any> {
    try {
      // Prepare the event body for Microsoft Graph API
      const outlookEvent = {
        subject: event.title,
        body: {
          contentType: 'HTML',
          content: this.formatDescription(event),
        },
        start: {
          dateTime: event.startTime.toISOString(),
          timeZone: event.timeZone || 'UTC',
        },
        end: {
          dateTime: event.endTime.toISOString(),
          timeZone: event.timeZone || 'UTC',
        },
        location: {
          displayName: event.location || (event.zoomMeetingLink ? 'Zoom Meeting' : ''),
        },
        attendees: event.attendees?.map(attendee => ({
          emailAddress: {
            address: attendee.email,
            name: attendee.name,
          },
          type: 'required',
        })),
        isOnlineMeeting: !!event.zoomMeetingLink,
        onlineMeetingProvider: event.zoomMeetingLink ? 'teamsForBusiness' : 'unknown',
      };

      // Make the API request
      const response = await axios.post(
        'https://graph.microsoft.com/v1.0/me/events',
        outlookEvent,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating Outlook Calendar event:', error);
      throw new Error(`Failed to create Outlook Calendar event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing event in Outlook Calendar
   */
  async updateEvent(eventId: string, event: CalendarEvent): Promise<any> {
    try {
      // Prepare the event body for Microsoft Graph API
      const outlookEvent = {
        subject: event.title,
        body: {
          contentType: 'HTML',
          content: this.formatDescription(event),
        },
        start: {
          dateTime: event.startTime.toISOString(),
          timeZone: event.timeZone || 'UTC',
        },
        end: {
          dateTime: event.endTime.toISOString(),
          timeZone: event.timeZone || 'UTC',
        },
        location: {
          displayName: event.location || (event.zoomMeetingLink ? 'Zoom Meeting' : ''),
        },
        attendees: event.attendees?.map(attendee => ({
          emailAddress: {
            address: attendee.email,
            name: attendee.name,
          },
          type: 'required',
        })),
      };

      // Make the API request
      const response = await axios.patch(
        `https://graph.microsoft.com/v1.0/me/events/${eventId}`,
        outlookEvent,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error updating Outlook Calendar event:', error);
      throw new Error(`Failed to update Outlook Calendar event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete an event from Outlook Calendar
   */
  async deleteEvent(eventId: string): Promise<void> {
    try {
      await axios.delete(`https://graph.microsoft.com/v1.0/me/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
    } catch (error) {
      console.error('Error deleting Outlook Calendar event:', error);
      throw new Error(`Failed to delete Outlook Calendar event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * List events within a date range
   */
  async listEvents(startDate: Date, endDate: Date): Promise<any[]> {
    try {
      const response = await axios.get('https://graph.microsoft.com/v1.0/me/calendarview', {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          Prefer: 'outlook.timezone="UTC"',
        },
        params: {
          startDateTime: startDate.toISOString(),
          endDateTime: endDate.toISOString(),
          $orderby: 'start/dateTime',
          $select: 'subject,bodyPreview,start,end,location,attendees',
        },
      });

      return response.data.value || [];
    } catch (error) {
      console.error('Error listing Outlook Calendar events:', error);
      throw new Error(`Failed to list Outlook Calendar events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Format the description to include Zoom meeting details
   */
  private formatDescription(event: CalendarEvent): string {
    let description = event.description || '';

    if (event.zoomMeetingLink) {
      description += `<br><br><hr><br>`;
      description += `<strong>Zoom Meeting Information:</strong><br>`;
      description += `- Meeting Link: <a href="${event.zoomMeetingLink}">${event.zoomMeetingLink}</a><br>`;
      
      if (event.zoomMeetingId) {
        description += `- Meeting ID: ${event.zoomMeetingId}<br>`;
      }
      
      if (event.zoomPassword) {
        description += `- Password: ${event.zoomPassword}<br>`;
      }
    }

    return description;
  }
}

/**
 * Factory method to create calendar service based on provider
 */
export function createCalendarService(
  provider: 'google' | 'outlook',
  accessToken: string,
  calendarId?: string
): CalendarService {
  switch (provider) {
    case 'google':
      return new GoogleCalendarService(accessToken, calendarId);
    case 'outlook':
      return new OutlookCalendarService(accessToken);
    default:
      throw new Error(`Unsupported calendar provider: ${provider}`);
  }
}

/**
 * Create a calendar event with Zoom meeting integration
 */
export async function createZoomMeetingCalendarEvent(
  provider: 'google' | 'outlook',
  accessToken: string,
  calendarEvent: CalendarEvent,
  zoomMeetingDetails: {
    meetingId: string;
    joinUrl: string;
    password?: string;
  }
): Promise<any> {
  // Add Zoom meeting details to the calendar event
  const eventWithZoom: CalendarEvent = {
    ...calendarEvent,
    zoomMeetingLink: zoomMeetingDetails.joinUrl,
    zoomMeetingId: zoomMeetingDetails.meetingId,
    zoomPassword: zoomMeetingDetails.password,
  };

  // Create the calendar service based on provider
  const calendarService = createCalendarService(provider, accessToken);

  // Create the calendar event
  return calendarService.createEvent(eventWithZoom);
}

export default {
  createCalendarService,
  createZoomMeetingCalendarEvent,
}; 