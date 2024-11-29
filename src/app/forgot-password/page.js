import ForgotPassword from "@/components/sections/forgot-password";
import ThemeController from "@/components/shared/others/ThemeController";

export const metadata = {
  title: "Forgot-Password",
  description: "Forgot password screen",
};
const Forgot_Password = () => {
  return (
    <main>
      <ForgotPassword />
      <ThemeController />
    </main>
  );
};

export default Forgot_Password;
