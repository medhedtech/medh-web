"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

// Types
interface IProtectedPageProps {
  children: ReactNode;
}

interface IDecodedToken {
  exp: number;
  iat?: number;
  [key: string]: any;
}

const ProtectedPage: React.FC<IProtectedPageProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token: string | null = localStorage.getItem("token");

    if (!token) {
      console.log("No token found. Redirecting to login.");
      router.push("/login");
    } else {
      try {
        const decoded: IDecodedToken = jwtDecode(token);
        const currentTime: number = Math.floor(Date.now() / 1000);
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