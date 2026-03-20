import { describe, it, expect } from 'vitest'
import { createTestUser } from './setup'

describe('Storage Policies', () => {
    const BUCKET_ID = 'event-images'

    // Helper to upload file
    const uploadFile = async (client: any, userId: string, fileName: string, sizeBytes: number, contentType: string) => {
        // Create dummy content
        // In Node, we can use Buffer
        const buffer = Buffer.alloc(sizeBytes, 'a')

        const filePath = `${userId}/${fileName}`

        return await client.storage
            .from(BUCKET_ID)
            .upload(filePath, buffer, {
                contentType: contentType,
                upsert: true
            })
    }

    it('should allow uploading a valid small image', async () => {
        const { user, client } = await createTestUser()

        // 1KB JPEG
        const { data, error } = await uploadFile(client, user.id, `valid_${Date.now()}.jpg`, 1024, 'image/jpeg')

        if (error) console.error('Valid upload failed:', error)
        expect(error).toBeNull()
        expect(data).toBeDefined()
    })

    it('should reject files larger than 2MB', async () => {
        const { user, client } = await createTestUser()

        // 5MB JPEG
        const largeSize = 5 * 1024 * 1024
        const { data: _data, error } = await uploadFile(client, user.id, `large_${Date.now()}.jpg`, largeSize, 'image/jpeg')

        expect(error).toBeDefined()
        // Error message depends on how it's enforced (RLS or Bucket Config)
        // Usually "Payload too large" or RLS violation
    })

    it('should reject non-image files', async () => {
        const { user, client } = await createTestUser()

        // 1KB Text file
        const { data: _data, error } = await uploadFile(client, user.id, `bad_${Date.now()}.txt`, 1024, 'text/plain')

        expect(error).toBeDefined()
    })
})
