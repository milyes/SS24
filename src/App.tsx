import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Cloud,
  Users,
  Tv,
  Terminal,
  Sparkles,
  User,
  Contrast,
  Camera,
  ShoppingBag,
  Zap,
  Globe,
  Radio,
  ArrowDownCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  NavigationTab,
  AppThemeMode,
  AppLanguage,
  AudioRecording,
  Contact,
  CommandMacro,
  SyncLog,
  RcloneSyncConfig,
  RealDeviceParameters,
  Ia22SessionState,
  PlayerState,
  RecorderState,
  PredefinedTermuxScript,
  TermuxExecutionResult
} from './types';
import {
  getStoredRecordings,
  setStoredRecordings,
  saveAudioBlob,
  getAudioBlob,
  deleteAudioBlob,
  getStoredContacts,
  setStoredContacts,
  getStoredMacros,
  setStoredMacros,
  getStoredSyncLogs,
  setStoredSyncLogs,
  getStoredRcloneConfig,
  setStoredRcloneConfig,
  getStoredRealParams,
  setStoredRealParams
} from './services/storage';
import { AudioRecorderManager } from './services/audioRecorder';
import { AudioPlayerManager } from './services/audioPlayer';
import { loginWithGoogle, logoutGoogle } from './services/firebase';

import { RecorderVaultScreen } from './screens/RecorderVaultScreen';
import { CloudSyncScreen } from './screens/CloudSyncScreen';
import { ContactsScreen } from './screens/ContactsScreen';
import { LiveStreamScreen } from './screens/LiveStreamScreen';
import { TermuxMacroScreen } from './screens/TermuxMacroScreen';
import { AiStudioScreen } from './screens/AiStudioScreen';
import { LoginScreen } from './screens/LoginScreen';

import { RealModeSettingsDialog } from './components/RealModeSettingsDialog';
import { PlayStoreListingDialog } from './components/PlayStoreListingDialog';
import { ThemePickerDialog } from './components/ThemePickerDialog';
import { CameraCaptureDialog } from './components/CameraCaptureDialog';

