"use client";
import EditProfile from "@/components/shared/dashboards/EditProfile";
import ProfileDetails from "@/components/shared/dashboards/ProfileDetails";
import React, { useState } from "react";

const StudentProfileMain = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      {isEditing ? (
        <EditProfile onBackClick={() => setIsEditing(false)} />
      ) : (
        <ProfileDetails onEditClick={() => setIsEditing(true)} />
      )}
    </div>
  );
};

export default StudentProfileMain;
