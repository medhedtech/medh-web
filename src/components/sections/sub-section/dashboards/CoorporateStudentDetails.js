"use client"
import EditProfile from "@/components/shared/dashboards/EditProfile";
import ProfileDetails from "@/components/shared/dashboards/ProfileDetails";
import React, { useState } from "react";

const CoorporateStudentProfile_Detalis_01 = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      {isEditing ? (
        <div className="px-4 mt-[-20px] py-6">
          <EditProfile onBackClick={() => setIsEditing(false)} />
        </div>
      ) : (
        <ProfileDetails onEditClick={() => setIsEditing(true)} />
      )}
    </div>
  );
};

export default CoorporateStudentProfile_Detalis_01;
