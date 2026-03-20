import { createContext, useEffect, useState, useContext, ReactNode } from "react";
import { supabase } from "@/lib/supabase/client/supabase";
import { Session, AuthError } from "@supabase/supabase-js";
import { UserRole } from "@/types";

export type UserCredentials = {
    email: string,
    password: string
}

type AuthContextType = {
    session: Session | null,
    loading: boolean,
    signUpNewUser: (credentials: UserCredentials, selectedRole: UserRole) => Promise<{ success: boolean, error?: AuthError, data?: any }>,
    signInUser: (credentials: UserCredentials) => Promise<{ success: boolean, error?: AuthError, data?: any }>,
    signInWithGoogle: () => Promise<{ success: boolean, error?: AuthError }>,
    signOut: () => Promise<void>,
    resetPassword: (email: string) => Promise<{ success: boolean, error?: AuthError }>,
    updatePassword: (password: string) => Promise<{ success: boolean, error?: AuthError }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        supabase.auth.getSession()
            .then(({ data: { session } }) => {
                setSession(session)
                setLoading(false)
            })

        supabase.auth.onAuthStateChange((_event, session) => {

            setSession(session)
            setLoading(false)
        })
    }, [])

    // Sign up 
    const signUpNewUser = async ({ email, password }: UserCredentials, selectedRole: UserRole): Promise<{ success: boolean, error?: AuthError, data?: any }> => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    role: selectedRole
                }
            }
        })
        if (error) {
            return { success: false, error }
        }
        return { success: true, data }
    }

    // Sign in
    const signInUser = async ({ email, password }: UserCredentials): Promise<{ success: boolean, error?: AuthError, data?: any }> => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            })
            if (error) {
                return { success: false, error }
            }

            return { success: true, data: data }
        } catch (error) {
            return { success: false, error: error as AuthError }
        }
    }

    // Sign out
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            // Error already surfaced via Supabase
        }
    }

    // Sign in with Google
    const signInWithGoogle = async (): Promise<{ success: boolean, error?: AuthError }> => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            }
        })
        if (error) {
            return { success: false, error }
        }
        return { success: true }
    }

    // Reset Password Request
    const resetPassword = async (email: string): Promise<{ success: boolean, error?: AuthError }> => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`,
        })
        if (error) {
            return { success: false, error }
        }
        return { success: true }
    }

    // Update Password
    const updatePassword = async (password: string): Promise<{ success: boolean, error?: AuthError }> => {
        const { error } = await supabase.auth.updateUser({ password })
        if (error) {
            return { success: false, error }
        }
        return { success: true }
    }

    return (
        <AuthContext.Provider value={{ session, loading, signUpNewUser, signInUser, signInWithGoogle, signOut, resetPassword, updatePassword }}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("UserAuth must be used within an AuthContextProvider")
    }
    return context
}