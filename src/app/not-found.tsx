import ErrorMain from "@/components/layout/main/ErrorMain";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import { NextPage } from "next";

const NotFoundPage: NextPage = () => {
  return (
    <PageWrapper>
      <main>
        <ErrorMain />
      </main>
    </PageWrapper>
  );
};

export default NotFoundPage; 