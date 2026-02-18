import type React from "react"
import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Eye, EyeOff, Check, X } from "lucide-react"
import type { UserRole } from "@/types"
import { UserAuth } from "@/context/AuthContext"
import { useNavigate, Link } from "react-router-dom"

interface AccountCreationStepProps {
  selectedRole: UserRole | null
  onNext: () => void
}

export function AccountCreationStep({ selectedRole, onNext }: AccountCreationStepProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()


  const { session, signUpNewUser } = UserAuth()


  const passwordRequirements = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password)
  }

  const allRequirementsMet = Object.values(passwordRequirements).every((req) => req)
  const passwordsMatch = password === confirmPassword && confirmPassword !== ""

  const isFormValid = email && allRequirementsMet && passwordsMatch && password && confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) {
      setError("Form requirements not met")
      return
    }

    if (!selectedRole) {
      setError("Please select a role")
      return
    }

    setLoading(true)
    setError("")
    try {
      const result = await signUpNewUser({ email, password }, selectedRole)
      if (result?.success) {
        if (selectedRole == 'HOST') navigate('/host/dashboard')
        else if (selectedRole == 'VENDOR') navigate('/vendor/dashboard')
        onNext()
      } else {
        if (result?.error?.message === "User already registered") {
          setError("This email is already registered. Please log in instead.");
        } else {
          setError(result?.error?.message || "Failed to create account")
        }
      }
    } catch (error) {
      setError("An error occurred during account creation")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl">
                <img src="/icon.png" alt="Pop Up Logo" className="h-8 w-8" />
              </div>
              <span className="text-xl font-bold text-foreground">Pop Up</span>
            </div>
          </div>
          <h2 className="mb-3 text-3xl font-bold text-foreground">Create Your Account</h2>
          <p className="text-balance text-muted-foreground">
            {selectedRole === "HOST" ? "Start connecting with pop-up vendors" : "Start discovering events near you"}
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
                <PasswordRequirement met={passwordRequirements.hasLower} text="Contains a lowercase letter" />
                <PasswordRequirement met={passwordRequirements.hasUpper} text="Contains an uppercase letter" />
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

          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Submit */}
          <Button type="submit" size="lg" className="w-full" disabled={!isFormValid}>
            Create Account
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline underline-offset-4">
              Log in
            </Link>
          </p>
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
