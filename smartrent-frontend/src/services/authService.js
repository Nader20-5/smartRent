import api from "./api";

// Maps backend auth response to frontend
const normalizeAuthResponse = (data) => ({
  token: data.token,
  user: {
    id: data.userId,
    fullName: `${data.firstName} ${data.lastName}`.trim(),
    email: data.email,
    role: data.role,
    profileImage: data.profileImage,
  },
});

// Authenticates user with credentials and token
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return normalizeAuthResponse(response.data);
};

// Creates new user with provided information
export const register = async (formData) => {
  const nameParts = formData.fullName.trim().split(/\s+/);
  const payload = {
    firstName: nameParts[0] || "",
    lastName: nameParts.slice(1).join(" ") || nameParts[0] || "",
    email: formData.email,
    password: formData.password,
    confirmPassword: formData.confirmPassword || formData.password,
    role: formData.role || "Tenant",
    phone: formData.phoneNumber || null,
  };

  const response = await api.post("/auth/register", payload);
  return normalizeAuthResponse(response.data);
};
