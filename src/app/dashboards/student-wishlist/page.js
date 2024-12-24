import ProtectedPage from "@/app/protectedRoutes";
import StudentWishlistMain from "@/components/layout/main/dashboards/StudentWishlistMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
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
          <DsahboardWrapper>
            <DashboardContainer>
              <StudentWishlistMain />
            </DashboardContainer>
          </DsahboardWrapper>
          <ThemeController />
        </main>
      </PageWrapper>
    </ProtectedPage>
  );
};

export default Student_Wishlist;
