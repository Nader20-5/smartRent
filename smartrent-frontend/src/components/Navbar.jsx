import React from "react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  
  // Hide the global navbar on pages that have their own integrated navigation
  const hiddenPaths = ["/login", "/register", "/", "/admin/dashboard", "/landlord/dashboard"];
  
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  return <div>Navbar Component</div>;
};

export default Navbar;
