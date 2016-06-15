SELECT started_at, is_completed, (EXTRACT(EPOCH FROM (length - (CURRENT_TIMESTAMP - started_at))))
FROM pom
WHERE id = ${pomId}
