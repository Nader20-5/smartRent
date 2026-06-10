import React, { useState, useEffect, useRef } from "react";
import {
  FaUserCircle,
  FaCamera,
  FaEnvelope,
  FaPhoneAlt,
  FaUser,
  FaSave,
  FaShieldAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaUserTag,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { getProfile, uploadProfilePicture, updateProfile } from "../../services/userService";
import "../../styles/profile.css";

const Profile = () => {
  const { user: authUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", phoneNumber: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      
      // Split full name into first and last
      const nameParts = (data.fullName || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setFormData({
        firstName,
        lastName,
        phoneNumber: data.phoneNumber || "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);

    setIsUploading(true);
    try {
      const data = await uploadProfilePicture(fd);
      setProfile((prev) => ({ ...prev, profileImage: data.profileImage }));
      
      // Update global auth user state so navbar updates
      if (authUser) {
        updateUser({ ...authUser, profileImage: data.profileImage });
      }
      
      toast.success("Profile picture updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload profile picture.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const updatedProfile = await updateProfile({
        fullName,
        phoneNumber: formData.phoneNumber
      });
      setProfile(updatedProfile);

      // Update global auth user state so navbar updates
      if (authUser) {
        updateUser({ 
          ...authUser, 
          fullName: updatedProfile.fullName,
          profileImage: updatedProfile.profileImage 
        });
      }

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="profile-page-wrapper">
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container-new">
        
        {/* Banner Header */}
        <header className="profile-banner">
          <div className="banner-avatar-wrapper">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt={profile.fullName} className="banner-avatar" />
            ) : (
              <div className="banner-avatar-placeholder"><FaUserCircle /></div>
            )}
            <button 
              className={`banner-edit-overlay ${isUploading ? "is-loading" : ""}`}
              onClick={handlePictureClick}
              disabled={isUploading}
            >
              <FaCamera />
            </button>
            <input type="file" ref={fileInputRef} className="hidden-input" accept="image/*" onChange={handleFileChange} />
          </div>
          
          <div className="banner-info">
            <h1 className="banner-name">{profile.fullName}</h1>
            <span className="banner-email">{profile.email}</span>
            <div className="banner-badges">
              <span className="badge-new badge-role"><FaUserTag /> {profile.role}</span>
              <span className="badge-new badge-status"><FaShieldAlt /> ACTIVE</span>
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <div className="profile-content-grid">
          
          {/* Left: Personal Information Card */}
          <section className="card-new">
            <div className="card-header-new">
              <FaUser />
              <h2>Personal Information</h2>
            </div>
            <div className="card-body-new">
              <form onSubmit={handleSubmit}>
                <div className="form-row-new">
                  <div className="form-group-new">
                    <label className="label-new">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      className="input-new"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="e.g. John"
                      required
                    />
                  </div>
                  <div className="form-group-new">
                    <label className="label-new">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      className="input-new"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="e.g. Doe"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-new" style={{ marginBottom: '24px' }}>
                  <label className="label-new">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phoneNumber"
                    className="input-new"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+1 234 567 890"
                  />
                </div>

                <button type="submit" className="save-btn-new" disabled={isSaving}>
                  {isSaving ? "Saving..." : <><FaSave /> Save Changes</>}
                </button>
              </form>
            </div>
          </section>

          {/* Right: Account Details Card */}
          <section className="card-new">
            <div className="card-header-new">
              <FaShieldAlt />
              <h2>Account Details</h2>
            </div>
            <div className="card-body-new">
              <div className="details-list-new">
                
                <div className="detail-item-new">
                  <div className="detail-icon-wrapper"><FaEnvelope /></div>
                  <div className="detail-content">
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value">{profile.email}</span>
                  </div>
                </div>

                <div className="detail-item-new">
                  <div className="detail-icon-wrapper"><FaPhoneAlt /></div>
                  <div className="detail-content">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{profile.phoneNumber || "Not set"}</span>
                  </div>
                </div>

                <div className="detail-item-new">
                  <div className="detail-icon-wrapper"><FaUserTag /></div>
                  <div className="detail-content">
                    <span className="detail-label">Role</span>
                    <span className="detail-value role-text">{profile.role}</span>
                  </div>
                </div>

                <div className="detail-item-new">
                  <div className="detail-icon-wrapper"><FaCheckCircle /></div>
                  <div className="detail-content">
                    <span className="detail-label">Account Status</span>
                    <span className="detail-value status-text">Active</span>
                  </div>
                </div>

                <div className="detail-item-new">
                  <div className="detail-icon-wrapper"><FaCalendarAlt /></div>
                  <div className="detail-content">
                    <span className="detail-label">Member Since</span>
                    <span className="detail-value">{formatDate(profile.createdAt)}</span>
                  </div>
                </div>

              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Profile;
