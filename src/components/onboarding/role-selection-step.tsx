"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, ShoppingBag, Check } from "lucide-react"
import type { UserRole } from "@/App"

interface RoleSelectionStepProps {
  selectedRole: UserRole
  onRoleSelect: (role: UserRole) => void
  onNext: () => void
}

export function RoleSelectionStep({ selectedRole, onRoleSelect, onNext }: RoleSelectionStepProps) {
  const handleContinue = () => {
    if (!selectedRole) {
      alert("Please select a role to continue")
      return
    }
    onNext()
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">We want to get to know you</h2>
          <p className="text-balance text-lg text-muted-foreground">Select the option that best describes you</p>
        </div>

        {/* Role Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {/* Event Host Card */}
          <Card
            className={`relative cursor-pointer border-2 p-8 transition-all hover:shadow-lg ${
              selectedRole === "host" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
            onClick={() => onRoleSelect("host")}
          >
            {selectedRole === "host" && (
              <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <Check className="h-5 w-5 text-primary-foreground" />
              </div>
            )}

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Calendar className="h-8 w-8 text-primary" />
            </div>

            <h3 className="mb-3 text-2xl font-bold text-foreground">I&apos;m an Event Host</h3>

            <p className="mb-6 leading-relaxed text-muted-foreground">
              Post your event, review vendor applications, and find the right pop-up partners—fast.
            </p>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Perfect for:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Student organizations</li>
                <li>• Bazaar organizers</li>
                <li>• Community events</li>
              </ul>
            </div>
          </Card>

          {/* Pop-Up Vendor Card */}
          <Card
            className={`relative cursor-pointer border-2 p-8 transition-all hover:shadow-lg ${
              selectedRole === "vendor" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
            onClick={() => onRoleSelect("vendor")}
          >
            {selectedRole === "vendor" && (
              <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <Check className="h-5 w-5 text-primary-foreground" />
              </div>
            )}

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>

            <h3 className="mb-3 text-2xl font-bold text-foreground">I&apos;m a Pop-Up Vendor</h3>

            <p className="mb-6 leading-relaxed text-muted-foreground">
              Discover events, apply to booths, and grow your business without relying on word of mouth.
            </p>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Perfect for:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Food & beverage</li>
                <li>• Merch & apparel</li>
                <li>• Art & crafts</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button size="lg" onClick={handleContinue} disabled={!selectedRole} className="w-full md:w-auto">
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
