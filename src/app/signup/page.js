import SignupMain from "@/components/layout/main/signupMain";
import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Signup/Register",
  description: "Signup/Register",
};
const Signup = () => {
  return (
    <PageWrapper>
      <main>
        <SignupMain />  
        <ThemeController />
      </main>
    </PageWrapper>
  );
};

export default Signup;
