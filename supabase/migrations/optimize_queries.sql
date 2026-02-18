-- Add indexes to improve query performance

-- Index for filtering events by host_id
CREATE INDEX IF NOT EXISTS idx_events_host_id ON events(host_id);

-- Index for sorting events by created_at (often used with host_id)
CREATE INDEX IF NOT EXISTS idx_events_host_id_created_at ON events(host_id, created_at DESC);

-- Index for filtering/joining applications by event_id
CREATE INDEX IF NOT EXISTS idx_applications_event_id ON applications(event_id);
