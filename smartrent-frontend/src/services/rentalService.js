import api from "./api";

// Handle property rental applications

// Create new rental application
export const createRentalApplication = async (formData) => {
  const response = await api.post("/rental", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Fetch tenant rental applications
export const getMyApplications = async (params) => {
  const response = await api.get("/rental/tenant", { params });
  return response.data;
};

// Fetch landlord rental applications
export const getLandlordApplications = async (params) => {
  const response = await api.get("/rental/landlord", { params });
  return response.data;
};

// Approve a rental application
export const approveRental = async (id) => {
  const response = await api.put(`/rental/${id}/approve`);
  return response.data;
};

// Reject a rental application
export const rejectRental = async (id, reason) => {
  const response = await api.put(`/rental/${id}/reject`, { reason });
  return response.data;
};

// Upload application document
export const uploadDocument = async (id, formData) => {
  const response = await api.post(`/rental/${id}/documents`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
