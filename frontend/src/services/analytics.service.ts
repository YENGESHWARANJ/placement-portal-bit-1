import api from "./api";

export const getAdminStats = async () => {
    const res: any = await api.get("/analytics/admin-stats");
    return res.data;
};

export const getRecruiterAnalytics = async () => {
    const res: any = await api.get("/analytics/recruiter-stats");
    return res.data;
};

export const getStudentAnalytics = async () => {
    const res: any = await api.get("/analytics/student-stats");
    return res.data;
};
