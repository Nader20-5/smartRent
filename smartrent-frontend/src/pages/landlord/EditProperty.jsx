import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import { getPropertyById, updateProperty, uploadPropertyImages } from "../../services/propertyService";
import PropertyForm from "../../components/PropertyForm";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);
  
  useEffect(() => {
    const fetchProp = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProp();
  }, [id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setSubmitMsg(null);

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        propertyType: formData.propertyType,
        price: Number(formData.price),
        location: formData.location,
        bedrooms: Number(formData.bedrooms),
        baths: Number(formData.baths),
        area: Number(formData.area),
        floor: formData.floor !== "" ? Number(formData.floor) : null,
        hasParking: formData.amenities.hasParking,
        hasElevator: formData.amenities.hasElevator,
        isFurnished: formData.amenities.isFurnished,
        hasPool: formData.amenities.hasPool,
      };

      await updateProperty(id, updateData);

      if (formData.newImages.length > 0) {
        const imgForm = new FormData();
        formData.newImages.forEach((img) => imgForm.append("images", img.file));
        await uploadPropertyImages(id, imgForm);
      }

      setSubmitMsg({ type: "success", text: "Property updated successfully!" });
      setTimeout(() => navigate("/landlord/properties"), 1500);
    } catch (err) {
      console.error("Failed to update property:", err);
      const msg = err.response?.data?.message || "Failed to update property. Please try again.";
      setSubmitMsg({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  if (!property) return <div className="page-wrapper"><div className="container">Loading...</div></div>;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="add-property-page">
          <Link to="/landlord/properties" className="edit-property-back-link">
            <FaChevronLeft /> Back to My Properties
          </Link>

          <div className="add-property-header">
            <h1 className="add-property-title">Edit Property</h1>
            <p className="add-property-subtitle">Update the details for "{property.title}"</p>
          </div>

          <PropertyForm 
            initialData={property} 
            onSubmit={handleSubmit} 
            submitting={submitting} 
            submitMsg={submitMsg}
            buttonText="Save Changes"
          />
        </div>
      </div>
    </div>
  );
};

export default EditProperty;
