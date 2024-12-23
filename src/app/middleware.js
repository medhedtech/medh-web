// middleware.js
import jwtDecode from "jwt-decode";
import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  
  // Middleware only for cookie-based handling
  // const token = req.cookies.get("token");
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found in cookies. Redirecting to login.");
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded);

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.log("Token expired. Redirecting to login.");
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Role-based access control check for specific routes
    const userRole = decoded.user.role[0];
    if (
      url.pathname.startsWith("/dashboards/admin-dashboard") &&
      userRole !== "admin"
    ) {
      console.log("Unauthorized access. Redirecting to /unauthorized.");
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}