import ZoomMeetingDetailsMain from "@/components/layout/main/ZoomMeetingDetailsMain";


import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import meetings from "@/../public/fakedata/meetings.json";
import { notFound } from "next/navigation";
export const metadata = {
  title: "Zoom Meetings Details | Medh - Education LMS Template",
  description: "Zoom Meetings Details | Medh - Education LMS Template",
};
const Zoom_Meetings_Details = ({ params }) => {
  const { id } = params;
  const isExistMettings = meetings?.find(({ id: id1 }) => id1 === parseInt(id));
  if (!isExistMettings) {
    notFound();
  }
  return (
    <PageWrapper>
      <main>
        <ZoomMeetingDetailsMain />
        
      </main>
    </PageWrapper>
  );
};
export async function generateStaticParams() {
  return meetings?.map(({ id }) => ({ id: id.toString() }));
}
export default Zoom_Meetings_Details;
