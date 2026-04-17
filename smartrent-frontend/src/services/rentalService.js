import api from "./api";

/**
 * --- VISIT SERVICES (تم إنجازها سابقاً) ---
 */
export const createVisit = async (data) => {
    const response = await api.post("/visits", data);
    return response.data;
};

export const getMyVisits = async (params) => {
    const response = await api.get("/visits/my-visits", { params });
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

export const cancelVisit = async (id) => {
    const response = await api.put(`/visits/${id}/cancel`);
    return response.data;
};


/**
 * --- RENTAL APPLICATION SERVICES (التاسك الجديد) ---
 */

// إنشاء طلب إيجار جديد (مع دعم رفع الملفات)
export const createRentalApplication = async (formData) => {
    const response = await api.post("/rentals", formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // ضروري لرفع المستندات
        },
    });
    return response.data;
};

// للمستأجر: جلب طلبات الإيجار الخاصة به
export const getMyApplications = async (params) => {
    const response = await api.get("/rentals/my-applications", { params });
    return response.data;
};

// للمالك: جلب طلبات الإيجار الواصلة لعقاراته
export const getLandlordApplications = async (params) => {
    const response = await api.get("/rentals/landlord", { params });
    return response.data;
};

// للمالك: الموافقة على طلب الإيجار
export const approveRental = async (id) => {
    const response = await api.put(`/rentals/${id}/approve`);
    return response.data;
};

// للمالك: رفض طلب الإيجار مع ذكر السبب
export const rejectRental = async (id, reason) => {
    const response = await api.put(`/rentals/${id}/reject`, { reason });
    return response.data;
};

// رفع مستند إضافي لطلب موجود
export const uploadDocument = async (id, formData) => {
    const response = await api.put(`/rentals/${id}/upload-docs`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
