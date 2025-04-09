import { useState, useEffect, useRef, useCallback } from 'react';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';
import { ZoomMeetingDetails, ZoomMeetingStatus, ZoomClient, ZoomClientConfig, ZoomSignatureResponse, ZoomError } from '@/types/zoom';
import { ZoomMtg } from '@zoom/meetingsdk';
import { apiUrls } from '@/apis';
import axios, { AxiosError } from 'axios';

// Add this at the top of the file
const isClient = typeof window !== 'undefined';

/**
 * Default Zoom configuration using environment variables
 */
const ZOOM_CONFIG: ZoomClientConfig = {
  sdkKey: process.env.NEXT_PUBLIC_ZOOM_SDK_KEY || '',
  sdkSecret: process.env.NEXT_PUBLIC_ZOOM_SDK_SECRET || '',
};

interface JoinMeetingParams {
  meetingNumber: string;
  userName: string;
  userEmail: string;
  passWord: string;
}

/**
 * Custom hook for managing Zoom Meeting SDK integration
 * Uses the Component View for modern embedded experience
 */
export const useZoomClient = () => {
  const [client, setClient] = useState<ZoomClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ZoomError | null>(null);
  const [currentMeeting, setCurrentMeeting] = useState<string | null>(null);
  const [meetingDetails, setMeetingDetails] = useState<ZoomMeetingDetails | null>(null);
  const clientRef = useRef<any>(null);
  const rootElementRef = useRef<string | null>(null);

  useEffect(() => {
    const initializeZoomClient = async () => {
      try {
        // Make sure React is loaded first
        if (typeof window !== 'undefined' && !window.React) {
          // Load React if not already loaded
          const reactScript = document.createElement('script');
          reactScript.src = 'https://unpkg.com/react@17/umd/react.production.min.js';
          reactScript.async = true;
          document.body.appendChild(reactScript);
          
          // Wait for React to load before loading Zoom SDK
          await new Promise((resolve) => {
            reactScript.onload = resolve;
          });
        }
        
        // Load Zoom Web SDK
        const script = document.createElement('script');
        script.src = 'https://source.zoom.us/2.18.0/zoom-meeting-2.18.0.min.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = async () => {
          try {
            // @ts-ignore - Zoom types are not available
            const zoomClient = window.ZoomMtgEmbed;
            if (!zoomClient) {
              throw new Error('Zoom client not found');
            }

            // Initialize Zoom client
            zoomClient.setZoomJSLib('https://source.zoom.us/2.18.0/lib', '/av');
            zoomClient.preLoadWasm();
            zoomClient.prepareJssdk();

            // Set language
            zoomClient.setLanguage('en-US');

            setClient(zoomClient);
            setIsInitialized(true);
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Zoom client';
            setError({ code: 'ZOOM_INIT_ERROR', message: errorMessage });
          }
        };

        script.onerror = () => {
          setError({ code: 'ZOOM_LOAD_ERROR', message: 'Failed to load Zoom SDK' });
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Zoom client';
        setError({ code: 'ZOOM_INIT_ERROR', message: errorMessage });
      }
    };

    initializeZoomClient();

    return () => {
      // Cleanup
      if (client) {
        client.leaveMeeting();
      }
    };
  }, []);

  const joinMeeting = useCallback(async (meetingNumber: string, userName: string, userEmail: string, role: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post<ZoomMeetingDetails>(apiUrls.zoom.signature, {
        meetingNumber,
        userName,
        userEmail,
        role
      });

      setMeetingDetails(response.data);
      return response.data;
    } catch (err) {
      const error: ZoomError = {
        code: err instanceof Error ? err.message : 'UNKNOWN_ERROR',
        message: err instanceof Error ? err.message : 'An unknown error occurred'
      };
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const leaveMeeting = useCallback(() => {
    if (client && isInitialized) {
      client.leaveMeeting();
    }
  }, [client, isInitialized]);

  const resetState = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setMeetingDetails(null);
  }, []);

  return {
    isInitialized,
    error,
    meetingDetails,
    joinMeeting,
    leaveMeeting,
    resetState,
    isLoading
  };
}; 