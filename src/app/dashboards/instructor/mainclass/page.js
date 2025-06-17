import ProtectedPage from "@/app/protectedRoutes";
import MainClass from "@/components/layout/main/dashboards/MainClass";


import React from "react";

const MainClasses = () => {
  return (
    <ProtectedPage>
      <main>
        
          <MainClass />
        
        
      </main>
    </ProtectedPage>
  );
};

export default MainClasses;
