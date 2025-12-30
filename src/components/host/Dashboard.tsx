import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar} from "lucide-react"
import { UserAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom";

export function HostDashboard() {
  const {session, signOut} = UserAuth();
  const navigate = useNavigate()
  console.log("Current session: ", session)

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signOut()
      navigate("/login")
    } catch (error) {
      console.error("Error signing out: ", error)
    }
  }

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
          <Button size="lg" className="w-full hover:cursor-pointer">
                <Calendar className="mr-2 h-5 w-5" />
                Post Your First Event
          </Button>
        </div>

        {/* Secondary Action */}
        <Button variant="outline" size="lg" className="w-7/12 mb-3">
          Complete Your Profile
        </Button>
      </div>
    </div>
  )
}
