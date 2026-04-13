import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getPendingLandlords,
  approveLandlord,
  rejectLandlord,
  getPendingProperties,
  approveProperty,
  rejectProperty,
} from "../../services/adminService";
import "./AdminDashboard.css";

// ─── Helper: Format date ────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// ─── Helper: Format price ───────────────────────
const formatPrice = (price) => {
  if (price == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// ─── Helper: Get initials ────────────────────────
const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  // Data state
  const [landlords, setLandlords] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tabs
  const [activeTab, setActiveTab] = useState("landlords");

  // Alert
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: '' }

  // Action in progress
  const [actionInProgress, setActionInProgress] = useState(null); // "approve-{id}" or "reject-{id}"

  // Removing row animation
  const [removingId, setRemovingId] = useState(null);

  // ─── Fetch Data ─────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [landlordData, propertyData] = await Promise.all([
        getPendingLandlords(),
        getPendingProperties(),
      ]);
      setLandlords(Array.isArray(landlordData) ? landlordData : []);
      setProperties(Array.isArray(propertyData) ? propertyData : []);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Auto-dismiss alert ─────────────────────
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // ─── Landlord Actions ───────────────────────
  const handleApproveLandlord = async (id, name) => {
    setActionInProgress(`approve-landlord-${id}`);
    try {
      await approveLandlord(id);
      setRemovingId(`landlord-${id}`);
      setTimeout(() => {
        setLandlords((prev) => prev.filter((l) => l.id !== id));
        setRemovingId(null);
        setAlert({ type: "success", message: `Landlord "${name}" successfully approved.` });
      }, 350);
    } catch (error) {
      setAlert({ type: "error", message: `Failed to approve landlord "${name}".` });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleRejectLandlord = async (id, name) => {
    setActionInProgress(`reject-landlord-${id}`);
    try {
      await rejectLandlord(id);
      setRemovingId(`landlord-${id}`);
      setTimeout(() => {
        setLandlords((prev) => prev.filter((l) => l.id !== id));
        setRemovingId(null);
        setAlert({ type: "success", message: `Landlord "${name}" has been rejected.` });
      }, 350);
    } catch (error) {
      setAlert({ type: "error", message: `Failed to reject landlord "${name}".` });
    } finally {
      setActionInProgress(null);
    }
  };

  // ─── Property Actions ──────────────────────
  const handleApproveProperty = async (id, title) => {
    setActionInProgress(`approve-property-${id}`);
    try {
      await approveProperty(id);
      setRemovingId(`property-${id}`);
      setTimeout(() => {
        setProperties((prev) => prev.filter((p) => p.id !== id));
        setRemovingId(null);
        setAlert({ type: "success", message: `Property "${title}" successfully approved.` });
      }, 350);
    } catch (error) {
      setAlert({ type: "error", message: `Failed to approve property "${title}".` });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleRejectProperty = async (id, title) => {
    setActionInProgress(`reject-property-${id}`);
    try {
      await rejectProperty(id);
      setRemovingId(`property-${id}`);
      setTimeout(() => {
        setProperties((prev) => prev.filter((p) => p.id !== id));
        setRemovingId(null);
        setAlert({ type: "success", message: `Property "${title}" has been rejected.` });
      }, 350);
    } catch (error) {
      setAlert({ type: "error", message: `Failed to reject property "${title}".` });
    } finally {
      setActionInProgress(null);
    }
  };

  // ─── Stats (dynamic counts) ─────────────────
  const totalPending = landlords.length + properties.length;

  return (
    <div className="admin-layout">
      {/* ═══════════════════════════════════
          SIDEBAR
      ═══════════════════════════════════ */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">SmartRent</div>

        <nav className="sidebar-nav">
          {/* Dashboard */}
          <button
            className="sidebar-nav-item active"
            onClick={() => {}}
            id="sidebar-dashboard"
          >
            <span className="sidebar-nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </span>
            Dashboard
          </button>

          {/* Pending Landlords */}
          <button
            className={`sidebar-nav-item ${activeTab === "landlords" ? "" : ""}`}
            onClick={() => setActiveTab("landlords")}
            id="sidebar-pending-landlords"
          >
            <span className="sidebar-nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            Pending Landlords
            {landlords.length > 0 && (
              <span className="sidebar-badge blue">{landlords.length}</span>
            )}
          </button>

          {/* Pending Properties */}
          <button
            className={`sidebar-nav-item`}
            onClick={() => setActiveTab("properties")}
            id="sidebar-pending-properties"
          >
            <span className="sidebar-nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </span>
            Pending Properties
            {properties.length > 0 && (
              <span className="sidebar-badge orange">{properties.length}</span>
            )}
          </button>

          {/* Divider + Management Section */}
          <div className="sidebar-divider"></div>
          <div className="sidebar-section-label">Management</div>

          {/* All Users */}
          <button className="sidebar-nav-item" id="sidebar-all-users">
            <span className="sidebar-nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </span>
            All Users
          </button>

          {/* All Properties */}
          <button className="sidebar-nav-item" id="sidebar-all-properties">
            <span className="sidebar-nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="6" width="22" height="16" rx="2"/>
                <path d="M1 10h22"/>
                <path d="M12 6V2"/>
                <path d="M7 2h10"/>
              </svg>
            </span>
            All Properties
          </button>
        </nav>

        {/* Logout */}
        <div className="sidebar-bottom">
          <button className="sidebar-logout" onClick={logout} id="sidebar-logout">
            <span className="sidebar-nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </span>
            Logout
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════ */}
      <main className="admin-main">
        {/* ─── Top Bar ──────────────────── */}
        <div className="admin-topbar">
          <div className="admin-topbar-left">
            <h1>Admin Dashboard</h1>
            <p>System overview and verification requests.</p>
          </div>
          <div className="admin-topbar-right">
            {/* Bell */}
            <div className="topbar-bell" id="topbar-notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="topbar-bell-dot"></span>
            </div>
            {/* User */}
            <div className="topbar-user">
              <div className="topbar-user-info">
                <div className="topbar-user-name">{user?.fullName || "Admin"}</div>
                <div className="topbar-user-role">System Admin</div>
              </div>
              <div className="topbar-avatar">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.fullName} />
                ) : (
                  getInitials(user?.fullName || "Admin")
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Stats Row ─────────────────── */}
        <div className="admin-stats">
          <div className="stat-card green">
            <div className="stat-label">Total Users</div>
            <div className="stat-number">12,482</div>
            <div className="stat-sub green">
              <span className="stat-sub-icon">📈</span> 12% inc.
            </div>
          </div>

          <div className="stat-card teal">
            <div className="stat-label">Active Landlords</div>
            <div className="stat-number">843</div>
            <div className="stat-sub teal">
              <span className="stat-sub-icon">✅</span> +5 this week
            </div>
          </div>

          <div className="stat-card navy">
            <div className="stat-label">Total Properties</div>
            <div className="stat-number">3,120</div>
            <div className="stat-sub navy">
              <span className="stat-sub-icon">🏠</span> 89% Occupied
            </div>
          </div>

          <div className="stat-card red">
            <div className="stat-label">Pending Approvals</div>
            <div className="stat-number">{totalPending}</div>
            <div className="stat-sub red">
              <span className="stat-sub-icon">⚠️</span> Requires Action
            </div>
          </div>
        </div>

        {/* ─── Tabs ───────────────────── */}
        <div className="admin-tabs-container">
          <div className="admin-tabs">
            <button
              className={`admin-tab ${activeTab === "landlords" ? "active" : ""}`}
              onClick={() => setActiveTab("landlords")}
              id="tab-pending-landlords"
            >
              Pending Landlords
              <span className={`tab-badge ${activeTab === "landlords" ? "dark" : "gray"}`}>
                {landlords.length}
              </span>
            </button>
            <button
              className={`admin-tab ${activeTab === "properties" ? "active" : ""}`}
              onClick={() => setActiveTab("properties")}
              id="tab-pending-properties"
            >
              Pending Properties
              <span className={`tab-badge ${activeTab === "properties" ? "dark" : "gray"}`}>
                {properties.length}
              </span>
            </button>
          </div>
        </div>

        {/* ─── Alert ──────────────────── */}
        {alert && (
          <div className={`admin-alert ${alert.type}`} id="admin-alert">
            <span className="admin-alert-icon">
              {alert.type === "success" ? (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="11" fill="#16a34a"/>
                  <path d="M7 11.5l3 3 5-5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="11" fill="#dc2626"/>
                  <path d="M11 6.5v5M11 14.5v.5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
            </span>
            <span className="admin-alert-text">{alert.message}</span>
            <button
              className="admin-alert-close"
              onClick={() => setAlert(null)}
              aria-label="Close alert"
            >
              ×
            </button>
          </div>
        )}

        {/* ─── Table Content ───────────── */}
        <div className="admin-table-container">
          {loading ? (
            <div className="admin-loading">
              <div className="admin-loading-spinner"></div>
              <div className="admin-loading-text">Loading data...</div>
            </div>
          ) : activeTab === "landlords" ? (
            /* ─── Landlords Table ─── */
            landlords.length === 0 ? (
              <div className="admin-empty">
                <div className="admin-empty-icon">✅</div>
                <div className="admin-empty-text">No pending landlords</div>
                <div className="admin-empty-sub">All landlord registrations have been reviewed.</div>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table" id="landlords-table">
                  <thead>
                    <tr>
                      <th>Landlord</th>
                      <th>Contact Info</th>
                      <th>Registered Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {landlords.map((landlord) => (
                      <tr
                        key={landlord.id}
                        className={removingId === `landlord-${landlord.id}` ? "row-removing" : ""}
                      >
                        <td>
                          <div className="table-landlord-cell">
                            <div className="table-avatar">
                              {landlord.profileImage ? (
                                <img src={landlord.profileImage} alt={landlord.fullName} />
                              ) : (
                                getInitials(landlord.fullName)
                              )}
                            </div>
                            <div>
                              <div className="table-name">{landlord.fullName}</div>
                              <div className="table-id">ID: #LD-{landlord.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="table-contact-email">{landlord.email}</div>
                          <div className="table-contact-phone">{landlord.phoneNumber || "—"}</div>
                        </td>
                        <td>
                          <div className="table-date">{formatDate(landlord.createdAt)}</div>
                        </td>
                        <td>
                          <div className="admin-actions">
                            <button
                              className="btn-approve"
                              onClick={() => handleApproveLandlord(landlord.id, landlord.fullName)}
                              disabled={!!actionInProgress}
                              id={`approve-landlord-${landlord.id}`}
                            >
                              {actionInProgress === `approve-landlord-${landlord.id}` ? "..." : "Approve"}
                            </button>
                            <button
                              className="btn-reject"
                              onClick={() => handleRejectLandlord(landlord.id, landlord.fullName)}
                              disabled={!!actionInProgress}
                              id={`reject-landlord-${landlord.id}`}
                            >
                              {actionInProgress === `reject-landlord-${landlord.id}` ? "..." : "Reject"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            /* ─── Properties Table ─── */
            properties.length === 0 ? (
              <div className="admin-empty">
                <div className="admin-empty-icon">🏠</div>
                <div className="admin-empty-text">No pending properties</div>
                <div className="admin-empty-sub">All property listings have been reviewed.</div>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table" id="properties-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Location</th>
                      <th>Price</th>
                      <th>Type</th>
                      <th>Landlord</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property) => (
                      <tr
                        key={property.id}
                        className={removingId === `property-${property.id}` ? "row-removing" : ""}
                      >
                        <td>
                          <div className="table-property-cell">
                            <div className="table-property-icon">🏢</div>
                            <div>
                              <div className="table-property-title">{property.title}</div>
                              <div className="table-property-id">ID: #PR-{property.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>{property.location || "—"}</td>
                        <td>
                          <span className="table-price">{formatPrice(property.price)}</span>
                        </td>
                        <td>
                          <span className="table-type-badge">{property.propertyType}</span>
                        </td>
                        <td>{property.landlord?.fullName || "—"}</td>
                        <td>
                          <div className="admin-actions">
                            <button
                              className="btn-approve"
                              onClick={() => handleApproveProperty(property.id, property.title)}
                              disabled={!!actionInProgress}
                              id={`approve-property-${property.id}`}
                            >
                              {actionInProgress === `approve-property-${property.id}` ? "..." : "Approve"}
                            </button>
                            <button
                              className="btn-reject"
                              onClick={() => handleRejectProperty(property.id, property.title)}
                              disabled={!!actionInProgress}
                              id={`reject-property-${property.id}`}
                            >
                              {actionInProgress === `reject-property-${property.id}` ? "..." : "Reject"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>

        {/* ─── Warning Alert (always visible) ── */}
        <div className="admin-warning" id="admin-warning-latency">
          <span className="admin-warning-icon">⚠️</span>
          <div>
            <div className="admin-warning-title">System Latency Detected</div>
            <div className="admin-warning-text">
              Background verification API is taking longer than usual to respond.
              Verification may be delayed.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
