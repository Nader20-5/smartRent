import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getPendingLandlords,
  approveLandlord,
  rejectLandlord,
  getPendingProperties,
  approveProperty,
  rejectProperty,
  getDashboardStats,
  getAllUsers,
  getAllProperties,
  toggleUserStatus,
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
  const [allUsers, setAllUsers] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeLandlords: 0,
    totalProperties: 0,
    pendingApprovals: 0,
  });
  
  const [loading, setLoading] = useState(true);

  // Tabs
  const [activeTab, setActiveTab] = useState("dashboard");

  // Alert
  const [alert, setAlert] = useState(null);

  // Action in progress
  const [actionInProgress, setActionInProgress] = useState(null);

  // Removing row animation
  const [removingId, setRemovingId] = useState(null);

  // ─── Fetch Data ─────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [landlordData, pendingPropData, statsData, usersData, allPropsData] = await Promise.all([
        getPendingLandlords(),
        getPendingProperties(),
        getDashboardStats(),
        getAllUsers(1, 100),
        getAllProperties(1, 100),
      ]);
      setLandlords(Array.isArray(landlordData) ? landlordData : []);
      setProperties(Array.isArray(pendingPropData) ? pendingPropData : []);
      setStats(statsData || { totalUsers: 0, activeLandlords: 0, totalProperties: 0, pendingApprovals: 0 });
      setAllUsers(usersData?.items || []);
      setAllProperties(Array.isArray(allPropsData) ? allPropsData : []);
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

  // ─── Actions ───────────────────────
  const handleApproveLandlord = async (id, name) => {
    setActionInProgress(`approve-landlord-${id}`);
    try {
      await approveLandlord(id);
      setRemovingId(`landlord-${id}`);
      setTimeout(() => {
        setLandlords((prev) => prev.filter((l) => l.id !== id));
        setRemovingId(null);
        setAlert({ type: "success", message: `Landlord "${name}" successfully approved.` });
        fetchData(); // refresh stats quietly
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
        fetchData(); // refresh stats quietly
      }, 350);
    } catch (error) {
      setAlert({ type: "error", message: `Failed to reject landlord "${name}".` });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleApproveProperty = async (id, title) => {
    setActionInProgress(`approve-property-${id}`);
    try {
      await approveProperty(id);
      setRemovingId(`property-${id}`);
      setTimeout(() => {
        setProperties((prev) => prev.filter((p) => p.id !== id));
        setRemovingId(null);
        setAlert({ type: "success", message: `Property "${title}" successfully approved.` });
        fetchData();
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
        fetchData();
      }, 350);
    } catch (error) {
      setAlert({ type: "error", message: `Failed to reject property "${title}".` });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleToggleUserStatus = async (id, name) => {
    setActionInProgress(`toggle-user-${id}`);
    try {
      await toggleUserStatus(id);
      setAllUsers((prev) => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
      setAlert({ type: "success", message: `User "${name}" status toggled successfully.` });
    } catch (error) {
      setAlert({ type: "error", message: `Failed to toggle status for user "${name}".` });
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="admin-layout">
      {/* ═══════════════════════════════════
          SIDEBAR
      ═══════════════════════════════════ */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">SmartRent</div>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
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

          <button
            className={`sidebar-nav-item ${activeTab === "landlords" ? "active" : ""}`}
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

          <button
            className={`sidebar-nav-item ${activeTab === "properties" ? "active" : ""}`}
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

          <div className="sidebar-divider"></div>
          <div className="sidebar-section-label">Management</div>

          <button 
            className={`sidebar-nav-item ${activeTab === "all-users" ? "active" : ""}`} 
            onClick={() => setActiveTab("all-users")}
            id="sidebar-all-users"
          >
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

          <button 
            className={`sidebar-nav-item ${activeTab === "all-properties" ? "active" : ""}`} 
            onClick={() => setActiveTab("all-properties")}
            id="sidebar-all-properties"
          >
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

        {/* ─── Stats Row (Only visible on Dashboard or Pending Tabs) ─────────────────── */}
        {(activeTab === "dashboard" || activeTab === "landlords" || activeTab === "properties") && (
          <div className="admin-stats">
            <div className="stat-card green">
              <div className="stat-label">Total Users</div>
              <div className="stat-number">{stats.totalUsers}</div>
              <div className="stat-sub green">
                <span className="stat-sub-icon">📈</span> Live DB Stats
              </div>
            </div>

            <div className="stat-card teal">
              <div className="stat-label">Active Landlords</div>
              <div className="stat-number">{stats.activeLandlords}</div>
              <div className="stat-sub teal">
                <span className="stat-sub-icon">✅</span> Live DB Stats
              </div>
            </div>

            <div className="stat-card navy">
              <div className="stat-label">Total Properties</div>
              <div className="stat-number">{stats.totalProperties}</div>
              <div className="stat-sub navy">
                <span className="stat-sub-icon">🏠</span> Live DB Stats
              </div>
            </div>

            <div className="stat-card red">
              <div className="stat-label">Pending Approvals</div>
              <div className="stat-number">{stats.pendingApprovals}</div>
              <div className="stat-sub red">
                <span className="stat-sub-icon">⚠️</span> Requires Action
              </div>
            </div>
          </div>
        )}

        {/* ─── Alert ──────────────────── */}
        {alert && (
          <div className={`admin-alert ${alert.type}`} id="admin-alert">
            <span className="admin-alert-icon">
              {alert.type === "success" ? "✅" : "❌"}
            </span>
            <span className="admin-alert-text">{alert.message}</span>
            <button className="admin-alert-close" onClick={() => setAlert(null)}>×</button>
          </div>
        )}

        {/* ─── Table Content ───────────── */}
        <div className="admin-table-container">
          {loading ? (
            <div className="admin-loading">
              <div className="admin-loading-spinner"></div>
              <div className="admin-loading-text">Loading dynamic data...</div>
            </div>
          ) : activeTab === "dashboard" ? (
             <div className="admin-empty">
                <div className="admin-empty-icon">📊</div>
                <div className="admin-empty-text">Welcome to the Admin Dashboard</div>
                <div className="admin-empty-sub">Overview of the system health and key metrics. Navigate via sidebar.</div>
             </div>
          ) : activeTab === "landlords" ? (
            landlords.length === 0 ? (
              <div className="admin-empty">
                <div className="admin-empty-icon">✅</div>
                <div className="admin-empty-text">No pending landlords</div>
                <div className="admin-empty-sub">All registration requests have been reviewed.</div>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
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
                      <tr key={landlord.id} className={removingId === `landlord-${landlord.id}` ? "row-removing" : ""}>
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
                            <button className="btn-approve" onClick={() => handleApproveLandlord(landlord.id, landlord.fullName)} disabled={!!actionInProgress}>Approve</button>
                            <button className="btn-reject" onClick={() => handleRejectLandlord(landlord.id, landlord.fullName)} disabled={!!actionInProgress}>Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : activeTab === "properties" ? (
            properties.length === 0 ? (
              <div className="admin-empty">
                <div className="admin-empty-icon">🏠</div>
                <div className="admin-empty-text">No pending properties</div>
                <div className="admin-empty-sub">All property listings have been reviewed.</div>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Location</th>
                      <th>Price</th>
                      <th>Landlord</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property) => (
                      <tr key={property.id} className={removingId === `property-${property.id}` ? "row-removing" : ""}>
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
                         <td><span className="table-price">{formatPrice(property.price)}</span></td>
                         <td>{property.landlord?.fullName || "—"}</td>
                         <td>
                           <div className="admin-actions">
                             <button className="btn-approve" onClick={() => handleApproveProperty(property.id, property.title)} disabled={!!actionInProgress}>Approve</button>
                             <button className="btn-reject" onClick={() => handleRejectProperty(property.id, property.title)} disabled={!!actionInProgress}>Reject</button>
                           </div>
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : activeTab === "all-users" ? (
            <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Approved</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((u) => (
                      <tr key={u.id}>
                         <td>
                           <div>
                             <div className="table-name">{u.fullName}</div>
                             <div className="table-id">ID: #{u.id}</div>
                           </div>
                         </td>
                         <td>{u.email}</td>
                         <td>{u.role}</td>
                         <td><span className={u.isActive ? "status-badge active" : "status-badge inactive"}>{u.isActive ? "Active" : "Inactive"}</span></td>
                         <td>{u.isApproved ? "Yes" : "No"}</td>
                         <td>
                           <div className="admin-actions">
                             <button 
                                className={u.isActive ? "btn-reject" : "btn-approve"} 
                                onClick={() => handleToggleUserStatus(u.id, u.fullName)} 
                                disabled={!!actionInProgress}
                              >
                               {u.isActive ? "Deactivate" : "Activate"}
                             </button>
                           </div>
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          ) : activeTab === "all-properties" ? (
             <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Status</th>
                      <th>Price</th>
                      <th>Landlord</th>
                      <th>Visibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allProperties.map((p) => (
                      <tr key={p.id}>
                         <td>
                           <div>
                             <div className="table-property-title">{p.title}</div>
                             <div className="table-property-id">ID: #PR-{p.id}</div>
                           </div>
                         </td>
                         <td>{p.rentalStatus}</td>
                         <td>{formatPrice(p.price)}</td>
                         <td>{p.landlord?.fullName || "—"}</td>
                          <td>
                            <span style={{ fontSize: "12px", padding: "4px 8px", borderRadius: "12px", background: p.isActive ? "#dcfce7" : "#fee2e2", color: p.isActive ? "#166534" : "#991b1b" }}>
                              {p.isActive ? "Visible" : "Hidden"}
                            </span>
                            <span style={{ marginLeft: "8px", fontSize: "12px", padding: "4px 8px", borderRadius: "12px",
                              background: p.isApproved ? "#dcfce7" : (!p.isActive ? "#fee2e2" : "#fef3c7"),
                              color: p.isApproved ? "#166534" : (!p.isActive ? "#991b1b" : "#92400e")
                            }}>
                              {p.isApproved ? "Approved" : (!p.isActive ? "Rejected" : "Pending")}
                            </span>
                          </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
