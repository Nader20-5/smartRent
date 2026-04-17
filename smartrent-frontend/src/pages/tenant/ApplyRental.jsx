import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createRentalApplication } from '../../services/visitService';
import { toast } from 'react-toastify';

const ApplyRental = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    occupation: '',
    monthlyIncome: '',
    message: '',
    documents: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('propertyId', propertyId);
    data.append('occupation', formData.occupation);
    data.append('monthlyIncome', formData.monthlyIncome);
    data.append('message', formData.message);
    if (formData.documents) data.append('documents', formData.documents);

    try {
      await createRentalApplication(data);
      toast.success("Application Sent Successfully!");
      navigate('/my-applications');
    } catch (error) {
      toast.error("Submission failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '60px 20px', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ maxWidth: '650px', margin: '0 auto', backgroundColor: '#ffffff', padding: '45px', borderRadius: '35px', boxShadow: '0 25px 70px rgba(0,0,0,0.04)' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'left', marginBottom: '40px' }}>
          <nav style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px' }}>
            Process / Rental Request
          </nav>
          <h1 style={{ color: '#1a237e', fontWeight: '800', fontSize: '32px', marginBottom: '10px' }}>Finalize Application</h1>
          <p style={{ color: '#64748b' }}>Complete the details below to apply for Property <span style={{color: '#1a237e', fontWeight: '700'}}>#{propertyId || "N/A"}</span></p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* Occupation Input */}
          <div>
            <label style={labelStyle}>Current Occupation</label>
            <input 
              type="text" 
              placeholder="e.g. Senior Software Engineer"
              required 
              style={inputStyle}
              onChange={(e) => setFormData({...formData, occupation: e.target.value})} 
            />
          </div>

          {/* Income Input */}
          <div>
            <label style={labelStyle}>Annual/Monthly Income ($)</label>
            <input 
              type="number" 
              placeholder="5000"
              required 
              style={inputStyle}
              onChange={(e) => setFormData({...formData, monthlyIncome: e.target.value})} 
            />
          </div>

          {/* File Upload Section */}
          <div style={{ 
            border: '2px dashed #e2e8f0', 
            padding: '30px', 
            borderRadius: '20px', 
            textAlign: 'center', 
            backgroundColor: '#fcfdfe',
            transition: '0.3s'
          }}>
            <div style={{ fontSize: '30px', marginBottom: '10px' }}>📄</div>
            <label style={{ display: 'block', fontWeight: '700', color: '#1a237e', marginBottom: '5px' }}>Upload Support Documents</label>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '15px' }}>ID, Passport or Salary Slip (PDF, JPG)</p>
            <input 
              type="file" 
              required 
              style={{ fontSize: '13px', color: '#64748b' }}
              onChange={(e) => setFormData({...formData, documents: e.target.files[0]})} 
            />
          </div>

          {/* Message Textarea */}
          <div>
            <label style={labelStyle}>Letter to Landlord (Optional)</label>
            <textarea 
              placeholder="Tell them a bit about yourself..."
              rows="3"
              style={{ ...inputStyle, resize: 'none' }}
              onChange={(e) => setFormData({...formData, message: e.target.value})} 
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            style={submitButtonStyle}
            disabled={loading}
          >
            {loading ? "Processing Securely..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Styles Object ---
const labelStyle = {
  display: 'block',
  fontWeight: '700',
  color: '#334155',
  marginBottom: '10px',
  fontSize: '14px'
};

const inputStyle = {
  width: '100%',
  padding: '15px 20px',
  borderRadius: '15px',
  border: '1px solid #e2e8f0',
  outline: 'none',
  fontSize: '15px',
  color: '#1e293b',
  backgroundColor: '#fcfdfe',
  boxSizing: 'border-box'
};

const submitButtonStyle = {
  backgroundColor: '#1a237e',
  color: '#ffffff',
  padding: '18px',
  border: 'none',
  borderRadius: '18px',
  fontWeight: '800',
  fontSize: '16px',
  cursor: 'pointer',
  marginTop: '10px',
  boxShadow: '0 10px 20px rgba(26, 35, 126, 0.2)',
  transition: 'all 0.3s ease'
};

export default ApplyRental;