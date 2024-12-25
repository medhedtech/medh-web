import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

export const validateToken = () => {
  const token = Cookies.get("token") || localStorage.getItem("token");

  if (token) {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      // Token expired, clear storage
      Cookies.remove("token");
      Cookies.remove("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      return false;
    }
  }

  return true;
};
