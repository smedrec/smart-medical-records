---
title: Transparent Field Encryption in PostgreSQL
description: Explains the transparent field encryption mechanism used for sensitive data in the database.
---

# Transparent Field Encryption in PostgreSQL

This document details the transparent field encryption setup implemented in our PostgreSQL database to protect sensitive data, particularly within the `mastra_messages` table. This mechanism ensures that data is encrypted at rest in the database but can be seamlessly accessed in its decrypted form by authorized applications without requiring explicit decryption logic in the application code.

## Overview

The system leverages PostgreSQL's `pgcrypto` extension, views, and `INSTEAD OF` triggers to achieve transparent encryption and decryption.

1.  **Base Table (`mastra_messages_encrypted`)**: This table stores the actual data. Sensitive information is held in a `BYTEA` (byte array) column, meaning it's stored in its encrypted binary form.
2.  **Encryption/Decryption Functions**:
    *   `encrypt_sensitive_data_func(plain_data TEXT) RETURNS BYTEA`: Takes plain text as input, encrypts it using AES-256, and returns the resulting `BYTEA`. It prepends a 16-byte Initialization Vector (IV) to the encrypted data.
    *   `decrypt_sensitive_data_func(encrypted_value BYTEA) RETURNS TEXT`: Takes the `BYTEA` (IV + encrypted data) as input, extracts the IV, decrypts the data using AES-256, and returns the original plain text.
3.  **View (`mastra_messages`)**: This is the primary interface for applications. When an application queries this view, the `sensitive_data` column (aliased as `content` in the view) is automatically decrypted using `decrypt_sensitive_data_func`.
4.  **`INSTEAD OF` Triggers**: These triggers are attached to the `mastra_messages` view:
    *   **`mastra_messages_instead_of_insert`**: When an application inserts data into the view, this trigger intercepts the operation. It calls `encrypt_sensitive_data_func` on the provided plain text `sensitive_data` (referred to as `content` when inserting into the view) and then inserts the encrypted version into the underlying `mastra_messages_encrypted` table.
    *   **`mastra_messages_instead_of_update`**: Similarly, for updates on the view, this trigger encrypts the new `sensitive_data` before updating the base table.
    *   **`mastra_messages_instead_of_delete`**: Handles deletions by removing the corresponding row from the base table.

## Key Management

The encryption and decryption functions rely on a secret key. This key is managed as a custom PostgreSQL configuration parameter: `custom.secret_key`.

*   **Setting the Key**: The key is intended to be set when the PostgreSQL server starts, typically via an environment variable passed through Docker Compose.
    Example `docker-compose.yml` snippet:
    ```yaml
    services:
      db:
        image: postgres:latest
        environment:
          POSTGRES_DB: your_database_name
          POSTGRES_USER: your_user
          POSTGRES_PASSWORD: your_password
          SECRET_KEY: ${YOUR_ACTUAL_SECRET_KEY} # Provided via .env file or shell
        command: postgres -c "custom.secret_key=${SECRET_KEY}"
    ```
*   **Accessing the Key**: Inside the SQL functions, `current_setting('custom.secret_key')` is used to retrieve the key's value.

**Security Note**: The security of this entire system hinges on the secrecy of `YOUR_ACTUAL_SECRET_KEY`. For production environments, consider more robust secret management solutions like Docker Secrets or dedicated Key Management Systems (KMS).

## `sensitive_data` Field and JSON Content

The `sensitive_data` column in the `mastra_messages_encrypted` table (exposed as `content` in the `mastra_messages` view) is designed to store sensitive information. In many cases, this data is structured as a JSON string.

Example JSON structure:
```json
{
  "format": 2,
  "parts": [
    { "type": "step-start" },
    { "type": "text", "text": "What is the weather in Leiria?" }
  ],
  "content": "What is the weather in Leiria?"
}
```

**Important Considerations for JSON Data:**

*   **Encryption Scope**: The entire JSON string is treated as a single piece of text for encryption and decryption. The `pgcrypto` functions operate on this serialized string.
*   **Application Responsibility**:
    *   **Serialization**: The application is responsible for serializing the JSON object into a string *before* inserting it into the `mastra_messages` view.
    *   **Deserialization**: When retrieving data, the application receives the decrypted JSON string and is responsible for parsing it back into a JSON object.
    *   **Validation**: The database does not validate the structure or content of the JSON. Any such validation must occur at the application layer before insertion. An invalid JSON string will be encrypted and decrypted as is, potentially leading to parsing errors in the application.
*   **Searchability**: It is not possible to directly query or filter based on specific fields *within* the encrypted JSON data using SQL. The data must be decrypted first (which the view does automatically for selects) and then processed at the application layer if internal searching is needed.
*   **Performance**: Encrypting and decrypting large JSON strings can have a performance overhead. This should be considered during design and testing.

## SQL Schema and Function Definitions

The core SQL definitions can be found in `.security/encrypt_sensive_data.sql`. This includes:

*   `CREATE TABLE mastra_messages_encrypted`
*   `CREATE OR REPLACE FUNCTION encrypt_sensitive_data_func()`
*   `CREATE OR REPLACE FUNCTION decrypt_sensitive_data_func()`
*   `CREATE VIEW mastra_messages`
*   Trigger functions and definitions (`mastra_messages_insert_trigger_func`, `mastra_messages_update_trigger_func`, `mastra_messages_delete_trigger_func`)

## Permissions

For enhanced security, application database users should only be granted permissions on the `mastra_messages` view (e.g., `SELECT`, `INSERT`, `UPDATE`, `DELETE`). They should **not** have direct access to the `mastra_messages_encrypted` base table. This enforces interaction through the transparent encryption/decryption layer.

```sql
-- Example:
GRANT SELECT, INSERT, UPDATE, DELETE ON mastra_messages TO your_app_user;
REVOKE ALL ON mastra_messages_encrypted FROM your_app_user; -- If any direct permissions were ever granted
```

By following this setup, sensitive data remains encrypted at rest, and the application can interact with it transparently, simplifying development while enhancing security.
