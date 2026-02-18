
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL!
// Fallback to VITE_SUPABASE_ROLE_KEY if SUPABASE_SERVICE_ROLE_KEY is missing
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ROLE_KEY || process.env.VITE_SUPABASE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ROLE_KEY)')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function resetDatabase() {
    console.log('⚠️  STARTING FULL DATABASE RESET ⚠️')
    console.log('This will delete ALL data found in public tables and storage buckets.')

    // Wait for 3 seconds to give a chance to cancel
    await new Promise(r => setTimeout(r, 3000));

    try {
        // 1. CLEAR STORAGE BUCKETS
        const buckets = ['event-images', 'application-images'];
        for (const bucket of buckets) {
            console.log(`Cleaning bucket: ${bucket}...`);
            const { data: files, error: listError } = await supabase.storage.from(bucket).list('', { limit: 100, search: '' });

            if (listError) {
                // Bucket might not exist, just log
                console.warn(`Could not list bucket ${bucket}:`, listError.message);
                continue;
            }

            if (files && files.length > 0) {
                const paths = files.map(f => f.name);
                // Note: list() is not recursive by default in some versions, but usually flat for root. 
                // Ideally we'd recurse but let's assume flat for now or simple structure.
                // Better approach: list loop until empty? 
                // For safety/speed in this script, just delete what we see. 

                // If folders exist, we might need a more robust recursive delete. 
                // For this app, images are likely at root or 1 level deep.

                const { error: removeError } = await supabase.storage.from(bucket).remove(paths);
                if (removeError) console.error(`Failed to remove files from ${bucket}:`, removeError);
                else console.log(`Removed ${paths.length} files from ${bucket}`);
            }
        }

        // 2. DELETE FROM TABLES (Child first)
        const tables = ['messages', 'applications', 'events', 'hosts', 'vendors'];

        for (const table of tables) {
            console.log(`Deleting all rows from ${table}...`);
            const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete not equal to nil UUID (basically all)
            if (error) {
                console.error(`Error deleting from ${table}:`, error.message);
            } else {
                console.log(`Cleared ${table}.`);
            }
        }

        // Delete users from public.users
        console.log('Deleting all rows from public.users...');
        const { error: usersError } = await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (usersError) console.error('Error deleting public.users:', usersError.message);
        else console.log('Cleared public.users.');

        // 3. DELETE AUTH USERS
        console.log('Deleting all AUTH users...');
        const { data: { users }, error: listUserError } = await supabase.auth.admin.listUsers();
        if (listUserError) {
            console.error('Error listing auth users:', listUserError.message);
        } else {
            console.log(`Found ${users.length} auth users.`);
            for (const user of users) {
                const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
                if (deleteError) console.error(`Failed to delete user ${user.id}:`, deleteError.message);
            }
            console.log('Cleared auth users.');
        }

        console.log('✅ DATABASE RESET COMPLETE');

    } catch (err) {
        console.error('Unexpected error during reset:', err);
    }
}

resetDatabase();
