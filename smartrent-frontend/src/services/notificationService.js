import api from "./api";

export const getNotifications = async () => {
  const response = await api.get("/notification", {
    params: { PageNumber: 1, PageSize: 10 }
  });
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await api.put(`/notification/${id}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.put("/notification/read-all");
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get("/notification/unread-count");
  return response.data;
};
