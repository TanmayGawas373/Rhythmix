import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // ⛔ important

  if (!user) return <Navigate to="/login" />;

  return children;
}