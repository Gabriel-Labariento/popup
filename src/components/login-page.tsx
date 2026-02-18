import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { UserAuth } from '@/context/AuthContext'

import { Footer } from './ui/footer'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { signInUser } = UserAuth()
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    setError(null)
    setLoading(true)

    try {
      // Replace this with your actual signInUser import call
      const result = await signInUser({ email, password })

      if (result?.success) {
        const role = result.data?.user.user_metadata.role
        if (role === 'HOST') navigate('/host/dashboard')
        else if (role === 'VENDOR') navigate('/vendor/dashboard')
        else navigate('/dashboard')
      } else {
        const errorMsg = result?.error?.message || ""
        if (errorMsg.includes("Invalid login credentials")) {
          setError("Incorrect email or password.")
        } else if (errorMsg.includes("Email not confirmed")) {
          setError("Please verify your email address before logging in.")
        } else {
          setError(errorMsg || "Failed to sign in. Please try again.")
        }
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

          {/* Logo and Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground">
                {/* If you don't have the SVG loaded yet, a placeholder icon works */}
                <img src="/icon.png" alt="Logo" className="h-6 w-6" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
              <span className="text-xl font-bold text-foreground">Pop Up</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          {/* ERROR DISPLAY - With smooth animation */}
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSignIn}>
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`h-12 bg-background ${error ? 'border-rose-300 focus-visible:ring-rose-200' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to='/'
              className="font-semibold text-primary hover:underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div >
  )
}