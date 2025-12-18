import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/authContext";
const PublicRoute = ({ children }: {  children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <p className="p-6">Loading...</p>;

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
