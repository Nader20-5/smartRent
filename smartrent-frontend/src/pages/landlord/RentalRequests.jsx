import React, { useEffect, useState } from 'react';
// تأكدي من استيراد الدوال من الـ Service الصحيح كما اتفقنا
import { getLandlordApplications, approveRental, rejectRental } from '../../services/rentalService'; 
import { toast } from 'react-toastify';

const RentalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getLandlordApplications();
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching rental requests:", error);
      toast.error("Failed to load rental applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') {
        await approveRental(id);
        toast.success("Rental Application Approved!");
      } else {
        const reason = prompt("Enter rejection reason:");
        if (reason === null) return;
        await rejectRental(id, reason);
        toast.info("Application Rejected");
      }
      fetchRequests();
    } catch (error) {
      toast.error("Process failed. Please try again.");
    }
  };

  // تصفية البيانات بناءً على الحالة
  const filteredRequests = requests.filter(req => 
    filter === 'All' ? true : req.status === filter
  );

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
       <div className="rental-loader"></div>
       <style>{`
         .rental-loader { border: 4px solid #f3f3f3; border-top: 4px solid #1a237e; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
         @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
       `}</style>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f9fbfc', minHeight: '100vh', padding: '40px', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Navigation Breadcrumb */}
        <nav style={{ fontSize: '12px', color: '#bdc3c7', marginBottom: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>
          MANAGEMENT / RENTAL APPLICATIONS
        </nav>
        
        <h1 style={{ color: '#1a237e', fontWeight: '800', fontSize: '36px', marginBottom: '10px' }}>Rental Requests</h1>
        <p style={{ color: '#7f8c8d', marginBottom: '40px' }}>Review tenant documents, income verification, and application details.</p>

        {/* Filter Tabs - زي الـ Visits بالظبط */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          {['All', 'Pending', 'Approved', 'Rejected'].map(statusOption => (
            <button 
              key={statusOption} 
              onClick={() => setFilter(statusOption)}
              style={{
                padding: '10px 25px', borderRadius: '50px', border: 'none',
                backgroundColor: filter === statusOption ? '#1a237e' : '#fff',
                color: filter === statusOption ? '#fff' : '#7f8c8d',
                fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', transition: '0.3s'
              }}
            > {statusOption} </button>
          ))}
        </div>

        {/* Table Container */}
        <div style={{ backgroundColor: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.02)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#fcfdfe' }}>
              <tr style={{ borderBottom: '1px solid #f0f2f5', color: '#bdc3c7', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '20px' }}>Applicant Profile</th>
                <th>Financial Info</th>
                <th>Verification</th>
                <th>Status</th>
                <th style={{ paddingRight: '20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? filteredRequests.map(req => (
                <tr key={req._id || req.id} style={{ borderBottom: '1px solid #f9fbfc' }}>
                  {/* Tenant Info */}
                  <td style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '45px', height: '45px', backgroundColor: '#e8eaf6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👤</div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#1a237e' }}>{req.tenantName || 'Applicant'}</div>
                      <div style={{ fontSize: '12px', color: '#95a5a6' }}>{req.occupation || 'No Occupation'}</div>
                    </div>
                  </td>

                  {/* Monthly Income */}
                  <td>
                    <div style={{ fontWeight: '700', color: '#2e7d32' }}>${req.monthlyIncome}</div>
                    <div style={{ fontSize: '11px', color: '#bdc3c7' }}>Monthly Income</div>
                  </td>

                  {/* Documents Link */}
                  <td>
                    {req.documents ? (
                      <a href={req.documents} target="_blank" rel="noreferrer" 
                         style={{ color: '#1a237e', textDecoration: 'none', fontWeight: '700', fontSize: '13px', borderBottom: '2px solid #e8eaf6' }}>
                        View Documents 📄
                      </a>
                    ) : <span style={{color: '#cbd5e1', fontSize: '13px'}}>No Docs Provided</span>}
                  </td>

                  {/* Status Badge */}
                  <td>
                    <span style={{ 
                      padding: '6px 16px', borderRadius: '50px', fontSize: '10px', fontWeight: '800',
                      backgroundColor: req.status === 'Approved' ? '#e8f5e9' : req.status === 'Rejected' ? '#ffebee' : '#fff3e0',
                      color: req.status === 'Approved' ? '#2e7d32' : req.status === 'Rejected' ? '#c62828' : '#ef6c00'
                    }}> {req.status?.toUpperCase()} </span>
                  </td>

                  {/* Action Buttons */}
                  <td style={{ paddingRight: '20px', textAlign: 'right' }}>
                    {req.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleAction(req._id || req.id, 'approve')} 
                          style={{ backgroundColor: '#1a237e', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                        >Approve</button>
                        <button 
                          onClick={() => handleAction(req._id || req.id, 'reject')} 
                          style={{ backgroundColor: 'transparent', color: '#ef5350', border: '1px solid #ef5350', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                        >Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: '#95a5a6' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>📂</div>
                    No rental applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RentalRequests;