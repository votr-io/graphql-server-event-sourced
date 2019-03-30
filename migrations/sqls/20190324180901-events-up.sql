CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- table to store our events
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    event_type VARCHAR (80) NOT NULL,
    aggregate_type VARCHAR (80) NOT NULL,
    aggregate_id VARCHAR (80) NOT NULL,
    date_created TIMESTAMP WITH TIME ZONE DEFAULT(now() at time zone 'utc'),
    actor VARCHAR (80) NOT NULL,
    data jsonb NOT NULL
);

-- notification for when a new event is added
CREATE OR REPLACE FUNCTION notify_new_event()
  RETURNS trigger AS
$BODY$
    BEGIN
        PERFORM pg_notify('new_event', row_to_json(NEW)::text);
        RETURN NULL;
    END; 
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- trigger to fire our notification function
CREATE TRIGGER notify_new_event
  AFTER INSERT
  ON "events"
  FOR EACH ROW
  EXECUTE PROCEDURE notify_new_event();




-- table for users

CREATE TYPE user_type AS ENUM ('WEAK');

CREATE TABLE users (
    id UUID PRIMARY KEY NOT NULL,
    email VARCHAR (256) UNIQUE NOT NULL,
    date_created TIMESTAMP WITH TIME ZONE DEFAULT(now() at time zone 'utc'),
    type user_type NOT NULL
);


--table for ballots

CREATE TABLE ballots (
    election_id UUID NOT NULL,
    ballot VARCHAR (800) NOT NULL
);
