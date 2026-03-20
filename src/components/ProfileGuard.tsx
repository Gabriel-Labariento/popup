import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useProfile } from "@/context/ProfileContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { UserAuth } from "@/context/AuthContext";

export const ProfileGuard = () => {
    const { isComplete, loading: profileLoading } = useProfile();
    const { session, loading: authLoading } = UserAuth();
    const location = useLocation();

    const isLoading = profileLoading || authLoading;

    // Determine the profile path based on role
    const role = session?.user?.user_metadata?.role;
    const profilePath = role === 'HOST' ? '/host/profile' : '/vendor/profile';

    const isProfilePage = location.pathname.includes('/profile');

    useEffect(() => {
        if (!isLoading && !isComplete && !isProfilePage) {
            toast.error("Please complete your profile to continue.", {
                id: "profile-incomplete-toast", // Prevent duplicate toasts
                duration: 5000,
            });
        }
    }, [isLoading, isComplete, isProfilePage]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-rose-600" size={48} />
            </div>
        );
    }

    // If profile is incomplete and we are NOT on the profile page, redirect to profile
    if (!isComplete && !isProfilePage) {
        return <Navigate to={profilePath} replace />;
    }

    return <Outlet />;
};
