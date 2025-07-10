import EventDetailsMain from "@/components/layout/main/EventDetailsMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
// import events from "../../../public/fakedata/events.json";
import { notFound } from "next/navigation";
export const metadata = {
  title: "Event Details - Dark | Medh - Education LMS Template",
  description: "Event Details - Dark  | Medh - Education LMS Template",
};

const Event_details_Dark = async ({ params }) => {
  const { id } = params;
  const isExistEvent = events?.find(({ id: id1 }) => id1 === parseInt(id));
  if (!isExistEvent) {
    notFound();
  }
  return (
    <PageWrapper>
      <main className="is-dark">
        <EventDetailsMain />
        
      </main>
    </PageWrapper>
  );
};
export default Event_details_Dark;
