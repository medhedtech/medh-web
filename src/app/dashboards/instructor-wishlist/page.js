import ProtectedPage from "@/app/protectedRoutes";
import InstructorWishlistMain from "@/components/layout/main/dashboards/InstructorWishlistMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DashboardWrapper from "@/components/shared/wrappers/DashboardWrapper";
export const metadata = {
  title: "Instructor Wishlist | Medh - Education LMS Template",
  description: "Instructor Wishlist | Medh - Education LMS Template",
};
const Instructor_Wishlist = () => {
  return (
    <ProtectedPage>
      <main>
        <DashboardWrapper>
          <DashboardContainer>
            <InstructorWishlistMain />
          </DashboardContainer>
        </DashboardWrapper>
        
      </main>
    </ProtectedPage>
  );
};

export default Instructor_Wishlist;
