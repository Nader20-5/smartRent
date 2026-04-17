import api from "./api";

// ==========================================
// 1. استعلامات الزيارات (Visits Section)
// ==========================================

export const createVisit = async (data) => {
  const response = await api.post("/visits", data);
  return response.data;
};

export const getMyVisits = async (params) => {
  const response = await api.get("/visits/my-visits", { params });
  return response.data;
};

export const cancelVisit = async (id) => {
  const response = await api.put(`/visits/${id}/cancel`);
  return response.data;
};

export const getLandlordVisits = async (params) => {
  const response = await api.get("/visits/landlord", { params });
  return response.data;
};

export const approveVisit = async (id) => {
  const response = await api.put(`/visits/${id}/approve`);
  return response.data;
};

export const rejectVisit = async (id, reason) => {
  const response = await api.put(`/visits/${id}/reject`, { reason });
  return response.data;
};


// ==========================================
// 2. استعلامات طلبات الإيجار (Rentals Section) - التاسك الجديد
// ==========================================

// تقديم طلب إيجار (لاحظي إننا بنبعت formData عشان الملفات)
export const createRentalApplication = async (formData) => {
  const response = await api.post("/rentals", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

// جلب طلبات الإيجار الخاصة بي (للمستأجر)
export const getMyApplications = async (params) => {
  const response = await api.get("/rentals/my-applications", { params });
  return response.data;
};

// جلب طلبات الإيجار الواردة (للمالك)
export const getLandlordApplications = async (params) => {
  const response = await api.get("/rentals/landlord", { params });
  return response.data;
};

// قبول طلب الإيجار
export const approveRental = async (id) => {
  const response = await api.put(`/rentals/${id}/approve`);
  return response.data;
};

// رفض طلب الإيجار مع السبب
export const rejectRental = async (id, reason) => {
  const response = await api.put(`/rentals/${id}/reject`, { reason });
  return response.data;
};