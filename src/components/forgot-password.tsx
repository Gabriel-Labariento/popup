import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { UserAuth } from '@/context/AuthContext'

import { Footer } from './ui/footer'

export function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const { resetPassword } = UserAuth()

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()

        setError(null)
        setLoading(true)

        try {
            const result = await resetPassword(email)

            if (result.success) {
                setSuccess(true)
            } else {
                setError(result.error?.message || "Failed to send reset email. Please try again.")
            }
        } catch (err) {
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
                        <Link to="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to login
                        </Link>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground">
                                <img src="/icon.png" alt="Logo" className="h-10 w-10" onError={(e) => e.currentTarget.style.display = 'none'} />
                            </div>
                            <span className="text-xl font-bold text-foreground">Pop Up</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Forgot password?</h1>
                        <p className="mt-2 text-muted-foreground">
                            No worries, we'll send you reset instructions.
                        </p>
                    </div>

                    {/* SUCCESS STATE */}
                    {success ? (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center animate-in fade-in zoom-in-95 duration-300">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-green-900">Check your email</h3>
                            <p className="text-sm text-green-700 mb-6">
                                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
                            </p>
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => {
                                    setSuccess(false)
                                    setEmail('')
                                }}
                            >
                                Send another email
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* ERROR DISPLAY */}
                            {error && (
                                <div className="mb-6 flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 animate-in fade-in slide-in-from-top-2">
                                    <Mail className="h-5 w-5 flex-shrink-0" />
                                    <p className="font-medium">{error}</p>
                                </div>
                            )}

                            {/* Reset Form */}
                            <form className="space-y-6" onSubmit={handleResetPassword}>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className={`h-12 bg-background ${error ? 'border-rose-300 focus-visible:ring-rose-200' : ''}`}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full text-base font-semibold"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending reset link...
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
        </div>
    )
}
