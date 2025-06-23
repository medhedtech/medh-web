import Home1 from "@/components/layout/main/Home1";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { NextPage } from "next";

const TestPage: NextPage = () => {
  return (
    <PageWrapper>
      <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-[2100px] mx-auto w-full">
          <Home1 />
        </div>
      </div>
    </PageWrapper>
  );
};

export default TestPage;
