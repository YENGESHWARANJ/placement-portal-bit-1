import api from "./api";

export const uploadResume = async (file: File) => {
  const form = new FormData();
  form.append("resume", file);
  await api.post("/resume/upload", form);
};
