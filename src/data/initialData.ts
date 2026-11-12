import {
  AudioRecording,
  CommandMacro,
  Contact,
  PredefinedTermuxScript,
  RcloneSyncConfig,
  StreamChannelPreset,
  SyncLog
} from '../types';

export const INITIAL_RECORDINGS: AudioRecording[] = [
  {
    id: 1,
    title: 'Flux WAY Vocal Capture',
    fileName: 'enregistrement_ghost_vocal.wav',
    durationSeconds: 60,
    fileSizeMb: 10.4,
    localPath: './storage/enregistrement_ghost_vocal.wav',
    cloudPath: 'gdrive:/Z-CORE/Captures/enregistrement_ghost_vocal.wav',
    isSynced: false,
    syncStatus: 'LOCAL_ONLY',
    sourceStream: 'Flux WAY (Z-CORE)',
    timestamp: Date.now() - 3600000,
    transcription: "Capture vocale d'une minute issue du flux WAY. Écoutable et prêt pour transfert cloud vers gdrive:/Z-CORE/Captures/.",
    aiSummary: "Enregistrement vocal de 60s capturé en local sur l'instance Z-CORE. Prêt à être transféré via rclone vers Google Drive.",
    waveformData: '20,45,80,65,30,90,70,85,95,60,40,75,85,90,65,50,80,95,70,40'
  },
  {
    id: 2,
    title: 'Archives Vocales 2023',
    fileName: 'enregistrement2023-02-06 07-11-38.wav',
    durationSeconds: 185,
    fileSizeMb: 31.2,
    localPath: './storage/archives/enregistrement2023-02-06.wav',
    cloudPath: 'gdrive:/Archives/2023/enregistrement2023-02-06 07-11-38.wav',
    isSynced: true,
    syncStatus: 'CLOUD_SYNCED',
    sourceStream: 'Drive Archive',
    timestamp: Date.now() - 86400000000,
    transcription: 'Archive audio historique de février 2023 déjà présente sur le Google Drive principal.',
    aiSummary: 'Fichier audio archivé de 3m05s. Sauvegarde confirmée sur le stockage cloud distant.',
    waveformData: '15,30,40,50,45,60,70,65,80,75,60,50,40,30,25,35,45,55,60,50'
  }
];

export const NESRIN_OUIS_CONTACT: Contact = {
  id: 1,
  firstName: 'Nesrin Ouis',
  lastName: '',
  organization: 'Nesrin Ouis',
  phoneNumber: '+1 438-985-5041',
  phoneLabel: 'Mobile',
  email: '',
  addressFormatted: '4347 Rue De Venise Saint-Leonard QC H1S1G2 Canada',
  street: '4347 Rue De Venise',
  city: 'Saint-Leonard',
  region: 'QC',
  postalCode: 'H1S1G2',
  country: 'Canada',
  extendedAddress: 'Saint-Leonard',
  notes: 'Here is the link to Nesrin Ouis profile on CanadaPages.com. https://www.canadapages.com/wp/nesrin-ouis-saintleonard-qc-4383809395/',
  profileUrl: 'https://www.canadapages.com/wp/nesrin-ouis-saintleonard-qc-4383809395/',
  labels: '* myContacts ::: * starred',
  isStarred: true,
  createdAt: Date.now() - 5000000
};

