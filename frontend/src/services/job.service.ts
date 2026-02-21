import api from "./api";

export const getJobs = async () => {
  const res: any = await api.get("/jobs");
  return res.data.jobs;
};

export const getRecommendedJobs = async () => {
  const res: any = await api.get("/jobs/recommendations");
  return res.data.jobs;
};

export const getMyJobs = async () => {
  const res: any = await api.get("/jobs/my");
  return res.data.jobs;
};

export const createJob = async (jobData: any) => {
  const res: any = await api.post("/jobs", jobData);
  return res.data;
};

export const applyJob = async (jobId: string) => {
  const res: any = await api.post(`/applications`, { jobId });
  return res.data;
};

export const getCompanies = async () => {
  const res: any = await api.get("/jobs/companies");
  return res.data.companies;
};

export const getJobById = async (id: string) => {
  const res: any = await api.get(`/jobs/${id}`);
  return res.data;
};

export const updateJob = async (id: string, jobData: any) => {
  const res: any = await api.put(`/jobs/${id}`, jobData);
  return res.data;
};


