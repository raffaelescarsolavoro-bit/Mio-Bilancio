MIO BILANCIO - GUIDA RAPIDA (Android)

CONTENUTO
- index.html, app.js: applicazione
- manifest.webmanifest: impostazioni installazione PWA
- sw.js: cache offline
- icon-192.png e icon-512.png: icone

IMPORTANTE
Perché Chrome Android proponga "Installa app" o "Aggiungi a schermata Home" come vera PWA,
i file devono essere pubblicati su un indirizzo HTTPS. Aprire index.html direttamente dal
file manager consente eventualmente di provarla, ma NON abilita l'installazione PWA completa
né il service worker.

PUBBLICAZIONE DA SOLO TELEFONO (GitHub Pages)
1. Apri github.com da Chrome e crea un account, se non ne hai uno.
2. Crea un nuovo repository pubblico, ad esempio "mio-bilancio".
3. Carica TUTTI i file e le immagini di questa cartella nella radice del repository.
   Puoi usare il sito GitHub in modalità desktop se il caricamento da mobile è scomodo.
4. Nel repository vai su Settings > Pages.
5. In "Build and deployment" scegli "Deploy from a branch", branch "main", cartella "/ (root)",
   poi salva. Attendi la pubblicazione.
6. Apri l'indirizzo Pages indicato da GitHub con Chrome sul telefono.
7. Menu ⋮ > "Installa app" oppure "Aggiungi a schermata Home".

DATI E PRIVACY
- Le transazioni sono memorizzate nel localStorage del browser sul dispositivo.
- Non ci sono collegamenti bancari, account o server applicativi.
- Esporta periodicamente un backup da Altro > Esporta backup e conserva il file in un luogo sicuro.
- Non cancellare i dati del sito/browser senza aver prima esportato il backup.
- Per trasferire i dati su un altro telefono, importa il file JSON dal nuovo dispositivo.

NOTE
Questa è una prima versione personale, non un'app bancaria certificata. I dati inseriti sono
esempi solo se li aggiungi tu: l'app parte con saldo iniziale zero e nessuna transazione.
Il grafico e i riepiloghi si basano sui movimenti registrati nel mese corrente.
