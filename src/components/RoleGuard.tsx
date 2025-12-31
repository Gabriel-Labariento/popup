import { Navigate, Outlet } from "react-router-dom";
import { UserAuth } from "@/context/AuthContext";
import { Spinner } from "./ui/spinner";

interface RoleGuardProps {
  allowedRole: 'HOST' | 'VENDOR';
}

export const RoleGuard = ({ allowedRole }: RoleGuardProps) => {
  const { session, loading } = UserAuth();

  if (loading) return <Spinner></Spinner>
  if (!session) return <Navigate to="/login" replace />;
  
  const userRole = session.user.user_metadata.role;

  if (userRole !== allowedRole) {
    // Redirect to their own dashboard if they try to access the wrong role's area
    return <Navigate to={userRole === 'HOST' ? '/host/dashboard' : '/vendor/dashboard'} replace />;
  }

  return <Outlet />; // Renders the child routes
};