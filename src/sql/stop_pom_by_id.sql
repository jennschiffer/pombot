UPDATE pom
SET is_completed = true
WHERE id = ${pomId}
RETURNING (EXTRACT (EPOCH FROM (length - (CURRENT_TIMESTAMP - started_at)))) as seconds_remaining
