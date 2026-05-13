import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createRentalApplication } from '../../services/rentalService';
import { getPropertyById } from '../../services/propertyService';
import { toast } from 'react-toastify';
import {
  FaFileSignature,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaEnvelopeOpenText,
  FaCloudUploadAlt,
  FaChevronLeft,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';

const ApplyRental = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState(null);
  const [formData, setFormData] = useState({
    proposedRent: '',
    moveInDate: '',
    leaseEndDate: '',
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

  // Get tomorrow as minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const isRangeOccupied = (startStr, endStr) => {
    if (!property || !property.occupiedRanges || !startStr) return false;
    const selectedStart = new Date(startStr);
    const selectedEnd = endStr ? new Date(endStr) : null;

    return property.occupiedRanges.some(range => {
      const occupiedStart = new Date(range.startDate);
      const occupiedEnd = range.endDate ? new Date(range.endDate) : null;

      if (!occupiedEnd) {
        // If existing occupancy is indefinite
        if (!selectedEnd) return selectedStart >= occupiedStart;
        return selectedEnd >= occupiedStart;
      }

      // Check for overlap: (StartA <= EndB) and (EndA >= StartB)
      if (selectedEnd) {
        return selectedStart <= occupiedEnd && selectedEnd >= occupiedStart;
      } else {
        // If user hasn't picked an end date yet, just check if move-in is inside an occupied range
        return selectedStart <= occupiedEnd && selectedStart >= occupiedStart;
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'moveInDate' && isRangeOccupied(value, formData.leaseEndDate)) {
      toast.warning("The selected move-in date is within an already rented period.");
    }
    if (name === 'leaseEndDate' && isRangeOccupied(formData.moveInDate, value)) {
      toast.warning("The selected lease period overlaps with an existing rental.");
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, documents: e.target.files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate date overlaps
    if (isRangeOccupied(formData.moveInDate, formData.leaseEndDate)) {
      toast.error('The selected period overlaps with an existing rental. Please choose different dates.');
      return;
    }

    // Validate date range
    if (formData.moveInDate && formData.leaseEndDate) {
      if (new Date(formData.leaseEndDate) <= new Date(formData.moveInDate)) {
        toast.error('Lease end date must be after the move-in date.');
        return;
      }
    }

    setLoading(true);

    const data = new FormData();
    data.append('PropertyId', propertyId);
    data.append('ProposedRent', formData.proposedRent);
    data.append('MoveInDate', formData.moveInDate);
    data.append('LeaseEndDate', formData.leaseEndDate);
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

          {/* Availability Alert */}
          {property && property.occupiedRanges && property.occupiedRanges.length > 0 && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem',
              marginBottom: '2rem',
              display: 'flex',
              gap: 12
            }}>
              <FaExclamationTriangle style={{ color: '#f59e0b', fontSize: '1.2rem', marginTop: 2 }} />
              <div>
                <h4 style={{ color: '#92400e', fontSize: '14px', fontWeight: 700, marginBottom: 4 }}>Note on Availability</h4>
                <p style={{ color: '#92400e', fontSize: '13px', lineHeight: 1.5 }}>
                  This property is currently occupied during the following periods:
                  <ul style={{ marginTop: 8, paddingLeft: 16 }}>
                    {property.occupiedRanges.map((range, idx) => (
                      <li key={idx}>
                        {new Date(range.startDate).toLocaleDateString()} to {range.endDate ? new Date(range.endDate).toLocaleDateString() : 'Indefinite'}
                      </li>
                    ))}
                  </ul>
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Date Range Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FaCalendarAlt style={{ marginRight: 6, color: 'var(--color-primary-light)' }} />
                  Move-in Date *
                </label>
                <input
                  type="date"
                  name="moveInDate"
                  className={`form-input ${isRangeOccupied(formData.moveInDate, formData.leaseEndDate) ? 'is-error' : ''}`}
                  required
                  min={minDate}
                  value={formData.moveInDate}
                  onChange={handleChange}
                  id="input-move-in-date"
                />
                {isRangeOccupied(formData.moveInDate, formData.leaseEndDate) && (
                  <span className="form-error-text" style={{ color: '#ef4444', fontSize: '12px', marginTop: 4 }}>
                    This period overlaps with an existing rental.
                  </span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">
                  <FaCalendarAlt style={{ marginRight: 6, color: 'var(--color-primary-light)' }} />
                  Lease End Date *
                </label>
                <input
                  type="date"
                  name="leaseEndDate"
                  className="form-input"
                  required
                  min={formData.moveInDate || minDate}
                  value={formData.leaseEndDate}
                  onChange={handleChange}
                  id="input-lease-end-date"
                />
              </div>
            </div>

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
              disabled={loading || isRangeOccupied(formData.moveInDate, formData.leaseEndDate)}
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
        </div>
      </div>
    </div>
  );
};

export default ApplyRental;