import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get("/user");
      return response.data;
    },
    retry: false,
    enabled: !!localStorage.getItem("token"),
  });

  const login = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post("/login", credentials);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      // Set the token in the api client for subsequent requests
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return user;
    },
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      await api.post("/logout");
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  // On initial load, set the token in api client if it exists in localStorage
  if (localStorage.getItem("token")) {
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${localStorage.getItem("token")}`;
  }

  return {
    user: user as User | undefined,
    isLoading,
    login: login.mutate,
    logout: logout.mutate,
    isLoggingIn: login.isPending,
    isLoggingOut: logout.isPending,
  };
}
