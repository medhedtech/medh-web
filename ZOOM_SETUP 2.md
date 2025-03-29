# Zoom Integration Setup

This document outlines the steps required to set up Zoom integration in the Medh platform.

## Prerequisites

1. A Zoom Developer Account
2. Zoom SDK App credentials
3. Zoom API credentials

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
NEXT_PUBLIC_ZOOM_API_KEY=your_zoom_api_key
NEXT_PUBLIC_ZOOM_SDK_KEY=your_zoom_sdk_key
ZOOM_API_SECRET=your_zoom_api_secret
ZOOM_SDK_SECRET=your_zoom_sdk_secret
```

## Features

The Zoom integration includes:

1. Real-time meeting status updates
2. Direct meeting join functionality
3. Secure signature generation
4. Meeting status tracking

## Components

### ZoomMeeting Component

The main component for displaying and interacting with Zoom meetings. Features include:

- Meeting status indicator (Live, Upcoming, Ended)
- Direct join meeting button
- Meeting details display
- Speaker information

### Zoom Client Hook

A custom hook (`useZoomClient`) that handles:

- Zoom SDK initialization
- Meeting status checks
- Join/leave meeting functionality
- Error handling

## API Endpoints

1. `/api/zoom/generate-signature`
   - Generates secure signatures for joining meetings
   - POST request with meeting number and role

2. `/api/zoom/meeting-status/[meetingId]`
   - Fetches real-time meeting status
   - GET request with meeting ID

## Security Considerations

1. All sensitive credentials are stored in environment variables
2. Signatures are generated server-side
3. API requests are authenticated using JWT
4. Meeting access is controlled through roles

## Usage

```typescript
import { ZoomMeeting } from '@/components/shared/zoom-meetings/ZoomMeeting';

const MyPage = () => {
  const meeting = {
    id: '123',
    title: 'Sample Meeting',
    zoomMeetingId: '789',
    joinUrl: 'https://zoom.us/j/789',
    // ... other meeting details
  };

  return <ZoomMeeting meeting={meeting} />;
};
```

## Troubleshooting

1. If meeting status is not updating:
   - Check Zoom API credentials
   - Verify meeting ID format
   - Check network connectivity

2. If join meeting fails:
   - Verify SDK initialization
   - Check signature generation
   - Confirm meeting is active

## Dependencies

- @zoomus/websdk: ^2.18.0
- date-fns: ^2.30.0
- react-hot-toast: ^2.4.1

## Additional Resources

- [Zoom API Documentation](https://developers.zoom.us/docs/api/)
- [Zoom Web SDK Documentation](https://developers.zoom.us/docs/web-sdk/) 