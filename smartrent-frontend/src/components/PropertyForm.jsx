import React, { useState, useRef, useEffect } from "react";
import {
  FaBuilding,
  FaHome,
  FaHotel,
  FaDoorOpen,
  FaParking,
  FaSwimmingPool,
  FaCouch,
  FaCloudUploadAlt,
  FaTimesCircle,
  FaImage,
  FaTrashAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaLayerGroup,
} from "react-icons/fa";
import { MdElevator } from "react-icons/md";

const PROPERTY_TYPES = [
  { value: "Apartment", label: "Apartment", icon: FaBuilding },
  { value: "House", label: "House", icon: FaHome },
  { value: "Villa", label: "Villa", icon: FaHotel },
  { value: "Studio", label: "Studio", icon: FaDoorOpen },
];

const AMENITY_TOGGLES = [
  { key: "hasParking", label: "Parking", icon: FaParking },
  { key: "hasElevator", label: "Elevator", icon: MdElevator },
  { key: "isFurnished", label: "Furnished", icon: FaCouch },
  { key: "hasPool", label: "Pool", icon: FaSwimmingPool },
];

const PropertyForm = ({ 
  initialData = null, 
  onSubmit, 
  submitting = false,
  submitMsg = null,
  buttonText = "Submit"
}) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "Apartment",
    price: "",
    location: "",
    bedrooms: "",
    baths: "",
    area: "",
    floor: "",
    amenities: {
      hasParking: false,
      hasElevator: false,
      isFurnished: false,
      hasPool: false,
    },
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        propertyType: initialData.propertyType || "Apartment",
        price: String(initialData.price || ""),
        location: initialData.location || "",
        bedrooms: String(initialData.bedrooms || ""),
        baths: String(initialData.baths || ""),
        area: String(initialData.area || ""),
        floor: initialData.floor != null ? String(initialData.floor) : "",
        amenities: initialData.amenities || {
          hasParking: false,
          hasElevator: false,
          isFurnished: false,
          hasPool: false,
        },
      });
      setExistingImages(initialData.images || []);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (type) => {
    setFormData((prev) => ({ ...prev, propertyType: type }));
  };

  const handleAmenityToggle = (key) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [key]: !prev.amenities[key],
      },
    }));
  };

  const processFiles = (files) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const newImages = validFiles.map((file) => ({
      file,
      id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      previewUrl: URL.createObjectURL(file),
    }));
    setNewImageFiles((prev) => [...prev, ...newImages]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragActive(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragActive(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files?.length > 0) processFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files?.length > 0) {
      processFiles(e.target.files);
      e.target.value = "";
    }
  };

  const removeExistingImage = (id) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
  };

  const removeNewImage = (id) => {
    setNewImageFiles((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleSubmitInternal = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      existingImages,
      newImages: newImageFiles
    });
  };

  return (
    <form className="add-property-form" onSubmit={handleSubmitInternal}>
      {/* Basic Info */}
      <section className="form-section">
        <h2 className="form-section-title">Basic Information</h2>
        <div className="form-section-body">
          <div className="form-group">
            <label className="form-label">Property Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. The Glass House Residency"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              placeholder="Describe your property in detail..."
              rows={5}
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </section>

      {/* Property Type */}
      <section className="form-section">
        <h2 className="form-section-title">Property Type</h2>
        <div className="form-section-body">
          <div className="type-selector-grid">
            {PROPERTY_TYPES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                className={`type-selector-card ${formData.propertyType === value ? "is-selected" : ""}`}
                onClick={() => handleTypeSelect(value)}
              >
                <Icon className="type-selector-icon" />
                <span className="type-selector-label">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Price & Location */}
      <section className="form-section">
        <h2 className="form-section-title">Price & Location</h2>
        <div className="form-section-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Monthly Price ($)</label>
              <input
                type="number"
                name="price"
                className="form-input"
                placeholder="e.g. 4500"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Location / Address</label>
              <input
                type="text"
                name="location"
                className="form-input"
                placeholder="e.g. 88 Skyline Boulevard"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="form-section">
        <h2 className="form-section-title">Property Details</h2>
        <div className="form-section-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label"><FaBed style={{marginRight: 6}} /> Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                className="form-input"
                min="0"
                value={formData.bedrooms}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label"><FaBath style={{marginRight: 6}} /> Bathrooms</label>
              <input
                type="number"
                name="baths"
                className="form-input"
                min="0"
                value={formData.baths}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label"><FaRulerCombined style={{marginRight: 6}} /> Area (sq ft)</label>
              <input
                type="number"
                name="area"
                className="form-input"
                min="1"
                value={formData.area}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label"><FaLayerGroup style={{marginRight: 6}} /> Floor (optional)</label>
              <input
                type="number"
                name="floor"
                className="form-input"
                min="0"
                value={formData.floor}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="form-section">
        <h2 className="form-section-title">Amenities</h2>
        <div className="form-section-body">
          <div className="amenity-toggles-grid">
            {AMENITY_TOGGLES.map(({ key, label, icon: Icon }) => (
              <div key={key} className="amenity-toggle">
                <div className="amenity-toggle-info">
                  <Icon className="amenity-toggle-icon" />
                  <span className="amenity-toggle-label">{label}</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  className={`amenity-switch ${formData.amenities[key] ? "is-on" : ""}`}
                  onClick={() => handleAmenityToggle(key)}
                >
                  <span className="amenity-switch-thumb" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="form-section">
        <h2 className="form-section-title">Property Images</h2>
        <div className="form-section-body">
          {existingImages.length > 0 && (
            <div className="edit-existing-images" style={{ marginBottom: 20 }}>
              <label className="form-label">Current Images</label>
              <div className="image-preview-grid">
                {existingImages.map((img) => (
                  <div key={img.id} className="image-preview-item">
                    <img src={img.imageUrl} alt="Property" className="image-preview-thumb" />
                    <button type="button" className="image-preview-remove" onClick={() => removeExistingImage(img.id)}>
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            className={`image-dropzone ${isDragActive ? "is-drag-active" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <FaCloudUploadAlt className="image-dropzone-icon" />
            <p className="image-dropzone-text">Drag & drop images here, or <span className="image-dropzone-browse">browse</span></p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="image-dropzone-input"
              onChange={handleFileInputChange}
            />
          </div>

          {newImageFiles.length > 0 && (
            <div className="image-preview-grid" style={{ marginTop: 20 }}>
              {newImageFiles.map((img) => (
                <div key={img.id} className="image-preview-item">
                  <img src={img.previewUrl} alt="Preview" className="image-preview-thumb" />
                  <button type="button" className="image-preview-remove" onClick={(e) => { e.stopPropagation(); removeNewImage(img.id); }}>
                    <FaTimesCircle />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Feedback & Submit */}
      {submitMsg && (
        <div className={`add-property-alert ${submitMsg.type}`} style={{
          padding: "12px 20px", borderRadius: "12px", marginBottom: "16px",
          display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: 500,
          background: submitMsg.type === "success" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
          color: submitMsg.type === "success" ? "#059669" : "#dc2626",
          border: `1px solid ${submitMsg.type === "success" ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
        }}>
          {submitMsg.text}
        </div>
      )}

      <div className="add-property-submit">
        <button type="submit" className="btn btn-primary btn-lg add-property-submit-btn" disabled={submitting}>
          {submitting ? "Processing..." : buttonText}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;