export const INITIAL_MACROS: CommandMacro[] = [
  {
    id: 1,
    name: 'Sync Ghost Vocal to Drive',
    category: 'RCLONE',
    commandText: 'rclone copy ./storage/enregistrement_ghost_vocal.wav gdrive:/Z-CORE/Captures/',
    description: "Copie chiffrée de l'enregistrement Z-CORE vers Google Drive.",
    isFavorite: true,
    requiresRoot: false
  },
  {
    id: 2,
    name: 'Sync Root Drive Folder',
    category: 'RCLONE',
    commandText: 'rclone copy ./storage/enregistrement_ghost_vocal.wav gdrive:/',
    description: 'Envoie le fichier directement à la racine de Google Drive.',
    isFavorite: true,
    requiresRoot: false
  },
  {
    id: 3,
    name: 'Setup Termux API Tools',
    category: 'TERMUX',
    commandText: 'pkg update && pkg install termux-api',
    description: "Installe les extensions Termux API pour gérer le matériel et l'affichage.",
    isFavorite: false,
    requiresRoot: false
  },
  {
    id: 4,
    name: 'Acquire Wake Lock',
    category: 'TERMUX',
    commandText: 'termux-wake-lock',
    description: "Empêche l'écran de se mettre en veille pendant les transferts.",
    isFavorite: false,
    requiresRoot: false
  },
  {
    id: 5,
    name: 'Release Wake Lock',
    category: 'TERMUX',
    commandText: 'termux-wake-unlock',
    description: "Permet à l'écran de se remettre en veille normalement.",
    isFavorite: false,
    requiresRoot: false
  },
  {
    id: 6,
    name: 'ADB Wake Screen',
    category: 'ADB',
    commandText: 'adb shell input keyevent 26',
    description: "Simule l'appui sur le bouton d'alimentation pour réveiller le téléphone.",
    isFavorite: false,
    requiresRoot: false
  },
  {
    id: 7,
    name: 'ADB Swipe Unlock',
    category: 'ADB',
    commandText: 'adb shell input swipe 500 1500 500 500 200',
    description: "Simule un glissement vers le haut pour afficher l'écran de déverrouillage.",
    isFavorite: false,
    requiresRoot: false
  },
  {
    id: 8,
    name: 'Z_GHOST Trailer Wakeup (Fido)',
    category: 'Z_GHOST',
    commandText: 'mode Z_GHOST_TLE wakeup --target +14389855041 --network FIDO --trailer-ghost',
    description: 'Commande de réveil à distance Z_GHOST Trailer via le réseau cellulaire Fido (+1 438 985-5041).',
    isFavorite: true,
    requiresRoot: false
  },
  {
    id: 9,
    name: 'Appel Trailer Ghost (Réseau Fido)',
    category: 'Z_GHOST',
    commandText: 'termux-telephony-call +14389855041',
    description: 'Déclenche un appel cellulaire direct vers le terminal Trailer Ghost sur le réseau Fido.',
    isFavorite: true,
    requiresRoot: false
  },
  {
    id: 10,
    name: 'IA22 - Windows Core Update (Noeud S24)',
    category: 'IA22',
    commandText: "am broadcast -a android.intent.action.MAIN --es message 'IA22 : SESSION ACTIVE - M.I. ZOUBIROU'",
    description: 'Validation du Noeud Maitre (S24), transmission session IA22 (M.I. ZOUBIROU) via ADB.',
    isFavorite: true,
    requiresRoot: false
  },
  {
    id: 11,
    name: 'IA22 - Wipe RAM & Session Traces',
    category: 'IA22',
    commandText: "pkill -u mx76 2>/dev/null; history -c; echo 'Traces effacees. Systeme securise.'",
    description: "Ferme tous les processus Linux/WSL de mx76, vide la RAM et efface l'historique.",
    isFavorite: true,
    requiresRoot: false
  }
];

export const INITIAL_RCLONE_CONFIG: RcloneSyncConfig = {
  remoteName: 'gdrive',
  remotePath: '/Z-CORE/Captures/',
  maxRetries: 5,
  initialRetryDelayMs: 2000,
  maxRetryDelayMs: 30000,
  bandwidthLimit: '10M',
  chunkSize: '8M',
  transfers: 4,
  requireUnmeteredNetwork: false,
  requireWifi: false,
  autoSyncEnabled: true,
  dryRun: false,
  verboseLogging: true,
  logFilePath: '/data/data/com.termux/files/home/rclone_sync.log'
};

