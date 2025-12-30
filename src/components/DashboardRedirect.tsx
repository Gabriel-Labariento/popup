import { UserAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export const DashboardRedirect = () => {
  const { session } = UserAuth();
  return <Navigate to={session?.user.user_metadata.role === 'HOST' ? '/host/dashboard' : '/vendor/dashboard'} replace />;
}

export default DashboardRedirect