UPDATE pom as p
SET is_completed=true
WHERE ((EXTRACT(EPOCH FROM (length - (CURRENT_TIMESTAMP - started_at)))) <= 0)
  AND (is_completed IS false)
RETURNING id,
  (SELECT slack_id FROM slack_channel WHERE id = p.slack_channel_id)
