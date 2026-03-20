import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client/supabase";
import { Loader2 } from "lucide-react";
import { UserRole } from "@/types";

export const AuthCallback = () => {
    const { session, loading } = UserAuth();
    const navigate = useNavigate();
    const processed = useRef(false);

    useEffect(() => {
        if (loading || processed.current) return;

        const handleCallback = async () => {
            processed.current = true;

            if (!session) {
                navigate("/login", { replace: true });
                return;
            }

            // Check if a role was stored during onboarding signup
            const pendingRole = localStorage.getItem("pending_oauth_role") as UserRole | null;
            localStorage.removeItem("pending_oauth_role");

            if (pendingRole) {
                // User came from onboarding flow — assign the pre-selected role
                await supabase.auth.updateUser({ data: { role: pendingRole } });
                navigate(
                    pendingRole === "HOST" ? "/host/dashboard" : "/vendor/dashboard",
                    { replace: true }
                );
                return;
            }

            // Check if user already has a role (returning OAuth user)
            const existingRole = session.user.user_metadata.role as UserRole | undefined;
            if (existingRole) {
                navigate(
                    existingRole === "HOST" ? "/host/dashboard" : "/vendor/dashboard",
                    { replace: true }
                );
                return;
            }

            // New OAuth user from login page — needs to select a role
            navigate("/select-role", { replace: true });
        };

        handleCallback();
    }, [session, loading, navigate]);

    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="animate-spin text-rose-600" size={48} />
        </div>
    );
};
