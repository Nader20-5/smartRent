import api from "./api";

export const createVisit = async (data) => {
  const response = await api.post("/visits", data);
  return response.data;
};

export const getMyVisits = async (params) => {
  const response = await api.get("/visits/my-visits", { params });
  return response.data;
};

export const approveVisit = async (id) => api.put(`/visits/${id}/approve`);
export const rejectVisit = async (id, reason) => api.put(`/visits/${id}/reject`, { reason });
export const cancelVisit = async (id) => api.put(`/visits/${id}/cancel`);
export const getLandlordVisits = async (params) => api.get("/visits/landlord", { params });