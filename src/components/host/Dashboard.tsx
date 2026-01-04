import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar} from "lucide-react"
import { UserAuth } from "@/context/AuthContext"
import { Link, useNavigate } from "react-router-dom";
import { FormEvent } from "react";

export function HostDashboard() {
  const {session} = UserAuth();

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
          <Link to="/host/create-event" className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-8 text-base w-full hover:cursor-pointer" >
                <Calendar className="mr-2 h-5 w-5" />
                Post Your First Event
          </Link>
        </div>

        {/* Secondary Action */}
        <Link className="w-7/12 mb-3 button-styles" to="/host/profile">
          Go to My Profile
        </Link>
      </div>
    </div>
  )
}
