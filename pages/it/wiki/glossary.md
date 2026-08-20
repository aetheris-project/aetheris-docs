# Glossario

Un riferimento rapido per i termini usati nella piattaforma Aetheris e in
questa documentazione.

| Termine | Definizione |
| --- | --- |
| Account | Un'identità che accede al portale; può possedere server e fatture. |
| Pannello admin | L'area della control plane rivolta agli operatori: nodi, piani, billing, whitelabel. |
| Allocazione | Una porzione delle risorse di un nodo (IP, intervallo di porte, CPU, RAM, disco) assegnabile ai server. |
| API key | Una credenziale machine a lunga durata per chiamare l'API REST. |
| Audit log | Registro append-only di ogni azione privilegiata: chi, cosa, quando, da quale IP. |
| Billing engine | Il sottosistema che trasforma i piani in fatture, prorata e dunning. |
| Portale clienti | L'area utente finale: server, console, backup, fatture, pagamenti. |
| Control plane | Tutto il layer di gestione (web + API + workers) che fa funzionare la piattaforma. |
| Driver | Un'integrazione tipizzata con un sistema esterno (Pterodactyl, Proxmox VE, VirtFusion). |
| Dunning | Il processo automatizzato di riprova dei pagamenti falliti e di escalation dei solleciti. |
| Egg | Una specifica di container Pterodactyl che definisce come gira un'immagine server. |
| Chiave di idempotenza | Un identificatore stabile che rende sicuri i retry: la stessa chiave non viene mai applicata due volte. |
| Fattura | Un documento fatturabile con righe, imposte e data di scadenza. |
| Nest | Una raccolta Pterodactyl di egg che condividono un'immagine di base. |
| Nodo | Un host hypervisor o pannello che esegue i server che fornisci. |
| Piano | Una definizione di prodotto: risorse, prezzo, periodo di fatturazione, limiti. |
| Prorata | Addebitare solo la frazione del periodo di fatturazione effettivamente usata. |
| Provisioning | Il lifecycle di creazione, sospensione, riattivazione e terminazione dei server. |
| Coda | Una coda BullMQ basata su Redis di job in background (provisioning, billing, webhook). |
| Tenant / Organizzazione | Lo scope di livello massimo che possiede utenti, nodi, piani e fatture. |
| Tema | Un insieme nominato di token di design (colori, tipografia, superfici) per l'interfaccia. |
| Webhook | Una notifica HTTP in uscita di un evento, firmata con HMAC-SHA256. |
| Whitelabel | Il branding riconfigurabile a runtime della piattaforma (nome, logo, colori, dominio). |
| Worker | Un processo che consuma le code BullMQ ed esegue job in background. |
