-- create new pom and "start" it
UPDATE pom
SET is_complete = true
WHERE id = $1
