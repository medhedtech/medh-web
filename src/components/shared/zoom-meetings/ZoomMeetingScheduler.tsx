'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Users, Video, CalendarDays, Clock } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createZoomMeetingCalendarEvent } from "@/services/calendar";
import { toast } from "react-hot-toast";
import axios from "axios";

interface ZoomMeetingSchedulerProps {
  onScheduled?: (meetingDetails: any) => void;
  defaultTitle?: string;
  defaultDuration?: number;
  defaultDate?: Date;
  isHost?: boolean;
}

export const ZoomMeetingScheduler: React.FC<ZoomMeetingSchedulerProps> = ({
  onScheduled,
  defaultTitle = "",
  defaultDuration = 60,
  defaultDate = new Date(),
  isHost = true,
}) => {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(defaultDate);
  const [startTime, setStartTime] = useState("10:00");
  const [duration, setDuration] = useState(defaultDuration.toString());
  const [attendees, setAttendees] = useState("");
  const [calendarProvider, setCalendarProvider] = useState<"google" | "outlook">("google");
  const [isScheduling, setIsScheduling] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Calculate end time based on start time and duration
  const getEndTime = (): string => {
    if (!startTime) return "";
    
    const [hours, minutes] = startTime.split(":").map(Number);
    const durationMinutes = parseInt(duration);
    
    const endMinutes = (minutes + durationMinutes) % 60;
    const hoursToAdd = Math.floor((minutes + durationMinutes) / 60);
    const endHours = (hours + hoursToAdd) % 24;
    
    return `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
  };

  const scheduleMeeting = async () => {
    if (!title || !date || !startTime || !duration) {
      showToast.error("Please fill all required fields");
      return;
    }

    try {
      setIsScheduling(true);

      // 1. Create a Zoom meeting via your backend API
      const meetingResponse = await axios.post("/api/zoom/create-meeting", {
        topic: title,
        agenda: description,
        startTime: formatDateTime(date, startTime),
        duration: parseInt(duration),
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          auto_recording: "cloud",
        },
      });

      const { id: meetingId, join_url: joinUrl, password } = meetingResponse.data;

      // 2. Get the attendee list
      const parsedAttendees = attendees
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email)
        .map((email) => ({ email }));

      // 3. Set up the calendar event details
      const [hours, minutes] = startTime.split(":").map(Number);
      const startDateTime = new Date(date!);
      startDateTime.setHours(hours, minutes, 0, 0);

      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + parseInt(duration));

      const calendarEvent = {
        title,
        description,
        startTime: startDateTime,
        endTime: endDateTime,
        attendees: parsedAttendees,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      // 4. Get access token for calendar integration
      // Note: In a real implementation, this would be securely handled through your backend
      const tokenResponse = await axios.get(`/api/auth/${calendarProvider}-token`);
      const accessToken = tokenResponse.data.access_token;

      // 5. Create the calendar event with Zoom meeting details
      await createZoomMeetingCalendarEvent(
        calendarProvider,
        accessToken,
        calendarEvent,
        {
          meetingId,
          joinUrl,
          password,
        }
      );

      showToast.success("Meeting scheduled successfully!");

      // 6. Call the onScheduled callback with meeting details
      if (onScheduled) {
        onScheduled({
          id: meetingId,
          title,
          description,
          date: formatDate(date!),
          startTime,
          duration: parseInt(duration),
          joinUrl,
          password,
        });
      }

      // Reset form
      resetForm();
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      showToast.error("Failed to schedule meeting");
    } finally {
      setIsScheduling(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate(new Date());
    setStartTime("10:00");
    setDuration("60");
    setAttendees("");
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return format(date, "PPP");
  };

  // Format date and time for API
  const formatDateTime = (date: Date, time: string): string => {
    const [hours, minutes] = time.split(":").map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes, 0, 0);
    return dateTime.toISOString();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-primary-600" />
          Schedule Zoom Meeting
        </CardTitle>
        <CardDescription>
          Create a new Zoom meeting and add it to your calendar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Meeting Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Meeting Title</Label>
          <Input
            id="title"
            placeholder="Weekly Team Meeting"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Meeting Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Discuss project updates and upcoming tasks..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? formatDate(date) : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date);
                    setIsDatePickerOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              End Time: {getEndTime()}
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="90">1.5 hours</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Attendees */}
        <div className="space-y-2">
          <Label htmlFor="attendees">
            Attendees (Optional, comma-separated)
          </Label>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <Input
              id="attendees"
              placeholder="user@example.com, another@example.com"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Add email addresses of people you want to invite
          </div>
        </div>

        {/* Calendar Integration */}
        <div className="space-y-2">
          <Label>Add to Calendar</Label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="google-calendar"
                name="calendar"
                value="google"
                checked={calendarProvider === "google"}
                onChange={() => setCalendarProvider("google")}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <Label htmlFor="google-calendar" className="text-sm font-normal">
                Google Calendar
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="outlook-calendar"
                name="calendar"
                value="outlook"
                checked={calendarProvider === "outlook"}
                onChange={() => setCalendarProvider("outlook")}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <Label htmlFor="outlook-calendar" className="text-sm font-normal">
                Outlook Calendar
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
        <Button
          variant="outline"
          onClick={resetForm}
          disabled={isScheduling}
          className="w-full sm:w-auto"
        >
          Reset
        </Button>
        <Button
          onClick={scheduleMeeting}
          disabled={isScheduling || !title || !date || !startTime || !duration}
          className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700"
        >
          {isScheduling ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Scheduling...
            </>
          ) : (
            <>
              <CalendarDays className="mr-2 h-4 w-4" />
              Schedule Meeting
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ZoomMeetingScheduler; 