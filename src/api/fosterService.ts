import axios from "axios";

const API_URL = "http://localhost:5000/api/fosters";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getMyFosterApplications = async () => {
  const response = await axios.get(
    `${API_URL}/my-applications`,
    getAuthConfig()
  );

  return response.data;
};

export const applyToFoster = async (applicationData: {
  petId: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
  availability: string;
  reason: string;
}) => {
  const response = await axios.post(
    `${API_URL}/apply`,
    applicationData,
    getAuthConfig()
  );

  return response.data;
};