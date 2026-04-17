import React, { useEffect, useState } from 'react';
// import { getMyVisits } from '../../services/visitService'; // اربطيها لما تخلصي تنسيق
import { Link } from 'react-router-dom';

const MyVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // محاكاة لبيانات فخمة عشان تشوفي الشكل اللي في الصور بالظبط
    setTimeout(() => {
      setVisits([
        { id: 1, propertyName: "The Glass Atrium", address: "422 Skyway Blvd, Westside", requestedDate: "2024-10-24T14:30:00", message: "", status: "Pending", image: "https://r-graphics.com/p_renderings/01.jpg" },
        { id: 2, propertyName: "Brutalist Loft Studio", address: "89 Ironwood Dist, East Bank", requestedDate: "2024-10-25T10:00:00", message: "Excited to see the lighting!", status: "Approved", image: "https://r-graphics.com/p_renderings/02.jpg" },
        { id: 3, propertyName: "Horizon Heights Penthouse", address: "01 Vista Ridge, Highpoint", requestedDate: "2024-10-28T16:30:00", message: "Moving from out of state.", status: "Rejected", image: "https://r-graphics.com/p_renderings/03.jpg" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // ألوان الـ Tags بناءً على الحالة
  const statusColors = {
    Pending: { bg: '#fff3e0', text: '#ef6c00', icon: '⏳' },
    Approved: { bg: '#e8f5e9', text: '#2e7d32', icon: '✅' },
    Rejected: { bg: '#ffebee', text: '#c62828', icon: '❌' },
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6' }}>
      <div style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #1a237e', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', padding: '60px 20px', direction: 'ltr', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Header Section (شيك جداً وبسيط) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
          <div>
            <h1 style={{ color: '#1a237e', fontWeight: '800', fontSize: '36px', letterSpacing: '-1px' }}>My Visit Requests</h1>
            <p style={{ color: '#7f8c8d', fontSize: '16px', marginTop: '5px' }}>Track and manage your upcoming property viewings across curated spaces.</p>
          </div>
          <Link to="/" style={{ textDecoration: 'none', backgroundColor: '#1a237e', color: '#fff', padding: '12px 30px', borderRadius: '50px', fontWeight: 'bold', fontSize: '15px', boxShadow: '0 4px 15px rgba(26, 35, 126, 0.2)', transition: '0.3s' }}>
            + Explore
          </Link>
        </div>

        {/* Visits Grid (الـ Cards الفخمة) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {visits.length > 0 ? visits.map(visit => {
            const colors = statusColors[visit.status] || statusColors.Pending;
            return (
              <div key={visit.id} style={{ backgroundColor: '#fff', borderRadius: '25px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'transform 0.3s, boxShadow 0.3s', cursor: 'pointer' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.shadow = '0 15px 40px rgba(0,0,0,0.1)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.shadow = '0 10px 30px rgba(0,0,0,0.05)'; }}>
                
                {/* Image & Status Tag (زي الصور بالظبط) */}
                <div style={{ position: 'relative', height: '200px' }}>
                  <img src={visit.image} alt={visit.propertyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: colors.bg, color: colors.text, padding: '7px 18px', borderRadius: '50px', fontWeight: '700', fontSize: '12px', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{colors.icon}</span> {visit.status}
                  </div>
                </div>

                {/* Content Area */}
                <div style={{ padding: '25px' }}>
                  <h3 style={{ color: '#2c3e50', fontWeight: '700', fontSize: '20px', marginBottom: '8px' }}>{visit.propertyName}</h3>
                  <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📍 {visit.address}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '15px', marginBottom: '20px' }}>
                    <div style={{ borderLeft: '3px solid #1a237e', paddingLeft: '10px' }}>
                      <small style={{ color: '#a0a0a0', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px' }}>Date</small>
                      <p style={{ color: '#333', fontWeight: 'bold', margin: '3px 0 0' }}>{new Date(visit.requestedDate).toLocaleDateString()}</p>
                    </div>
                    <div style={{ borderLeft: '3px solid #1a237e', paddingLeft: '10px' }}>
                      <small style={{ color: '#a0a0a0', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px' }}>Time</small>
                      <p style={{ color: '#333', fontWeight: 'bold', margin: '3px 0 0' }}>{new Date(visit.requestedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  
                  {visit.message && (
                     <p style={{ color: '#555', fontSize: '13px', fontStyle: 'italic', background: '#e1f5fe', padding: '10px', borderRadius: '8px' }}>
                        "{visit.message}"
                     </p>
                  )}

                </div>

                {/* زرار شيك (Rounded full) */}
                <div style={{ padding: '0 25px 25px' }}>
                  <button style={{ backgroundColor: '#f4f7f6', color: '#1a237e', border: 'none', padding: '12px 0', width: '100%', borderRadius: '50px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: '0.3s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#e8f0fe'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#f4f7f6'}>
                    View Details
                  </button>
                </div>

              </div>
            );
          }) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#7f8c8d', fontSize: '18px', padding: '60px 0' }}>
              No visit requests yet. Time to find your next home!
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyVisits;