import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaParking,
  FaSwimmingPool,
  FaCouch,
  FaStar,
  FaEdit,
  FaTrashAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
} from "react-icons/fa";
import { MdElevator } from "react-icons/md";

const AMENITY_CONFIG = [
  { key: "hasParking", label: "Parking", icon: FaParking },
  { key: "hasElevator", label: "Elevator", icon: MdElevator },
  { key: "isFurnished", label: "Furnished", icon: FaCouch },
  { key: "hasPool", label: "Pool", icon: FaSwimmingPool },
];



// Formats property price with currency
const formatPrice = (price) => {
  return `$${price.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}/mo`;
};

const PropertyCard = ({
  property,
  variant = "tenant",
  onFavoriteToggle,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(property.isFavorite);

  const mainImage =
    property.images?.find((img) => img.isMain) || property.images?.[0];

  const activeAmenities = AMENITY_CONFIG.filter(
    (a) => property.amenities?.[a.key]
  );

  // Toggles property favorite status
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFav((prev) => !prev);
    onFavoriteToggle?.(property.id, !isFav);
  };

  // Initiates property edit workflow
  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(property.id);
    } else {
      navigate(`/landlord/properties/edit/${property.id}`);
    }
  };

  // Initiates property deletion workflow
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(property.id);
  };

  const [isAnimate, setIsAnimate] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Link
      to={`/property/${property.id}`}
      className={`property-card ${isAnimate ? "animate-in" : ""}`}
      id={`property-card-${property.id}`}
    >
      <div className="property-card-image-wrapper">
        <img
          src={mainImage?.imageUrl}
          alt={property.title}
          className="property-card-image"
          loading="lazy"
        />

        <div className="property-card-image-overlay" />

        <div className="property-card-tags">
          <span
            className={`property-card-tag ${
              property.rentalStatus === "Available" ? "tag-success" : "tag-info"
            }`}
          >
            {property.rentalStatus === "Available" && <span className="status-dot"></span>}
            {property.rentalStatus}
          </span>

          {variant === "landlord" && (
            <span
              className={`property-card-tag ${
                property.isApproved
                  ? "tag-success"
                  : !property.isActive
                  ? "tag-error"
                  : "tag-warning"
              }`}
            >
              {property.isApproved
                ? "Approved"
                : !property.isActive
                ? "Rejected"
                : "Pending"}
            </span>
          )}
        </div>

        {variant === "tenant" && (
          <button
            className={`property-card-favorite ${isFav ? "is-active" : ""}`}
            onClick={handleFavoriteClick}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            id={`favorite-btn-${property.id}`}
          >
            {isFav ? <FaHeart /> : <FaRegHeart />}
          </button>
        )}

        {property.rating && (
          <div className="property-card-rating">
            <FaStar className="property-card-star-icon" />
            <span>{property.rating.averageScore.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="property-card-content">
        <div className="property-card-header">
          <h3 className="property-card-title">{property.title}</h3>
          <span className="property-card-type">{property.propertyType}</span>
        </div>

        <p className="property-card-price">{formatPrice(property.price)}</p>

        <p className="property-card-location">
          <FaMapMarkerAlt className="property-card-pin-icon" />
          <span>{property.location}</span>
        </p>

        <div className="property-card-stats" style={{ display: 'flex', gap: '12px', margin: '10px 0', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaBed /> {property.bedrooms}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaBath /> {property.baths}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaRulerCombined /> {property.area} sqft</span>
        </div>

        {activeAmenities.length > 0 && (
          <div className="property-card-amenities">
            {activeAmenities.map(({ key, label, icon: Icon }) => (
              <span key={key} className="property-card-amenity">
                <Icon className="property-card-amenity-icon" />
                <span>{label}</span>
              </span>
            ))}
          </div>
        )}

        {variant === "landlord" && (
          <div className="property-card-actions">
            <div className="property-card-action-buttons">
              <button
                className="property-card-action-btn action-edit"
                onClick={handleEdit}
                aria-label="Edit property"
                id={`edit-btn-${property.id}`}
              >
                <FaEdit />
              </button>
              <button
                className="property-card-action-btn action-delete"
                onClick={handleDelete}
                aria-label="Delete property"
                id={`delete-btn-${property.id}`}
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default PropertyCard;
