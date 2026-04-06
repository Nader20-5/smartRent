export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
export const SIGNALR_URL = process.env.REACT_APP_SIGNALR_URL || "http://localhost:5000/hubs/notifications";

export const ROLES = {
  ADMIN: "Admin",
  LANDLORD: "Landlord",
  TENANT: "Tenant",
};

export const PROPERTY_TYPES = {
  APARTMENT: "Apartment",
  HOUSE: "House",
  STUDIO: "Studio",
  VILLA: "Villa",
  CONDO: "Condo",
};

export const PROPERTY_STATUS = {
  ACTIVE: "Active",
  RENTED: "Rented",
  INACTIVE: "Inactive",
};

export const VISIT_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

export const RENTAL_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const DOCUMENT_TYPES = {
  ID: "ID",
  PROOF_OF_INCOME: "ProofOfIncome",
  REFERENCE: "Reference",
  OTHER: "Other",
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE: 1,
};
