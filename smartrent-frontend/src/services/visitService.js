import api from "./api";

// --- استعلامات المستأجر (Tenants) ---

// إرسال طلب زيارة جديد
export const createVisit = async (data) => {
  const response = await api.post("/visits", data);
  return response.data;
};

// جلب طلبات الزيارة الخاصة بي كمستأجر
export const getMyVisits = async (params) => {
  const response = await api.get("/visits/my-visits", { params });
  return response.data;
};

// إلغاء طلب زيارة
export const cancelVisit = async (id) => {
  // تصحيح: يجب استخدام العلامات المائلة المائلة للخلف ` ` بدلاً من العادية لتمرير الـ id
  const response = await api.put(`/visits/${id}/cancel`);
  return response.data;
};

// --- استعلامات الملاك (Landlords) ---

// جلب طلبات الزيارة الواردة للمالك
export const getLandlordVisits = async (params) => {
  const response = await api.get("/visits/landlord", { params });
  return response.data;
};

// قبول طلب زيارة
export const approveVisit = async (id) => {
  // تصحيح: استخدام ` ` لتمرير المتغير id في المسار
  const response = await api.put(`/visits/${id}/approve`);
  return response.data;
};

// رفض طلب زيارة مع ذكر السبب
export const rejectVisit = async (id, reason) => {
  // تصحيح: استخدام ` ` وإرسال الـ reason ككائن (Object)
  const response = await api.put(`/visits/${id}/reject`, { reason });
  return response.data;
};