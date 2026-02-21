import { Navigate } from "react-router-dom";
import useAuthStore from "../store/auth.store";

interface Props {
  children: JSX.Element;
  roles?: string[];
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { token, user } = useAuthStore();

  if (!token) return <Navigate to="/auth/login" replace />;

  if (roles && !roles.includes(user?.role || "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
