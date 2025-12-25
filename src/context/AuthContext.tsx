import { createContext, useEffect, useState, useContext, ReactNode } from "react";
import { supabase } from "@/lib/supabase/client/supabase";

const AuthContext = createContext<any>(null)

export const AuthContextProvider = ({children}: {children: ReactNode}) => {
    const [session, setSession] = useState<any>("hey")

    // Sign up 
    const signUpNewUser = async () => {
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
    const signOut = () => {
        const {error} = supabase.auth.signOut();
        if (error) {
            console.error("Sign out error: ", error)
        }
    }
    return (
        <AuthContext.Provider value={{session, signUpNewUser, signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext)
}