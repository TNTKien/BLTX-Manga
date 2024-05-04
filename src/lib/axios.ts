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
  if (
    originalRequest?.url === "/api/auth/session" &&
    error.response?.status === 400
  ) {
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
        });

        return api(originalRequest);
      }
      const res = await api.post("/api/auth/refresh", {
        // headers: {
        //   Cookie: `authToken=${cookies().get(
        //     "authToken"
        //   )}; refreshToken=${cookies().get("refreshToken")}`,
        // },
      });
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

// import axios from "axios";
// import { baseURL } from "@/utils/config";
// import { cookies, headers } from "next/headers";

// const axiosInstance = axios.create({
//   baseURL,
//   timeout: 10000,
//   withCredentials: true,
// });

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalConfig = error.config;
//     console.log(error.response.status);
//     if (originalConfig.url !== "/api/auth/login" && error.response) {
//       // originalConfig._retry = true;
//       try {
//         await axiosInstance.post(
//           "/api/auth/refresh",
//           {},
//           {
//             withCredentials: true,
//             // headers: `authToken=${cookies().get("..")}; refreshToken=${cookies().get("")};`
//           }
//         );
//         return axiosInstance(originalConfig);
//       } catch (e) {
//         return Promise.reject(e);
//       }
//     }
//     return Promise.reject(error);
//   }
// );
// export default axiosInstance;
