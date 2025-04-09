# Zoom Meeting SDK Integration

This document provides a comprehensive guide to the Zoom Meeting SDK integration implemented in this project.

## Features

This integration provides the following features:

1. **Component View Integration** - Modern embedded Zoom experience
2. **Calendar-Level Meeting Scheduling** - Google Calendar and Outlook integration
3. **Automatic Meeting Fetching** - Real-time meeting status updates
4. **AWS S3 Recording Storage** - Secure storage of meeting recordings

## Implementation Components

### Core Components

- **useZoomClient.ts** - Custom React hook for managing the Zoom SDK
- **ZoomMeeting.tsx** - Component for displaying and joining Zoom meetings
- **ZoomMeetingScheduler.tsx** - Component for scheduling Zoom meetings with calendar integration
- **recording.ts** - Service for handling Zoom recording webhooks and S3 integration
- **calendar.ts** - Service for calendar integrations

### API Routes

- **/api/zoom/create-meeting** - Creates a new Zoom meeting
- **/api/zoom/generate-signature** - Generates a Zoom JWT signature for joining meetings
- **/api/zoom/meeting-status/:id** - Gets the current status of a meeting
- **/api/zoom/webhook** - Handles Zoom webhooks (particularly for recordings)

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file with the following variables:

```
# Zoom API Credentials
NEXT_PUBLIC_ZOOM_SDK_KEY=your_sdk_key
NEXT_PUBLIC_ZOOM_SDK_SECRET=your_sdk_secret
ZOOM_API_KEY=your_api_key
ZOOM_API_SECRET=your_api_secret
ZOOM_JWT_TOKEN=your_zoom_jwt_token
ZOOM_WEBHOOK_SECRET_TOKEN=your_webhook_secret

# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-zoom-recordings-bucket
```

### 2. Install Dependencies

```bash
npm install @zoom/meetingsdk @zoom/meetingsdk/embedded aws-sdk axios date-fns
```

### 3. Register Webhooks

In your Zoom Developer Dashboard:

1. Navigate to App Marketplace > Develop > Build App
2. Choose your app
3. Go to Feature > Event Subscriptions
4. Add a subscription for:
   - Meeting Events: `meeting.ended`
   - Recording Events: `recording.completed`
5. Set the Event Notification Endpoint URL to: `https://your-domain.com/api/zoom/webhook`
6. Save the Verification Token as `ZOOM_WEBHOOK_SECRET_TOKEN` in your `.env` file

## Usage Examples

### Joining a Zoom Meeting

```tsx
import { ZoomMeeting } from "@/components/shared/zoom-meetings/ZoomMeeting";

const MyPage = () => {
  const meetingDetails = {
    id: "123456789",
    title: "Weekly Team Meeting",
    zoomMeetingId: "123456789",
    date: "2023-05-25",
    startingTime: "10:00 AM",
    duration: "60 minutes",
    speakerName: "John Doe",
    speakerImage: "/images/speakers/john-doe.jpg",
    image: "/images/meetings/team-meeting.jpg",
    department: "Engineering",
    status: "live" // 'live', 'upcoming', or 'completed'
  };

  return <ZoomMeeting meeting={meetingDetails} />;
};
```

### Scheduling a Zoom Meeting

```tsx
import { ZoomMeetingScheduler } from "@/components/shared/zoom-meetings/ZoomMeetingScheduler";

const SchedulePage = () => {
  const handleScheduled = (meetingDetails) => {
    console.log("Meeting scheduled:", meetingDetails);
    // Handle scheduled meeting details
  };

  return (
    <ZoomMeetingScheduler
      onScheduled={handleScheduled}
      defaultTitle="Weekly Team Sync"
      defaultDuration={45}
      defaultDate={new Date()}
      isHost={true}
    />
  );
};
```

## Component View Lifecycle

The Zoom Component View integration handles the complete meeting lifecycle:

1. **Initialization** - The SDK is initialized once per container
2. **Join Meeting** - User joins the meeting with proper authorization
3. **Leave Meeting** - User leaves meeting explicitly or implicitly when component unmounts
4. **Cleanup** - Resources are properly cleaned up to prevent memory leaks

## Error Handling

This implementation includes robust error handling:

1. **Client-Side Errors** - Properly handled and displayed to users via toast notifications
2. **API Errors** - Properly formatted error responses with appropriate HTTP status codes
3. **Recovery Strategy** - Automatic retry and recovery mechanisms for transient failures

## Security Considerations

This implementation follows Zoom's security best practices:

1. **JWT Authentication** - Secure server-side signature generation
2. **Webhook Validation** - HMAC signature verification
3. **Data Protection** - Secure handling of meeting credentials
4. **AWS S3 Security** - Encrypted storage with proper IAM permissions

## Calendar Integration

The calendar integration supports:

1. **Google Calendar** - Full OAuth flow with proper scopes
2. **Microsoft Outlook** - Microsoft Graph API integration
3. **Meeting Details** - Complete meeting information embedded in calendar events
4. **Attendee Management** - Automatic invitation emails to attendees

## S3 Recording Integration

The S3 recording integration includes:

1. **Webhook Processing** - Automatic capture of recording.completed events
2. **Secure Download** - Secure handling of recording downloads
3. **Organized Storage** - Structured S3 path organization by host/date/meeting
4. **Metadata** - Rich metadata stored with each recording

## Troubleshooting

Common issues and solutions:

1. **Meeting Won't Join** - Check browser console for errors, verify signature generation
2. **Webhooks Not Working** - Verify webhook URL is publicly accessible and secret is correct
3. **Recording Not Uploading** - Check S3 permissions and AWS credentials
4. **Calendar Integration Failing** - Verify OAuth tokens and refresh process

## References

- [Zoom Meeting SDK Documentation](https://developers.zoom.us/docs/meeting-sdk/)
- [Zoom API Documentation](https://developers.zoom.us/docs/api/)
- [AWS S3 SDK Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html)
- [Google Calendar API](https://developers.google.com/calendar)
- [Microsoft Graph API](https://learn.microsoft.com/en-us/graph/api/resources/calendar) 