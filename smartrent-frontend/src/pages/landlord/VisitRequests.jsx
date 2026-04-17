import React, { useEffect, useState } from 'react';
import { getLandlordVisits, approveVisit, rejectVisit } from '../../services/visitService';
import { toast } from 'react-toastify';

const VisitRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  // دالة جلب البيانات من السيرفر
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getLandlordVisits();
      // تأكدي إن الداتا اللي راجعة مصفوفة (Array)
      setRequests(data || []); 
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load requests from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // دالة الموافقة أو الرفض
  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') {
        await approveVisit(id);
        toast.success("Visit Request Accepted!");
      } else {
        const reason = prompt("Please enter rejection reason:");
        if (reason === null) return; 
        
        await rejectVisit(id, reason);
        toast.info("Visit Request Rejected");
      }
      fetchRequests(); // تحديث الجدول بعد العملية
    } catch (error) {
      toast.error("Action failed. Please try again.");
    }
  };

  // تصفية البيانات (Filtering)
  const filteredRequests = requests.filter(req => 
    filter === 'All' ? true : req.status === filter
  );

  // واجهة التحميل (Loading Spinner)
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
       <div className="loader"></div>
       <style>{`
         .loader { border: 4px solid #f3f3f3; border-top: 4px solid #1a237e; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
         @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
       `}</style>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f9fbfc', minHeight: '100vh', padding: '40px', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <nav style={{ fontSize: '12px', color: '#bdc3c7', marginBottom: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>
          DASHBOARD / VISIT REQUESTS
        </nav>
        <h1 style={{ color: '#1a237e', fontWeight: '800', fontSize: '36px', marginBottom: '10px' }}>Rental Requests</h1>
        <p style={{ color: '#7f8c8d', marginBottom: '40px' }}>Review and manage site visit applications for your properties.</p>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          {['All', 'Pending', 'Accepted', 'Approved', 'Rejected'].map(statusOption => (
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
                <th style={{ padding: '20px' }}>Tenant Info</th>
                <th>Property Details</th>
                <th>Schedule</th>
                <th>Status</th>
                <th style={{ paddingRight: '20px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? filteredRequests.map(req => (
                <tr key={req.id} style={{ borderBottom: '1px solid #f9fbfc' }}>
                  <td style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '45px', height: '45px', backgroundColor: '#e8eaf6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👤</div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#1a237e' }}>{req.tenantName || 'N/A'}</div>
                      <div style={{ fontSize: '12px', color: '#95a5a6' }}>{req.tenantEmail || 'No Email'}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#2c3e50' }}>{req.propertyTitle || req.propertyName}</div>
                    <div style={{ fontSize: '11px', color: '#1a237e', fontWeight: 'bold' }}>ID: #{req.propertyId}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{new Date(req.requestedDate).toLocaleDateString()}</div>
                    <div style={{ fontSize: '11px', color: '#bdc3c7' }}>{new Date(req.requestedDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '6px 16px', borderRadius: '50px', fontSize: '10px', fontWeight: '800',
                      backgroundColor: (req.status === 'Accepted' || req.status === 'Approved') ? '#e8f5e9' : req.status === 'Rejected' ? '#ffebee' : '#fff3e0',
                      color: (req.status === 'Accepted' || req.status === 'Approved') ? '#2e7d32' : req.status === 'Rejected' ? '#c62828' : '#ef6c00'
                    }}> {req.status?.toUpperCase()} </span>
                  </td>
                  <td style={{ paddingRight: '20px' }}>
                    {req.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleAction(req.id, 'approve')} style={{ backgroundColor: '#1a237e', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Accept</button>
                        <button onClick={() => handleAction(req.id, 'reject')} style={{ backgroundColor: 'transparent', color: '#ef5350', border: '1px solid #ef5350', padding: '8px 15px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#95a5a6' }}>No requests found for this category.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisitRequests;