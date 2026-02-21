import api from "./api";

export const registerStudent = async (payload: any) => {
  const response: any = await api.post("/students/register", payload);
  return response.data;
};

export const getStudentProfile = async () => {
  const response: any = await api.get("/students/profile");
  return response.data.data;
};

export const getStudentById = async (id: string) => {
  const res: any = await api.get(`/students/${id}`);
  return res.data.student;
};

export const updateStudentProfile = async (payload: any) => {
  // Backend uses POST /profile for updates
  const response: any = await api.post("/students/profile", payload);
  return response.data.data;
};
