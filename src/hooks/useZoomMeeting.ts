import { useState, useCallback } from 'react';
import { ZoomMeetingDetails, ZoomMeetingState, ZoomError } from '@/types/zoom';
import { initializeZoomMeeting } from '@/utils/zoomUtils';

const initialState: ZoomMeetingState = {
  isLoading: false,
  error: null,
  meetingDetails: null,
};

export const useZoomMeeting = () => {
  const [state, setState] = useState<ZoomMeetingState>(initialState);

  const joinMeeting = useCallback(async (details: ZoomMeetingDetails) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const meetingDetails = await initializeZoomMeeting(details);
      setState(prev => ({
        ...prev,
        isLoading: false,
        meetingDetails,
      }));
      return meetingDetails;
    } catch (error) {
      const zoomError: ZoomError = {
        code: 'ZOOM_ERROR',
        message: error instanceof Error ? error.message : 'Failed to initialize Zoom meeting',
      };
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: zoomError,
      }));
      throw zoomError;
    }
  }, []);

  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    joinMeeting,
    resetState,
  };
}; 