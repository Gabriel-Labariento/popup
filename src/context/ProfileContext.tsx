import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/lib/supabase/client/supabase";
import { UserAuth } from "./AuthContext";
import { HostProfile, VendorProfile, UserRole } from "@/types";

type ProfileContextType = {
    profile: HostProfile | VendorProfile | null;
    loading: boolean;
    isComplete: boolean;
    refetch: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileContextProvider = ({ children }: { children: ReactNode }) => {
    const { session, loading: authLoading } = UserAuth();
    const [profile, setProfile] = useState<HostProfile | VendorProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        if (!session?.user) {
            console.log("[ProfileContext] No user session found. Setting profile to null.");
            setProfile(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const role = session.user.user_metadata.role as UserRole;
            console.log("[ProfileContext] Fetching profile for user:", session.user.id, "Role:", role);

            const table = role === 'HOST' ? 'hosts' : 'vendors';

            const { data, error } = await supabase
                .from(table)
                .select('*')
                .eq('user_id', session.user.id)
                .maybeSingle();

            if (error) {
                console.error("[ProfileContext] Error fetching profile:", error);
            }

            console.log("[ProfileContext] Profile data fetched:", data);
            setProfile(data);
        } catch (error) {
            console.error("[ProfileContext] Unexpected error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => {
        if (!authLoading) {
            fetchProfile();
        }
    }, [authLoading, fetchProfile]);

    // Check if profile is complete
    const isComplete = Boolean(
        profile &&
        // Basic check: must have a name. You can expand this logic.
        ('organization_name' in profile ? profile.organization_name : profile.business_name)
    );

    console.log("[ProfileContext] State - Loading:", loading, "IsComplete:", isComplete, "Profile:", profile);

    return (
        <ProfileContext.Provider value={{ profile, loading, isComplete, refetch: fetchProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error("useProfile must be used within a ProfileContextProvider");
    }
    return context;
};
