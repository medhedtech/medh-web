
import AdvisoryBoard from "@/components/sections/team/advisoryBoard";
import DynamicTeam from "@/components/sections/team/dynamicTeam";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Our Team | Medh - Education LMS Platform",
  description: "Meet our dynamic team and advisory board members at Medh. Learn about the experts and professionals driving innovation in education technology.",
  keywords: "Medh team, advisory board, education experts, EdTech professionals, leadership team",
};

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <PageWrapper>
        <DynamicTeam />
        <AdvisoryBoard />
        
      </PageWrapper>
    </main>
  );
}
