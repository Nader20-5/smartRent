import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaTrashAlt,
  FaHome,
} from "react-icons/fa";
import { MdSearchOff } from "react-icons/md";
import PropertyCard from "../../components/PropertyCard";
import properties from "../../data/dummyProperties.json";

const Favorites = () => {
  // Track removed favorites locally
  const [removedIds, setRemovedIds] = useState([]);

  const favoriteProperties = useMemo(() => {
    return properties
      .filter((p) => p.isFavorite)
      .filter((p) => !removedIds.includes(p.id));
  }, [removedIds]);

  const handleFavoriteToggle = (id, newState) => {
    if (!newState) {
      setRemovedIds((prev) => [...prev, id]);
    } else {
      setRemovedIds((prev) => prev.filter((rid) => rid !== id));
    }
  };

  const clearAllFavorites = () => {
    setRemovedIds(favoriteProperties.map((p) => p.id));
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* ── Header ── */}
        <div className="favorites-header">
          <div className="favorites-header-top">
            <div>
              <h1 className="favorites-title">
                <FaHeart className="favorites-title-icon" /> My Favorites
              </h1>
              <p className="favorites-subtitle">
                Properties you've saved for later
              </p>
            </div>
            {favoriteProperties.length > 0 && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={clearAllFavorites}
                id="clear-favorites-btn"
              >
                <FaTrashAlt /> Clear All
              </button>
            )}
          </div>
          <div className="favorites-count">
            <span className="favorites-count-number">
              {favoriteProperties.length}
            </span>
            <span className="favorites-count-label">
              {favoriteProperties.length === 1
                ? "saved property"
                : "saved properties"}
            </span>
          </div>
        </div>

        {/* ── Grid or Empty State ── */}
        {favoriteProperties.length > 0 ? (
          <div className="property-grid" id="favorites-grid">
            {favoriteProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={{ ...property, isFavorite: true }}
                variant="tenant"
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state" id="favorites-empty-state">
            <div className="empty-state-icon-wrapper">
              <FaRegHeart className="empty-state-icon" />
            </div>
            <h3 className="empty-state-title">No Favorites Yet</h3>
            <p className="empty-state-text">
              You haven't saved any properties to your favorites yet. Browse our
              listings and tap the heart icon on any property you love.
            </p>
            <Link to="/" className="btn btn-primary btn-lg" id="browse-btn">
              <FaHome /> Browse Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
