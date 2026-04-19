import api from "./api";

// ==========================================
// Rental Application Services
// ==========================================

// Tenant: Create a new rental application (with file upload)
export const createRentalApplication = async (formData) => {
  const response = await api.post("/rental", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Tenant: Get my rental applications
export const getMyApplications = async (params) => {
  const response = await api.get("/rental/tenant", { params });
  return response.data;
};

// Landlord: Get rental applications for my properties
export const getLandlordApplications = async (params) => {
  const response = await api.get("/rental/landlord", { params });
  return response.data;
};

// Landlord: Approve a rental application
export const approveRental = async (id) => {
  const response = await api.put(`/rental/${id}/approve`);
  return response.data;
};

// Landlord: Reject a rental application with reason
export const rejectRental = async (id, reason) => {
  const response = await api.put(`/rental/${id}/reject`, { reason });
  return response.data;
};

// Tenant: Upload additional document for existing application
export const uploadDocument = async (id, formData) => {
  const response = await api.post(`/rental/${id}/documents`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
