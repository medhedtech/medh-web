"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  Calendar, 
  Users, 
  Link, 
  Video, 
  Copy, 
  ExternalLink, 
  CheckCircle, 
  X, 
  Play, 
  AlertCircle,
  FileText,
  ArrowLeft,
  Check
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Meeting } from "@/types/meetings";
import { useZoomClient } from "@/hooks/useZoomClient";
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Separator } from '../../../../components/ui/separator';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from "react-hot-toast";

interface ZoomMeetingDetailsProps {
  meeting: Meeting;
  onClose: () => void;
}

export const ZoomMeetingDetails: React.FC<ZoomMeetingDetailsProps> = ({
  meeting,
  onClose,
}) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const { isLoading, error, joinMeeting, resetState } = useZoomClient();
  
  // Parse meeting date/time - memoize to prevent recalculation
  const meetingDate = React.useMemo(() => new Date(meeting.startTime), [meeting.startTime]);
  
  const formattedDate = React.useMemo(() => meetingDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }), [meetingDate]);
  
  const formattedTime = React.useMemo(() => {
    return meetingDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }, [meetingDate]);
  
  // Calculate time remaining
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const startTime = new Date(meeting.startTime);
      const endTime = new Date(meeting.endTime);
      
      if (now < startTime) {
        const diff = startTime.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `Starts in ${hours}h ${minutes}m`;
      } else if (now > endTime) {
        return 'Meeting ended';
      } else {
        const diff = endTime.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `Ends in ${hours}h ${minutes}m`;
      }
    };

    setTimeRemaining(calculateTimeRemaining());
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [meeting.startTime, meeting.endTime]);

  const handleJoinMeeting = async () => {
    try {
      resetState();
      await joinMeeting(
        meeting.meetingNumber,
        meeting.host,
        meeting.hostEmail,
        0 // 0 for attendee, 1 for host
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join meeting';
      console.error('Failed to join meeting:', {
        error: err,
        message: errorMessage,
        meetingId: meeting.id,
        meetingNumber: meeting.meetingNumber
      });
      showToast.error(errorMessage);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(meeting.joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy meeting link:', err);
    }
  };

  const handleClose = () => {
    router.back();
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-900/50';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-900/50';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <Play className="w-4 h-4" />;
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto p-4"
    >
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={handleClose}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to meetings</span>
        </Button>
      </div>
      
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <Badge 
                variant="outline" 
                className={cn(
                  "mb-3 bg-white/20 text-white border-white/30",
                  getStatusColor(meeting.status)
                )}
              >
                <span className="flex items-center gap-1">
                  {getStatusIcon(meeting.status)}
                  <span className="capitalize">{meeting.status}</span>
                </span>
              </Badge>
              <h1 className="text-2xl font-bold mb-2">{meeting.title}</h1>
              <p className="text-white/80">{formattedDate} at {formattedTime}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/80">{timeRemaining}</div>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Host</h3>
                  <p className="font-medium">{meeting.host}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-full">
                  <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Meeting ID</h3>
                  <p className="font-medium">{meeting.meetingNumber}</p>
                </div>
              </div>
              
              {meeting.password && (
                <div className="flex items-start gap-3">
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-full">
                    <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Password</h3>
                    <p className="font-medium">{meeting.password}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {meeting.course && (
                <div className="flex items-start gap-3">
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-full">
                    <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Course</h3>
                    <p className="font-medium">{meeting.course}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full">
                  <Calendar className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                  <p className="font-medium">
                    {new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(meeting.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              
              {meeting.participants !== undefined && (
                <div className="flex items-start gap-3">
                  <div className="bg-teal-50 dark:bg-teal-900/20 p-2 rounded-full">
                    <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Participants</h3>
                    <p className="font-medium">{meeting.participants} attendees</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {meeting.description && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{meeting.description}</p>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="p-6 bg-gray-50 dark:bg-gray-900/50 flex flex-col sm:flex-row gap-3 justify-between">
          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Check className="w-4 h-4" />
            <span>{copied ? 'Copied!' : 'Copy Meeting Link'}</span>
          </Button>
          <Button
            onClick={handleJoinMeeting}
            disabled={isLoading}
            className="flex items-center gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            <Video className="w-4 h-4" />
            <span>{isLoading ? 'Joining...' : 'Join Meeting'}</span>
          </Button>
        </CardFooter>
      </Card>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-md flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error.message || 'An unexpected error occurred'}</span>
        </motion.div>
      )}
    </motion.div>
  );
}; 