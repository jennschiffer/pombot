UPDATE pom
SET (is_completed, is_alerted) = (true, true)
WHERE id = ${pomId}
RETURNING (EXTRACT (EPOCH FROM (length - (CURRENT_TIMESTAMP - started_at)))) as seconds_remaining
