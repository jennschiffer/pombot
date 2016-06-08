CREATE TABLE slack_team (
  id SERIAL PRIMARY KEY,
  token TEXT NOT NULL CHECK(token <> ''),
  slack_id TEXT NOT NULL,
  oauth_payload JSONB,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ
);

CREATE TABLE slack_channel (
  id SERIAL PRIMARY KEY,
  slack_channel_id TEXT NOT NULL,
  slack_team_id INTEGER NOT NULL REFERENCES slack_team(id),
  name TEXT NOT NULL CHECK(name <> ''),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ
);

CREATE TABLE slack_user (
  id SERIAL PRIMARY KEY,
  slack_user_id TEXT NOT NULL,
  slack_team_id INTEGER NOT NULL REFERENCES slack_team(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ
);

CREATE TABLE pom (
  id SERIAL PRIMARY KEY,
  slack_channel_id INTEGER NOT NULL REFERENCES slack_channel(id),
  started_at TIMESTAMPTZ,
  length interval NOT NULL DEFAULT '25 minutes',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ
);

CREATE TABLE pom_task (
  id SERIAL PRIMARY KEY,
  pom_id INTEGER NOT NULL REFERENCES pom(id),
  slack_user_id INTEGER NOT NULL REFERENCES slack_user(id),
  description TEXT NOT NULL CHECK(description <> ''),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ
);

CREATE TRIGGER updated_at BEFORE UPDATE ON slack_team
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

CREATE TRIGGER updated_at BEFORE UPDATE ON slack_channel
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

CREATE TRIGGER updated_at BEFORE UPDATE ON slack_user
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

CREATE TRIGGER updated_at BEFORE UPDATE ON pom
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

CREATE TRIGGER updated_at BEFORE UPDATE ON pom_task
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

---

DROP TABLE slack_team;
DROP TABLE slack_channel;
DROP TABLE slack_user;
DROP TABLE pom;
DROP TABLE pom_task;
