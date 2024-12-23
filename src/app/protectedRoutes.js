// ProtectedPage.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const ProtectedPage = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    // Check token in localStorage on page load
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found. Redirecting to login.");
      router.push("/login");
    } else {
      try {
        // Decode the token
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
          console.log("Token expired. Redirecting to login.");
          router.push("/login");
        }
      } catch (error) {
        console.error("Invalid token. Redirecting to login.", error);
        router.push("/login");
      }
    }
  }, [router]);

  // Show protected content only if token is valid
  return <>{children}</>;
};

export default ProtectedPage;
