import api from "./api";

export const getRecruiterProfile = async () => {
    const res: any = await api.get("/auth/me");
    return res.data;
};

export const getRecruiterStats = async () => {
    const res: any = await api.get("/analytics/recruiter-stats");
    return res.data;
};

export const getRecruiterJobs = async (page = 1, limit = 10, search = "") => {
    const res: any = await api.get(`/jobs/my?page=${page}&limit=${limit}&search=${search}`);
    return res.data;
};

export const getJobApplicants = async (jobId: string) => {
    const res: any = await api.get(`/applications/job/${jobId}`);
    return res.data.applications;
};

export const updateApplicationStatus = async (applicationId: string, status: string) => {
    const res: any = await api.put(`/applications/${applicationId}`, { status });
    return res.data;
};

export const deleteJob = async (jobId: string) => {
    const res: any = await api.delete(`/jobs/${jobId}`);
    return res.data;
};

export const fastTrackApplicant = async (applicationId: string) => {
    const res: any = await api.post(`/applications/${applicationId}/fast-track`);
    return res.data;
};

export const scheduleInterview = async (data: any) => {
    const res: any = await api.post("/interview/schedule", data);
    return res.data;
};

export const getInterviews = async () => {
    const res: any = await api.get("/interview/my");
    return res.data.interviews;
};

export const submitInterviewFeedback = async (id: string, feedback: any) => {
    const res: any = await api.post(`/interview/${id}/feedback`, { feedback });
    return res.data;
};