export const STREAM_PRESETS: StreamChannelPreset[] = [
  {
    id: 'zcore_logic_cover',
    title: 'Z-CORE Logic Cover (979V11)',
    category: 'Tunnel Cloudflare (Ghost)',
    streamUrl: 'https://retailers-mitchell-customs-rotation.trycloudflare.com/logic_cover.html',
    resolution: 'Web UI / Gatekeeper 979V11'
  },
  {
    id: 'zcore_usb_live',
    title: 'Z-CORE USB Live (Montreal)',
    category: 'Tunnel Cloudflare (Ghost)',
    streamUrl: 'https://retailers-mitchell-customs-rotation.trycloudflare.com/index_usb.html',
    resolution: 'Web UI / Montreal QC'
  },
  {
    id: 'zcore_workspace',
    title: 'Z-CORE Workspace Live',
    category: 'Tunnel Cloudflare (Ghost)',
    streamUrl: 'https://retailers-mitchell-customs-rotation.trycloudflare.com/',
    resolution: 'Cloudflare Root Listing'
  },
  {
    id: 'mux_test_hls',
    title: 'Mux Live HLS Test',
    category: 'Flux HLS Certifié',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    resolution: '1080p HLS Validé'
  },
  {
    id: 'bein_1_hf',
    title: 'BEIN 1 HF',
    category: 'Sport & Direct',
    streamUrl: 'https://tvnow.best/api/stream/amishpatel81@gmail.com/790899/livetv.epg/tf1.fr.m3u8',
    resolution: '1080p High Frequency'
  },
  {
    id: 'tf1_direct',
    title: 'TF1 HD Direct',
    category: 'Généraliste',
    streamUrl: 'https://tvnow.best/api/stream/amishpatel81@gmail.com/790899/livetv.epg/tf1.fr.m3u8',
    resolution: '1080p Direct'
  },
  {
    id: 'france_24',
    title: 'France 24 Info',
    category: 'Actualités 24/7',
    streamUrl: 'https://static.france24.com/live/F24_FR_LO_HLS/live_tv.m3u8',
    resolution: '720p HLS'
  },
  {
    id: 'euronews_fr',
    title: 'Euronews Français',
    category: 'Actualités Internationales',
    streamUrl: 'https://rakuten-euronews-1-eu.rakuten.wurl.tv/playlist.m3u8',
    resolution: '720p HLS'
  }
];