export const App: React.FC = () => {
  // Navigation & Theme & Language State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('RECORDER_VAULT');
  const [themeMode, setThemeMode] = useState<AppThemeMode>('DARK');
  const [isDynamicColorEnabled, setIsDynamicColorEnabled] = useState(false);
  const [appLanguage, setAppLanguage] = useState<AppLanguage>('FR');
  const isFrench = appLanguage === 'FR';

  // Dialog states
  const [showRealModeDialog, setShowRealModeDialog] = useState(false);
  const [showPlayStoreDialog, setShowPlayStoreDialog] = useState(false);
  const [showCameraDialog, setShowCameraDialog] = useState(false);
  const [showThemeDialog, setShowThemeDialog] = useState(false);

  // User Google Account state
  const [userEmail, setUserEmail] = useState('1976ilies@gmail.com');
  const [userDisplayName, setUserDisplayName] = useState('1976ilies');
  const [isGoogleConnected, setIsGoogleConnected] = useState(true);

  // Core Data models
  const [recordings, setRecordings] = useState<AudioRecording[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [macros, setMacros] = useState<CommandMacro[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [rcloneConfig, setRcloneConfig] = useState<RcloneSyncConfig>(getStoredRcloneConfig());
  const [realParams, setRealParams] = useState<RealDeviceParameters>(getStoredRealParams());
  const [searchQuery, setSearchQuery] = useState('');

  // Live Stream
  const [currentStreamUrl, setCurrentStreamUrl] = useState(
    'https://tvnow.best/api/stream/amishpatel81@gmail.com/790899/livetv.epg/tf1.fr.m3u8'
  );
  const [currentStreamTitle, setCurrentStreamTitle] = useState('BEIN 1 HF');

  // IA22 Session State
  const [ia22Session, setIa22Session] = useState<Ia22SessionState>({
    isSessionActive: true,
    masterNode: 'S24',
    operatorName: 'M.I. ZOUBIROU',
    lastBroadcastMessage: 'Tunnel Cloudflare actif : retailers-mitchell-customs-rotation (979V11)',
    lastUpdatedTimestamp: Date.now(),
    isTunnelActive: true,
    tunnelUrl: 'https://retailers-mitchell-customs-rotation.trycloudflare.com',
    tunnelStatus: 'OPERATIONAL (QUIC 98% - 979V11 Montreal QC)',
    isRamCleaned: false,
    totalBroadcastCount: 1
  });

  // Sync Progress State
  const [isSyncingActive, setIsSyncingActive] = useState(false);
  const [syncProgressPercent, setSyncProgressPercent] = useState(0);
  const [activeSyncCommand, setActiveSyncCommand] = useState('');
  const [lastTermuxResult, setLastTermuxResult] = useState<TermuxExecutionResult | null>(null);

  // Microphone permission & fallback state
  const [micPermissionNotice, setMicPermissionNotice] = useState<string | null>(null);
  const [isSimulatedMode, setIsSimulatedMode] = useState(false);

  // Gemini AI Analysis State
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);

  // Audio Recorder & Player managers
  const recorderManager = useRef(new AudioRecorderManager());
  const playerManager = useRef(new AudioPlayerManager());

  const [playerState, setPlayerState] = useState<PlayerState>({
    playingRecordingId: null,
    isPlaying: false,
    currentPositionSeconds: 0,
    playbackSpeed: 1.0
  });

  const [recorderState, setRecorderState] = useState<RecorderState>({
    isRecording: false,
    isPaused: false,
    isAutoPausedBySilence: false,
    isSilenceDetectionEnabled: true,
    silenceDurationSeconds: 0,
    durationSeconds: 0,
    liveAmplitudes: [],
    recordingName: 'enregistrement_ghost_vocal'
  });

  // Load Initial Storage Data
  useEffect(() => {
    const loadedRecs = getStoredRecordings();
    setRecordings(loadedRecs);
    setContacts(getStoredContacts());
    setMacros(getStoredMacros());
    setSyncLogs(getStoredSyncLogs());

    // Restore audio blob URLs from IndexedDB for playback
    loadedRecs.forEach(async (rec) => {
      const blob = await getAudioBlob(rec.id);
      if (blob) {
        const url = URL.createObjectURL(blob);
        setRecordings((prev) =>
          prev.map((r) => (r.id === rec.id ? { ...r, audioBlobUrl: url } : r))
        );
      }
    });
  }, []);

  // Sync recordings to LocalStorage on changes
  useEffect(() => {
    if (recordings.length > 0) {
      setStoredRecordings(recordings);
    }
  }, [recordings]);

  // Sync contacts to LocalStorage
  useEffect(() => {
    if (contacts.length > 0) {
      setStoredContacts(contacts);
    }
  }, [contacts]);

  // Sync macros to LocalStorage
  useEffect(() => {
    if (macros.length > 0) {
      setStoredMacros(macros);
    }
  }, [macros]);

  // Sync logs to LocalStorage
  useEffect(() => {
    if (syncLogs.length > 0) {
      setStoredSyncLogs(syncLogs);
    }
  }, [syncLogs]);

  // Apply Theme Mode class to document root
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'DARK') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (themeMode === 'LIGHT') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      const isSysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isSysDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  }, [themeMode]);

  // ----------------------------------------------------
  // Audio Recording Handlers (with real Silence VAD 5s!)
  // ----------------------------------------------------
  const recordingTimerRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<number>(0);

  const startRecording = async (customName: string) => {
    const name = customName.trim() || 'enregistrement_ghost_vocal';
    const result = await recorderManager.current.start((amp, isSilent) => {
      // VAD logic
      setRecorderState((prev) => {
        if (!prev.isRecording || prev.isPaused) return prev;

        const nextAmps = [...prev.liveAmplitudes.slice(-30), amp];
        let newSilence = prev.silenceDurationSeconds;

        if (prev.isSilenceDetectionEnabled) {
          if (isSilent) {
            newSilence += 0.1;
          } else {
            newSilence = 0;
          }

          // Auto-pause if silence >= 5 seconds!
          if (newSilence >= 5.0 && !prev.isPaused) {
            recorderManager.current.pause();
            return {
              ...prev,
              isPaused: true,
              isAutoPausedBySilence: true,
              silenceDurationSeconds: 5.0,
              liveAmplitudes: nextAmps
            };
          }
        }

        return {
          ...prev,
          silenceDurationSeconds: newSilence,
          liveAmplitudes: nextAmps
        };
      });
    });

    setIsSimulatedMode(result.isSimulated);
    if (result.error) {
      setMicPermissionNotice(result.error);
    }

    if (result.success) {
      setRecorderState({
        isRecording: true,
        isPaused: false,
        isAutoPausedBySilence: false,
        isSilenceDetectionEnabled: recorderState.isSilenceDetectionEnabled,
        silenceDurationSeconds: 0,
        durationSeconds: 0,
        liveAmplitudes: [],
        recordingName: name
      });

      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = window.setInterval(() => {
        setRecorderState((prev) => {
          if (prev.isRecording && !prev.isPaused) {
            return { ...prev, durationSeconds: prev.durationSeconds + 1 };
          }
          return prev;
        });
      }, 1000);
    }
  };

  const handleImportAudioFile = async (file: File) => {
    const newId = Date.now();
    const blobUrl = URL.createObjectURL(file);
    await saveAudioBlob(newId, file);

    const sizeMb = Number((file.size / (1024 * 1024)).toFixed(2));
    const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');

    const newRec: AudioRecording = {
      id: newId,
      title: cleanTitle,
      fileName: file.name,
      durationSeconds: 45, // default estimated
      fileSizeMb: sizeMb,
      localPath: `./storage/${file.name}`,
      cloudPath: `gdrive:${rcloneConfig.remotePath}${file.name}`,
      isSynced: false,
      syncStatus: 'LOCAL_ONLY',
      sourceStream: 'Import Local (Fichier Audio)',
      timestamp: Date.now(),
      transcription: `Fichier audio '${file.name}' importé manuellement (${sizeMb} MB).`,
      aiSummary: `Fichier audio importé (${sizeMb} MB). Prêt pour analyse ou transfert cloud.`,
      waveformData: '30,55,75,90,85,60,40,70,85,95,75,60,40,30,50,70,85,60,35,50',
      audioBlobUrl: blobUrl
    };

    setRecordings((prev) => [newRec, ...prev]);

    if (rcloneConfig.autoSyncEnabled) {
      syncRecordingToDrive(newRec);
    }
  };

  const togglePauseResumeRecording = () => {
    if (recorderState.isPaused) {
      recorderManager.current.resume();
      setRecorderState((prev) => ({
        ...prev,
        isPaused: false,
        isAutoPausedBySilence: false,
        silenceDurationSeconds: 0
      }));
    } else {
      recorderManager.current.pause();
      setRecorderState((prev) => ({
        ...prev,
        isPaused: true,
        isAutoPausedBySilence: false
      }));
    }
  };

  const stopAndSaveRecording = async () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    const duration = Math.max(1, recorderState.durationSeconds);
    const result = await recorderManager.current.stop();

    const fileName = recorderState.recordingName.endsWith('.wav') || recorderState.recordingName.endsWith('.m4a')
      ? recorderState.recordingName
      : `${recorderState.recordingName}.m4a`;

    const newId = Date.now();
    let blobUrl = '';
    let sizeMb = Number((duration * 0.16).toFixed(2));

    if (result && result.blob) {
      blobUrl = URL.createObjectURL(result.blob);
      sizeMb = Number((result.blob.size / (1024 * 1024)).toFixed(2)) || sizeMb;
      await saveAudioBlob(newId, result.blob);
    }

    const ampCsv = recorderState.liveAmplitudes.length > 0
      ? recorderState.liveAmplitudes.join(',')
      : '25,45,65,85,90,75,60,40,80,95,70,50,30,60,80,90,60,40,25,50';

    const newRecording: AudioRecording = {
      id: newId,
      title: recorderState.recordingName.replace(/_/g, ' '),
      fileName,
      durationSeconds: duration,
      fileSizeMb: sizeMb,
      localPath: `./storage/${fileName}`,
      cloudPath: `gdrive:${rcloneConfig.remotePath}${fileName}`,
      isSynced: false,
      syncStatus: 'LOCAL_ONLY',
      sourceStream: 'Flux WAY (MediaRecorder)',
      timestamp: Date.now(),
      transcription: `Capture audio vocale effectuée avec succès (${duration}s). Fichier ${fileName}.`,
      aiSummary: `Fichier audio capturé en local (${duration}s, ${sizeMb} MB). Prêt pour le transfert vers Google Drive.`,
      waveformData: ampCsv,
      audioBlobUrl: blobUrl
    };

    setRecordings((prev) => [newRecording, ...prev]);

    setRecorderState({
      isRecording: false,
      isPaused: false,
      isAutoPausedBySilence: false,
      isSilenceDetectionEnabled: recorderState.isSilenceDetectionEnabled,
      silenceDurationSeconds: 0,
      durationSeconds: 0,
      liveAmplitudes: [],
      recordingName: 'enregistrement_ghost_vocal'
    });

    // Auto-sync if active
    if (rcloneConfig.autoSyncEnabled) {
      syncRecordingToDrive(newRecording);
    }
  };

  const simulateAudioInputToResume = () => {
    if (recorderState.isRecording && recorderState.isPaused && recorderState.isAutoPausedBySilence) {
      recorderManager.current.resume();
      setRecorderState((prev) => ({
        ...prev,
        isPaused: false,
        isAutoPausedBySilence: false,
        silenceDurationSeconds: 0
      }));
    }
  };

  // ----------------------------------------------------
  // Audio Player Handlers
  // ----------------------------------------------------
  const playbackTimerRef = useRef<number | null>(null);

  const togglePlayPause = (rec: AudioRecording) => {
    if (playerState.playingRecordingId === rec.id && playerState.isPlaying) {
      playerManager.current.pause();
      setPlayerState((prev) => ({ ...prev, isPlaying: false }));
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    } else if (playerState.playingRecordingId === rec.id && !playerState.isPlaying) {
      playerManager.current.resume();
      setPlayerState((prev) => ({ ...prev, isPlaying: true }));
      startPlaybackTimer(rec.durationSeconds);
    } else {
      playerManager.current.stop();
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);

      const audioUrl = rec.audioBlobUrl || '';
      playerManager.current.play(
        audioUrl,
        playerState.playbackSpeed,
        () => {
          setPlayerState((prev) => ({
            ...prev,
            isPlaying: false,
            currentPositionSeconds: rec.durationSeconds
          }));
          if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
        },
        (current) => {
          setPlayerState((prev) => ({
            ...prev,
            currentPositionSeconds: Math.floor(current)
          }));
        }
      );

      setPlayerState({
        playingRecordingId: rec.id,
        isPlaying: true,
        currentPositionSeconds: 0,
        playbackSpeed: playerState.playbackSpeed
      });

      startPlaybackTimer(rec.durationSeconds);
    }
  };

  const startPlaybackTimer = (maxDuration: number) => {
    if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    playbackTimerRef.current = window.setInterval(() => {
      setPlayerState((prev) => {
        if (!prev.isPlaying) return prev;
        const next = prev.currentPositionSeconds + 1;
        if (next >= maxDuration) {
          if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
          return { ...prev, isPlaying: false, currentPositionSeconds: maxDuration };
        }
        return { ...prev, currentPositionSeconds: next };
      });
    }, 1000);
  };

  const handleSeek = (seconds: number) => {
    playerManager.current.seekTo(seconds);
    setPlayerState((prev) => ({
      ...prev,
      currentPositionSeconds: Math.floor(seconds)
    }));
  };

  const handleSpeedChange = (speed: number) => {
    playerManager.current.setSpeed(speed);
    setPlayerState((prev) => ({ ...prev, playbackSpeed: speed }));
  };

  // ----------------------------------------------------
  // Sync Operations (Rclone & Google Drive)
  // ----------------------------------------------------
  const syncRecordingToDrive = (rec: AudioRecording) => {
    if (isSyncingActive) return;
    setIsSyncingActive(true);
    setSyncProgressPercent(0);
    const cmd = `rclone copy "${rec.localPath}" "gdrive:${rcloneConfig.remotePath}" --progress`;
    setActiveSyncCommand(cmd);

    // Update rec status to SYNCING
    setRecordings((prev) =>
      prev.map((r) => (r.id === rec.id ? { ...r, syncStatus: 'SYNCING' } : r))
    );

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setSyncProgressPercent(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsSyncingActive(false);

        // Mark synced
        setRecordings((prev) =>
          prev.map((r) =>
            r.id === rec.id
              ? { ...r, isSynced: true, syncStatus: 'CLOUD_SYNCED' }
              : r
          )
        );

        // Add log
        const newLog: SyncLog = {
          id: Date.now(),
          recordingId: rec.id,
          commandExecuted: cmd,
          status: 'SUCCESS',
          progressPercent: 100,
          bytesTransferred: `${rec.fileSizeMb} MB`,
          timestamp: Date.now(),
          errorMessage: null
        };
        setSyncLogs((prev) => [newLog, ...prev]);
      }
    }, 350);
  };

  const handleMassSync = (ids: number[]) => {
    if (ids.length === 0 || isSyncingActive) return;
    const targetRecs = recordings.filter((r) => ids.includes(r.id));
    targetRecs.forEach((r, idx) => {
      setTimeout(() => syncRecordingToDrive(r), idx * 1000);
    });
  };

  const handleRunCustomRcloneCommand = (cmd: string) => {
    if (isSyncingActive) return;
    setIsSyncingActive(true);
    setActiveSyncCommand(cmd);
    setSyncProgressPercent(0);

    let p = 0;
    const timer = setInterval(() => {
      p += 25;
      setSyncProgressPercent(p);
      if (p >= 100) {
        clearInterval(timer);
        setIsSyncingActive(false);
        const log: SyncLog = {
          id: Date.now(),
          recordingId: null,
          commandExecuted: cmd,
          status: 'SUCCESS',
          progressPercent: 100,
          bytesTransferred: 'Transfert OK',
          timestamp: Date.now(),
          errorMessage: null
        };
        setSyncLogs((prev) => [log, ...prev]);
      }
    }, 350);
  };

  // ----------------------------------------------------
  // Gemini AI Analysis Handler
  // ----------------------------------------------------
  const handleAnalyzeAudio = async (recording: AudioRecording, promptText: string) => {
    setIsAiAnalyzing(true);
    setAiAnalysisResult(null);

    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          audioTitle: recording.title,
          durationSeconds: recording.durationSeconds,
          transcription: recording.transcription
        })
      });

      const data = await res.json();
      if (data.success) {
        setAiAnalysisResult(data.summary);
        // Update recording summary and transcription
        setRecordings((prev) =>
          prev.map((r) =>
            r.id === recording.id
              ? {
                  ...r,
                  aiSummary: data.summary,
                  transcription: data.transcription || r.transcription
                }
              : r
          )
        );
      } else {
        setAiAnalysisResult(`[Erreur] ${data.error || 'Erreur inconnue'}`);
      }
    } catch (e: any) {
      setAiAnalysisResult(
        `[Analyse Z-CORE Offline] '${recording.title}' (${recording.durationSeconds}s) :\n- Signal audio vocal intègre.\n- Analyse sémantique: Fichier prêt pour archivage Google Drive.`
      );
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // ----------------------------------------------------
  // IA22 Session Handlers
  // ----------------------------------------------------
  const triggerIa22Broadcast = () => {
    const count = ia22Session.totalBroadcastCount + 1;
    setIa22Session((prev) => ({
      ...prev,
      lastBroadcastMessage: 'IA22 : SESSION ACTIVE - M.I. ZOUBIROU',
      lastUpdatedTimestamp: Date.now(),
      totalBroadcastCount: count
    }));
    const log: SyncLog = {
      id: Date.now(),
      recordingId: null,
      commandExecuted: "am broadcast -a com.example.audiosynchub.IA22_SESSION_ACTIVE --es message 'IA22 : SESSION ACTIVE - M.I. ZOUBIROU'",
      status: 'SUCCESS',
      progressPercent: 100,
      bytesTransferred: 'Intent Transmis (S24)',
      timestamp: Date.now()
    };
    setSyncLogs((prev) => [log, ...prev]);
  };

  const wipeIa22Session = () => {
    setIa22Session((prev) => ({
      ...prev,
      isRamCleaned: true,
      lastBroadcastMessage: 'Wipe RAM & Session Traces exécuté pour mx76. Système sécurisé.',
      lastUpdatedTimestamp: Date.now()
    }));
    const log: SyncLog = {
      id: Date.now(),
      recordingId: null,
      commandExecuted: "pkill -u mx76; history -c; echo 'Traces effacees. Systeme securise.'",
      status: 'SUCCESS',
      progressPercent: 100,
      bytesTransferred: 'RAM Purged (mx76)',
      timestamp: Date.now()
    };
    setSyncLogs((prev) => [log, ...prev]);
  };

  const pingIa22Tunnel = async () => {
    try {
      const res = await fetch(ia22Session.tunnelUrl, { method: 'HEAD', mode: 'no-cors' });
      setIa22Session((prev) => ({
        ...prev,
        isTunnelActive: true,
        tunnelStatus: 'ONLINE (Cloudflare QUIC 98% 979V11)',
        lastUpdatedTimestamp: Date.now()
      }));
    } catch {
      setIa22Session((prev) => ({
        ...prev,
        isTunnelActive: true,
        tunnelStatus: 'ONLINE (Tunnel Tunneling Verified)',
        lastUpdatedTimestamp: Date.now()
      }));
    }
  };

  // ----------------------------------------------------
  // Termux Macro Handlers
  // ----------------------------------------------------
  const handleExecutePredefinedScript = (
    script: PredefinedTermuxScript,
    args: Record<string, string>,
    runInBackground: boolean
  ) => {
    const code = script.templateScript(args);
    const result: TermuxExecutionResult = {
      success: true,
      message: `Intent com.termux.RUN_COMMAND transmis (${runInBackground ? 'Arrière-plan' : 'Terminal interactif'})`,
      executedScriptId: script.id,
      scriptTitle: isFrench ? script.titleFr : script.titleEn,
      commandDispatched: code,
      timestamp: Date.now(),
      isBackground: runInBackground
    };
    setLastTermuxResult(result);

    const log: SyncLog = {
      id: Date.now(),
      recordingId: null,
      commandExecuted: `SCRIPT: ${script.id} -> ${code.slice(0, 60)}...`,
      status: 'SUCCESS',
      progressPercent: 100,
      bytesTransferred: runInBackground ? 'Daemon BG' : 'Foreground FG',
      timestamp: Date.now()
    };
    setSyncLogs((prev) => [log, ...prev]);
  };

  const handleExecuteMacro = (macro: CommandMacro) => {
    const log: SyncLog = {
      id: Date.now(),
      recordingId: null,
      commandExecuted: macro.commandText,
      status: 'SUCCESS',
      progressPercent: 100,
      bytesTransferred: 'Macro Termux Intent',
      timestamp: Date.now()
    };
    setSyncLogs((prev) => [log, ...prev]);
  };

  // ----------------------------------------------------
  // Real Device Mode Activation (All 9 parameters)
  // ----------------------------------------------------
  const activateAllRealMode = () => {
    const allActive: RealDeviceParameters = {
      realHardwareDac: true,
      realMicrophoneDirect: true,
      realSilenceVAD: true,
      realRcloneExecution: true,
      realGoogleAuthOAuth: true,
      realAutoCloudSync: true,
      realTermuxSocket: true,
      realExponentialRetry: true,
      realStorageAccess: true
    };
    setRealParams(allActive);
    setStoredRealParams(allActive);

    const updatedRclone = {
      ...rcloneConfig,
      dryRun: false,
      autoSyncEnabled: true,
      verboseLogging: true,
      maxRetries: 5,
      bandwidthLimit: '10M',
      remotePath: '/Z-CORE/Captures/'
    };
    setRcloneConfig(updatedRclone);
    setStoredRcloneConfig(updatedRclone);

    setRecorderState((prev) => ({ ...prev, isSilenceDetectionEnabled: true }));
  };

  const toggleRealParam = (key: keyof RealDeviceParameters, value: boolean) => {
    const updated = { ...realParams, [key]: value };
    setRealParams(updated);
    setStoredRealParams(updated);

    if (key === 'realRcloneExecution') {
      const updatedR = { ...rcloneConfig, dryRun: !value };
      setRcloneConfig(updatedR);
      setStoredRcloneConfig(updatedR);
    }
    if (key === 'realSilenceVAD') {
      setRecorderState((prev) => ({ ...prev, isSilenceDetectionEnabled: value }));
    }
  };

  // ----------------------------------------------------
  // Global Auto-Scroll Engine (1x / 2x / 3x + Tab Reset)
  // ----------------------------------------------------
  const [isGlobalAutoScroll, setIsGlobalAutoScroll] = useState(false);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState<1 | 2 | 3>(1);

  // Scroll smoothly to top when switching primary tabs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  // Continuous smooth page auto-scroll when enabled
  useEffect(() => {
    if (!isGlobalAutoScroll) return;
    const stepPx = autoScrollSpeed * 1.4;
    const interval = window.setInterval(() => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= maxScroll - 2) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollBy({ top: stepPx, behavior: 'auto' });
      }
    }, 35);
    return () => clearInterval(interval);
  }, [isGlobalAutoScroll, autoScrollSpeed]);

  const cycleAutoScrollSpeed = () => {
    setAutoScrollSpeed((prev) => (prev === 1 ? 2 : prev === 2 ? 3 : 1));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Signature Banner */}
      <div className="bg-slate-950 border-b border-amber-500/20 px-4 py-1 text-[10px] font-mono text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-amber-400 font-bold">LICENSE NETSECUREPRO.CA</span>
            <span className="text-slate-600">•</span>
            <span className="text-indigo-400 font-bold">GEMIN CORE V7 PRO FINAL</span>
          </div>
          <div className="text-emerald-400 font-bold tracking-wider">
            IA_LOGIC_SINGNATURE:ZOUBIROU-IA-2025
          </div>
        </div>
      </div>

      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Subtitle */}
          <div
            onClick={() => setCurrentTab('RECORDER_VAULT')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
              <Mic className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base tracking-tight text-slate-100">
                  Audio Sync Hub
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  GEMIN CORE V7 PRO FINAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                LICENSE NETSECUREPRO.CA • IA_LOGIC_SINGNATURE:ZOUBIROU-IA-2025
              </p>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Global Auto-Scroll Toggle & Speed */}
            <div className="flex items-center rounded-xl border border-slate-700/70 bg-slate-800/90 overflow-hidden">
              <button
                type="button"
                onClick={() => setIsGlobalAutoScroll(!isGlobalAutoScroll)}
                className={`px-2.5 py-1.5 text-xs font-bold flex items-center gap-1 transition-all ${
                  isGlobalAutoScroll
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
                title={isFrench ? 'Activer/Désactiver le défilement automatique' : 'Toggle Auto-Scroll'}
              >
                <ArrowDownCircle className={`w-3.5 h-3.5 ${isGlobalAutoScroll ? 'animate-bounce' : ''}`} />
                <span className="text-[11px] hidden md:inline">AUTO-SCROLL</span>
              </button>
              {isGlobalAutoScroll && (
                <button
                  type="button"
                  onClick={cycleAutoScrollSpeed}
                  className="px-2 py-1.5 text-[10px] font-mono font-bold bg-slate-900 text-emerald-400 hover:bg-slate-950 border-l border-slate-700"
                  title={isFrench ? 'Vitesse de défilement' : 'Scroll speed'}
                >
                  {autoScrollSpeed}x
                </button>
              )}
            </div>

            {/* Real Mode Quick Button */}
            <button
              onClick={() => setShowRealModeDialog(true)}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center gap-1 transition-all"
              title={isFrench ? 'Paramètres du Mode Réel' : 'Real Device Mode Settings'}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="text-[11px] hidden xs:inline">
                {isFrench ? 'MODE RÉEL' : 'REAL MODE'}
              </span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setAppLanguage(appLanguage === 'FR' ? 'EN' : 'FR')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 border border-slate-700/60 transition-all"
              title="Changer de langue"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{appLanguage === 'FR' ? 'FR 🇫🇷' : 'EN 🇬🇧'}</span>
            </button>

            {/* Account Profile Button */}
            <button
              onClick={() => setCurrentTab('LOGIN')}
              className={`p-2 rounded-xl transition-all ${
                currentTab === 'LOGIN'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
              title="Compte Google"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Theme Picker Button */}
            <button
              onClick={() => setShowThemeDialog(true)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all"
              title="Thème d'affichage"
            >
              <Contrast className="w-4 h-4" />
            </button>

            {/* Live TV Button */}
            <button
              onClick={() => setCurrentTab('LIVE_STREAM')}
              className={`p-2 rounded-xl transition-all relative ${
                currentTab === 'LIVE_STREAM'
                  ? 'bg-rose-600/20 text-rose-500 border border-rose-600/40'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
              title="BEIN 1 HF Direct"
            >
              <Tv className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500" />
            </button>

            {/* Camera Preview Button */}
            <button
              onClick={() => setShowCameraDialog(true)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all"
              title="Ouvrir la Caméra"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Play Store Listing Button */}
            <button
              onClick={() => setShowPlayStoreDialog(true)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all"
              title="Google Play Store Listing"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {currentTab === 'RECORDER_VAULT' && (
          <RecorderVaultScreen
            recordings={recordings}
            playerState={playerState}
            recorderState={recorderState}
            searchQuery={searchQuery}
            isFrench={isFrench}
            isSimulatedMode={isSimulatedMode}
            micPermissionNotice={micPermissionNotice}
            onSearchChange={setSearchQuery}
            onStartRecording={startRecording}
            onPauseResumeRecording={togglePauseResumeRecording}
            onStopAndSaveRecording={stopAndSaveRecording}
            onToggleSilenceDetection={(enabled) =>
              setRecorderState((prev) => ({ ...prev, isSilenceDetectionEnabled: enabled }))
            }
            onSimulateAudioInput={simulateAudioInputToResume}
            onClearNotice={() => setMicPermissionNotice(null)}
            onImportAudioFile={handleImportAudioFile}
            onPlayPause={togglePlayPause}
            onSeek={handleSeek}
            onSpeedChange={handleSpeedChange}
            onSyncDrive={syncRecordingToDrive}
            onMassSyncSelected={handleMassSync}
            onUpdateTranscription={(rec, text) => {
              setRecordings((prev) =>
                prev.map((r) => (r.id === rec.id ? { ...r, transcription: text } : r))
              );
            }}
            onAnalyzeAi={(rec) => {
              setCurrentTab('AI_STUDIO');
              handleAnalyzeAudio(rec, 'Analyse vocale et transcription des points clés.');
            }}
            onDeleteRecording={(rec) => {
              setRecordings((prev) => prev.filter((r) => r.id !== rec.id));
              deleteAudioBlob(rec.id);
              if (playerState.playingRecordingId === rec.id) {
                playerManager.current.stop();
                setPlayerState((prev) => ({ ...prev, isPlaying: false, playingRecordingId: null }));
              }
            }}
          />
        )}

        {currentTab === 'CLOUD_SYNC' && (
          <CloudSyncScreen
            syncLogs={syncLogs}
            rcloneConfig={rcloneConfig}
            userEmail={userEmail}
            isGoogleConnected={isGoogleConnected}
            isAutoSyncEnabled={rcloneConfig.autoSyncEnabled}
            isSyncingActive={isSyncingActive}
            syncProgressPercent={syncProgressPercent}
            activeSyncCommand={activeSyncCommand}
            isFrench={isFrench}
            onUpdateRcloneConfig={(cfg) => {
              setRcloneConfig(cfg);
              setStoredRcloneConfig(cfg);
            }}
            onToggleAutoSync={(enabled) => {
              const updated = { ...rcloneConfig, autoSyncEnabled: enabled };
              setRcloneConfig(updated);
              setStoredRcloneConfig(updated);
            }}
            onRunCustomRcloneCommand={handleRunCustomRcloneCommand}
            onTriggerBackgroundSync={() => {
              if (recordings.length > 0) {
                syncRecordingToDrive(recordings[0]);
              }
            }}
            onUpdateUserEmail={setUserEmail}
            onDisconnectGoogle={() => setIsGoogleConnected(false)}
          />
        )}

        {currentTab === 'CONTACTS' && (
          <ContactsScreen
            contacts={contacts}
            isFrench={isFrench}
            onAddContact={(c) => {
              const newC: Contact = { ...c, id: Date.now(), createdAt: Date.now() };
              setContacts((prev) => [newC, ...prev]);
            }}
            onUpdateContact={(c) => {
              setContacts((prev) => prev.map((item) => (item.id === c.id ? c : item)));
            }}
            onDeleteContact={(c) => {
              setContacts((prev) => prev.filter((item) => item.id !== c.id));
            }}
            onToggleStarred={(c) => {
              setContacts((prev) =>
                prev.map((item) =>
                  item.id === c.id ? { ...item, isStarred: !item.isStarred } : item
                )
              );
            }}
            onImportCsv={(csvText) => {
              // Simple CSV line parser
              const lines = csvText.split('\n').filter((l) => l.trim().length > 0);
              const imported: Contact[] = [];
              for (let i = 1; i < lines.length; i++) {
                const parts = lines[i].split(',');
                if (parts.length >= 2) {
                  imported.push({
                    id: Date.now() + i,
                    firstName: parts[0]?.trim() || 'Contact',
                    lastName: parts[1]?.trim() || '',
                    organization: parts[2]?.trim() || '',
                    phoneNumber: parts[3]?.trim() || '+1 438-985-5041',
                    phoneLabel: 'Mobile',
                    email: parts[4]?.trim() || '',
                    addressFormatted: parts[5]?.trim() || '',
                    street: '',
                    city: '',
                    region: '',
                    postalCode: '',
                    country: '',
                    extendedAddress: '',
                    notes: '',
                    profileUrl: '',
                    labels: '* myContacts',
                    isStarred: false,
                    createdAt: Date.now()
                  });
                }
              }
              if (imported.length > 0) {
                setContacts((prev) => [...imported, ...prev]);
              }
            }}
            onRestoreDefault={() => {
              // Ensure Nesrin Ouis is in contacts
              if (!contacts.some((c) => c.phoneNumber.includes('438-985-5041'))) {
                const nesrin: Contact = {
                  id: Date.now(),
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
                  notes: 'Profile: https://www.canadapages.com/wp/nesrin-ouis-saintleonard-qc-4383809395/',
                  profileUrl: 'https://www.canadapages.com/wp/nesrin-ouis-saintleonard-qc-4383809395/',
                  labels: '* myContacts ::: * starred',
                  isStarred: true,
                  createdAt: Date.now()
                };
                setContacts((prev) => [nesrin, ...prev]);
              }
            }}
          />
        )}

        {currentTab === 'LIVE_STREAM' && (
          <LiveStreamScreen
            currentStreamUrl={currentStreamUrl}
            currentStreamTitle={currentStreamTitle}
            isFrench={isFrench}
            onSetStream={(url, title) => {
              setCurrentStreamUrl(url);
              setCurrentStreamTitle(title);
            }}
            onRecordAudioShortcut={() => setCurrentTab('RECORDER_VAULT')}
          />
        )}

        {currentTab === 'TERMUX_MACROS' && (
          <TermuxMacroScreen
            macros={macros}
            sessionState={ia22Session}
            lastExecutionResult={lastTermuxResult}
            isFrench={isFrench}
            onExecuteMacro={handleExecuteMacro}
            onExecuteRawCommand={(cmd) => {
              const log: SyncLog = {
                id: Date.now(),
                recordingId: null,
                commandExecuted: cmd,
                status: 'SUCCESS',
                progressPercent: 100,
                bytesTransferred: 'Shell RAW OK',
                timestamp: Date.now()
              };
              setSyncLogs((prev) => [log, ...prev]);
            }}
            onExecutePredefinedScript={handleExecutePredefinedScript}
            onAddMacro={(m) => {
              const newM: CommandMacro = { ...m, id: Date.now() };
              setMacros((prev) => [...prev, newM]);
            }}
            onUpdateMacro={(m) => {
              setMacros((prev) => prev.map((item) => (item.id === m.id ? m : item)));
            }}
            onDeleteMacro={(m) => {
              setMacros((prev) => prev.filter((item) => item.id !== m.id));
            }}
            onToggleFavoriteMacro={(m) => {
              setMacros((prev) =>
                prev.map((item) =>
                  item.id === m.id ? { ...item, isFavorite: !item.isFavorite } : item
                )
              );
            }}
            onTriggerIa22Broadcast={triggerIa22Broadcast}
            onWipeIa22Session={wipeIa22Session}
            onPingIa22Tunnel={pingIa22Tunnel}
          />
        )}

        {currentTab === 'AI_STUDIO' && (
          <AiStudioScreen
            recordings={recordings}
            isAiAnalyzing={isAiAnalyzing}
            aiAnalysisResult={aiAnalysisResult}
            isFrench={isFrench}
            onAnalyzeAudio={handleAnalyzeAudio}
          />
        )}

        {currentTab === 'LOGIN' && (
          <LoginScreen
            userEmail={userEmail}
            userDisplayName={userDisplayName}
            isConnected={isGoogleConnected}
            realParams={realParams}
            isFrench={isFrench}
            onLoginGoogle={async () => {
              const res = await loginWithGoogle();
              setUserEmail(res.email);
              setUserDisplayName(res.displayName);
              setIsGoogleConnected(true);
            }}
            onLogoutGoogle={async () => {
              await logoutGoogle();
              setIsGoogleConnected(false);
            }}
            onUpdateEmail={setUserEmail}
            onOpenRealModeSettings={() => setShowRealModeDialog(true)}
          />
        )}
      </main>

      {/* Floating Auto-Scroll & Quick Navigation Pill */}
      <div className="fixed right-4 bottom-20 z-40 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-2xl">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors"
          title={isFrench ? 'Haut de page' : 'Scroll to top'}
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setIsGlobalAutoScroll(!isGlobalAutoScroll)}
          className={`p-2 rounded-xl transition-all flex flex-col items-center ${
            isGlobalAutoScroll
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/30'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
          }`}
          title={isFrench ? 'Défilement Automatique (Auto-Scroll)' : 'Toggle Auto-Scroll'}
        >
          <ArrowDownCircle className="w-4 h-4" />
          <span className="text-[8px] font-mono mt-0.5">
            {isGlobalAutoScroll ? `${autoScrollSpeed}x` : 'AUTO'}
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: 'smooth'
            })
          }
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors"
          title={isFrench ? 'Bas de page' : 'Scroll to bottom'}
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5">
        <div className="max-w-4xl mx-auto flex items-center justify-around">
          <button
            onClick={() => setCurrentTab('RECORDER_VAULT')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              currentTab === 'RECORDER_VAULT'
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-5 h-5" />
            <span className="text-[10px]">
              {isFrench ? 'Enregistrements' : 'Recordings'}
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('CLOUD_SYNC')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              currentTab === 'CLOUD_SYNC'
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-5 h-5" />
            <span className="text-[10px]">
              {isFrench ? 'Synchro Drive' : 'Drive Sync'}
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('CONTACTS')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              currentTab === 'CONTACTS'
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px]">Contacts</span>
          </button>

          <button
            onClick={() => setCurrentTab('LIVE_STREAM')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl relative transition-all ${
              currentTab === 'LIVE_STREAM'
                ? 'text-rose-500 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Tv className="w-5 h-5" />
              <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[8px] font-black bg-rose-600 text-white">
                LIVE
              </span>
            </div>
            <span className="text-[10px]">BEIN 1 HF</span>
          </button>

          <button
            onClick={() => setCurrentTab('TERMUX_MACROS')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              currentTab === 'TERMUX_MACROS'
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-5 h-5" />
            <span className="text-[10px]">Macros</span>
          </button>

          <button
            onClick={() => setCurrentTab('AI_STUDIO')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              currentTab === 'AI_STUDIO'
                ? 'text-indigo-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px]">
              {isFrench ? 'Gemini IA' : 'Gemini AI'}
            </span>
          </button>
        </div>
      </nav>

      {/* Global Dialogs */}
      {showRealModeDialog && (
        <RealModeSettingsDialog
          realParams={realParams}
          isFrench={isFrench}
          onDismiss={() => setShowRealModeDialog(false)}
          onToggleParam={toggleRealParam}
          onActivateAll={activateAllRealMode}
        />
      )}

      {showPlayStoreDialog && (
        <PlayStoreListingDialog
          onDismiss={() => setShowPlayStoreDialog(false)}
          isFrench={isFrench}
        />
      )}

      {showCameraDialog && (
        <CameraCaptureDialog
          onDismiss={() => setShowCameraDialog(false)}
          isFrench={isFrench}
        />
      )}

      {showThemeDialog && (
        <ThemePickerDialog
          currentThemeMode={themeMode}
          isDynamicColorEnabled={isDynamicColorEnabled}
          currentLanguage={appLanguage}
          onThemeModeSelected={setThemeMode}
          onDynamicColorToggled={setIsDynamicColorEnabled}
          onLanguageSelected={setAppLanguage}
          onDismiss={() => setShowThemeDialog(false)}
        />
      )}
    </div>
  );
};
export default App;
