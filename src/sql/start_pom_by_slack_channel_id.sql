INSERT INTO pom (
  slack_channel_id,
  started_at,
  is_completed
)
VALUES (
  (SELECT id FROM slack_channel WHERE slack_id=${slack_channel_id}),
  CURRENT_TIMESTAMP,
  false
)
ON CONFLICT (slack_channel_id) WHERE (is_completed IS false)
DO UPDATE
SET (started_at, is_completed) = (CURRENT_TIMESTAMP, false)
RETURNING id, (EXTRACT (EPOCH FROM (length - (CURRENT_TIMESTAMP - started_at)))) as seconds_remaining
