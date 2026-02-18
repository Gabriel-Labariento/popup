
-- Convert start_date and end_date from DATE to TIMESTAMPTZ
-- This allows storing both date and time, which is required by the UI.
ALTER TABLE events
  ALTER COLUMN start_date TYPE timestamp with time zone USING start_date::timestamp with time zone,
  ALTER COLUMN end_date TYPE timestamp with time zone USING end_date::timestamp with time zone;
