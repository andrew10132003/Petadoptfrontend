import api from "../utils/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getMyFosterApplications = async () => {
  const response = await api.get("/fosters/my-applications", getAuthConfig());
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
  const response = await api.post("/fosters/apply", applicationData, getAuthConfig());
  return response.data;
};

export const respondToFosterInformation = async (
  applicationId: string,
  requestId: string,
  responseText: string
) => {
  const response = await api.post(
    `/fosters/my-applications/${applicationId}/information-requests/${requestId}/respond`,
    { response: responseText },
    getAuthConfig()
  );
  return response.data;
};
