import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import ThemeController from "@/components/shared/others/ThemeController";
import FaqContent from "./FaqContent";

export const metadata = {
  title: "Frequently Asked Questions | MEDH - Education LMS Platform",
  description: "Find answers to common questions about MEDH courses, platform, and services.",
};

const FaqPage = () => {
  return (
    <PageWrapper>
      <main>
        <FaqContent />
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default FaqPage; 