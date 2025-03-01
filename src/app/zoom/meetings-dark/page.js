import ZoomMeetingsMain from "@/components/layout/main/ZoomMeetingsMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Zoom Meetings - Dark | Medh - Education LMS Template",
  description: "Zoom Meetings - Dark | Medh - Education LMS Template",
};
const Zoom_Meetings_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <ZoomMeetingsMain />
        
      </main>
    </PageWrapper>
  );
};

export default Zoom_Meetings_Dark;
