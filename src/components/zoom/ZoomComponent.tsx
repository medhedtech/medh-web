import { useEffect, useRef } from 'react';
import { ZoomMeetingDetails } from '@/types/zoom';
import { useZoomClient } from '@/hooks/useZoomClient';

interface ZoomComponentProps {
  meetingDetails: ZoomMeetingDetails;
}

const ZoomComponent = ({ meetingDetails }: ZoomComponentProps) => {
  const { joinMeeting, leaveMeeting } = useZoomClient();
  const meetingContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeMeeting = async () => {
      if (!meetingContainerRef.current) return;

      try {
        await joinMeeting({
          meetingNumber: meetingDetails.meetingId,
          userName: meetingDetails.userName,
          userEmail: meetingDetails.userEmail,
          passWord: meetingDetails.password,
        });
      } catch (error) {
        console.error('Failed to join meeting:', error);
      }
    };

    initializeMeeting();

    return () => {
      leaveMeeting();
    };
  }, [meetingDetails, joinMeeting, leaveMeeting]);

  return (
    <div className="w-full h-full">
      <div id="zmmtg-root" className="w-full h-full" />
      <div ref={meetingContainerRef} id="meetingSDKElement" className="w-full h-full" />
    </div>
  );
};

export default ZoomComponent; 