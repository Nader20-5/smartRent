import api from "./api";

export const getAllProperties = async (params) => {
  const response = await api.get("/property", { params });
  return response.data;
};

export const getPropertyById = async (id) => {
  const response = await api.get(`/property/${id}`);
  return response.data;
};

export const createProperty = async (data) => {
  const response = await api.post("/property", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateProperty = async (id, data) => {
  const response = await api.put(`/property/${id}`, data);
  return response.data;
};

export const deleteProperty = async (id) => {
  const response = await api.delete(`/property/${id}`);
  return response.data;
};

export const getMyProperties = async (params) => {
  const response = await api.get("/property/my", { params });
  return response.data;
};

export const uploadPropertyImages = async (id, formData) => {
  const response = await api.post(`/property/${id}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