export const PREDEFINED_SCRIPTS: PredefinedTermuxScript[] = [
  {
    id: 'rclone_sync_audio',
    titleFr: 'Synchronisation Audio Google Drive',
    titleEn: 'Google Drive Audio Rclone Sync',
    category: 'RCLONE_CLOUD',
    descriptionFr: 'Transfère et synchronise les enregistrements audio locaux vers Google Drive avec reprise et bande passante contrôlée.',
    descriptionEn: 'Transfers and syncs local audio recordings to Google Drive with retries and bandwidth limiting.',
    arguments: [
      { key: 'sourceDir', labelFr: 'Dossier Local', labelEn: 'Local Folder', defaultValue: '/sdcard/recordings', descriptionFr: 'Chemin des fichiers audio', descriptionEn: 'Audio storage directory' },
      { key: 'remotePath', labelFr: 'Dossier Distant', labelEn: 'Remote Path', defaultValue: 'gdrive:/Z-CORE/Captures/', descriptionFr: 'Destination Google Drive', descriptionEn: 'Google Drive remote target' },
      { key: 'bwlimit', labelFr: 'Limite Bande Passante', labelEn: 'Bandwidth Limit', defaultValue: '10M', descriptionFr: 'Débit max (ex: 5M, 10M, 0)', descriptionEn: 'Max transfer rate' },
      { key: 'retries', labelFr: 'Nombre de Retries', labelEn: 'Retries Count', defaultValue: '5', descriptionFr: 'Tentatives en cas de coupure', descriptionEn: 'Retries on disconnect' }
    ],
    defaultRunInBackground: true,
    iconType: 'CLOUD_SYNC',
    templateScript: (args) => {
      const src = args.sourceDir || '/sdcard/recordings';
      const dst = args.remotePath || 'gdrive:/Z-CORE/Captures/';
      const bw = args.bwlimit || '10M';
      const retries = args.retries || '5';
      return `# === Z-CORE AUDIO RCLONE AUTO-SYNC ===
echo "[$(date '+%H:%M:%S')] Demarrage de la synchronisation Rclone..."
if ! command -v rclone &> /dev/null; then
    echo "Erreur: rclone n'est pas installe. Installez avec: pkg install rclone"
    exit 1
fi
mkdir -p "${src}"
rclone copy "${src}" "${dst}" \\
    --transfers 4 \\
    --retries ${retries} \\
    --bwlimit ${bw} \\
    --low-level-retries 10 \\
    --progress \\
    --verbose
echo "[$(date '+%H:%M:%S')] Synchronisation terminee vers ${dst} !"
if command -v termux-toast &> /dev/null; then
    termux-toast "Sync Rclone Z-CORE terminee avec succes !"
fi`;
    }
  },
  {
    id: 'termux_setup_storage',
    titleFr: 'Initialisation Stockage & Dossiers',
    titleEn: 'Termux Storage & Folder Init',
    category: 'STORAGE_SYSTEM',
    descriptionFr: 'Lie le stockage partagé Android (termux-setup-storage) et crée les répertoires ~/recordings et ~/scripts.',
    descriptionEn: 'Links Android shared storage and prepares ~/recordings and ~/scripts directories.',
    defaultRunInBackground: false,
    iconType: 'FOLDER',
    requiresStorageSetup: true,
    templateScript: () => `# === INITIALISATION STOCKAGE TERMUX & Z-CORE ===
echo "Demande d'autorisation de stockage Android..."
termux-setup-storage
mkdir -p ~/storage/shared/recordings
mkdir -p ~/scripts
mkdir -p ~/recordings_backup
echo "Arborescence Z-CORE configuree avec succes !"
ls -la ~/storage/shared/`
  },
  {
    id: 'rclone_test_connection',
    titleFr: 'Test Connexion Google Drive & Remotes',
    titleEn: 'Test Google Drive & Rclone Remotes',
    category: 'RCLONE_CLOUD',
    descriptionFr: 'Vérifie la validité des tokens OAuth2 et liste les dossiers distants du drive configuré.',
    descriptionEn: 'Validates OAuth2 token health and lists remote directories on configured Google Drive.',
    arguments: [
      { key: 'remoteName', labelFr: 'Nom du Remote', labelEn: 'Remote Name', defaultValue: 'gdrive:', descriptionFr: 'Nom du remote rclone.conf', descriptionEn: 'Rclone remote identifier' }
    ],
    defaultRunInBackground: false,
    iconType: 'CHECK',
    templateScript: (args) => {
      const remote = args.remoteName || 'gdrive:';
      return `# === VERIFICATION REMOTE RCLONE ===
echo "Verification des remotes rclone configures :"
rclone listremotes
echo "Test de connexion sur ${remote}..."
rclone lsd "${remote}" --timeout 15s
echo "Test complete avec succes !"`;
    }
  },
  {
    id: 'ffmpeg_audio_compress',
    titleFr: 'Compression Audio FFmpeg (AAC Lossless)',
    titleEn: 'FFmpeg Audio Compression (AAC Lossless)',
    category: 'AUDIO_PROCESSING',
    descriptionFr: 'Compresse les enregistrements WAV/PCM en format M4A/AAC 96k pour optimiser le transfert cloud.',
    descriptionEn: 'Batch encodes and compresses WAV/PCM recordings into optimized AAC M4A files for fast upload.',
    arguments: [
      { key: 'bitrate', labelFr: 'Débit Audio (Bitrate)', labelEn: 'Audio Bitrate', defaultValue: '96k', descriptionFr: 'Qualité compression', descriptionEn: 'Output bitrate', options: ['64k', '96k', '128k', '192k'] },
      { key: 'folder', labelFr: 'Dossier Source', labelEn: 'Source Folder', defaultValue: '/sdcard/recordings', descriptionFr: 'Emplacement des pistes', descriptionEn: 'Recordings directory' }
    ],
    defaultRunInBackground: true,
    iconType: 'AUDIO',
    templateScript: (args) => {
      const br = args.bitrate || '96k';
      const dir = args.folder || '/sdcard/recordings';
      return `# === COMPRESSION AUDIO FFMPEG Z-CORE ===
if ! command -v ffmpeg &> /dev/null; then
    echo "Installation de ffmpeg requise: pkg install ffmpeg"
    exit 1
fi
cd "${dir}" || exit 1
echo "Traitement des fichiers audio dans ${dir} (Debit: ${br})..."
for f in *.wav *.mp4; do
    [ -e "$f" ] || continue
    out="\${f%.*}.m4a"
    if [ ! -f "$out" ]; then
        echo "Compression de $f -> $out"
        ffmpeg -y -i "$f" -c:a aac -b:a ${br} -ar 44100 "$out"
    fi
done
echo "Encodage termine avec succes !"`;
    }
  },
  {
    id: 'z_ghost_wakeup_telemetry',
    titleFr: 'Protocole Réveil Z_GHOST (Fido)',
    titleEn: 'Z_GHOST Wakeup Telemetry Protocol',
    category: 'TELEMETRY_GHOST',
    descriptionFr: 'Exécute la séquence télémétrique vers le terminal cible mobile Fido (+1 438 985-5041).',
    descriptionEn: 'Executes the telemetry wakeup sequence targeted at mobile line Fido (+1 438 985-5041).',
    arguments: [
      { key: 'targetPhone', labelFr: 'Numéro Cible', labelEn: 'Target Phone', defaultValue: '+14389855041', descriptionFr: 'Ligne mobile de télémétrie', descriptionEn: 'Mobile receiver' },
      { key: 'carrier', labelFr: 'Opérateur Télécom', labelEn: 'Carrier Network', defaultValue: 'FIDO', descriptionFr: 'Nom du réseau', descriptionEn: 'Carrier name' }
    ],
    defaultRunInBackground: true,
    iconType: 'TERMINAL',
    templateScript: (args) => {
      const target = args.targetPhone || '+14389855041';
      const carrier = args.carrier || 'FIDO';
      return `# === Z_GHOST TLE WAKEUP TELEMETRY SEQUENCE ===
echo "Activation sequence Z_GHOST [Carrier: ${carrier}]..."
echo "Target Receiver: ${target}"
mode Z_GHOST_TLE wakeup --target ${target} --network ${carrier} --trailer-ghost --timestamp $(date +%s)
echo "Signal de synchro transmis a l'antenne Fido."
if command -v termux-toast &> /dev/null; then
    termux-toast "Protocole Z_GHOST active sur ${target} (${carrier})"
fi`;
    }
  },
  {
    id: 'termux_battery_health',
    titleFr: 'Télémétrie Batterie & Matériel',
    titleEn: 'Battery & Hardware Telemetry',
    category: 'TERMUX_API',
    descriptionFr: 'Récupère les paramètres physiques de la batterie (tension, température, niveau) via Termux:API.',
    descriptionEn: 'Fetches battery metrics via Termux:API.',
    defaultRunInBackground: false,
    requiresApiPlugin: true,
    iconType: 'BATTERY',
    templateScript: () => `# === BATTERY & HARDWARE TELEMETRY ===
echo "=== ETAT DE LA BATTERIE (TERMUX:API) ==="
if command -v termux-battery-status &> /dev/null; then
    termux-battery-status
else
    echo "Module termux-api non installe. Executez: pkg install termux-api"
    cat /sys/class/power_supply/battery/capacity 2>/dev/null || uptime
fi
echo ""
echo "=== INFO PROCESSEUR / KERNEL ==="
uname -a`
  },
  {
    id: 'network_cloud_ping',
    titleFr: 'Diagnostic Réseau & Ping Google APIs',
    titleEn: 'Network & Google API Ping Diagnostic',
    category: 'DIAGNOSTICS',
    descriptionFr: 'Mesure la latence réseau vers les serveurs Google Drive API et vérifie la résolution DNS.',
    descriptionEn: 'Pings Google Drive API endpoints to measure latency and test DNS resolution.',
    defaultRunInBackground: false,
    iconType: 'NETWORK',
    templateScript: () => `# === DIAGNOSTIC RESEAU & GOOGLE DRIVE ENDPOINT ===
echo "Test de connectivite vers www.googleapis.com..."
ping -c 4 www.googleapis.com
echo ""
echo "Test de resolution DNS :"
getprop net.dns1 2>/dev/null || echo "DNS Standard OK"
echo ""
echo "Test HTTP Header Google Drive :"
if command -v curl &> /dev/null; then
    curl -I --connect-timeout 5 https://www.googleapis.com
else
    echo "curl non installe. Installez avec: pkg install curl"
fi`
  }
];

