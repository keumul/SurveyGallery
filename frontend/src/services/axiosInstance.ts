import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

const axiosClient = (token: string | null = null): AxiosInstance => {
    const headers = token ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    } : {
        "Content-Type": "application/json",
    };

    const client = axios.create({
        baseURL: process.env.REACT_APP_API_HOST + '/api',
        headers,
        timeout: 60000,
        withCredentials: false,
    });

    client.interceptors.request.use((config: any) => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("No access token found in localStorage");
        }
        return config;
    });

    client.interceptors.response.use(
        (response: AxiosResponse) => { return response; },
        (error: AxiosError) => {
            try {
                const { response } = error;
                if (response?.status === 401) {
                    localStorage.removeItem("ACCESS_TOKEN");
                }
            } catch (error) {
                console.error(error);
            }
            throw error;
        }
    );

    return client;
};

export default axiosClient;
