import ProtectedPage from "@/app/protectedRoutes";
import DemoClasses from "@/components/layout/main/dashboards/DemoClasses";


export const metadata = {
  title: "Demo Class",
  description: "Demo Class",
};
const Demo_Class = () => {
  return (
    <ProtectedPage>
      <main>
        
          <DemoClasses />
        
        
      </main>
    </ProtectedPage>
  );
};

export default Demo_Class;
