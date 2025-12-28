"use client"

import { Button } from "@/components/ui/button"
import { FileText, Users, ShieldCheck, Search, Star, TrendingUp } from "lucide-react"
import type { UserRole } from "@/App"

interface BenefitsStepProps {
  selectedRole: UserRole
  onNext: () => void
}

export function BenefitsStep({ selectedRole, onNext }: BenefitsStepProps) {
  const isHost = selectedRole === "HOST"

  const benefits = isHost
    ? [
        {
          icon: FileText,
          title: "Post events in minutes",
          description: "Create detailed event listings with just a few clicks. No spreadsheets needed.",
        },
        {
          icon: Users,
          title: "Receive organized applications",
          description: "All vendor applications in one place. Review, compare, and respond instantly.",
        },
        {
          icon: ShieldCheck,
          title: "Vet vendors with profiles",
          description: "View portfolios, ratings, and past events to choose the perfect vendors.",
        },
      ]
    : [
        {
          icon: Search,
          title: "Discover legitimate events",
          description: "Browse verified events in your area. Filter by date, type, and requirements.",
        },
        {
          icon: Star,
          title: "Apply with one profile",
          description: "Create your profile once and apply to unlimited events. No more repetitive forms.",
        },
        {
          icon: TrendingUp,
          title: "Build trust and credibility",
          description: "Collect reviews and showcase your work to stand out from the crowd.",
        },
      ]

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
            {isHost ? "Everything You Need to Run Great Events" : "Grow Your Business with Pop Up"}
          </h2>
          <p className="text-balance text-lg text-muted-foreground">
            {isHost
              ? "Simplify vendor management and focus on creating amazing experiences"
              : "Connect with opportunities and build your reputation"}
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-12 space-y-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={index}
                className="flex items-start gap-6 rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-bold text-foreground">{benefit.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Button size="lg" onClick={onNext} className="w-full md:w-auto">
            Create My Account
          </Button>
        </div>
      </div>
    </div>
  )
}
