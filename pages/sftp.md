# SFTP user management

Create and manage SFTP access for server file management.

## Create an SFTP user

Admin → SFTP → Add User, or via the API:

```bash
curl -sS http://127.0.0.1:8000/api/system/sftp \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "server_id": 1,
    "username": "webuser",
    "home_path": "/home/container",
    "enabled": true
  }'
```

## Rules

- Username must start with a lowercase letter.
- Allowed characters: lowercase letters, digits, underscores.
- The pair `(server_id, username)` must be unique.
- Home path defaults to `/home/container`.

## List users

```bash
curl -sS http://127.0.0.1:8000/api/system/sftp \
  -H "Authorization: Bearer $TOKEN"
```

## Update / delete

```bash
# Update
curl -sS http://127.0.0.1:8000/api/system/sftp/{id} \
  -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"enabled":false}'

# Delete
curl -sS http://127.0.0.1:8000/api/system/sftp/{id} \
  -X DELETE \
  -H "Authorization: Bearer $TOKEN"
```

See also: [Backend](backend.md), [Security](security.md).
