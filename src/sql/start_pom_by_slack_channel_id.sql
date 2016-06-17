INSERT INTO pom (
  slack_channel_id,
  started_at,
  is_completed,
  length
)
VALUES (
  (SELECT id FROM slack_channel WHERE slack_id=${slack_channel_id}),
  CURRENT_TIMESTAMP,
  false,
  '30 seconds'
)
ON CONFLICT (slack_channel_id) WHERE (is_completed IS false)
DO UPDATE
SET started_at = CURRENT_TIMESTAMP,
  is_completed = false
RETURNING id, (EXTRACT (EPOCH FROM (length - (CURRENT_TIMESTAMP - started_at)))) as seconds_remaining
