import api from "./api";

// ==========================================
// Visits Section
// ==========================================

export const createVisit = async (data) => {
  const response = await api.post("/visit", data);
  return response.data;
};

export const getMyVisits = async (params) => {
  const response = await api.get("/visit/tenant", { params });
  return response.data;
};

export const cancelVisit = async (id) => {
  const response = await api.put(`/visit/${id}/cancel`);
  return response.data;
};

export const getLandlordVisits = async (params) => {
  const response = await api.get("/visit/landlord", { params });
  return response.data;
};

export const approveVisit = async (id) => {
  const response = await api.put(`/visit/${id}/approve`);
  return response.data;
};

export const rejectVisit = async (id, reason) => {
  const response = await api.put(`/visit/${id}/reject`, { reason });
  return response.data;
};
