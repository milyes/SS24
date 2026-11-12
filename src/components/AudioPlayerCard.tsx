import React from 'react';
import {
  Play,
  Pause,
  Cloud,
  CheckCircle,
  Clock,
  Sparkles,
  FileText,
  Trash2,
  HardDrive,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { AudioRecording, PlayerState } from '../types';
import { AudioWaveformVisualizer } from './AudioWaveformVisualizer';

interface Props {
  recording: AudioRecording;
  playerState: PlayerState;
  isSelectionMode: boolean;
  isSelected: boolean;
  isFrench: boolean;
  onToggleSelect: (id: number) => void;
  onPlayPause: (recording: AudioRecording) => void;
  onSeek: (seconds: number) => void;
  onSpeedChange: (speed: number) => void;
  onSync: (recording: AudioRecording) => void;
  onOpenDetail: (recording: AudioRecording) => void;
  onAnalyzeAi: (recording: AudioRecording) => void;
  onDelete: (recording: AudioRecording) => void;
}

export const AudioPlayerCard: React.FC<Props> = ({
  recording,
  playerState,
  isSelectionMode,
  isSelected,
  isFrench,
  onToggleSelect,
  onPlayPause,
  onSeek,
  onSpeedChange,
  onSync,
  onOpenDetail,
  onAnalyzeAi,
  onDelete
}) => {
  const isThisPlaying =
    playerState.playingRecordingId === recording.id && playerState.isPlaying;
  const isThisActive = playerState.playingRecordingId === recording.id;

  const currentSeconds = isThisActive
    ? playerState.currentPositionSeconds
    : 0;
  const progressPercent = recording.durationSeconds > 0
    ? Math.min(100, (currentSeconds / recording.durationSeconds) * 100)
    : 0;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 ${
        isSelected
          ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/50'
          : isThisActive
          ? 'border-emerald-500/50 bg-slate-900/90 shadow-lg shadow-emerald-950/20'
          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/70'
      }`}
    >
      <div className="p-4 space-y-3">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {isSelectionMode && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(recording.id)}
                className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-400 bg-slate-800"
              />
            )}
            <div className="p-2 rounded-xl bg-slate-800/80 text-emerald-400 border border-slate-700/50">
              <HardDrive className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-100 text-sm truncate">
                {recording.title}
              </h3>
              <p className="text-xs text-slate-400 font-mono truncate">
                {recording.fileName} • {recording.fileSizeMb} MB
              </p>
            </div>
          </div>

          {/* Sync Status Badge */}
          <div className="flex items-center gap-1.5 shrink-0">
            {recording.isSynced || recording.syncStatus === 'CLOUD_SYNCED' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle className="w-3 h-3" />
                {isFrench ? 'Synchronisé' : 'Synced'}
              </span>
            ) : recording.syncStatus === 'SYNCING' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-sky-500/10 text-sky-400 border border-sky-500/30 animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" />
                {isFrench ? 'En cours...' : 'Syncing...'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Cloud className="w-3 h-3" />
                {isFrench ? 'Local uniquement' : 'Local only'}
              </span>
            )}
          </div>
        </div>

        {/* Waveform Visualizer */}
        <AudioWaveformVisualizer
          waveformData={recording.waveformData}
          isPlaying={isThisActive}
          progressPercent={progressPercent}
          onSeekPercent={(pct) => {
            const targetSeconds = (pct / 100) * recording.durationSeconds;
            onSeek(targetSeconds);
          }}
          height={48}
        />

        {/* Player Controls & Scrubber */}
        <div className="flex items-center justify-between gap-2 pt-1 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPlayPause(recording)}
              className={`p-2 rounded-xl transition-all ${
                isThisPlaying
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
              }`}
              title={isThisPlaying ? 'Pause' : 'Play'}
            >
              {isThisPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <span className="font-mono text-slate-300">
              {formatTime(currentSeconds)} / {formatTime(recording.durationSeconds)}
            </span>

            {/* Speed selector */}
            <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60 ml-1">
              {speeds.map((s) => (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    playerState.playbackSpeed === s && isThisActive
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSync(recording)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
              title={isFrench ? 'Synchroniser Google Drive' : 'Sync to Google Drive'}
            >
              <Cloud className="w-4 h-4" />
            </button>

            <button
              onClick={() => onAnalyzeAi(recording)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
              title={isFrench ? 'Analyser avec Gemini IA' : 'Analyze with Gemini AI'}
            >
              <Sparkles className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenDetail(recording)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title={isFrench ? 'Détails & Transcription' : 'Details & Transcription'}
            >
              <FileText className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDelete(recording)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title={isFrench ? 'Supprimer' : 'Delete'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI summary preview pill if present */}
        {recording.aiSummary && (
          <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0 text-indigo-400" />
            <p className="line-clamp-2">{recording.aiSummary}</p>
          </div>
        )}
      </div>
    </div>
  );
};
