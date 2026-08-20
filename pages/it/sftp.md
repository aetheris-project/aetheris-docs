# Utenti SFTP

Gestire l'accesso SFTP per la gestione file dei server.

## Crea un utente SFTP

Admin → SFTP → Add User, o via API:

```bash
curl -sS http://127.0.0.1:8000/api/system/sftp \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"server_id":1,"username":"webuser","home_path":"/home/container","enabled":true}'
```

## Regole

- Username deve iniziare con una lettera minuscola.
- Caratteri ammessi: lettere minuscole, cifre, underscore.
- La coppia `(server_id, username)` deve essere unica.

## Elenca utenti

```bash
curl -sS http://127.0.0.1:8000/api/system/sftp \
  -H "Authorization: Bearer $TOKEN"
```

Vedi anche: [Backend](backend.md), [Sicurezza](security.md).
