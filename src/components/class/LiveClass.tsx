import { useEffect, useState } from 'react';
import { useZoomClient } from '@/hooks/useZoomClient';
import { ZoomMeetingDetails } from '@/types/zoom';
import dynamic from 'next/dynamic';

// Dynamically import the Zoom component with no SSR
const ZoomComponent = dynamic(() => import('@/components/zoom/ZoomComponent'), {
  ssr: false,
  loading: () => <div>Loading Zoom...</div>


});

interface LiveClassProps {
  meetingDetails: ZoomMeetingDetails;
}

export const LiveClass = ({ meetingDetails }: LiveClassProps) => {
  const { joinMeeting, leaveMeeting, isInitialized, isLoading, error } = useZoomClient();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return <div>Initializing Zoom...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!isInitialized) {
    return <div>Zoom is not initialized</div>;
  }

  return (
    <div className="w-full h-full">
      <ZoomComponent meetingDetails={meetingDetails} />
    </div>
  );
}; 