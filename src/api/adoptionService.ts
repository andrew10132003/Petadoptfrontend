
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://petadoptbackend.onrender.com/api";

// =====================================================
// AXIOS CONFIG
// =====================================================

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// =====================================================
// CREATE ADOPTION - ADOPTER
// =====================================================

export const createAdoption = async (
  adoptionData: {
    petId: string;
    petName: string;
    email: string;
    phone: string;
    address: string;
    occupation: string;
    reason: string;
  }
) => {
  const response = await axios.post(
    `${API_URL}/adoptions`,
    adoptionData,
    getAuthHeaders()
  );

  return response.data;
};

// =====================================================
// GET MY ADOPTIONS - ADOPTER
// =====================================================

export const getMyAdoptions = async () => {
  const response = await axios.get(
    `${API_URL}/adoptions/my`,
    getAuthHeaders()
  );

  return response.data;
};

// =====================================================
// CANCEL ADOPTION - ADOPTER
// =====================================================

export const cancelAdoption = async (
  adoptionId: string
) => {
  if (!adoptionId) {
    throw new Error("Adoption ID is missing.");
  }

  const response = await axios.patch(
    `${API_URL}/adoptions/${adoptionId}/cancel`,
    {},
    getAuthHeaders()
  );

  return response.data;
};

// =====================================================
// GET SHELTER ADOPTIONS - SHELTER
// =====================================================

export const getShelterAdoptions = async () => {
  const response = await axios.get(
    `${API_URL}/adoptions/shelter`,
    getAuthHeaders()
  );

  return response.data;
};

// =====================================================
// APPROVE ADOPTION - SHELTER
// =====================================================

export const approveAdoption = async (
  adoptionId: string
) => {
  const response = await axios.patch(
    `${API_URL}/adoptions/shelter/${adoptionId}/approve`,
    {},
    getAuthHeaders()
  );

  return response.data;
};

// =====================================================
// REJECT ADOPTION - SHELTER
// =====================================================

export const rejectAdoption = async (
  adoptionId: string
) => {
  const response = await axios.patch(
    `${API_URL}/adoptions/shelter/${adoptionId}/reject`,
    {},
    getAuthHeaders()
  );

  return response.data;
};

// =====================================================
// REQUEST ADDITIONAL INFORMATION - SHELTER
// =====================================================

export const requestAdditionalInformation = async (
  adoptionId: string,
  message: string
) => {
  const response = await axios.post(
    `${API_URL}/adoptions/${adoptionId}/information-requests`,
    { message },
    getAuthHeaders()
  );

  return response.data;
};

// =====================================================
// RESPOND TO INFORMATION REQUEST - ADOPTER
// =====================================================

export const respondToInformationRequest = async (
  adoptionId: string,
  requestId: string,
  responseText: string
) => {
  const response = await axios.post(
    `${API_URL}/adoptions/${adoptionId}/information-requests/${requestId}/respond`,
    { response: responseText },
    getAuthHeaders()
  );

  return response.data;
};

// =====================================================
// SCHEDULE MEET-AND-GREET - SHELTER
// =====================================================

export const scheduleMeetAndGreet = async (
  adoptionId: string,
  meeting: {
    scheduledAt: string;
    location: string;
    notes?: string;
  }
) => {
  const response = await axios.post(
    `${API_URL}/adoptions/${adoptionId}/meet-and-greet`,
    meeting,
    getAuthHeaders()
  );

  return response.data;
};

// =====================================================
// RESPOND TO MEET-AND-GREET - ADOPTER
// =====================================================

export const respondToMeetAndGreet = async (
  adoptionId: string,
  decision: "confirmed" | "cancelled"
) => {
  const response = await axios.patch(
    `${API_URL}/adoptions/${adoptionId}/meet-and-greet/respond`,
    { decision },
    getAuthHeaders()
  );

  return response.data;
};
