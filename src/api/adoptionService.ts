import api from "../utils/api";

export const submitAdoption = async (adoptionData: {
  petId: string;
  petName: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  reason: string;
}) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    "/adoptions",
    adoptionData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getMyAdoptions = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get(
    "/adoptions/my",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const cancelAdoption = async (id: string) => {
  const token = localStorage.getItem("token");

  const response = await api.patch(
    `/adoptions/${id}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};