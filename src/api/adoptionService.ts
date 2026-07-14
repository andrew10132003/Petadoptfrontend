import api from "./api";

export const submitAdoption = async (data: any) => {
  const response = await api.post("/adoptions", data);
  return response.data;
};