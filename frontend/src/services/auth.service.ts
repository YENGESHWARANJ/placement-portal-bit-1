import api from "./api";

export const registerUser = (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  return api.post("/auth/register", payload);
};
