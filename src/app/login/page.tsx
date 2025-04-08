import LoginMain from "@/components/layout/main/LoginMain";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Login",
  description: "Login",
};

const Login = () => {
  return (
    // <PageWrapper>
      <main>
        <LoginMain />  
      </main>
    // </PageWrapper>
  );
};

export default Login;
