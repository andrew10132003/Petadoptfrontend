import api from "./api";

export const getPets = async () => {
  const response = await api.get("/pets");
  return response.data;
};

export const getPet = async (id: string) => {
  const response = await api.get(`/pets/${id}`);
  return response.data;
};