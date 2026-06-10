import React, { useState, useMemo } from "react";
import {
  FaBuilding,
  FaCheckCircle,
  FaClock,
  FaChartPie,
  FaCalendarAlt,
  FaFileSignature,
  FaUserCheck,
  FaEye,
  FaTimesCircle,
} from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import PropertyCard from "../../components/PropertyCard";
import NotificationBell from "../../components/NotificationBell";
import { useAuth } from "../../context/AuthContext";
import { getMyProperties, deleteProperty } from "../../services/propertyService";
import { getNotifications } from "../../services/notificationService";

const getActivityStyles = (type = '', title = '') => {
  const t = `${type} ${title}`.toLowerCase();
  if (t.includes('visit')) return { icon: FaEye, color: 'activity-visit' };
  if (t.includes('rental') || t.includes('application')) return { icon: FaFileSignature, color: 'activity-rental' };
  if (t.includes('approv')) return { icon: FaCheckCircle, color: 'activity-approval' };
  if (t.includes('tenant') || t.includes('move')) return { icon: FaUserCheck, color: 'activity-tenant' };
  return { icon: FaBuilding, color: 'activity-default' };
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return `${Math.max(seconds, 0)} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months !== 1 ? 's' : ''} ago`;
};

const LandlordDashboard = () => {
  const [activeTab, setActiveTab] = useState("activity");
  const [properties, setProperties] = useState([]);
  const [activities, setActivities] = useState([]);
  const { token } = useAuth();

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [propsData, notifData] = await Promise.all([
          getMyProperties(),
          getNotifications()
        ]);
        setProperties(propsData?.data || propsData || []);
        setActivities(notifData?.items || notifData || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };
    fetchDashboardData();
  }, []);

  // ── Derive stats from properties data ──
  const stats = useMemo(() => {
    const total = properties.length;
    const approved = properties.filter((p) => p.isApproved).length;
    const pending = properties.filter((p) => !p.isApproved && p.isActive).length;
    const rejected = properties.filter((p) => !p.isApproved && !p.isActive).length;
    const occupancyRate =
      total > 0 ? Math.round((approved / total) * 100) : 0;

    return { total, approved, pending, rejected, occupancyRate };
  }, [properties]);

  const handleDeleteProperty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteProperty(id);
      fetchProperties(); // Refresh list and stats
    } catch (err) {
      console.error("Failed to delete property:", err);
      const msg = err.response?.data?.message || "Failed to delete property. Please try again.";
      alert(msg);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        {/* ── Page Header ── */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">
              Welcome back! Here's an overview of your property portfolio.
            </p>
          </div>
          {token && <NotificationBell token={token} />}
        </div>

        {/* ══════ Stats Row ══════ */}
        <div className="stats-row" id="stats-row">
          <div className="stat-card stat-card-total">
            <div className="stat-card-icon-wrapper">
              <FaBuilding className="stat-card-icon" />
            </div>
            <div className="stat-card-body">
              <span className="stat-card-value">{stats.total}</span>
              <span className="stat-card-label">Total Assets</span>
            </div>
          </div>

          <div className="stat-card stat-card-approved">
            <div className="stat-card-icon-wrapper">
              <FaCheckCircle className="stat-card-icon" />
            </div>
            <div className="stat-card-body">
              <span className="stat-card-value">{stats.approved}</span>
              <span className="stat-card-label">Approved</span>
            </div>
          </div>

          <div className="stat-card stat-card-pending">
            <div className="stat-card-icon-wrapper">
              <FaClock className="stat-card-icon" />
            </div>
            <div className="stat-card-body">
              <span className="stat-card-value">{stats.pending}</span>
              <span className="stat-card-label">Pending</span>
            </div>
          </div>

          <div className="stat-card stat-card-rejected">
            <div className="stat-card-icon-wrapper">
              <FaTimesCircle className="stat-card-icon" />
            </div>
            <div className="stat-card-body">
              <span className="stat-card-value">{stats.rejected}</span>
              <span className="stat-card-label">Rejected</span>
            </div>
          </div>

          <div className="stat-card stat-card-occupancy">
            <div className="stat-card-icon-wrapper">
              <FaChartPie className="stat-card-icon" />
            </div>
            <div className="stat-card-body">
              <span className="stat-card-value">{stats.occupancyRate}%</span>
              <span className="stat-card-label">Occupancy</span>
            </div>
          </div>
        </div>

        {/* ══════ Tab Navigation ══════ */}
        <div className="dashboard-tabs" id="dashboard-tabs">
          <button
            className={`dashboard-tab ${
              activeTab === "activity" ? "is-active" : ""
            }`}
            onClick={() => setActiveTab("activity")}
          >
            Recent Activity
          </button>
          <button
            className={`dashboard-tab ${
              activeTab === "properties" ? "is-active" : ""
            }`}
            onClick={() => setActiveTab("properties")}
          >
            My Properties
          </button>
        </div>

        {/* ══════ Tab Content: Recent Activity ══════ */}
        {activeTab === "activity" && (
          <section className="activity-timeline" id="activity-timeline">
            {activities.length > 0 ? (
              activities.map((event, index) => {
                const { icon: EventIcon, color } = getActivityStyles(event.type, event.title);
                return (
                  <div
                    key={event.id || index}
                    className={`activity-item ${color}`}
                  >
                    <div className="activity-item-dot">
                      <EventIcon className="activity-item-dot-icon" />
                    </div>
                    <div className="activity-item-content">
                      <p className="activity-item-title">{event.title}</p>
                      <span className="activity-item-property">
                        {event.message}
                      </span>
                      <span className="activity-item-time">{formatTimeAgo(event.createdAt)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="empty-state-text" style={{ padding: '2rem', textAlign: 'center' }}>
                No recent activity found.
              </p>
            )}
          </section>
        )}

        {/* ══════ Tab Content: My Properties ══════ */}
        {activeTab === "properties" && (
          <section className="dashboard-properties" id="dashboard-properties">
            <div className="property-grid">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  variant="landlord"
                  onDelete={handleDeleteProperty}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default LandlordDashboard;
