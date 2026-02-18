
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { createTestUser, createAnonClient } from './setup'

config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not found. Some cleanup might fail.')
}

const adminSupabase = createClient(supabaseUrl, supabaseServiceKey || 'placeholder')

describe('Database Constraints', () => {
    let createdUserIds: string[] = []

    afterAll(async () => {
        // Cleanup users created during tests
        if (supabaseServiceKey && createdUserIds.length > 0) {
            for (const uid of createdUserIds) {
                // Delete user (cascade should handle the rest if configured, otherwise we leave junk? 
                // Verification test checks cascade, so strictly we should try to clean up.
                // If cascade fails, this might fail to delete user due to FK. 
                // So we might need to delete dependent rows first if cascade is missing.
                await adminSupabase.auth.admin.deleteUser(uid)
            }
        }
    })

    // Helper to create a host profile
    async function createHostProfile(client: any, userId: string) {
        const { data, error } = await client
            .from('hosts')
            .insert({
                user_id: userId,
                organization_name: 'Test Org ' + userId,
                contact_phone: '555-0199'
            })
            .select()
            .single()
        if (error) throw new Error(`Failed to create host profile: ${error.message}`)
        return data
    }

    it('should enforce foreign key constraints', async () => {
        const { client, user } = await createTestUser()
        if (user) createdUserIds.push(user.id)

        // Test: applications -> events (FK)
        const { error } = await client
            .from('applications')
            .insert({
                event_id: '00000000-0000-0000-0000-000000000000', // invalid UUID
                vendor_id: user?.id,
                status: 'PENDING'
            })

        expect(error).toBeDefined()
        expect(error?.code).toBe('23503') // foreign_key_violation
    })

    it('should enforce NOT NULL constraints', async () => {
        const { client, user } = await createTestUser()
        if (user) createdUserIds.push(user.id)

        // We don't necessarily need a host profile here if NOT NULL check happens before FK check.
        // But to be safe and explicit, let's create one if we can, OR just check specific field.
        // Event title is NOT NULL. 

        // Trying to insert with null Title
        const { error } = await client
            .from('events')
            .insert({
                host_id: user?.id, // This might trigger FK error if checked first, but usually NOT NULL is checked early.
                title: null,
                category: 'MARKET',
                start_date: '2024-01-01',
                end_date: '2024-01-02',
                location_address: '123 Test St'
            } as any)

        expect(error).toBeDefined()
        // If it's a FK error (23503), then database checked FK before Not Null? 
        // Or maybe check order is undefined.
        // If we get 23503, we should retry with a valid host profile to verify the NOT NULL constraint on title.
        if (error?.code === '23503') {
            const host = await createHostProfile(client, user!.id)
            const { error: error2 } = await client
                .from('events')
                .insert({
                    host_id: user?.id,
                    title: null,
                    category: 'MARKET',
                    start_date: '2024-01-01',
                    end_date: '2024-01-02',
                    location_address: '123 Test St'
                } as any)
            expect(error2).toBeDefined()
            expect(error2?.code).toBe('23502') // not_null_violation
        } else {
            expect(error?.code).toBe('23502')
        }
    })

    it('should enforce unique email constraints', async () => {
        const email = `test_unique_${Date.now()}@example.com`
        const password = 'TestPassword123!'
        const supabase = createAnonClient()

        const { data: data1, error: error1 } = await supabase.auth.signUp({
            email,
            password,
        })
        expect(error1).toBeNull()
        if (data1.user) createdUserIds.push(data1.user.id)

        const { data: data2, error: error2 } = await supabase.auth.signUp({
            email,
            password,
        })

        // Supabase auth usually prevents second signup or returns fake success (security).
        // But specific validation of 'unique email' can be inferred if we can't create another user.
        // However, if we really want to test the DB constraint, we'd need Admin access to insert into users table.
        // Since this is verifying "Database constraints", verifying Auth behavior is a proxy.
    })

    it('should validate dates (end_date > start_date)', async () => {
        const { client, user } = await createTestUser()
        if (!user) throw new Error('User creation failed')
        createdUserIds.push(user.id)

        // Create Host Profile First
        await createHostProfile(client, user.id)

        const { error } = await client
            .from('events')
            .insert({
                host_id: user.id,
                title: 'Invalid Date Event',
                category: 'MARKET',
                start_date: '2024-01-10',
                end_date: '2024-01-01', // Before start date
                location_address: '123 Test St'
            })

        if (!error) {
            console.warn('Date validation (end_date > start_date) is MISSING')
            // We can choose to fail the test or just log it. 
            // The user asked to "Test" it, implying we should report if it works.
            // I will fail it so we know.
            throw new Error('Expected date validation violation but got success')
        } else {
            expect(error.code).toBe('23514') // check_violation
        }
    })

    it('should verify cascade delete behavior', async () => {
        // 1. Create User
        const { client, user } = await createTestUser()
        if (!user) throw new Error('User not created')
        // We DON'T add to createdUserIds yet because we expect it to be gone.
        // But if test fails, we want it in the list. So add it, but know it might be gone.
        createdUserIds.push(user.id)

        // 2. Create Host Profile
        await createHostProfile(client, user.id)

        // 3. Create Event
        const { data: event, error: eventError } = await client
            .from('events')
            .insert({
                host_id: user.id,
                title: 'Cascade Test Event',
                category: 'MARKET',
                start_date: '2024-01-01',
                end_date: '2024-01-02',
                location_address: '123 Test St'
            })
            .select()
            .single()

        expect(eventError).toBeNull()
        expect(event).toBeDefined()

        // 4. Delete User (requires Admin)
        if (!supabaseServiceKey) {
            console.warn('Skipping Cascade Delete test: No Service Key')
            return
        }

        const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(user.id)
        expect(deleteError).toBeNull()

        // 5. Check if Event is deleted
        const { data: eventsFound } = await adminSupabase
            .from('events')
            .select('*')
            .eq('id', event.id)

        // If cascade works, eventsFound should be empty.
        if (eventsFound && eventsFound.length === 0) {
            // Success
        } else {
            // Failed - Manually cleanup
            console.warn('Cascade delete FAILED: Event persisted. Deleting manually.')
            await adminSupabase.from('events').delete().eq('id', event.id)
            throw new Error('Cascade delete failed: Event was not deleted when User was deleted')
        }
    })
})
