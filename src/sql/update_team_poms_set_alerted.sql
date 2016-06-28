UPDATE pom as p
SET is_alerted=true
WHERE ((EXTRACT(EPOCH FROM (length - (CURRENT_TIMESTAMP - started_at)))) <= 300)
  AND ((EXTRACT(EPOCH FROM (length - (CURRENT_TIMESTAMP - started_at)))) > 0)
  AND (is_alerted IS false)
  AND (slack_channel_id = ANY (
    SELECT id
    FROM slack_channel
    WHERE (slack_team_id = (
      SELECT id
      FROM slack_team
      WHERE (token = ${token})
    ))
  ))
RETURNING id,
  (SELECT slack_id FROM slack_channel WHERE id = p.slack_channel_id),
  (EXTRACT(EPOCH FROM (length - (CURRENT_TIMESTAMP - started_at)))) AS seconds_remaining
