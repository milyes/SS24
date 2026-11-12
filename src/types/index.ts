export type NavigationTab =
  | 'LOGIN'
  | 'RECORDER_VAULT'
  | 'CLOUD_SYNC'
  | 'CONTACTS'
  | 'LIVE_STREAM'
  | 'TERMUX_MACROS'
  | 'AI_STUDIO';

export type AppThemeMode = 'DARK' | 'LIGHT' | 'SYSTEM';
export type AppLanguage = 'FR' | 'EN';

export interface AudioRecording {
  id: number;
  title: string;
  fileName: string;
  durationSeconds: number;
  fileSizeMb: number;
  localPath: string;
  cloudPath: string;
  isSynced: boolean;
  syncStatus: 'LOCAL_ONLY' | 'SYNCING' | 'CLOUD_SYNCED' | 'ERROR';
  timestamp: number;
  sourceStream: string;
  transcription?: string;
  aiSummary?: string;
  waveformData: string; // CSV amplitude numbers e.g. "15,28,45,80,..."
  audioBlobUrl?: string; // in-memory or indexedDB playback URL
}

export interface CommandMacro {
  id: number;
  name: string;
  category: 'RCLONE' | 'ADB' | 'TERMUX' | 'Z_GHOST' | 'IA22' | string;
  commandText: string;
  description: string;
  isFavorite: boolean;
  requiresRoot: boolean;
}

export interface Contact {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  organization: string;
  phoneNumber: string;
  phoneLabel: string;
  email: string;
  addressFormatted: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  extendedAddress: string;
  notes: string;
  profileUrl: string;
  labels: string;
  isStarred: boolean;
  createdAt: number;
}

export interface SyncLog {
  id: number;
  recordingId: number | null;
  commandExecuted: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILED';
  progressPercent: number;
  bytesTransferred: string;
  timestamp: number;
  errorMessage?: string | null;
}

export interface ScriptArgument {
  key: string;
  labelFr: string;
  labelEn: string;
  defaultValue: string;
  descriptionFr: string;
  descriptionEn: string;
  isSecret?: boolean;
  options?: string[];
}

export type TermuxScriptCategory =
  | 'RCLONE_CLOUD'
  | 'AUDIO_PROCESSING'
  | 'STORAGE_SYSTEM'
  | 'TELEMETRY_GHOST'
  | 'DIAGNOSTICS'
  | 'TERMUX_API';

export interface PredefinedTermuxScript {
  id: string;
  titleFr: string;
  titleEn: string;
  category: TermuxScriptCategory;
  descriptionFr: string;
  descriptionEn: string;
  executablePath?: string;
  workDir?: string;
  templateScript: (args: Record<string, string>) => string;
  arguments?: ScriptArgument[];
  defaultRunInBackground?: boolean;
  iconType?: string;
  requiresApiPlugin?: boolean;
  requiresStorageSetup?: boolean;
}

export interface TermuxExecutionResult {
  success: boolean;
  message: string;
  executedScriptId?: string | null;
  scriptTitle: string;
  commandDispatched: string;
  timestamp: number;
  isBackground: boolean;
}

export interface RealDeviceParameters {
  realHardwareDac: boolean;
  realMicrophoneDirect: boolean;
  realSilenceVAD: boolean;
  realRcloneExecution: boolean;
  realGoogleAuthOAuth: boolean;
  realAutoCloudSync: boolean;
  realTermuxSocket: boolean;
  realExponentialRetry: boolean;
  realStorageAccess: boolean;
}

export interface RcloneSyncConfig {
  remoteName: string;
  remotePath: string;
  maxRetries: number;
  initialRetryDelayMs: number;
  maxRetryDelayMs: number;
  bandwidthLimit: string;
  chunkSize: string;
  transfers: number;
  requireUnmeteredNetwork: boolean;
  requireWifi: boolean;
  autoSyncEnabled: boolean;
  dryRun: boolean;
  verboseLogging: boolean;
  logFilePath: string;
}

export interface Ia22SessionState {
  isSessionActive: boolean;
  masterNode: string;
  operatorName: string;
  lastBroadcastMessage: string;
  lastUpdatedTimestamp: number;
  isTunnelActive: boolean;
  tunnelUrl: string;
  tunnelStatus: string;
  isRamCleaned: boolean;
  totalBroadcastCount: number;
}

export interface StreamChannelPreset {
  id: string;
  title: string;
  category: string;
  streamUrl: string;
  resolution: string;
}

export interface PlayerState {
  playingRecordingId: number | null;
  isPlaying: boolean;
  currentPositionSeconds: number;
  playbackSpeed: number;
}

export interface RecorderState {
  isRecording: boolean;
  isPaused: boolean;
  isAutoPausedBySilence: boolean;
  isSilenceDetectionEnabled: boolean;
  silenceDurationSeconds: number;
  durationSeconds: number;
  liveAmplitudes: number[];
  recordingName: string;
}
