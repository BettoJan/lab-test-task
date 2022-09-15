create DATABASE userdb;
create TABLE IF NOT EXISTS users (
                                     id SERIAL       PRIMARY KEY,
                                     username        varchar(255)    UNIQUE NOT NULL,
    passwordHash    varchar(255)    NOT NULL,
    email           varchar(255)    UNIQUE,
    created_at      timestamp       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      timestamp       NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE 'plpgsql'
;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON userdb.public.users
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at()
;