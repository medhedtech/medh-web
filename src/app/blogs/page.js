import BlogsMain from "@/components/layout/main/BlogsMain";


import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Blog | Medh - Education LMS Template",
  description: "Blog | Medh - Education LMS Template",
};

const Blogs = async () => {
  return (
    <PageWrapper>
      <main>
        <BlogsMain />
        
      </main>
    </PageWrapper>
  );
};

export default Blogs;
