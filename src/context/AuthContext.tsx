import { createContext, useEffect, useState, useContext, ReactNode } from "react";
import { supabase } from "@/lib/supabase/client/supabase";
import { Session } from "@supabase/supabase-js";

export type UserCredentials = {
    email: string,
    password: string
}

type AuthContextType = {
    session: Session | null,
    signUpNewUser: (credentials: UserCredentials) => Promise<{success: boolean, error?: any, data?: any}>,
    signInUser: (credentials: UserCredentials) => Promise<{success: boolean, error?: any, data?: any}>,
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthContextProvider = ({children}: {children: ReactNode}) => {
    const [session, setSession] = useState<Session | null>(null)

    // Sign up 
    const signUpNewUser = async ({email, password}: UserCredentials) => {
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password
        })
        

        if (error) {
            console.error("Error signing up: ", error)
            return {success: false, error}
        }
        return {success: true, data}
    }
    
    // Sign in
    const signInUser = async ({email , password}: UserCredentials) => {
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            })
            if (error) {
                console.error("Sign in error: ", error)
                return {success: false, error}
            }
            console.log("sign-in success: ", data)
            return {success: true, data}
        } catch (error) {
            console.error("Error signing in: ", error)
            return {success: false, error}
        }
    }

    useEffect(() => {
        supabase.auth.getSession()
        .then(({data: {session}}) => {
            setSession(session)
        })
        
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    // Sign out
    const signOut = async () => {
        const {error} = await supabase.auth.signOut();
        if (error) {
            console.error("Sign out error: ", error)
        }
    }
    return (
        <AuthContext.Provider value={{session, signUpNewUser, signInUser, signOut }}>
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