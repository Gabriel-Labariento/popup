
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL!
// Fallback to VITE_SUPABASE_ROLE_KEY if SUPABASE_SERVICE_ROLE_KEY is missing
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ROLE_KEY)')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function cleanup() {
    console.log('Starting cleanup...')

    // 1. Delete test users
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
        console.error('Error listing users:', listError)
        return
    }

    const testUsers = users.filter(u => u.email?.startsWith('test_') || u.email?.startsWith('dummy_'))

    console.log(`Found ${testUsers.length} test users to delete.`)

    for (const user of testUsers) {
        console.log(`Deleting user ${user.email} (${user.id})...`)
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
        if (deleteError) {
            console.error(`Failed to delete user ${user.id}:`, deleteError)
        } else {
            console.log(`Deleted user ${user.id}`)
        }
    }

    // 2. Delete stray events
    const { data: testEvents, error: eventError } = await supabase
        .from('events')
        .select('id, title')
        .ilike('title', '%Test%')

    if (eventError) {
        console.error('Error listing events:', eventError)
    } else if (testEvents && testEvents.length > 0) {
        console.log(`Found ${testEvents.length} stray test events. Deleting...`)
        const ids = testEvents.map(e => e.id)
        const { error: deleteEventError } = await supabase
            .from('events')
            .delete()
            .in('id', ids)

        if (deleteEventError) console.error('Error deleting events:', deleteEventError)
        else console.log('Deleted stray test events.')
    }

    console.log('Cleanup complete.')
}

cleanup()
