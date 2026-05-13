import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createRentalApplication } from '../../services/rentalService';
import { getPropertyById } from '../../services/propertyService';
import { toast } from 'react-toastify';
import {
  FaFileSignature,
  FaMoneyBillWave,
  FaEnvelopeOpenText,
  FaCloudUploadAlt,
  FaChevronLeft,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';

const ApplyRental = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState(null);
  const [formData, setFormData] = useState({
    proposedRent: '',
    coverLetter: '',
    documents: null,
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(propertyId);
        setProperty(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProperty();
  }, [propertyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, documents: e.target.files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const data = new FormData();
    data.append('PropertyId', propertyId);
    data.append('ProposedRent', formData.proposedRent);
    data.append('CoverLetter', formData.coverLetter);

    if (formData.documents) {
      for (let i = 0; i < formData.documents.length; i++) {
        data.append('Documents', formData.documents[i]);
      }
    }

    try {
      await createRentalApplication(data);
      toast.success('Application submitted successfully!');
      navigate('/my-applications');
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        'Submission failed. Please try again.';
      toast.error(typeof msg === 'string' ? msg : 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 720, paddingTop: '2rem', paddingBottom: '4rem' }}>
        {/* Breadcrumb */}
        <nav className="detail-breadcrumb" id="apply-rental-breadcrumb">
          <Link to={`/property/${propertyId}`} className="detail-breadcrumb-link">
            <FaChevronLeft style={{ fontSize: '0.65rem', marginRight: 4 }} />
            Back to Property
          </Link>
          <span className="detail-breadcrumb-separator">/</span>
          <span className="detail-breadcrumb-current">Apply for Rental</span>
        </nav>

        {/* Card */}
        <div
          style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-10)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
              <FaFileSignature style={{ color: 'var(--color-primary-light)', fontSize: '1.5rem' }} />
              <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Rental Application
              </h1>
            </div>
            {property && (
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                Applying for: <strong>{property.title}</strong>
              </p>
            )}
          </div>

          {/* Rented Alert */}
          {property && property.rentalStatus === "Rented" && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 12
            }}>
              <FaTimesCircle style={{ color: 'var(--color-error)', fontSize: '2.5rem' }} />
              <div>
                <h4 style={{ color: 'var(--color-error)', fontSize: '18px', fontWeight: 700, marginBottom: 8 }}>Property Already Rented</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
                  This property is currently off the market as it has been successfully rented. No further applications are being accepted at this time.
                </p>
                <Link to="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Browse Other Properties</Link>
              </div>
            </div>
          )}


            {property && property.rentalStatus !== "Rented" && (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

                {/* Proposed Rent */}
                <div className="form-group">
                  <label className="form-label">
                    <FaMoneyBillWave style={{ marginRight: 6, color: 'var(--color-success)' }} />
                    Proposed Monthly Rent ($) *
                  </label>
                  <input
                    type="number"
                    name="proposedRent"
                    className="form-input"
                    placeholder={property ? `Listing price: $${property.price}` : "e.g. 5000"}
                    required
                    min="1"
                    value={formData.proposedRent}
                    onChange={handleChange}
                    id="input-proposed-rent"
                  />
                </div>

                {/* Cover Letter */}
                <div className="form-group">
                  <label className="form-label">
                    <FaEnvelopeOpenText style={{ marginRight: 6, color: 'var(--color-info)' }} />
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    name="coverLetter"
                    className="form-textarea"
                    placeholder="Introduce yourself to the landlord. Mention your occupation, reason for renting, etc."
                    rows="4"
                    value={formData.coverLetter}
                    onChange={handleChange}
                    id="input-cover-letter"
                  />
                </div>

                {/* Document Upload */}
                <div className="form-group">
                  <label className="form-label">
                    <FaCloudUploadAlt style={{ marginRight: 6, color: 'var(--color-warning)' }} />
                    Supporting Documents *
                  </label>
                  <div
                    style={{
                      border: '2px dashed var(--color-border)',
                      padding: 'var(--space-6)',
                      borderRadius: 'var(--radius-lg)',
                      textAlign: 'center',
                      background: 'var(--color-bg-elevated)',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <FaCloudUploadAlt style={{ fontSize: '2rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }} />
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)' }}>
                      Upload ID, Salary Slip, or Employment Letter (PDF, JPG, PNG)
                    </p>
                    <input
                      type="file"
                      multiple
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      style={{ fontSize: 'var(--font-size-sm)' }}
                      id="input-documents"
                    />
                    {formData.documents && formData.documents.length > 0 && (
                      <p style={{ marginTop: 'var(--space-2)', color: 'var(--color-success)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
                        <FaCheckCircle style={{ marginRight: 4 }} />
                        {formData.documents.length} file(s) selected
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-2)' }}
                  id="submit-rental-btn"
                >
                  {loading ? (
                    <>
                      <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaFileSignature /> Submit Application
                    </>
                  )}
                </button>
              </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default ApplyRental;