## PostgreSQL Field Encryption/Decryption with pgcrypto

Protecting sensitive data in your database is a critical security measure. While hashing (e.g., SHA256) is excellent for one-way transformations like password storage or data integrity checks, it's not suitable for scenarios where you need to retrieve the original data. For that, you need encryption.

This guide will walk you through encrypting and decrypting a specific field in a PostgreSQL table using the pgcrypto extension, which provides robust cryptographic functions like AES.

## 1. Why SHA256 is Not Suitable for Decryption

As mentioned, SHA256 is a cryptographic hash function. Its primary characteristics are:

    One-Way: It's computationally infeasible to reverse a SHA256 hash to get the original input.

    Fixed Output Size: Regardless of the input size, the output (hash) is always 256 bits long.

    Deterministic: The same input will always produce the same hash output.

    Collision Resistance: It's extremely difficult to find two different inputs that produce the same hash output.

These properties make it ideal for verifying data integrity or storing passwords (you hash the user's input password and compare it to the stored hash, never decrypting the stored hash). However, if you need to retrieve the original sensitive data (e.g., a credit card number, a personal identification number), hashing simply won't work. For that, you need encryption, which is a two-way process (encrypt and decrypt) using a key.

## 2. Setting Up pgcrypto

First, you need to enable the pgcrypto extension in your PostgreSQL database. This only needs to be done once per database.

```sql

-- Connect to your database (e.g., psql -d your_database_name)
CREATE EXTENSION pgcrypto;

```

## 3. Creating a Table with an Encrypted Field

Let's create a sample table named users where the sensitive_data field will be encrypted. We'll store the encrypted data as BYTEA (binary string) because encryption functions often return binary data.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    sensitive_data BYTEA -- This field will store the encrypted data
);
```

## 4. Encrypting Data on INSERT and UPDATE

To ensure data is encrypted automatically, we'll use a function to perform the encryption and a trigger to call this function before an INSERT or UPDATE operation.

Important: The Encryption Key
The security of your encrypted data heavily relies on the secrecy of your encryption key. Never hardcode the key directly into your functions or scripts in a production environment.
For this example, we'll use a placeholder key. In a real application, you should:

    Store the key securely (e.g., in an environment variable, a key management service, or a separate configuration file not accessible by the database directly).

    Pass the key to the database function at runtime, or use a secure mechanism to retrieve it within the database environment (though this is more complex and often involves external tools).

    Consider using a different key for each user or piece of data for enhanced security.

Let's define a function that encrypts the sensitive_data using AES-256 in CBC mode (Cipher Block Chaining) with a static key. We'll also use gen_random_bytes(16) to generate a random Initialization Vector (IV) for each encryption, which is crucial for security (it prevents identical plaintexts from producing identical ciphertexts). The IV will be prepended to the ciphertext.

```sql
-- Function to encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_sensitive_data()
RETURNS TRIGGER AS $$
DECLARE
    encryption_key TEXT := 'your_super_secret_key_123456789012345678901234567890'; -- !!! REPLACE WITH A SECURE KEY !!!
    iv BYTEA;
    encrypted_bytes BYTEA;
BEGIN
    IF NEW.sensitive_data IS NOT NULL THEN
        -- Generate a random 16-byte IV for AES-256
        iv := gen_random_bytes(16);
        -- Encrypt the data using AES-256 in CBC mode
        -- The pgcrypto function expects BYTEA for data, key, and IV
        encrypted_bytes := pgp_sym_encrypt_bytea(NEW.sensitive_data, encryption_key::bytea, 'aes256'::text, iv);
        -- Store the IV concatenated with the encrypted data
        NEW.sensitive_data := iv || encrypted_bytes;
    END IF;
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

