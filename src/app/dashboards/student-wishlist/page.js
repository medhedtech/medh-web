import ProtectedPage from "@/app/protectedRoutes";
import StudentWishlistMain from "@/components/layout/main/dashboards/StudentWishlistMain";


import DashboardWrapper from "@/components/shared/wrappers/DashboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Student Wishlist | Medh - Education LMS Template",
  description: "Student Wishlist | Medh - Education LMS Template",
};
const Student_Wishlist = () => {
  return (
    <ProtectedPage>
      <PageWrapper>
        <main>
          <DashboardWrapper>
            
              <StudentWishlistMain />
            
          </DashboardWrapper>
          
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Student_Wishlist;
