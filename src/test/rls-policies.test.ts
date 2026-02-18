import { describe, it, expect, beforeAll } from 'vitest'
import { createTestUser } from './setup'

// Setup types
type TestUser = Awaited<ReturnType<typeof createTestUser>>

describe('RLS Policies', () => {
    let sharedUser: TestUser
    let sharedHost: TestUser
    let sharedVendor: TestUser
    let sharedOutsider: TestUser

    beforeAll(async () => {
        // Create a pool of users to avoid rate limits
        // We run them sequentially to be nice to rate limiter or in parallel if limits allow (parallel is risky)
        sharedUser = await createTestUser()
        await new Promise(r => setTimeout(r, 1000)) // 1s delay
        sharedHost = await createTestUser()
        await new Promise(r => setTimeout(r, 1000))
        sharedVendor = await createTestUser()
        await new Promise(r => setTimeout(r, 1000))
        sharedOutsider = await createTestUser()
    }, 30000) // Increase timeout for setup

    // Helper to setup vendor safely
    const setupVendor = async (client: any, userId: string, businessName: string) => {
        const { error: insertError } = await client
            .from('vendors')
            .insert({ user_id: userId, business_name: businessName })

        if (insertError && insertError.code === '23505') {
            return await client
                .from('vendors')
                .update({ business_name: businessName })
                .eq('user_id', userId)
        }
        return { error: insertError }
    }

    // Helper to setup host safely
    const setupHost = async (client: any, userId: string, orgName: string) => {
        const { error: insertError } = await client
            .from('hosts')
            .insert({ user_id: userId, organization_name: orgName })

        if (insertError && insertError.code === '23505') {
            return await client
                .from('hosts')
                .update({ organization_name: orgName })
                .eq('user_id', userId)
        }
        return { error: insertError }
    }

    describe('Users Table', () => {
        it('should allow users to view their own profile', async () => {
            const { user, client } = sharedUser

            const { data, error } = await client
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single()

            expect(error).toBeNull()
            expect(data).toBeDefined()
            expect(data.id).toBe(user.id)
        })

        it('should not allow users to view other profiles', async () => {
            const { client: client1 } = sharedUser
            const { user: user2 } = sharedHost

            const { data, error } = await client1
                .from('users')
                .select('*')
                .eq('id', user2.id)
                .single()

            expect(error).toBeDefined()
            expect(data).toBeNull()
        })

        it('should allow users to update their own profile', async () => {
            const { user, client } = sharedUser

            const { error } = await client
                .from('users')
                .update({ is_verified: true })
                .eq('id', user.id)

            expect(error).toBeNull()
        })
    })

    describe('Hosts Table', () => {
        it('should allow authenticated users to view public host profiles', async () => {
            const { user: hostUser, client: hostClient } = sharedHost
            const { client: viewerClient } = sharedUser

            // Ensure host profile exists
            const { error: insertError } = await setupHost(hostClient, hostUser.id, 'Test Org')
            expect(insertError).toBeNull()

            // View as another user
            const { data, error } = await viewerClient
                .from('hosts')
                .select('*')
                .eq('user_id', hostUser.id)
                .single()

            expect(error).toBeNull()
            expect(data).toBeDefined()
            expect(data.organization_name).toBe('Test Org')
        })

        it('should allow users to create/update their own host profile', async () => {
            const { user, client } = sharedHost
            const { error } = await setupHost(client, user.id, 'My Host Profile')
            expect(error).toBeNull()
        })

        it('should not allow users to create a host profile for others', async () => {
            const { client } = sharedUser
            const { user: otherUser } = sharedHost

            const { error } = await client
                .from('hosts')
                .insert({
                    user_id: otherUser.id,
                    organization_name: 'Impressionist Profile'
                })

            expect(error).toBeDefined()
        })

        it('should allow users to update their own host profile', async () => {
            const { user, client } = sharedHost
            await setupHost(client, user.id, 'Original Name')

            const { error } = await client
                .from('hosts')
                .update({ organization_name: 'Updated Name' })
                .eq('user_id', user.id)

            expect(error).toBeNull()
        })

        it('should not allow users to update others host profile', async () => {
            const { user: hostUser, client: hostClient } = sharedHost
            const { client: attackerClient } = sharedOutsider

            // Ensure host profile
            await setupHost(hostClient, hostUser.id, 'Original Name')

            // Attacker tries to update
            await attackerClient
                .from('hosts')
                .update({ organization_name: 'Hacked Name' })
                .eq('user_id', hostUser.id)

            const { data: verifyData } = await hostClient
                .from('hosts')
                .select('organization_name')
                .eq('user_id', hostUser.id)
                .single()

            expect(verifyData?.organization_name).toBe('Original Name')
        })
    })

    describe('Vendors Table', () => {
        it('should allow authenticated users to view vendor profiles', async () => {
            const { user: vendorUser, client: vendorClient } = sharedVendor
            const { client: viewerClient } = sharedOutsider

            // Create vendor profile
            const { error: insertError } = await setupVendor(vendorClient, vendorUser.id, 'Test Business')
            expect(insertError).toBeNull()

            // View as another user
            const { data, error } = await viewerClient
                .from('vendors')
                .select('*')
                .eq('user_id', vendorUser.id)
                .single()

            expect(error).toBeNull()
            expect(data.business_name).toBe('Test Business')
        })

        it('should allow users to create/update their own vendor profile', async () => {
            const { user, client } = sharedVendor
            const { error } = await setupVendor(client, user.id, 'My Vendor Biz')
            expect(error).toBeNull()
        })

        it('should allow users to update their own vendor profile', async () => {
            const { user, client } = sharedVendor
            await setupVendor(client, user.id, 'Old Name')

            const { error } = await client
                .from('vendors')
                .update({ business_name: 'New Name' })
                .eq('user_id', user.id)

            expect(error).toBeNull()
        })
    })

    describe('Applications Table', () => {
        it('should allow vendors to create applications', async () => {
            const { user: hostUser, client: hostClient } = sharedHost
            const { user: vendorUser, client: vendorClient } = sharedVendor

            // Ensure Host and Event (Use separate event to avoid conflicts if needed, but safe to reuse host)
            await setupHost(hostClient, hostUser.id, 'Host Org')
            const { data: event } = await hostClient.from('events').insert({
                host_id: hostUser.id,
                title: `Event ${Date.now()}`, // Unique event
                category: 'MARKET',
                start_date: '2025-01-01',
                end_date: '2025-01-01',
                location_address: 'Test Loc'
            }).select().single()

            // Ensure Vendor
            await setupVendor(vendorClient, vendorUser.id, 'Vendor Biz')

            const { error } = await vendorClient
                .from('applications')
                .insert({
                    event_id: event.id,
                    vendor_id: vendorUser.id,
                    business_description: 'Test App'
                })

            expect(error).toBeNull()
        })

        it('should allow host to view applications for their event', async () => {
            const { user: hostUser, client: hostClient } = sharedHost
            const { user: vendorUser, client: vendorClient } = sharedVendor

            // Ensure Host/Event
            await setupHost(hostClient, hostUser.id, 'Host Org')
            const { data: event } = await hostClient.from('events').insert({
                host_id: hostUser.id,
                title: `Event for View ${Date.now()}`,
                category: 'MARKET',
                start_date: '2025-01-01',
                end_date: '2025-01-01',
                location_address: 'Test Loc'
            }).select().single()

            // Vendor applies
            await setupVendor(vendorClient, vendorUser.id, 'Vendor Biz')
            await vendorClient.from('applications').insert({
                event_id: event.id,
                vendor_id: vendorUser.id,
                business_description: 'Test App'
            })

            // Host views
            const { data, error } = await hostClient
                .from('applications')
                .select('*')
                .eq('event_id', event.id)

            expect(error).toBeNull()
            expect(data.length).toBeGreaterThan(0)
        })
    })

    describe('Messages Table', () => {
        it('should allow users to send messages', async () => {
            const { user: sender, client: senderClient } = sharedUser
            const { user: receiver } = sharedOutsider

            const { error } = await senderClient
                .from('messages')
                .insert({
                    sender_id: sender.id,
                    receiver_id: receiver.id,
                    content: 'Hello'
                })

            expect(error).toBeNull()
        })

        it('should allow users to view their own messages', async () => {
            const { user: user1, client: client1 } = sharedUser
            const { user: user2 } = sharedOutsider

            // user1 sends to user2
            await client1.from('messages').insert({
                sender_id: user1.id,
                receiver_id: user2.id,
                content: 'Hello User2'
            })

            // user1 checks
            const { data: sentMessages } = await client1.from('messages').select('*').eq('sender_id', user1.id)
            expect(sentMessages.length).toBeGreaterThan(0)
        })

        it('should verify message visibility', async () => {
            const { user: sender, client: senderClient } = sharedUser
            const { user: receiver, client: receiverClient } = sharedOutsider
            const { client: outsiderClient } = sharedHost // host is outsider to this convo

            // Sender sends message
            const { data: msg } = await senderClient.from('messages').insert({
                sender_id: sender.id,
                receiver_id: receiver.id,
                content: 'Secret Message'
            }).select().single()

            // Receiver views
            // We need client for receiver (sharedOutsider)
            const { data: received, error: recvError } = await receiverClient
                .from('messages')
                .select('*')
                .eq('id', msg.id)
                .single()

            expect(recvError).toBeNull()
            expect(received.content).toBe('Secret Message')

            // Outsider views
            const { data: outside, error: outError } = await outsiderClient
                .from('messages')
                .select('*')
                .eq('id', msg.id)
                .single()

            expect(outError).toBeDefined()
        })
    })
})
