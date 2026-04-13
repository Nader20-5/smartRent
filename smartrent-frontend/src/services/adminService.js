import api from "./api";

export const getPendingLandlords = async () => {
  const response = await api.get("/admin/pending-landlords");
  return response.data;
};

export const approveLandlord = async (id) => {
  const response = await api.put(`/admin/approve-landlord/${id}`);
  return response.data;
};

export const rejectLandlord = async (id) => {
  const response = await api.put(`/admin/reject-landlord/${id}`);
  return response.data;
};

export const getPendingProperties = async () => {
  const response = await api.get("/admin/pending-properties");
  return response.data;
};

export const approveProperty = async (id) => {
  const response = await api.put(`/admin/approve-property/${id}`);
  return response.data;
};

export const rejectProperty = async (id) => {
  const response = await api.put(`/admin/reject-property/${id}`);
  return response.data;
};
