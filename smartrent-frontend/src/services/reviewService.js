import api from "./api";

export const createReview = async (data) => {
  const res = await api.post("/reviews", data);
  return res.data;
};

export const getPropertyReviews = async (propertyId) => {
  const res = await api.get(`/reviews/property/${propertyId}`);
  return res.data;
};

export const updateReview = async (id, data) => {
  const res = await api.put(`/reviews/${id}`, data);
  return res.data;
};

export const deleteReview = async (id) => {
  const res = await api.delete(`/reviews/${id}`);
  return res.data;
};

