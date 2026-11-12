# Audio Sync Hub (Z-CORE Voice & Google Drive Sync Infrastructure)

Rewritten from Android to a production-grade React + TypeScript application powered by Vite, Tailwind CSS, Web Audio API, and Gemini AI.

## Features

- **Voice Recorder Vault**:
  - Live 44.1 kHz PCM audio capture via standard Web Audio API & MediaRecorder
  - Interactive real-time waveform visualizer with amplitude bars
  - Silence Detection VAD (Voice Activity Detection): automatically pauses after 5 seconds of silence and automatically resumes when speech is detected
  - IndexedDB + LocalStorage persistent vault preserving recordings across browser reloads
  - Variable playback speed controls (0.75x, 1x, 1.25x, 1.5x, 2x), interactive waveform seek bar
  - Batch selection & mass multi-cloud transfer

- **Cloud Sync Manager (Google Drive & Rclone)**:
  - Google Drive OAuth2 integration & Firebase authentication state
  - Real-time Rclone CLI configuration (remote name, remote path, bandwidth limits, chunk size, retries)
  - 30-day transfer metrics, success rates, volume analysis, and transfer audit log
  - Custom Rclone command runner (`rclone copy`, `rclone sync`, `rclone lsd`)

- **Contacts & Transmission Directory**:
  - Full Google Contacts address book
  - Google Contacts standard CSV import and export
  - Direct telephony and dialer actions
  - Pre-seeded default contact (Nesrin Ouis)

- **Live Stream (BEIN 1 HF & Tunnels)**:
  - High Frequency live HLS player powered by HLS.js
  - Presets: BEIN 1 HF, Z-CORE Logic Cover (979V11), Z-CORE USB Live (Montreal), Z-CORE Workspace Live, TF1 HD Direct, France 24 Info, Euronews Français
  - Fullscreen video support, stream reload, and custom stream URL input

- **Termux & ADB Macro Manager**:
  - IA22 Master Node (S24) session controller (operator: M.I. ZOUBIROU)
  - Cloudflare tunnel status ping (`retailers-mitchell-customs-rotation.trycloudflare.com`)
  - ADB broadcast trigger (`IA22 : SESSION ACTIVE - M.I. ZOUBIROU`)
  - RAM & session purge command (`pkill -u mx76; history -c`)
  - Predefined Termux scripts catalog with configurable arguments and bash code generator
  - Interactive shell console simulator for direct CLI execution

- **Gemini AI Audio Studio**:
  - AI semantic analysis powered by Google Gemini (`gemini-2.5-flash`)
  - Voice transcription, summarization, and key action item extraction
  - NetsecurePro IA SIM & eSIM official license card (MILYES-IA V9 NANS CORE)

- **Hardware & System Dialogs**:
  - Real Device Mode settings (DAC 44.1k, direct mic, silence VAD, real rclone execution, etc.)
  - Bilingual switcher: Français 🇫🇷 / English 🇬🇧
  - Theme picker: Dark, Light, System, and Material Dynamic Color
  - Live camera snapshot tool
  - Google Play Store listing viewer

## Running the Application

```bash
npm install
npm run dev
```

Listens on `http://0.0.0.0:3000`.
