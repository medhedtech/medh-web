"use client";
import SignUpForm from "@/components/shared/login/SignUpForm";
import React, { useEffect } from "react";

const SignUp = () => {
  useEffect(() => {
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';
    return () => {
      // Restore scrolling
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };
  }, []);
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <SignUpForm />
    </div>
  );
};

export default SignUp;
