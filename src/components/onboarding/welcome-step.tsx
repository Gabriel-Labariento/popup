import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

interface WelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl text-center"
      >
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex items-center gap-2"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg bg-card border">
              <img src="/icon.png" alt="Pop Up Logo" className="h-8 w-8" />
            </div>
            <span className="text-2xl font-bold text-foreground">Pop Up</span>
          </motion.div>
        </div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl"
        >
          Where <span className="text-primary">Events</span> and <span className="text-primary">Pop Up Businesses</span> Meet
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-12 text-balance text-lg leading-relaxed text-muted-foreground md:text-xl"
        >
          A centralized platform where event hosts and pop-up vendors connect, apply, and collaborate—without the chaos.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button size="lg" onClick={onNext} className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all hover:scale-105">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent hover:bg-muted/50" asChild>
            <Link to="/how-it-works">
              Learn How It Works
            </Link>
          </Button>
        </motion.div>

        {/* Login */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-sm text-muted-foreground"
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:underline underline-offset-4"
          >
            Log in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  )
}
