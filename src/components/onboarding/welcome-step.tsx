"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface WelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary-foreground"
              >
                <path
                  d="M3 9h4V3H3v6zm0 12h4v-6H3v6zm6 0h4v-6H9v6zm0-12h4V3H9v6zm6 12h4v-6h-4v6zm0-18v6h4V3h-4z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold text-foreground">Pop Up</span>
          </div>
        </div>

        {/* Hero Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative h-48 w-full max-w-md">
            <img
              src="/abstract-modern-illustration-connecting-people-and.jpg"
              alt="Pop Up connecting events and vendors"
              className="h-full w-full rounded-2xl object-cover"
            />
          </div>
        </div>

        {/* Headline */}
        <h1 className="mb-4 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
          Where Events and Pop-Up Businesses Meet
        </h1>

        {/* Subheading */}
        <p className="mb-8 text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
          A centralized platform where event hosts and pop-up vendors connect, apply, and collaborate—without the chaos
          of Facebook groups.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" onClick={onNext} className="w-full sm:w-auto">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent" onClick={onNext}>
            Learn How It Works
          </Button>
        </div>
      </div>
    </div>
  )
}
