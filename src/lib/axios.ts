import axios from "axios";
import { baseURL } from "@/utils/config";
import { cookies, headers } from "next/headers";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    //console.log(error);
    const originalConfig = error.config;
    //console.log(error.response.status);
    if (
      originalConfig.url !== "/api/auth/login" &&
      error.response &&
      error.response.status === 401
    ) {
      originalConfig._retry = true;
      try {
        await axiosInstance.post(
          "/api/auth/refresh",
          {},
          {
            withCredentials: true,
            // headers: `authToken=${cookies().get("..")}; refreshToken=${cookies().get("")};`
          }
        );
        return axiosInstance(originalConfig);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
