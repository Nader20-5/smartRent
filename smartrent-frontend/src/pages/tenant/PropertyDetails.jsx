import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaCheckCircle,
  FaStar,
  FaArrowLeft,
  FaHeart,
  FaShare,
  FaCar,
  FaBuilding,
  FaCouch,
  FaSwimmingPool,
  FaStarHalfAlt,
  FaRegStar,
  FaParking,
  FaPhoneAlt,
  FaCalendarAlt,
  FaFileSignature,
  FaChevronLeft,
  FaUserCircle,
  FaQuoteLeft,
} from "react-icons/fa";
import { MdElevator, MdVerified } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { getPropertyById } from "../../services/propertyService";

const AMENITY_CONFIG = [
  { key: "hasParking", label: "Parking", icon: FaParking },
  { key: "hasElevator", label: "Elevator", icon: MdElevator },
  { key: "isFurnished", label: "Furnished", icon: FaCouch },
  { key: "hasPool", label: "Pool", icon: FaSwimmingPool },
];


const formatPrice = (price) =>
  `$${price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const renderStars = (score) => {
  const stars = [];
  const fullStars = Math.floor(score);
  const hasHalf = score - fullStars >= 0.25 && score - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={`full-${i}`} className="star-icon star-filled" />);
  if (hasHalf) stars.push(<FaStarHalfAlt key="half" className="star-icon star-filled" />);
  for (let i = 0; i < emptyStars; i++) stars.push(<FaRegStar key={`empty-${i}`} className="star-icon star-empty" />);
  return stars;
};

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [activeImageUrl, setActiveImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (isLoading) {
    return (
      <div className="page-wrapper container">
        <div className="loading-state" style={{ padding: "8rem 0", textAlign: "center" }}>
          <div className="spinner" style={{ width: 40, height: 40, margin: "0 auto 1rem" }} />
          <p style={{ color: "var(--color-text-muted)" }}>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="page-wrapper container">
        <div className="empty-state">
          <h3 className="empty-state-title">Property Not Found</h3>
          <p className="empty-state-text">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            <FaChevronLeft /> Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = property.images?.find((img) => img.isMain) || property.images?.[0];
  const currentImage = activeImageUrl || mainImage?.imageUrl;
  const thumbnails = property.images || [];

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* ── Breadcrumb ── */}
        <nav className="detail-breadcrumb" id="detail-breadcrumb">
          <Link to="/" className="detail-breadcrumb-link">Properties</Link>
          <span className="detail-breadcrumb-separator">/</span>
          <span className="detail-breadcrumb-current">{property.title}</span>
        </nav>

        {/* ══════════ Two-Column Layout ══════════ */}
        <div className="detail-layout">
          {/* ── LEFT COLUMN (70%) ── */}
          <div className="detail-main">
            {/* Image Gallery */}
            <section className="detail-gallery" id="detail-gallery">
              <div className="detail-gallery-main">
                <img src={currentImage} alt={property.title} className="detail-gallery-main-image" />
                <div className="property-card-tags">
                  <span className={`property-card-tag ${property.rentalStatus === 'Available' ? 'tag-success' : 'tag-info'}`}>
                    {property.rentalStatus === 'Available' && <span className="status-dot"></span>}
                    {property.rentalStatus}
                  </span>
                </div>
              </div>
              {thumbnails.length > 1 && (
                <div className="detail-gallery-thumbnails">
                  {thumbnails.map((img) => (
                    <button
                      key={img.id}
                      className={`detail-gallery-thumb ${(activeImageUrl || mainImage?.imageUrl) === img.imageUrl ? "is-active" : ""}`}
                      onClick={() => setActiveImageUrl(img.imageUrl)}
                      aria-label={`View image ${img.id}`}
                    >
                      <img src={img.imageUrl} alt={`${property.title} thumbnail`} className="detail-gallery-thumb-image" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Title & Meta */}
            <section className="detail-header" id="detail-header">
              <div className="detail-header-top">
                <h1 className="detail-title">{property.title}</h1>
                <span className="detail-type-badge">{property.propertyType}</span>
              </div>
              <p className="detail-location">
                <FaMapMarkerAlt className="detail-location-icon" /> {property.location}
              </p>
            </section>

            {/* About Section */}
            <section className="detail-about" id="detail-about">
              <h2 className="detail-section-title">About This Property</h2>
              <p className="detail-description">{property.description}</p>
            </section>

            {/* Amenities Grid */}
            <section className="detail-amenities" id="detail-amenities">
              <h2 className="detail-section-title">Amenities</h2>
              <div className="detail-amenities-grid">
                {AMENITY_CONFIG.map(({ key, label, icon: Icon }) => {
                  const isAvailable = property.amenities?.[key];
                  return (
                    <div key={key} className={`detail-amenity-card ${isAvailable ? "is-available" : "is-unavailable"}`}>
                      <Icon className="detail-amenity-card-icon" />
                      <span className="detail-amenity-card-label">{label}</span>
                      {isAvailable && <MdVerified className="detail-amenity-check" />}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Reviews Section */}
            <section className="detail-reviews" id="detail-reviews">
              <div className="detail-reviews-header">
                <h2 className="detail-section-title">Reviews</h2>
                <div className="detail-reviews-summary">
                  <div className="detail-reviews-stars">{renderStars(property.rating.averageScore)}</div>
                  <span className="detail-reviews-score">{property.rating.averageScore.toFixed(1)}</span>
                  <span className="detail-reviews-count">({property.rating.totalReviews} reviews)</span>
                </div>
              </div>

              <div className="detail-reviews-list">
                {property.reviews && property.reviews.length > 0 ? (
                  property.reviews.map((review) => (
                    <article key={review.id} className="detail-review-card">
                      <div className="detail-review-header">
                        <FaUserCircle className="detail-review-avatar-icon" style={{ fontSize: "2.5rem", color: "var(--color-text-muted)" }} />
                        <div className="detail-review-meta">
                          <span className="detail-review-author">{review.tenantFullName}</span>
                          <span className="detail-review-date">{new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                        </div>
                        <div className="detail-review-stars">{renderStars(review.rating)}</div>
                      </div>
                      <div className="detail-review-body">
                        <FaQuoteLeft className="detail-review-quote-icon" />
                        <p className="detail-review-comment">{review.comment}</p>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="empty-state" style={{ padding: "2rem 0" }}>
                    <FaRegStar style={{ fontSize: "2rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }} />
                    <p style={{ color: "var(--color-text-muted)" }}>No reviews yet for this property.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* ── RIGHT COLUMN (30%) — Sticky Booking Card ── */}
          <aside className="detail-sidebar">
            <div className="sticky-booking-card" id="sticky-booking-card">
              <div className="booking-card-price-section">
                <span className="booking-card-price">{formatPrice(property.price)}</span>
                <span className="booking-card-period">/ month</span>
              </div>
              <hr className="booking-card-divider" />
              <div className="booking-card-landlord">
                <div className="booking-card-landlord-info">
                  <span className="booking-card-landlord-name">{property.landlord.fullName}</span>
                  <span className="booking-card-landlord-role"><MdVerified className="booking-card-verified-icon" /> Verified Landlord</span>
                </div>
              </div>
              <a href={`tel:${property.landlord.phoneNumber}`} className="booking-card-phone">
                <FaPhoneAlt className="booking-card-phone-icon" /> {property.landlord.phoneNumber}
              </a>
              <hr className="booking-card-divider" />
              <div className="booking-card-actions">
                <Link to={`/book-visit/${property.id}`} className="btn btn-primary btn-lg booking-card-btn" id="book-visit-btn"><FaCalendarAlt /> Book a Visit</Link>
                <Link to={`/apply-rental/${property.id}`} className="btn btn-secondary btn-lg booking-card-btn" id="apply-rental-btn"><FaFileSignature /> Apply for Rental</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
