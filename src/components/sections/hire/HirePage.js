import React from "react";
import Hire from "./Hire";

const HirePage = () => {
  try {
    return (
      <div>
        <Hire
          hireTitle="Hire from Medh"
          hireText="Recruit industry-trained, job-ready top talents to meet your business needs through our placement services."
          hireButtonText="Recruit@Medh"
          hireBackground="#EDE6FF"
          hireButtonColor="black"
          hireButtonTextColor="white"
          trainingTitle="Corporate Training"
          trainingText="Enhance your employees' skills, motivation, and engagement with our dynamic Training Courses."
          trainingButtonText="Empower Your Team"
          trainingBackgroundColor="#FFEAF3"
          trainingTextColor="black"
          trainingButtonColor="black"
          trainingButtonTextColor="white"
        />
      </div>
    );
  } catch (error) {
    console.error("Error rendering HirePage:", error);
    return <div>Error loading the page.</div>;
  }
};

export default HirePage;
