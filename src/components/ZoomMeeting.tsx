import React, { useEffect, useState } from 'react';
import { useZoomClient } from '../hooks/useZoomClient';
import { ZoomMeetingDetails, ZoomMeetingStatus } from '../types/zoom';

interface ZoomMeetingProps {
  meetingDetails: ZoomMeetingDetails;
  onStatusChange?: (status: ZoomMeetingStatus) => void;
}

export const ZoomMeeting: React.FC<ZoomMeetingProps> = ({ meetingDetails, onStatusChange }) => {
  const { isInitialized, error, joinMeeting, leaveMeeting } = useZoomClient();
  const [status, setStatus] = useState<ZoomMeetingStatus>(ZoomMeetingStatus.LEFT);

  useEffect(() => {
    if (error) {
      setStatus(ZoomMeetingStatus.ERROR);
      onStatusChange?.(ZoomMeetingStatus.ERROR);
    }
  }, [error, onStatusChange]);

  const handleJoinMeeting = async () => {
    try {
      setStatus(ZoomMeetingStatus.JOINING);
      onStatusChange?.(ZoomMeetingStatus.JOINING);
      await joinMeeting(meetingDetails);
      setStatus(ZoomMeetingStatus.JOINED);
      onStatusChange?.(ZoomMeetingStatus.JOINED);
    } catch (err) {
      setStatus(ZoomMeetingStatus.ERROR);
      onStatusChange?.(ZoomMeetingStatus.ERROR);
      console.error('Failed to join meeting:', err);
    }
  };

  const handleLeaveMeeting = () => {
    leaveMeeting();
    setStatus(ZoomMeetingStatus.LEFT);
    onStatusChange?.(ZoomMeetingStatus.LEFT);
  };

  if (!isInitialized) {
    return <div>Initializing Zoom client...</div>;
  }

  if (error) {
    return <div>Error initializing Zoom client: {error.message}</div>;
  }

  return (
    <div className="zoom-meeting-container">
      {status === ZoomMeetingStatus.JOINED ? (
        <button
          onClick={handleLeaveMeeting}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Leave Meeting
        </button>
      ) : (
        <button
          onClick={handleJoinMeeting}
          disabled={status === ZoomMeetingStatus.JOINING}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {status === ZoomMeetingStatus.JOINING ? 'Joining...' : 'Join Meeting'}
        </button>
      )}
      {status === ZoomMeetingStatus.ERROR && (
        <div className="text-red-500 mt-2">Failed to join meeting. Please try again.</div>
      )}
    </div>
  );
}; 