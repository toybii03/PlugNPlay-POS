import React, { ReactNode } from "react";
import { useAuth, User } from "@/contexts/AuthContext";
import LoginForm from "./LoginForm";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: User["role"];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-id="thd4jdvj1"
        data-path="src/components/auth/ProtectedRoute.tsx"
      >
        <div
          className="text-center"
          data-id="vt88co9wu"
          data-path="src/components/auth/ProtectedRoute.tsx"
        >
          <Loader2
            className="h-8 w-8 animate-spin mx-auto mb-4"
            data-id="sctfr4t55"
            data-path="src/components/auth/ProtectedRoute.tsx"
          />
          <p
            className="text-gray-600"
            data-id="37a1r6397"
            data-path="src/components/auth/ProtectedRoute.tsx"
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to home page instead of rendering LoginForm inline
    window.location.href = "/";
    return null;
  }

  if (
    requiredRole &&
    user.role !== requiredRole &&
    user.role !== "admin" &&
    user.role !== "manager"
  ) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-id="6b814xmrz"
        data-path="src/components/auth/ProtectedRoute.tsx"
      >
        <div
          className="text-center"
          data-id="a8yg8myw1"
          data-path="src/components/auth/ProtectedRoute.tsx"
        >
          <h1
            className="text-2xl font-bold text-red-600 mb-4"
            data-id="u4xw11h7a"
            data-path="src/components/auth/ProtectedRoute.tsx"
          >
            Access Denied
          </h1>
          <p
            className="text-gray-600"
            data-id="7lquh1yus"
            data-path="src/components/auth/ProtectedRoute.tsx"
          >
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
