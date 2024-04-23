import axiosInstance from "./axios";
import { User } from "@prisma/client";

export async function getAuthSession() {
  try {
    const { status, data } = await axiosInstance.get("/api/auth/session");

    if (status === 200) {
      return data as Pick<User, "id" | "email" | "username">;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
