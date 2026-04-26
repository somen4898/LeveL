-- Rename core kinds: gym -> body, eating -> fuel, coding -> craft
ALTER TABLE cores DROP CONSTRAINT cores_kind_check;
ALTER TABLE cores ADD CONSTRAINT cores_kind_check CHECK (kind IN ('body','fuel','craft'));

-- Update any existing data
UPDATE cores SET kind = 'body' WHERE kind = 'gym';
UPDATE cores SET kind = 'fuel' WHERE kind = 'eating';
UPDATE cores SET kind = 'craft' WHERE kind = 'coding';
