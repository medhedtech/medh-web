import { Metadata } from 'next';
import { notFound } from "next/navigation";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { ZoomMeetingDetails } from "@/components/layout/main/zoom/ZoomMeetingDetails";
import { Meeting } from "@/types/meetings";
// import meetings from "../../../../public/fakedata/meetings.json";

export const metadata: Metadata = {
  title: "Zoom Meeting Details | Medh - Education LMS Template",
  description: "View your scheduled Zoom live class details and join with one click",
  keywords: ["zoom meeting", "live class", "virtual classroom", "online education"],
};

interface ZoomMeetingDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function ZoomMeetingDetailsPage({ params }: ZoomMeetingDetailsPageProps) {
  // Ensure we have the id
  const { id } = params;
  
  if (!id) {
    return notFound();
  }
  
  // Find the meeting details from our data source
  // Convert the JSON data to match our Meeting interface
  const meetingDetails = (meetings as any[])?.find(
    (meeting) => meeting.id.toString() === id
  );
  
  // Handle case when meeting is not found
  if (!meetingDetails) {
    return notFound();
  }
  
  // Transform the data to match our Meeting interface
  const transformedMeeting: Meeting = {
    id: meetingDetails.id.toString(),
    title: meetingDetails.title,
    description: meetingDetails.description,
    startTime: meetingDetails.startTime,
    endTime: meetingDetails.endTime,
    host: meetingDetails.host,
    hostEmail: meetingDetails.hostEmail || `${meetingDetails.host.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    meetingNumber: meetingDetails.meetingNumber || meetingDetails.id.toString(),
    joinUrl: meetingDetails.meetingLink || `https://zoom.us/j/${meetingDetails.id}`,
    password: meetingDetails.password,
    course: meetingDetails.course,
    status: meetingDetails.status || 'upcoming',
    participants: meetingDetails.participants || 0
  };
  
  return (
    <PageWrapper>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ZoomMeetingDetails 
          meeting={transformedMeeting} 
        />
      </main>
    </PageWrapper>
  );
} 