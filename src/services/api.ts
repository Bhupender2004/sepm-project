import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError<any>) => {
                if (error.response?.status === 401) {
                    // Token expired, logout user
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    // Auth endpoints
    async register(data: {
        fullName: string;
        email: string;
        password: string;
        confirmPassword: string;
    }) {
        const response = await this.client.post('/auth/register', data);
        return response.data;
    }

    async login(data: { email: string; password: string; rememberMe?: boolean }) {
        const response = await this.client.post('/auth/login', data);
        if (response.data.success) {
            const { accessToken, refreshToken, user } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
        }
        return response.data;
    }

    async logout() {
        try {
            await this.client.post('/auth/logout');
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    }

    // Resume endpoints
    async uploadResume(file: File, label?: string) {
        const formData = new FormData();
        formData.append('resume', file);
        if (label) {
            formData.append('label', label);
        }

        const response = await this.client.post('/resumes', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    async getResumes(page: number = 1, limit: number = 10) {
        const response = await this.client.get('/resumes', {
            params: { page, limit },
        });
        return response.data;
    }

    async getResumeById(id: string) {
        const response = await this.client.get(`/resumes/${id}`);
        return response.data;
    }

    async updateResume(id: string, data: { label?: string; isDefault?: boolean }) {
        const response = await this.client.patch(`/resumes/${id}`, data);
        return response.data;
    }

    async deleteResume(id: string) {
        const response = await this.client.delete(`/resumes/${id}`);
        return response.data;
    }

    // Job Description endpoints
    async createJobDescription(data: {
        jobTitle: string;
        company: string;
        fullText: string;
    }) {
        const response = await this.client.post('/analyses/job-descriptions', data);
        return response.data;
    }

    async getJobDescriptions(page: number = 1, limit: number = 10) {
        const response = await this.client.get('/analyses/job-descriptions', {
            params: { page, limit },
        });
        return response.data;
    }

    async getJobDescriptionById(id: string) {
        const response = await this.client.get(`/analyses/job-descriptions/${id}`);
        return response.data;
    }

    async updateJobDescription(
        id: string,
        data: { jobTitle?: string; company?: string; fullText?: string }
    ) {
        const response = await this.client.patch(`/analyses/job-descriptions/${id}`, data);
        return response.data;
    }

    async deleteJobDescription(id: string) {
        const response = await this.client.delete(`/analyses/job-descriptions/${id}`);
        return response.data;
    }

    // Analysis endpoints
    async createAnalysis(data: { resumeId: string; jobDescriptionId: string }) {
        const response = await this.client.post('/analyses', data);
        return response.data;
    }

    async getAnalyses(page: number = 1, limit: number = 10) {
        const response = await this.client.get('/analyses', {
            params: { page, limit },
        });
        return response.data;
    }

    async getAnalysisById(id: string) {
        const response = await this.client.get(`/analyses/${id}`);
        return response.data;
    }

    async deleteAnalysis(id: string) {
        const response = await this.client.delete(`/analyses/${id}`);
        return response.data;
    }
}

export const apiClient = new ApiClient();
export default apiClient;
