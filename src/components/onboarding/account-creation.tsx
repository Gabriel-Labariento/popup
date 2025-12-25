import type React from "react"

import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Eye, EyeOff, Check, X } from "lucide-react"
import type { UserRole } from "@/App"
import { UserAuth } from "@/context/AuthContext"

interface AccountCreationStepProps {
  selectedRole: UserRole
  onNext: () => void
}

export function AccountCreationStep({ selectedRole, onNext }: AccountCreationStepProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState("")

  const {session, signUpNewUser} = UserAuth()
  console.log(session)
  
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasLetter: /[a-zA-Z]/.test(password),
  }

  const allRequirementsMet = Object.values(passwordRequirements).every((req) => req)
  const passwordsMatch = password === confirmPassword && confirmPassword !== ""

  const isFormValid = email && allRequirementsMet && passwordsMatch && password && confirmPassword

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      onNext()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-3xl font-bold text-foreground">Create Your Account</h2>
          <p className="text-balance text-muted-foreground">
            {selectedRole === "host" ? "Start connecting with pop-up vendors" : "Start discovering events near you"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Requirements */}
            {password && (
              <div className="space-y-1.5 rounded-lg bg-muted/50 p-3 text-sm">
                <PasswordRequirement met={passwordRequirements.minLength} text="At least 8 characters" />
                <PasswordRequirement met={passwordRequirements.hasNumber} text="Contains a number" />
                <PasswordRequirement met={passwordRequirements.hasLetter} text="Contains a letter" />
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Match Indicator */}
            {confirmPassword && (
              <div className="flex items-center gap-2 text-sm">
                {passwordsMatch ? (
                  <>
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-primary">Passwords match</span>
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 text-destructive" />
                    <span className="text-destructive">Passwords don&apos;t match</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Trust Microcopy */}
          <p className="text-balance text-sm text-muted-foreground">
            We don&apos;t share your contact details publicly. Your privacy is protected.
          </p>

          {/* Submit */}
          <Button type="submit" size="lg" className="w-full" disabled={!isFormValid}>
            Create Account
          </Button>
        </form>
      </div>
    </div>
  )
}

function PasswordRequirement({
  met,
  text,
}: {
  met: boolean
  text: string
}) {
  return (
    <div className="flex items-center gap-2">
      {met ? <Check className="h-4 w-4 text-primary" /> : <X className="h-4 w-4 text-muted-foreground" />}
      <span className={met ? "text-primary" : "text-muted-foreground"}>{text}</span>
    </div>
  )
}
