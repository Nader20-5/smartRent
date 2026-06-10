import api from "./api";

// Retrieves all active property listings
export const getAllProperties = async (params) => {
  const response = await api.get("/property", { params });
  return response.data;
};

// Retrieves property details by ID
export const getPropertyById = async (id) => {
  const response = await api.get(`/property/${id}`);
  return response.data;
};

// Creates a new property listing
export const createProperty = async (data) => {
  const response = await api.post("/property", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Updates an existing property listing
export const updateProperty = async (id, data) => {
  const response = await api.put(`/property/${id}`, data);
  return response.data;
};

// Soft deletes a property listing
export const deleteProperty = async (id) => {
  const response = await api.delete(`/property/${id}`);
  return response.data;
};

// Retrieves properties owned by landlord
export const getMyProperties = async (params) => {
  const response = await api.get("/property/my", { params });
  return response.data;
};

// Uploads images for a property
export const uploadPropertyImages = async (id, formData) => {
  const response = await api.post(`/property/${id}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
