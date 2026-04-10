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
} from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import PropertyCard from "../../components/PropertyCard";
import properties from "../../data/dummyProperties.json";

const DUMMY_ACTIVITY = [
  {
    id: 1,
    type: "visit",
    icon: FaEye,
    title: "Visit request from Sophia Martinez",
    property: "The Glass House Residency",
    time: "2 hours ago",
    color: "activity-visit",
  },
  {
    id: 2,
    type: "rental",
    icon: FaFileSignature,
    title: "Rental application from Daniel Okafor",
    property: "Emerald Crest Villa",
    time: "5 hours ago",
    color: "activity-rental",
  },
  {
    id: 3,
    type: "approval",
    icon: FaCheckCircle,
    title: "Property approved by admin",
    property: "Oakwood Family Residence",
    time: "1 day ago",
    color: "activity-approval",
  },
  {
    id: 4,
    type: "visit",
    icon: FaCalendarAlt,
    title: "Upcoming visit with Lina Chen",
    property: "The Glass House Residency",
    time: "Tomorrow at 3:00 PM",
    color: "activity-visit",
  },
  {
    id: 5,
    type: "tenant",
    icon: FaUserCheck,
    title: "New tenant moved into property",
    property: "Riverside Cottage Retreat",
    time: "3 days ago",
    color: "activity-tenant",
  },
];

const LandlordDashboard = () => {
  const [activeTab, setActiveTab] = useState("activity");

  // ── Derive stats from properties data ──
  const stats = useMemo(() => {
    const total = properties.length;
    const approved = properties.filter(
      (p) => p.rentalStatus === "Available" || p.rentalStatus === "Approved"
    ).length;
    const pending = properties.filter(
      (p) => p.rentalStatus === "Pending Approval"
    ).length;
    const occupancyRate =
      total > 0 ? Math.round((approved / total) * 100) : 0;

    return { total, approved, pending, occupancyRate };
  }, []);

  const handleDeleteProperty = (id) => {
    console.log("Delete property:", id);
    // Future: DELETE to API
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        {/* ── Page Header ── */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back! Here's an overview of your property portfolio.
          </p>
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
            {DUMMY_ACTIVITY.map((event) => {
              const EventIcon = event.icon;
              return (
                <div
                  key={event.id}
                  className={`activity-item ${event.color}`}
                >
                  <div className="activity-item-dot">
                    <EventIcon className="activity-item-dot-icon" />
                  </div>
                  <div className="activity-item-content">
                    <p className="activity-item-title">{event.title}</p>
                    <span className="activity-item-property">
                      {event.property}
                    </span>
                    <span className="activity-item-time">{event.time}</span>
                  </div>
                </div>
              );
            })}
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
