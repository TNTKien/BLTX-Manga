import axiosInstance from "./axios";
import { User } from "@prisma/client";
import { cookies } from "next/headers";

export async function getAuthSession() {
  try {
    const { status, data } = await axiosInstance.get("/api/auth/session", {
      headers: {
        Cookie: `authToken=${cookies().get("authToken")?.value}`,
      },
    });
    //console.log(status);
    if (status === 200) {
      return data.data as Pick<User, "id" | "email" | "username" | "role">;
    } else {
      return null;
    }
  } catch (error) {
    //console.error(error);
    return null;
  }
}