-- Trigger to call the encryption function before insert or update
CREATE TRIGGER encrypt_users_sensitive_data
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION encrypt_sensitive_data();
```

Explanation of pgp_sym_encrypt_bytea parameters:

    data: The data to encrypt (must be BYTEA).

    key: The encryption key (must be BYTEA).

    cipher: The cipher algorithm (e.g., 'aes256').

    iv: The Initialization Vector (must be BYTEA).

## 5. Decrypting Data on SELECT

Decryption should only happen when authorized. You can achieve this by:

    Using a custom function in your SELECT statements. This is the most flexible approach.

    Creating a VIEW that decrypts the data. This can simplify queries for authorized users/applications but means the decryption key might be embedded in the view definition (less secure).

Let's define a function to decrypt the data. This function will expect the combined IV and ciphertext.

```sql
-- Function to decrypt sensitive data
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(encrypted_value BYTEA)
RETURNS TEXT AS $$

DECLARE
    encryption_key TEXT := 'your_super_secret_key_123456789012345678901234567890'; -- !!! MUST BE THE SAME KEY USED FOR ENCRYPTION !!!
    iv BYTEA;
    ciphertext BYTEA;
    decrypted_bytes BYTEA;
BEGIN
    IF encrypted_value IS NULL THEN
        RETURN NULL;
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

Now, let's test it:

```sql
-- Insert some data (the trigger will encrypt sensitive_data)
INSERT INTO users (username, sensitive_data) VALUES
('alice', 'Alice''s Top Secret Info'::bytea),
('bob', 'Bob''s Confidential Details'::bytea);

-- Try to select the data directly - it will be encrypted binary data
SELECT id, username, sensitive_data FROM users;

-- Select data, decrypting the sensitive_data field
SELECT
    id,
    username,
    decrypt_sensitive_data(sensitive_data) AS decrypted_sensitive_data
FROM users;

-- Update data (the trigger will re-encrypt)
UPDATE users SET sensitive_data = 'Alice''s NEW Top Secret Info'::bytea WHERE username = 'alice';

-- Verify the update and decryption
SELECT
    id,
    username,
    decrypt_sensitive_data(sensitive_data) AS decrypted_sensitive_data
FROM users WHERE username = 'alice';
```

## 6. Important Considerations for Key Management and Security

This implementation provides a good foundation, but robust security requires careful attention to key management:

    Key Secrecy is Paramount: The security of your encrypted data is entirely dependent on the secrecy of your encryption key. If the key is compromised, all your encrypted data can be decrypted.

    Key Storage:

        NEVER store the key directly in your database or application code.

        Consider using environment variables, a dedicated Key Management System (KMS), or a secure secrets manager (e.g., AWS KMS, Google Cloud KMS, Azure Key Vault).

        If the key must be accessible by the database, explore PostgreSQL's GUC (Grand Unified Configuration) variables or a custom extension that can securely retrieve keys from an external source.

    Key Rotation: Regularly rotate your encryption keys. When you rotate a key, you'll need to re-encrypt all data encrypted with the old key using the new key.

    Access Control: Implement strict access controls (PostgreSQL roles and permissions) to limit who can execute the decryption function. Only authorized application users or roles should have EXECUTE privilege on decrypt_sensitive_data.

    Auditing: Log access to the decryption function and any attempts to view sensitive data.

    Performance: Encryption and decryption add overhead. For very high-volume transactions, measure the performance impact.

    Data Type: Ensure the sensitive_data column is BYTEA to correctly store the binary output of encryption. When decrypting, you can cast it back to TEXT or whatever the original data type was.

    Initialization Vector (IV): Always use a unique, random IV for each encryption. This prevents identical plaintexts from producing identical ciphertexts, which is a common vulnerability (known as the "deterministic encryption" problem). pgcrypto handles this well by allowing you to provide an IV. We prepended the IV to the ciphertext for easy retrieval during decryption.

    Application-Level Encryption: For maximum security, consider performing encryption/decryption at the application layer. This keeps the encryption key entirely out of the database, reducing the attack surface. However, it shifts the key management burden to your application infrastructure.

By following these guidelines and using pgcrypto, you can significantly enhance the security of sensitive data within your PostgreSQL database.
