import { create } from "zustand";
import api from "../services/api";

export interface Company {
  _id: string;
  name: string;
  description: string;
  industry: string;
  website?: string;
  location: string;
  status: 'active' | 'inactive';
}

interface CompanyState {
  companies: Company[];
  loading: boolean;
  fetchCompanies: () => Promise<void>;
  addCompany: (company: Omit<Company, '_id' | 'status'>) => Promise<void>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  toggleCompanyStatus: (id: string, currentStatus: 'active' | 'inactive') => Promise<void>;
}

const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  loading: false,

  fetchCompanies: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get<{ companies: Company[] }>('/companies');
      set({ companies: data.companies || [] });
    } finally {
      set({ loading: false });
    }
  },

  addCompany: async (companyInfo) => {
    const { data } = await api.post<{ company: Company }>('/companies', { ...companyInfo, status: 'active' });
    set(state => ({ companies: [data.company, ...state.companies] }));
  },

  updateCompany: async (id, updates) => {
    const { data } = await api.put<{ company: Company }>(`/companies/${id}`, updates);
    set(state => ({
      companies: state.companies.map(c => c._id === id ? data.company : c)
    }));
  },

  deleteCompany: async (id) => {
    await api.delete(`/companies/${id}`);
    set(state => ({
      companies: state.companies.filter(c => c._id !== id)
    }));
  },

  toggleCompanyStatus: async (id, currentStatus) => {
    const status = currentStatus === 'active' ? 'inactive' : 'active';
    await api.put(`/companies/${id}`, { status });
    set(state => ({
      companies: state.companies.map(c => c._id === id ? { ...c, status } : c)
    }));
  }
}));

export default useCompanyStore;
