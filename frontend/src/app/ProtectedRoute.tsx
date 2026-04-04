import { Navigate, Outlet } from "react-router-dom";
import { useAuth, getRoleRedirect } from "../features/auth/AuthContext";

interface Props {
  children?: React.ReactElement;
  roles?: string[];
  redirectTo?: string;
}

/**
 * ProtectedRoute — wraps routes that require authentication.
 * - No token → redirect to /login
 * - Token but wrong role → redirect to role's default dashboard
 * - Token + correct role (or no role restriction) → render
 */
export default function ProtectedRoute({ children, roles, redirectTo }: Props) {
  const { token, user, loading } = useAuth();

  // Still hydrating from localStorage
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-500">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!token) {
    return <Navigate to={redirectTo || "/login"} replace />;
  }

  // Role restriction check
  if (roles && user && !roles.includes(user.role)) {
    // Redirect to their correct dashboard instead of /unauthorized
    return <Navigate to={getRoleRedirect(user.role)} replace />;
  }

  // Render children (for single-element usage) or outlet (for nested routes)
  return children ? children : <Outlet />;
}
