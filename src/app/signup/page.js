"use client";
import SignUpForm from "@/components/shared/login/SignUpForm";
import React from "react";

const SignUp = () => {
  return (
    <div className="overflow-y-auto h-screen md:overflow-y-visible md:h-auto fixed inset-0 w-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <SignUpForm />
    </div>
  );
};

export default SignUp;
