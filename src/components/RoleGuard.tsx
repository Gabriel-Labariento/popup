import { Navigate, Outlet } from "react-router-dom";
import { UserAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  allowedRole: 'HOST' | 'VENDOR' | undefined;
}

export const RoleGuard = ({ allowedRole }: RoleGuardProps) => {
  const { session, loading } = UserAuth();

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="animate-spin text-rose-600" size={48} />
        </div>
    )
  }
  if (!session) return <Navigate to="/login" replace />;

  const userRole = session.user.user_metadata.role;

  if (!userRole) return <Navigate to="/select-role" replace />;

  if (userRole !== allowedRole || allowedRole === undefined) {
    // Redirect to their own dashboard if they try to access the wrong role's area
    return <Navigate to={userRole === 'HOST' ? '/host/dashboard' : '/vendor/dashboard'} replace />;
  }

  return <Outlet />; // Renders the child routes
};