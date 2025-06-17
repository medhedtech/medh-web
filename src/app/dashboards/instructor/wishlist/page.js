import ProtectedPage from "@/app/protectedRoutes";
import InstructorWishlistMain from "@/components/layout/main/dashboards/InstructorWishlistMain";


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
          
            <InstructorWishlistMain />
          
        </DashboardWrapper>
        
      </main>
    </ProtectedPage>
  );
};

export default Instructor_Wishlist;
