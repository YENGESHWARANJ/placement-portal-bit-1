import api from "./api";

export const getResources = async (params?: {
    category?: string;
    type?: string;
    difficulty?: string;
    search?: string;
}) => {
    const res: any = await api.get("/resources", { params });
    return res.data.resources;
};

export const getFeaturedResources = async () => {
    const res: any = await api.get("/resources/featured");
    return res.data.resources;
};

export const getResourceById = async (id: string) => {
    const res: any = await api.get(`/resources/${id}`);
    return res.data.resource;
};

export const createResource = async (payload: any) => {
    const res: any = await api.post("/resources", payload);
    return res.data;
};

export const updateResource = async (id: string, payload: any) => {
    const res: any = await api.put(`/resources/${id}`, payload);
    return res.data;
};

export const deleteResource = async (id: string) => {
    const res: any = await api.delete(`/resources/${id}`);
    return res.data;
};

export const getCategories = async () => {
    const res: any = await api.get("/resources/categories");
    return res.data.categories;
};
