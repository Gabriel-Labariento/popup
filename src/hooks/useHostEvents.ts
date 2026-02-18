import { useEffect, useState } from "react";
import { UserAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client/supabase";

export function useHostEvents() {
    const { session, loading: authLoading } = UserAuth();
    const [hasEvents, setHasEvents] = useState<boolean | null>(null); // null = loading
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        async function checkEvents() {
            if (!session?.user?.id) return;

            try {
                // Check if at least one exists
                const { count, error } = await supabase
                    .from('events')
                    .select('*', { count: 'exact', head: true }) // head: true makes it fast - no data returned, just count
                    .eq('host_id', session.user.id);

                if (error) throw error;

                setHasEvents(count !== null && count > 0);
            } catch (err) {
                console.error("Error checking events:", err);
                setHasEvents(false);
            } finally {
                setFetching(false);
            }
        }

        if (!authLoading) {
            checkEvents();
        }
    }, [session, authLoading]);

    return { hasEvents, fetching: fetching || authLoading };
}
