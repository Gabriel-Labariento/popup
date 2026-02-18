import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const createAnonClient = () => {
    return createClient(supabaseUrl, supabaseAnonKey)
}

export const createTestUser = async () => {
    const supabase = createAnonClient()
    const email = `test_${Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`
    const password = 'TestPassword123!'

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) throw error
    if (!data.user) throw new Error('User creation failed')

    // Return the client authenticated as this user
    const authenticatedClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${data.session?.access_token}`,
            },
        },
    })

    return { user: data.user, client: authenticatedClient, email, password, session: data.session }
}

export const createClientWithToken = (token: string) => {
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    })
}
