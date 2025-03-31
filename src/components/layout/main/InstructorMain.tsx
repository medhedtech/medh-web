import React from 'react';
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import InstructorsPrimary from "@/components/sections/instructors/InstructorsPrimary";

const InstructorMain: React.FC = () => {
  return (
    <>
      <HeroPrimary path={"Instructor page"} title={"Instructor page"} />
      <InstructorsPrimary />
    </>
  );
};

export default InstructorMain;
