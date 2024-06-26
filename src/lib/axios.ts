import axios, { AxiosError } from "axios";
import { baseURL } from "@/utils/config";
import { cookies } from "next/headers";
const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.response.use((res) => res, rotateTokenHandler);

async function rotateTokenHandler(error: AxiosError) {
  const originalRequest = error.config;
  //console.log(error);
  //console.log(typeof window);
  if (
    // originalRequest?.url === "/api/auth/session" &&
    //@ts-ignore
    error.response?.data?.message === "Invalid token" &&
    !!originalRequest &&
    //@ts-ignore
    !originalRequest?._retry &&
    error.response?.status === 401
  ) {
    //@ts-ignore
    originalRequest._retry = true;
    try {
      if (typeof window === "undefined") {
        const cookies = (await import("next/headers")).cookies;
        console.log(cookies().get("authToken"));
        await api.post("/api/auth/refresh", {
          headers: {
            Cookie: `authToken=${
              cookies().get("authToken")?.value
            }; refreshToken=${cookies().get("refreshToken")?.value}`,
          },
          withCredentials: true,
        });

        return api(originalRequest);
      }
      const res = await api.post(
        "/api/auth/refresh",
        {
          // headers: {
          //   Cookie: `authToken=${cookies().get(
          //     "authToken"
          //   )}; refreshToken=${cookies().get("refreshToken")}`,
          // },
        },
        {
          withCredentials: true,
        }
      );
      //console.log(res);
      return api(originalRequest);
    } catch (e) {
      //console.log(e);
      return Promise.reject(e);
    }
  }

  return Promise.reject(error);
}

export default api;
