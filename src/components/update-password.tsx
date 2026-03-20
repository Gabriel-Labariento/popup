import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2, CheckCircle2, Eye, EyeOff, Check, X } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { UserAuth } from '@/context/AuthContext'

import { Footer } from './ui/footer'

export function UpdatePassword() {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const { updatePassword } = UserAuth()

    const passwordRequirements = {
        minLength: password.length >= 8,
        hasNumber: /\d/.test(password),
        hasUpper: /[A-Z]/.test(password),
        hasLower: /[a-z]/.test(password)
    }

    const allRequirementsMet = Object.values(passwordRequirements).every((req) => req)
    const passwordsMatch = password === confirmPassword && confirmPassword !== ""
    const isFormValid = allRequirementsMet && passwordsMatch

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        setError(null)

        if (!isFormValid) {
            setError("Please meet all password requirements.")
            return
        }

        setLoading(true)

        try {
            const result = await updatePassword(password)

            if (result.success) {
                setSuccess(true)
                // Redirect after a short delay or let user click
                setTimeout(() => navigate('/login'), 3000)
            } else {
                setError(result.error?.message || "Failed to update password. Please try again.")
            }
        } catch (_err) {
            setError("An unexpected error occurred. Please check your connection.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-md">

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground">
                                <img src="/icon.png" alt="Logo" className="h-6 w-6" onError={(e) => e.currentTarget.style.display = 'none'} />
                            </div>
                            <span className="text-xl font-bold text-foreground">Pop Up</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Set new password</h1>
                        <p className="mt-2 text-muted-foreground">
                            Create a strong password for your account.
                        </p>
                    </div>

                    {/* SUCCESS STATE */}
                    {success ? (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center animate-in fade-in zoom-in-95 duration-300">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-green-900">Password updated!</h3>
                            <p className="text-sm text-green-700 mb-6">
                                Your password has been successfully reset. You can now log in with your new password.
                            </p>
                            <Button
                                className="w-full"
                                onClick={() => navigate('/login')}
                            >
                                Go to Login
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* ERROR DISPLAY */}
                            {error && (
                                <div className="mb-6 flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                    <p className="font-medium">{error}</p>
                                </div>
                            )}

                            {/* Reset Form */}
                            <form className="space-y-6" onSubmit={handleUpdatePassword}>
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className={error ? 'border-rose-300 focus-visible:ring-rose-200' : ''}
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

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className={error ? 'border-rose-300 focus-visible:ring-rose-200' : ''}
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

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full text-base font-semibold"
                                    disabled={loading || !isFormValid}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating password...
                                        </>
                                    ) : (
                                        'Reset password'
                                    )}
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            </div>
            <Footer />
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
