import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "manager" | "cashier";
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored auth token on mount
    const storedUser = localStorage.getItem("pos_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("pos_user");
      }
    }
    setIsLoading(false);
  }, [navigate]);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/login", {
        email: username,
        password,
      });

      const userData = response.data.user;
      const token = response.data.token;

      // Save the token
      localStorage.setItem("token", token);
      setUser(userData);
      localStorage.setItem("pos_user", JSON.stringify(userData));

      // Redirect based on role ONLY after login
      if (userData.role === "admin" || userData.role === "manager") {
        navigate("/dashboard");
      } else if (userData.role === "cashier") {
        navigate("/sales");
      }

      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error);
      setError(
        error.response?.data?.message ||
          "An error occurred during login. Please try again."
      );
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("pos_user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
