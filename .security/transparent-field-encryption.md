# PostgreSQL Transparent Field Encryption/Decryption with Views and INSTEAD OF Triggers

To achieve transparent encryption and decryption at the database level, allowing a third-party application to interact with plain text data while the database handles the cryptographic operations, we will use a combination of:

    pgcrypto extension: For the actual encryption/decryption functions.

    Base Table: To store the encrypted BYTEA data.

    VIEW: To expose the data as plain text to the application.

    INSTEAD OF Triggers: To intercept INSERT and UPDATE operations on the view, encrypt the data, and then write it to the base table.

## 1. Prerequisites: Enable pgcrypto

If you haven't already, enable the pgcrypto extension:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

## 2. Base Table for Encrypted Data

This is the actual table where the data will be stored. The sensitive_data column will be of type BYTEA.

```sql
-- Drop existing table if it exists for a clean start
DROP TABLE IF EXISTS public.mastra_messages_encrypted CASCADE;

CREATE TABLE public.mastra_messages_encrypted (
	id text NOT NULL,
	thread_id text NOT NULL,
	sensitive_data BYTEA,
	"role" text NOT NULL,
	"type" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"resourceId" text NULL,
	CONSTRAINT mastra_messages_encrypted_pkey PRIMARY KEY (id)
);

```

## 3. Encryption and Decryption Functions

These functions remain largely the same, handling the actual cryptographic operations. Remember the critical importance of secure key management.

```sql
-- Function to encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_sensitive_data_func(plain_data TEXT)
RETURNS BYTEA AS $$
DECLARE
    encryption_key TEXT := current_setting('custom.secret_key'); -- !!! REPLACE WITH A SECURE KEY !!!
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
    encryption_key TEXT := current_setting('custom.secret_key'); -- !!! MUST BE THE SAME KEY USED FOR ENCRYPTION !!!
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
```

## 4. The Transparent View

This view will be the interface for your third-party application. It will automatically decrypt the sensitive_data field when selected.

```sql
-- Drop existing view if it exists for a clean start
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

CREATE VIEW users AS
SELECT
    id,
    username,
    decrypt_sensitive_data_func(sensitive_data) AS sensitive_data
FROM
    users_encrypted;
```

## 5. INSTEAD OF Triggers for Transparent Writes

These triggers will intercept INSERT, UPDATE, and DELETE operations on the users view, perform the necessary encryption, and then modify the users_encrypted base table.

```sql
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
```

## 6. Granting Permissions

Crucially, you must grant the application's database user permissions only on the users view, and NOT on the mastra_messages_encrypted table. This ensures the application can only interact with the decrypted view.

```sql
-- Example: Create a dedicated application user (replace 'app_user' and 'your_password')
CREATE USER app_user WITH PASSWORD 'your_secure_password';

-- Grant permissions on the view to the application user
GRANT SELECT, INSERT, UPDATE, DELETE ON mastra_messages TO app_user;

-- IMPORTANT: Revoke or ensure no permissions on the base table for app_user
-- (By default, new users have no permissions, but it's good to be explicit if needed)
-- REVOKE ALL ON mastra_messages_encrypted FROM app_user;
-- REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_user; -- More aggressive
```

## 7. Testing the Transparent Process

Now, when your application performs INSERT, UPDATE, or SELECT operations on the users table (which is actually our view), it will behave as if it's interacting with plain text data.

```sql
-- 1. Insert data via the view (application's perspective)
-- The 'sensitive_data' here is plain text
INSERT INTO mastra_messages (id, thread_id, content, "role", "type", "createdAt", "resourceId") VALUES
VALUES
('charlie', 'charlie-thread', 'Charlie''s Private Info', 'user', 'message', '2023-01-01T00:00:00.000Z', '1234567890'),
('diana', 'diana-thread', 'Diana''s Secret Document', 'user', 'message', '2023-01-01T00:00:00.000Z', '1234567890');

-- 2. Verify data in the base table (database administrator's perspective)
-- You will see encrypted binary data
SELECT id, thread_id, sensitive_data, "role", "type", "createdAt", "resourceId" FROM mastra_messages_encrypted;

-- 3. Select data via the view (application's perspective)
-- You will see plain text data
SELECT id, thread_id, content, "role", "type", "createdAt", "resourceId" FROM mastra_messages WHERE id = 'charlie';

-- 4. Update data via the view (application's perspective)
-- The 'sensitive_data' here is plain text
UPDATE mastra_messages SET content = 'Charlie''s Updated Private Info' WHERE id = 'charlie';

-- 5. Verify the update in the base table (encrypted)
SELECT id, username, sensitive_data FROM mastra_messages_encrypted WHERE id = 'charlie';

-- 6. Verify the update via the view (decrypted)
SELECT id, thread_id, content, "role", "type", "createdAt", "resourceId" FROM mastra_messages WHERE id = 'charlie';

-- 7. Delete data via the view (application's perspective)
DELETE FROM mastra_messages WHERE id = 'diana';

-- 8. Verify deletion in the base table
SELECT * FROM mastra_messages_encrypted WHERE id = 'diana';
```

8. Key Management and Security Considerations (Reiterated)

The success of this transparent encryption hinges entirely on the security of your encryption key.

    Key Secrecy: The encryption_key used in encrypt_sensitive_data_func and decrypt_sensitive_data_func must be kept absolutely secret.

    Key Storage: Do not hardcode the key in production. Instead, consider:

        Environment Variables: Pass the key to the PostgreSQL server process as an environment variable, then retrieve it within a custom function (more advanced, requires C extension or careful pg_settings usage).

        External Key Management System (KMS): Integrate PostgreSQL with an external KMS (e.g., AWS KMS, Google Cloud KMS, Azure Key Vault) to retrieve the key at runtime. This is the most secure approach but requires significant setup.

        PostgreSQL Parameter: For less sensitive scenarios, you could store the key as a custom PostgreSQL configuration parameter (SET custom.encryption_key = '...'), but this is generally not recommended for high-security keys as it's visible to superusers.

    Key Rotation: Implement a strategy for regularly rotating your encryption keys. This will involve re-encrypting all data with the new key.

    Permissions: Ensure the application user only has access to the view and not the underlying table. This is crucial for preventing direct access to the encrypted data.

    Auditing: Log all access and modifications to the view and underlying table to detect suspicious activity.

This approach provides a powerful and transparent way to encrypt sensitive data in your PostgreSQL database without requiring any changes to your third-party application.
