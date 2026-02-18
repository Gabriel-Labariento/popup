-- Function to handle application status changes
CREATE OR REPLACE FUNCTION handle_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- When an application is accepted (from PENDING or REJECTED)
  IF NEW.status = 'ACCEPTED' AND (OLD.status IS NULL OR OLD.status != 'ACCEPTED') THEN
    UPDATE events
    SET 
      spots_available = GREATEST(0, spots_available - 1),
      spots_filled = spots_filled + 1
    WHERE id = NEW.event_id;
  
  -- When an application was accepted but is now rejected or pending
  ELSIF OLD.status = 'ACCEPTED' AND NEW.status != 'ACCEPTED' THEN
    UPDATE events
    SET 
      spots_available = spots_available + 1,
      spots_filled = GREATEST(0, spots_filled - 1)
    WHERE id = NEW.event_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to run after status update
DROP TRIGGER IF EXISTS on_application_status_change ON applications;

CREATE TRIGGER on_application_status_change
AFTER UPDATE OF status ON applications
FOR EACH ROW
EXECUTE FUNCTION handle_application_status_change();
