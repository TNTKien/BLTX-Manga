import axios from "axios";
import { baseURL } from "@/utils/config";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    if (originalConfig.url !== "/api/auth/login" && error.response) {
      originalConfig._retry = true;
      try {
        await axiosInstance.post("/api/auth/refresh");
        return axiosInstance(originalConfig);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
