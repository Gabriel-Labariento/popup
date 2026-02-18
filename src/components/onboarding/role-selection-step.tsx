import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Calendar, ShoppingBag, Check } from "lucide-react"
import { motion } from "framer-motion"
import type { UserRole } from "@/types"

interface RoleSelectionStepProps {
  selectedRole: UserRole | null
  onRoleSelect: (role: UserRole) => void
  onNext: () => void
}

export function RoleSelectionStep({ selectedRole, onRoleSelect, onNext }: RoleSelectionStepProps) {
  const handleContinue = () => {
    if (!selectedRole) {
      toast.error("Please select a role to continue")
      return
    }
    onNext()
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 text-3xl font-bold text-foreground md:text-4xl"
          >
            We want to get to know you
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-balance text-lg text-muted-foreground"
          >
            Select the option that best describes you
          </motion.p>
        </div>

        {/* Role Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mb-8 grid gap-6 md:grid-cols-2"
        >
          {/* Event Host Card */}
          <motion.div variants={item}>
            <Card
              className={`relative cursor-pointer border-2 p-8 transition-all duration-200 ${selectedRole === "HOST" ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50 hover:shadow-sm"
                }`}
              onClick={() => onRoleSelect("HOST")}
            >
              {selectedRole === "HOST" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary"
                >
                  <Check className="h-5 w-5 text-primary-foreground" />
                </motion.div>
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
          </motion.div>

          {/* Pop-Up Vendor Card */}
          <motion.div variants={item}>
            <Card
              className={`relative cursor-pointer border-2 p-8 transition-all duration-200 ${selectedRole === "VENDOR" ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50 hover:shadow-sm"
                }`}
              onClick={() => onRoleSelect("VENDOR")}
            >
              {selectedRole === "VENDOR" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary"
                >
                  <Check className="h-5 w-5 text-primary-foreground" />
                </motion.div>
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
          </motion.div>
        </motion.div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button size="lg" onClick={handleContinue} disabled={!selectedRole} className="w-full md:w-auto shadow-md transition-all hover:scale-105 active:scale-95">
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
