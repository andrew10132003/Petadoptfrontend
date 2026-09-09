import api from "../utils/api";

// Get all pets
export const getPets = async () => {
  const response = await api.get("/pets");
  return response.data;
};

// Get single pet
export const getPet = async (id: string) => {
  const response = await api.get(`/pets/${id}`);
  return response.data;
};

// Register user
export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// Login user
export const loginUser = async (loginData: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/login", loginData);
  return response.data;
};