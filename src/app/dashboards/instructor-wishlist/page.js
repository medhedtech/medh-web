import InstructorWishlistMain from "@/components/layout/main/dashboards/InstructorWishlistMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import ThemeController from "@/components/shared/others/ThemeController";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Wishlist | Medh - Education LMS Template",
  description: "Instructor Wishlist | Medh - Education LMS Template",
};
const Instructor_Wishlist = () => {
  return (
    <main>
      <DsahboardWrapper>
        <DashboardContainer>
          <InstructorWishlistMain />
        </DashboardContainer>
      </DsahboardWrapper>
      <ThemeController />
    </main>
  );
};

export default Instructor_Wishlist;
