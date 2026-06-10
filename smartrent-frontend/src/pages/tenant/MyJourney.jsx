import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaCalendarAlt, 
  FaFileAlt, 
  FaMapMarkerAlt, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaArrowRight,
  FaHome,
  FaExclamationCircle
} from "react-icons/fa";
import { toast } from "react-toastify";
import { getMyVisits } from "../../services/visitService";
import { getMyApplications } from "../../services/rentalService";
import "../../styles/my-journey.css";

const MyJourney = () => {
  const [activeTab, setActiveTab] = useState("visits"); // 'visits' or 'applications'
  const [visits, setVisits] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [visitsRes, appsRes] = await Promise.all([
        getMyVisits(),
        getMyApplications()
      ]);
      
      // Accessing .data (ServiceResult) then .data (PagedResult) then .items
      setVisits(visitsRes?.data?.items || []);
      setApplications(appsRes?.data?.items || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your journey data.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "status-pending";
      case "approved": return "status-approved";
      case "rejected": return "status-rejected";
      case "cancelled": return "status-cancelled";
      default: return "status-pending";
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="journey-page-wrapper">
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="journey-page-wrapper">
      <div className="journey-container">
        
        {/* Page Header */}
        <header className="journey-header">
          <div className="journey-title-area">
            <h1>My Journey</h1>
            <p>Track your path to finding the perfect home.</p>
          </div>
          <div className="journey-stats">
            <div className="stat-box">
              <span className="stat-value">{visits.length}</span>
              <span className="stat-label">Visit Requests</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{applications.length}</span>
              <span className="stat-label">Rental Apps</span>
            </div>
          </div>
        </header>

        {/* Navigation tabs */}
        <div className="journey-tabs">
          <button 
            className={`journey-tab ${activeTab === "visits" ? "active" : ""}`}
            onClick={() => setActiveTab("visits")}
          >
            <FaCalendarAlt /> Visits
          </button>
          <button 
            className={`journey-tab ${activeTab === "applications" ? "active" : ""}`}
            onClick={() => setActiveTab("applications")}
          >
            <FaFileAlt /> Applications
          </button>
        </div>

        {/* Main list content */}
        <div className="journey-content">
          {activeTab === "visits" ? (
            visits.length > 0 ? (
              <div className="journey-list">
                {visits.map((visit) => (
                  <article key={visit.id} className="journey-card horizontal">
                    <div className="card-content">
                      <div className="card-main-info">
                        <div className="card-header-flex">
                          <h3 className="card-title">{visit.propertyTitle}</h3>
                          <span className={`card-status-badge ${getStatusClass(visit.status)}`}>
                            {visit.status}
                          </span>
                        </div>
                        <div className="card-location">
                          <FaMapMarkerAlt /> {visit.propertyLocation}
                        </div>
                      </div>
                      
                      <div className="card-meta-grid">
                        <div className="detail-item">
                          <span className="detail-label">Visit Date</span>
                          <span className="detail-value">{formatDate(visit.requestedDate)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Message</span>
                          <span className="detail-value">{visit.message || "No message"}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Requested</span>
                          <span className="detail-value">{formatDate(visit.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="card-action-side">
                      <Link to={`/property/${visit.propertyId}`} className="btn-journey btn-view-details">
                        View <FaArrowRight />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="journey-empty">
                <FaCalendarAlt className="empty-icon" />
                <h3>No visits found</h3>
                <p>You haven't requested any property visits yet.</p>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <FaHome /> Browse Properties
                </Link>
              </div>
            )
          ) : (
            applications.length > 0 ? (
              <div className="journey-list">
                {applications.map((app) => (
                  <article key={app.id} className="journey-card horizontal">
                    <div className="card-content">
                      <div className="card-main-info">
                        <div className="card-header-flex">
                          <h3 className="card-title">{app.propertyTitle}</h3>
                          <span className={`card-status-badge ${getStatusClass(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="card-location">
                          <FaMapMarkerAlt /> {app.propertyLocation || "N/A"}
                        </div>
                      </div>

                      <div className="card-meta-grid">
                        <div className="detail-item">
                          <span className="detail-label">Applied On</span>
                          <span className="detail-value">{formatDate(app.createdAt)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Proposed Rent</span>
                          <span className="detail-value">${app.proposedRent}/mo</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Application ID</span>
                          <span className="detail-value">#{app.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="card-action-side">
                      <Link to={`/property/${app.propertyId}`} className="btn-journey btn-view-details">
                        View <FaArrowRight />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="journey-empty">
                <FaFileAlt className="empty-icon" />
                <h3>No applications found</h3>
                <p>You haven't applied for any properties yet.</p>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <FaHome /> Browse Properties
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MyJourney;
