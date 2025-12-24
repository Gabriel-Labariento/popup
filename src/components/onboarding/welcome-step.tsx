import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

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
              <img src="icon.svg" alt="Pop Up Logo" />
            </div>
            <span className="text-2xl font-bold text-foreground">Pop Up</span>
          </div>
        </div>
        
        {/* Headline */}
        <h1 className="mb-8 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
          Where Events and Pop Up Businesses Meet
        </h1>

        {/* Subheading */}
        <p className="mb-12 text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
          A centralized platform where event hosts and pop-up vendors connect, apply, and collaborate—without the chaos.
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

        {/* Login */}
        <p className="mt-4 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline underline-offset-4"
            >
              Log in
            </Link>
        </p>
      </div>
    </div>
  )
}
