import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty } from "../../services/propertyService";
import PropertyForm from "../../components/PropertyForm";

const AddProperty = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setSubmitMsg(null);

    try {
      const fd = new FormData();
      fd.append("Title", formData.title);
      fd.append("Description", formData.description);
      fd.append("PropertyType", formData.propertyType);
      fd.append("Price", Number(formData.price));
      fd.append("Location", formData.location);
      fd.append("Bedrooms", Number(formData.bedrooms) || 0);
      fd.append("Baths", Number(formData.baths) || 0);
      fd.append("Area", Number(formData.area) || 0);
      if (formData.floor !== "") fd.append("Floor", Number(formData.floor));
      fd.append("HasParking", formData.amenities.hasParking);
      fd.append("HasElevator", formData.amenities.hasElevator);
      fd.append("IsFurnished", formData.amenities.isFurnished);
      fd.append("HasPool", formData.amenities.hasPool);

      formData.newImages.forEach((img) => {
        fd.append("Images", img.file);
      });

      await createProperty(fd);
      setSubmitMsg({ type: "success", text: "Property submitted! Pending admin approval." });
      setTimeout(() => navigate("/landlord/properties"), 1500);
    } catch (err) {
      console.error("Failed to create property:", err);
      const msg = err.response?.data?.message || "Failed to create property. Please try again.";
      setSubmitMsg({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="add-property-page">
          <div className="add-property-header">
            <h1 className="add-property-title">Add New Property</h1>
            <p className="add-property-subtitle">Fill out the details below to list your property</p>
          </div>
          <PropertyForm 
            onSubmit={handleSubmit} 
            submitting={submitting} 
            submitMsg={submitMsg}
            buttonText="Submit for Approval"
          />
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
