import api from "../utils/api";

type RegisterData = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
};

export const registerUser = async (userData: RegisterData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};