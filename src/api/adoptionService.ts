import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://petadoptbackend.onrender.com/api";

// =====================================================
// AXIOS CONFIG
// =====================================================

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// =====================================================
// CREATE ADOPTION
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
// GET MY ADOPTIONS
// =====================================================

export const getMyAdoptions =
  async () => {

    const response =
      await axios.get(
        `${API_URL}/adoptions/my`,
        getAuthHeaders()
      );

    return response.data;
  };

// =====================================================
// CANCEL ADOPTION
// =====================================================

export const cancelAdoption =
  async (
    adoptionId: string
  ) => {

    if (!adoptionId) {
      throw new Error(
        "Adoption ID is missing."
      );
    }

    const response =
      await axios.patch(
        `${API_URL}/adoptions/${adoptionId}/cancel`,
        {},
        getAuthHeaders()
      );

    return response.data;
  };

// =====================================================
// SHELTER REQUESTS
// =====================================================

export const getShelterAdoptions =
  async () => {

    const response =
      await axios.get(
        `${API_URL}/adoptions/shelter`,
        getAuthHeaders()
      );

    return response.data;
  };

// =====================================================
// APPROVE
// =====================================================

export const approveAdoption =
  async (
    adoptionId: string
  ) => {

    const response =
      await axios.patch(
        `${API_URL}/adoptions/shelter/${adoptionId}/approve`,
        {},
        getAuthHeaders()
      );

    return response.data;
  };

// =====================================================
// REJECT
// =====================================================

export const rejectAdoption =
  async (
    adoptionId: string
  ) => {

    const response =
      await axios.patch(
        `${API_URL}/adoptions/shelter/${adoptionId}/reject`,
        {},
        getAuthHeaders()
      );

    return response.data;
  };