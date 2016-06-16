SELECT started_at, is_completed, (EXTRACT(EPOCH FROM (length - (CURRENT_TIMESTAMP - started_at)))) as seconds_remaining
FROM pom
WHERE id = ${pomId}
