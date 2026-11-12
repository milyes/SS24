import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  CheckSquare,
  Cloud,
  FolderOpen,
  FileAudio,
  ArrowDownCircle
} from 'lucide-react';
import {
  AudioRecording,
  PlayerState,
  RecorderState
} from '../types';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { AudioPlayerCard } from '../components/AudioPlayerCard';
import { RecordingDetailDialog } from '../components/RecordingDetailDialog';
import { NetsecureProLicenseCard } from '../components/NetsecureProLicenseCard';

interface Props {
  recordings: AudioRecording[];
  playerState: PlayerState;
  recorderState: RecorderState;
  searchQuery: string;
  isFrench: boolean;
  isSimulatedMode: boolean;
  micPermissionNotice: string | null;
  onSearchChange: (q: string) => void;
  onStartRecording: (name: string) => void;
  onPauseResumeRecording: () => void;
  onStopAndSaveRecording: () => void;
  onToggleSilenceDetection: (enabled: boolean) => void;
  onSimulateAudioInput: () => void;
  onClearNotice: () => void;
  onImportAudioFile: (file: File) => void;
  onPlayPause: (rec: AudioRecording) => void;
  onSeek: (seconds: number) => void;
  onSpeedChange: (speed: number) => void;
  onSyncDrive: (rec: AudioRecording) => void;
  onMassSyncSelected: (ids: number[]) => void;
  onUpdateTranscription: (rec: AudioRecording, text: string) => void;
  onAnalyzeAi: (rec: AudioRecording) => void;
  onDeleteRecording: (rec: AudioRecording) => void;
}

export const RecorderVaultScreen: React.FC<Props> = ({
  recordings,
  playerState,
  recorderState,
  searchQuery,
  isFrench,
  isSimulatedMode,
  micPermissionNotice,
  onSearchChange,
  onStartRecording,
  onPauseResumeRecording,
  onStopAndSaveRecording,
  onToggleSilenceDetection,
  onSimulateAudioInput,
  onClearNotice,
  onImportAudioFile,
  onPlayPause,
  onSeek,
  onSpeedChange,
  onSyncDrive,
  onMassSyncSelected,
  onUpdateTranscription,
  onAnalyzeAi,
  onDeleteRecording
}) => {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [detailModalRecording, setDetailModalRecording] =
    useState<AudioRecording | null>(null);
  const [autoScrollVault, setAutoScrollVault] = useState(true);
  const vaultListRef = useRef<HTMLDivElement | null>(null);
  const prevCountRef = useRef<number>(recordings.length);

  // Auto-scroll to vault list when a new recording is saved
  useEffect(() => {
    if (autoScrollVault && recordings.length > prevCountRef.current && vaultListRef.current) {
      vaultListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    prevCountRef.current = recordings.length;
  }, [recordings.length, autoScrollVault]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === recordings.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(recordings.map((r) => r.id)));
    }
  };

  const handleMassSync = () => {
    onMassSyncSelected(Array.from(selectedIds));
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  const filteredRecordings = recordings.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.fileName.toLowerCase().includes(q) ||
      r.localPath.toLowerCase().includes(q) ||
      (r.transcription && r.transcription.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-5 pb-16">
      {/* License & Core Banner */}
      <NetsecureProLicenseCard isInitiallyExpanded={false} />

      {/* Voice Recorder section */}
      <VoiceRecorder
        recorderState={recorderState}
        isSimulatedMode={isSimulatedMode}
        micPermissionNotice={micPermissionNotice}
        isFrench={isFrench}
        onStartRecording={onStartRecording}
        onPauseResume={onPauseResumeRecording}
        onStopAndSave={onStopAndSaveRecording}
        onToggleSilenceDetection={onToggleSilenceDetection}
        onSimulateAudioInput={onSimulateAudioInput}
        onClearNotice={onClearNotice}
        onImportAudioFile={onImportAudioFile}
      />

      {/* Vault Header & Search / Filter Controls */}
      <div
        ref={vaultListRef}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-emerald-400" />
              <span>{isFrench ? 'Coffre-fort des Enregistrements' : 'Audio Recordings Vault'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {recordings.length}
              </span>
            </h2>
            <button
              type="button"
              onClick={() => setAutoScrollVault(!autoScrollVault)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 border transition-colors ${
                autoScrollVault
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title={isFrench ? 'Défilement automatique vers les nouvelles pistes' : 'Auto-scroll to new tracks'}
            >
              <ArrowDownCircle className="w-3 h-3" />
              <span>{autoScrollVault ? 'AUTO-SCROLL ON' : 'AUTO-SCROLL OFF'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-400">
            {isFrench
              ? 'Captures vocales sécurisées prêtes pour transfert Google Drive & Rclone'
              : 'Secure voice captures ready for Google Drive & Rclone multi-cloud sync'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isFrench ? 'Rechercher une piste...' : 'Search tracks...'}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              if (isSelectionMode) setSelectedIds(new Set());
            }}
            className={`p-2 rounded-xl border transition-colors ${
              isSelectionMode
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title={isFrench ? 'Mode sélection groupée' : 'Batch selection mode'}
          >
            <CheckSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mass Selection Action Bar */}
      {isSelectionMode && (
        <div className="p-3 rounded-2xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <button
              onClick={selectAll}
              className="text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              {selectedIds.size === recordings.length
                ? isFrench ? 'Tout désélectionner' : 'Deselect all'
                : isFrench ? 'Tout sélectionner' : 'Select all'}
            </button>
            <span className="text-slate-400 font-mono">
              {selectedIds.size} {isFrench ? 'sélectionné(s)' : 'selected'}
            </span>
          </div>

          <button
            onClick={handleMassSync}
            disabled={selectedIds.size === 0}
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
          >
            <Cloud className="w-4 h-4" />
            <span>
              {isFrench
                ? `Masse-Sync (${selectedIds.size})`
                : `Batch Sync (${selectedIds.size})`}
            </span>
          </button>
        </div>
      )}

      {/* Recordings List */}
      {filteredRecordings.length === 0 ? (
        <div className="p-12 rounded-3xl border border-dashed border-slate-800 text-center space-y-3">
          <FileAudio className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">
            {isFrench ? 'Aucun enregistrement trouvé' : 'No recordings found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isFrench
              ? 'Démarrez un enregistrement vocal ci-dessus pour capturer votre premier flux audio Z-CORE.'
              : 'Start a voice recording above to capture your first Z-CORE audio track.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredRecordings.map((rec) => (
            <AudioPlayerCard
              key={rec.id}
              recording={rec}
              playerState={playerState}
              isSelectionMode={isSelectionMode}
              isSelected={selectedIds.has(rec.id)}
              isFrench={isFrench}
              onToggleSelect={toggleSelect}
              onPlayPause={onPlayPause}
              onSeek={onSeek}
              onSpeedChange={onSpeedChange}
              onSync={onSyncDrive}
              onOpenDetail={(r) => setDetailModalRecording(r)}
              onAnalyzeAi={onAnalyzeAi}
              onDelete={onDeleteRecording}
            />
          ))}
        </div>
      )}

      {/* Detail Dialog Modal */}
      {detailModalRecording && (
        <RecordingDetailDialog
          recording={detailModalRecording}
          isFrench={isFrench}
          onDismiss={() => setDetailModalRecording(null)}
          onUpdateTranscription={onUpdateTranscription}
          onAnalyzeAi={onAnalyzeAi}
          onSyncDrive={onSyncDrive}
          onDelete={onDeleteRecording}
        />
      )}
    </div>
  );
};
