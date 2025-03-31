import { notFound } from "next/navigation";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ZoomMeetingDetails from "@/components/layout/main/zoom/ZoomMeetingDetails";
import meetings from "@/../public/fakedata/meetings.json";

export const metadata = {
  title: "Zoom Meeting Details | Medh - Education LMS Template",
  description: "View your scheduled Zoom live class details and join with one click",
};

const ZoomMeetingDetailsPage = ({ params }) => {
  const { id } = params;
  
  // Find the meeting details from our data source
  const meetingDetails = meetings?.find(({ id: meetingId }) => meetingId === parseInt(id));
  
  // Handle case when meeting is not found
  if (!meetingDetails) {
    notFound();
  }
  
  return (
    <PageWrapper>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ZoomMeetingDetails meetingId={id} meetingDetails={meetingDetails} />
      </main>
    </PageWrapper>
  );
};

export default ZoomMeetingDetailsPage;
