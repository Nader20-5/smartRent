import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  FaChartLine, 
  FaBuilding, 
  FaCalendarAlt, 
  FaClipboardList, 
  FaSignOutAlt,
  FaHome
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">
          <FaBuilding className="logo-icon" /> Prophoria
        </h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/landlord/dashboard" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FaChartLine /> Dashboard
        </NavLink>
        <NavLink to="/landlord/properties" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FaBuilding /> My Properties
        </NavLink>
        <NavLink to="/landlord/visits" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FaCalendarAlt /> Visit Requests
        </NavLink>
        <NavLink to="/landlord/rentals" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FaClipboardList /> Rental Requests
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/" className="sidebar-link sidebar-link-ghost" title="Back to Public Site">
           <FaHome /> Back to Site
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link sidebar-logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
