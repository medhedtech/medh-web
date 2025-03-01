import ProtectedPage from "@/app/protectedRoutes";
import InstructorWishlistMain from "@/components/layout/main/dashboards/InstructorWishlistMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
export const metadata = {
  title: "Instructor Wishlist | Medh - Education LMS Template",
  description: "Instructor Wishlist | Medh - Education LMS Template",
};
const Instructor_Wishlist = () => {
  return (
    <ProtectedPage>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <InstructorWishlistMain />
          </DashboardContainer>
        </DsahboardWrapper>
        
      </main>
    </ProtectedPage>
  );
};

export default Instructor_Wishlist;
