import { Button } from "@/components/ui/button"
import { CheckCircle, Search } from "lucide-react"
import { UserRole } from "@/App"

export function VendorDashboard() {
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
        Your account is ready. Start discovering events and growing your business.
        </p>

        {/* Next Steps Card */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-8 text-left">
          <h3 className="mb-4 text-xl font-bold text-foreground">Get started now</h3>
          <p className="mb-6 leading-relaxed text-muted-foreground">
            Browse available events in your area and submit your first application.
          </p>

          {/* CTA Button */}
          <Button size="lg" className="w-full">
                <Search className="mr-2 h-5 w-5" />
                Browse Available Events
          </Button>
        </div>

        {/* Secondary Action */}
        <Button variant="outline" size="lg">
          Complete Your Profile
        </Button>
      </div>
    </div>
  )
}
