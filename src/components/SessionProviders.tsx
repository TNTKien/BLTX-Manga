import axiosInstance from "@/lib/axios";
import { createContext, use, useEffect, useState } from "react";
import { User } from "@prisma/client";

const Context = createContext<userState | null>(null);

const initState: userState = {
  loading: false,
  user: null,
  error: null,
};

type userState = {
  loading: boolean;
  user: Pick<User, "id" | "email" | "username" | "role"> | null;
  error: any;
};

function SessionProviders({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useState(initState);
  useEffect(() => {
    const fetchUser = async () => {
      dispatch({ ...state, loading: true });
      try {
        const { data } = await axiosInstance.get("/api/auth/session");
        dispatch({ user: data.data, loading: false, error: null });
      } catch (error) {
        dispatch({ ...state, loading: false, error });
      }
    };
    fetchUser();
  }, []);
  return <Context.Provider value={state}>{children}</Context.Provider>;
}

function useSession() {
  const context = use(Context);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

export { SessionProviders, useSession };
