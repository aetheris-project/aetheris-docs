# Configurazione Proxmox VE

Aetheris pilota Proxmox VE tramite API v2 (`/api2/json`) per macchine virtuali
QEMU e container LXC.

## 1. Crea un utente API

Nella web UI di Proxmox:

1. `Datacenter -> Permissions -> Users -> Add`.
2. Nome utente: `aetheris`, realm `PAM`, imposta una password forte.
3. `Datacenter -> Permissions -> Add` e concedi i ruoli:
   - `PVEVMAdmin` sul pool o datacenter (ciclo di vita VM e proxy VNC).
   - `PVEVMUser` sullo storage target (accesso template e disco).
4. Se usi gli snapshot per i backup, concedi `PVEDatastoreUser` sullo storage
   di backup.

## 2. Registra la credenziale in Aetheris

Nell'Admin Panel, aggiungi una credenziale hypervisor di tipo `proxmox`:

| Campo | Esempio |
| --- | --- |
| API URL | `https://pve.example.com:8006` |
| Utente | `aetheris@pam` |
| Password | la password dell'utente |
| Storage | `local-lvm` o il nome del tuo pool ZFS |
| Verify TLS | `true` (metti `false` solo per self-signed senza TLS di proxy) |

Equivalenti ambiente: `PROXMOX_URL`, `PROXMOX_USER`, `PROXMOX_PASSWORD`,
`PROXMOX_VERIFY_TLS`.

## 3. Template e immagini

### QEMU

Carica un ISO o un template VZDump sullo storage configurato, poi referenzialo
con il suo percorso completo nello storage nel piano, ad esempio:

```
local:iso/ubuntu-22.04.4-live-server-amd64.iso
```

### LXC

Scarica un template container da `Storage -> CT Templates`, poi referenzialo
nel piano come:

```
local:vztmpl/ubuntu-22.04-standard_22.04-1_amd64.tar.zst
```

Aetheris passa il valore come parametro `ostemplate` durante la creazione.

## 4. Modello di rete

Aetheris provisiona le VM sul bridge predefinito `vmbr0` con networking
virtio. Per usare un altro bridge, modifica il default del driver in
`src/lib/adapters/hypervisors/proxmox.ts` o estendi il piano con un campo di
configurazione di rete.

## 5. Mapping del ciclo di vita

| Operazione Aetheris | Endpoint Proxmox |
| --- | --- |
| Provisioning (QEMU) | `POST /nodes/{node}/qemu` |
| Provisioning (LXC) | `POST /nodes/{node}/lxc` |
| Start / Stop / Reboot | `POST /nodes/{node}/{type}/{vmid}/status/{start\|shutdown\|reboot}` |
| Suspend / Resume | `POST /nodes/{node}/{type}/{vmid}/status/{suspend\|resume}` |
| Termina | `DELETE /nodes/{node}/{type}/{vmid}` (+ `purge=1` con snapshot) |
| Telemetria | `GET /nodes/{node}/{type}/{vmid}/status/current` |
| Console | `POST /nodes/{node}/{type}/{vmid}/vncproxy` + `vncwebsocket` |
| Backup | `POST/DELETE /nodes/{node}/{type}/{vmid}/snapshot*` |

Gli identificatori server usano il formato `node:qemu|...|vmid`, ad esempio
`pve01:qemu:104`.

## 6. Note TLS

Proxmox di default distribuisce un certificato self-signed. Il driver usa la
fetch API, che non può disabilitare la verifica del certificato; termina TLS su
un reverse proxy Nginx o HAProxy davanti a `:8006` e mantieni
`PROXMOX_VERIFY_TLS` a `true` in produzione.
