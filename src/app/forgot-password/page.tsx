import { Metadata } from "next";
import ForgotPasswordForm from "@/components/shared/login/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password - MEDH",
  description: "Reset your MEDH account password securely",
  keywords: ["forgot password", "reset password", "MEDH", "account recovery"],
};

const ForgotPasswordPage = (): JSX.Element => {
  return (
    <main className="min-h-screen">
      <ForgotPasswordForm />
    </main>
  );
};

export default ForgotPasswordPage; 