import { useEffect, useState } from "react";
import { UserAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client/supabase";
import { Link } from "react-router-dom";
import { CheckCircle, Calendar, Loader2 } from "lucide-react";
import HostEventsPage from "./EventsPage";

export function HostDashboard() {
  const { session, loading } = UserAuth();
  const [hasEvents, setHasEvents] = useState<boolean | null>(null); // null = loading
  const [fetchingEvents, setFetchingEvents] = useState(true);

  useEffect(() => {
    async function checkEvents() {
      if (!session?.user?.id) return;

      try {
        // We only need to know if at least one exists
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
        setFetchingEvents(false);
      }
    }

    if (!loading) {
      checkEvents();
    }
  }, [session, loading]);

  // 1. Show global loader while checking Auth and Database
  if (loading || fetchingEvents) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // 2. If the user HAS events, show the List Page
  if (hasEvents) {
    return <HostEventsPage />;
  }

  // 3. If the user HAS NO events, show the Default CTA
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
        </div>

        {/* Success Message */}
        <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">Welcome to Pop Up!</h2>
        <p className="mb-8 text-balance text-lg text-muted-foreground">
            Your account is ready. Start posting events and connecting with vendors.
        </p>

        {/* Next Steps Card */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-8 text-left">
          <h3 className="mb-4 text-xl font-bold text-foreground">Get started now</h3>
          <p className="mb-6 leading-relaxed text-muted-foreground">
              Create your first event listing and let vendors discover your opportunity.
          </p>

          {/* CTA Button */}
          <Link 
            to="/host/events/create" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-8 text-base w-full"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Post Your First Event
          </Link>
        </div>

        {/* Secondary Action */}
        <Link 
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors underline" 
          to="/host/profile"
        >
          Go to My Profile
        </Link>
      </div>
    </div>
  );
}