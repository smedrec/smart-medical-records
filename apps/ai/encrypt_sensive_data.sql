-- PGOPTIONS="-c 'custom.secret_ke=${SECRET_KEY}'"

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS mastra_messages_encrypted CASCADE;

CREATE TABLE mastra_messages_encrypted (
	id text NOT NULL,
	thread_id text NOT NULL,
	sensitive_data BYTEA,
	"role" text NOT NULL,
	"type" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"resourceId" text NULL,
	CONSTRAINT mastra_messages_encrypted_pkey PRIMARY KEY (id)
);

-- Function to encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_sensitive_data_func(plain_data TEXT)
RETURNS BYTEA AS $$
DECLARE
    encryption_key TEXT := SELECT current_setting('custom.secret_key');
    iv BYTEA;
    encrypted_bytes BYTEA;
BEGIN
    IF plain_data IS NULL THEN
        RETURN NULL;
    END IF;

    -- Generate a random 16-byte IV for AES-256
    iv := gen_random_bytes(16);
    -- Encrypt the data using AES-256 in CBC mode
    -- The pgcrypto function expects BYTEA for data, key, and IV
    encrypted_bytes := pgp_sym_encrypt_bytea(plain_data::bytea, encryption_key::bytea, 'aes256'::text, iv);
    -- Store the IV concatenated with the encrypted data
    RETURN iv || encrypted_bytes;
END;
$$ LANGUAGE plpgsql;

-- Function to decrypt sensitive data
CREATE OR REPLACE FUNCTION decrypt_sensitive_data_func(encrypted_value BYTEA)
RETURNS TEXT AS $$
DECLARE
    encryption_key TEXT := SELECT current_setting('custom.secret_key');
    iv BYTEA;
    ciphertext BYTEA;
    decrypted_bytes BYTEA;
BEGIN
    IF encrypted_value IS NULL THEN
        RETURN NULL;
    END IF;

    -- Ensure the encrypted_value is long enough to contain an IV
    IF octet_length(encrypted_value) < 16 THEN
        RAISE EXCEPTION 'Invalid encrypted data format: IV missing or too short.';
    END IF;

    -- Extract the IV (first 16 bytes)
    iv := substring(encrypted_value FOR 16);
    -- Extract the actual ciphertext (remaining bytes)
    ciphertext := substring(encrypted_value FROM 17);

    -- Decrypt the data using AES-256 in CBC mode
    decrypted_bytes := pgp_sym_decrypt_bytea(ciphertext, encryption_key::bytea, 'aes256'::text, iv);

    -- Return the decrypted data as text
    RETURN encode(decrypted_bytes, 'escape'); -- Or just RETURN decrypted_bytes::text; depending on original data type
END;
$$ LANGUAGE plpgsql;

DROP VIEW IF EXISTS public.mastra_messages CASCADE;

CREATE VIEW public.mastra_messages AS
SELECT
    id,
    thread_id,
    decrypt_sensitive_data_func(sensitive_data) AS content,
    "role",
    "type",
    "createdAt",
    "resourceId"
FROM
    public.mastra_messages_encrypted;

-- INSTEAD OF INSERT Trigger
CREATE OR REPLACE FUNCTION mastra_messages_insert_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO mastra_messages_encrypted (id, thread_id, sensitive_data, "role", "type", "createdAt", "resourceId")
    VALUES (NEW.id, NEW.thread_id, encrypt_sensitive_data_func(NEW.sensitive_data), NEW."role", NEW."type", NEW."createdAt", NEW."resourceId");
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mastra_messages_instead_of_insert
INSTEAD OF INSERT ON mastra_messages
FOR EACH ROW
EXECUTE FUNCTION mastra_messages_insert_trigger_func();

-- INSTEAD OF UPDATE Trigger
CREATE OR REPLACE FUNCTION mastra_messages_update_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE mastra_messages_encrypted
    SET
        thread_id = NEW.thread_id,
        sensitive_data = encrypt_sensitive_data_func(NEW.sensitive_data),
        "role" = NEW."role",
        "type" = NEW."type",
        "createdAt" = NEW."createdAt",
        "resourceId" = NEW."resourceId"
    WHERE
        id = OLD.id; -- Use OLD.id to identify the row to update
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mastra_messages_instead_of_update
INSTEAD OF UPDATE ON mastra_messages
FOR EACH ROW
EXECUTE FUNCTION mastra_messages_update_trigger_func();

-- INSTEAD OF DELETE Trigger (optional, but good for completeness)
CREATE OR REPLACE FUNCTION mastra_messages_delete_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM mastra_messages_encrypted
    WHERE id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mastra_messages_instead_of_delete
INSTEAD OF DELETE ON mastra_messages
FOR EACH ROW
EXECUTE FUNCTION mastra_messages_delete_trigger_func();