export function generateInitialSyncLogs(): SyncLog[] {
  const logs: SyncLog[] = [];
  const now = Date.now();
  const dayMs = 86400000;

  const pattern = [
    [4, 0], [6, 1], [5, 0], [8, 0], [3, 1],
    [7, 0], [9, 1], [4, 0], [6, 0], [8, 1],
    [5, 0], [11, 1], [7, 0], [6, 0], [9, 2],
    [5, 0], [8, 0], [12, 1], [6, 0], [7, 1],
    [10, 0], [8, 0], [14, 1], [9, 0], [11, 1],
    [13, 0], [10, 1], [15, 0], [12, 1], [8, 0]
  ];

  let idCounter = 1;
  pattern.forEach(([successCount, failCount], idx) => {
    const daysAgo = 29 - idx;
    const baseTime = now - daysAgo * dayMs;

    for (let s = 0; s < successCount; s++) {
      const timeOffset = s * 7200000 + (s * 17 % 30) * 60000;
      const mb = (4.2 + (s * 1.8) % 15.0).toFixed(1);
      logs.push({
        id: idCounter++,
        recordingId: s % 2 === 0 ? 1 : 2,
        commandExecuted:
          s % 3 === 0
            ? 'rclone copy ./storage/enregistrement_ghost_vocal.wav gdrive:/Z-CORE/Captures/ --progress'
            : s % 3 === 1
            ? 'rclone sync ./storage/ gdrive:/Z-CORE/Captures/ --fast-list'
            : 'rclone copy ./storage/archives/ gdrive:/Archives/2026/ --checksum',
        status: 'SUCCESS',
        progressPercent: 100,
        bytesTransferred: `${mb} MB`,
        timestamp: baseTime + timeOffset,
        errorMessage: null
      });
    }

    for (let f = 0; f < failCount; f++) {
      const timeOffset = (f + 3) * 10800000 + 15 * 60000;
      logs.push({
        id: idCounter++,
        recordingId: 1,
        commandExecuted: 'rclone copy ./storage/enregistrement_ghost_vocal.wav gdrive:/Z-CORE/Captures/',
        status: 'FAILED',
        progressPercent: 35 + f * 15,
        bytesTransferred: '1.2 MB',
        timestamp: baseTime + timeOffset,
        errorMessage:
          f % 3 === 0
            ? 'Erreur HTTP 504 Gateway Timeout (Réseau distant instable)'
            : f % 3 === 1
            ? 'Jeton OAuth Google temporairement expiré (rafraîchissement automatique)'
            : "Connexion socket interrompue pendant l'upload"
      });
    }
  });

  return logs;
}
