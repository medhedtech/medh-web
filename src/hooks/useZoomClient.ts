import { useState, useEffect } from 'react';
import { ZoomMeetingDetails, ZoomMeetingStatus, ZoomClient, ZoomClientConfig } from '@/types/zoom';

const ZOOM_CONFIG: ZoomClientConfig = {
  apiKey: process.env.NEXT_PUBLIC_ZOOM_API_KEY || '',
  apiSecret: process.env.NEXT_PUBLIC_ZOOM_API_SECRET || '',
  sdkKey: process.env.NEXT_PUBLIC_ZOOM_SDK_KEY || '',
  sdkSecret: process.env.NEXT_PUBLIC_ZOOM_SDK_SECRET || '',
};

export const useZoomClient = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [ZoomMtg, setZoomMtg] = useState<any>(null);

  useEffect(() => {
    // Only import and initialize Zoom on the client side
    if (typeof window !== 'undefined' && !isInitialized && !error) {
      import('@zoom/meetingsdk').then((ZoomMtgModule) => {
        setZoomMtg(ZoomMtgModule);
        initializeZoom(ZoomMtgModule);
      }).catch(err => {
        setError(err instanceof Error ? err : new Error('Failed to load Zoom SDK'));
        console.error('Failed to load Zoom SDK:', err);
      });
    }
  }, [isInitialized, error]);

  const initializeZoom = async (ZoomMtgInstance: any) => {
    try {
      // Initialize Zoom client
      ZoomMtgInstance.init({
        zoomAppRoot: document.getElementById('zmmtg-root'),
        language: 'en-US',
        customize: {
          meetingInfo: ['topic', 'host', 'mn', 'pwd', 'telPwd', 'invite', 'participant', 'dc', 'enctype'],
          toolbar: {
            buttons: [
              {
                text: 'Custom Button',
                className: 'CustomButton',
                onClick: () => {
                  console.log('custom button');
                }
              }
            ]
          }
        }
      });

      setIsInitialized(true);
      console.log('Zoom initialized successfully');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize Zoom'));
      console.error('Failed to initialize Zoom:', err);
    }
  };

  const zoomClient: ZoomClient = {
    isInitialized,
    
    init: async (config: ZoomClientConfig) => {
      if (!ZoomMtg) throw new Error('Zoom SDK not loaded');
      try {
        await ZoomMtg.init({
          ...config,
          zoomAppRoot: document.getElementById('zmmtg-root'),
          language: 'en-US',
        });
        setIsInitialized(true);
      } catch (err) {
        throw new Error('Failed to initialize Zoom client');
      }
    },

    getMeetingStatus: async (meetingId: string): Promise<ZoomMeetingStatus> => {
      try {
        const response = await fetch(`/api/zoom/meeting-status/${meetingId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch meeting status');
        }
        
        const data = await response.json();
        return data.status;
      } catch (err) {
        console.error('Error fetching meeting status:', err);
        return 'not_started';
      }
    },

    joinMeeting: async ({ meetingNumber, joinUrl, password }: ZoomMeetingDetails) => {
      if (!isInitialized || !ZoomMtg) {
        throw new Error('Zoom client not initialized');
      }

      try {
        // Generate signature from backend
        const response = await fetch('/api/zoom/generate-signature', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            meetingNumber,
            role: 0, // 0 for attendee, 1 for host
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate signature');
        }

        const { signature } = await response.json();

        return new Promise((resolve, reject) => {
          ZoomMtg.join({
            signature,
            meetingNumber,
            userName: 'Test User', // TODO: Get from user context
            sdkKey: ZOOM_CONFIG.sdkKey,
            password: password,
            success: (success: any) => {
              console.log('Joined meeting successfully:', success);
              resolve(success);
            },
            error: (error: any) => {
              console.error('Failed to join meeting:', error);
              reject(error);
            },
          });
        });
      } catch (err) {
        console.error('Error joining meeting:', err);
        throw err;
      }
    },

    leaveMeeting: async () => {
      if (!isInitialized || !ZoomMtg) {
        throw new Error('Zoom client not initialized');
      }

      ZoomMtg.leaveMeeting({
        success: () => {
          console.log('Left meeting successfully');
        },
        error: (error: any) => {
          console.error('Failed to leave meeting:', error);
          throw error;
        },
      });
    },
  };

  return { zoomClient, isInitialized, error };
};

export default useZoomClient; 