import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createVisit } from '../../services/visitService';
import { getPropertyById } from '../../services/propertyService';
import { toast } from 'react-toastify';
import { 
  FaCalendarAlt, 
  FaRegClock, 
  FaCommentAlt, 
  FaChevronLeft, 
  FaInfoCircle,
  FaHome
} from 'react-icons/fa';

const BookVisit = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [requestedDate, setRequestedDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createVisit({
        propertyId: parseInt(propertyId),
        requestedDate,
        message
      });
      toast.success("Visit request sent! The landlord will be notified.");
      navigate('/my-visits');
    } catch (error) {
      toast.error(error.response?.data?.message || "Error booking visit");
    } finally {
      setSubmitting(false);
    }
  };

  const minDateTime = new Date();
  minDateTime.setHours(minDateTime.getHours() + 1);
  const minDateTimeString = minDateTime.toISOString().slice(0, 16);

  return (
    <div className="page-wrapper" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: 600 }}>
        
        {/* Breadcrumb-like back link */}
        <Link 
          to={`/property/${propertyId}`} 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 8, 
            color: 'var(--color-text-secondary)', 
            marginBottom: '1.5rem',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
        >
          <FaChevronLeft /> Back to Property
        </Link>

        <div style={{
          background: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-2xl)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--color-border)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative Background Element */}
          <div style={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 120,
            height: 120,
            background: 'var(--color-primary)',
            opacity: 0.05,
            borderRadius: '50%',
            filter: 'blur(20px)'
          }} />

          {/* Header */}
          <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
            <div style={{
              width: 64,
              height: 64,
              background: 'var(--color-bg-elevated)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: 'var(--color-primary)',
              fontSize: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-border)'
            }}>
              <FaCalendarAlt />
            </div>
            <h1 style={{ 
              fontSize: 'var(--font-size-2xl)', 
              fontWeight: 800, 
              color: 'var(--color-text-primary)',
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em'
            }}>
              Book a Property Visit
            </h1>
            {property && (
              <p style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <FaHome style={{ color: 'var(--color-primary-light)' }} /> {property.title}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Info Box */}
            <div style={{
              padding: '1rem',
              background: 'rgba(59, 130, 246, 0.08)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              marginBottom: '0.5rem'
            }}>
              <FaInfoCircle style={{ color: 'var(--color-primary)', marginTop: 2 }} />
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Your request will be sent to the landlord for approval. You'll be notified once they confirm the appointment.
              </p>
            </div>

            {/* Date Input */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaRegClock style={{ color: 'var(--color-primary)' }} /> Preferred Date & Time
              </label>
              <input 
                type="datetime-local" 
                required 
                min={minDateTimeString}
                className="form-input"
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
                style={{ height: 52 }}
              />
            </div>

            {/* Message Input */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaCommentAlt style={{ color: 'var(--color-primary)' }} /> Message for Landlord
              </label>
              <textarea 
                placeholder="Hi! I'm interested in seeing this property. Are you available at this time?"
                rows="4"
                className="form-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ resize: 'none', paddingTop: '12px' }}
              />
            </div>

            {/* Actions */}
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button 
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={submitting}
                style={{ width: '100%', height: 56, fontSize: '1rem', justifyContent: 'center' }}
              >
                {submitting ? 'Sending Request...' : 'Confirm Visit Request'}
              </button>
              
              <button 
                type="button"
                className="btn"
                onClick={() => navigate(-1)}
                disabled={submitting}
                style={{ 
                  width: '100%', 
                  background: 'transparent', 
                  color: 'var(--color-text-secondary)',
                  fontWeight: 600,
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default BookVisit;