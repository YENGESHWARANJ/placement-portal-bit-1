import api from "./api";

export const getRankedCandidates = async () => {
  const res = await api.get("/ai/ranking");
  return res.data;
};
