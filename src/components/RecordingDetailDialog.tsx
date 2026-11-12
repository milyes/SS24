import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Cloud,
  Copy,
  Check,
  FileText,
  Clock,
  HardDrive,
  Download,
  Trash2,
  Share2,
  ArrowDownCircle
} from 'lucide-react';
import { AudioRecording } from '../types';
import { AudioWaveformVisualizer } from './AudioWaveformVisualizer';

interface Props {
  recording: AudioRecording;
  isFrench: boolean;
  onDismiss: () => void;
  onUpdateTranscription: (rec: AudioRecording, newText: string) => void;
  onAnalyzeAi: (rec: AudioRecording) => void;
  onSyncDrive: (rec: AudioRecording) => void;
  onDelete: (rec: AudioRecording) => void;
}

export const RecordingDetailDialog: React.FC<Props> = ({
  recording,
  isFrench,
  onDismiss,
  onUpdateTranscription,
  onAnalyzeAi,
  onSyncDrive,
  onDelete
}) => {
  const [transcriptionInput, setTranscriptionInput] = useState(
    recording.transcription || ''
  );
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [autoScrollTeleprompter, setAutoScrollTeleprompter] = useState(false);
  const transcriptionTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!autoScrollTeleprompter || !transcriptionTextareaRef.current) return;
    const timer = window.setInterval(() => {
      const el = transcriptionTextareaRef.current;
      if (!el) return;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
        el.scrollTop = 0;
      } else {
        el.scrollTop += 1.2;
      }
    }, 45);
    return () => clearInterval(timer);
  }, [autoScrollTeleprompter]);

  const rcloneCmd = `rclone copy "${recording.localPath}" "${recording.cloudPath}" -v --progress`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleSaveTranscription = () => {
    onUpdateTranscription(recording, transcriptionInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                {recording.title}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {recording.fileName} • {recording.durationSeconds}s • {recording.fileSizeMb} MB
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Waveform preview */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {isFrench ? 'Forme d\'onde Audio' : 'Audio Waveform'}
          </label>
          <AudioWaveformVisualizer
            waveformData={recording.waveformData}
            height={52}
          />
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1">
            <span className="text-slate-500 block uppercase text-[10px]">
              {isFrench ? 'Chemin Local' : 'Local Path'}
            </span>
            <span className="text-slate-300 break-all">{recording.localPath}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1">
            <span className="text-slate-500 block uppercase text-[10px]">
              {isFrench ? 'Chemin Google Drive' : 'Drive Path'}
            </span>
            <span className="text-emerald-400 break-all">{recording.cloudPath}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1">
            <span className="text-slate-500 block uppercase text-[10px]">
              {isFrench ? 'Source Capture' : 'Source'}
            </span>
            <span className="text-slate-300">{recording.sourceStream}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1">
            <span className="text-slate-500 block uppercase text-[10px]">
              {isFrench ? 'Statut Synchronisation' : 'Sync Status'}
            </span>
            <span
              className={`font-semibold ${
                recording.isSynced
                  ? 'text-emerald-400'
                  : 'text-amber-400'
              }`}
            >
              {recording.isSynced
                ? isFrench
                  ? 'Synchronisé sur Google Drive'
                  : 'Synced to Google Drive'
                : isFrench
                ? 'Stockage Local'
                : 'Local Only'}
            </span>
          </div>
        </div>

        {/* Gemini AI Summary Section */}
        {recording.aiSummary && (
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>{isFrench ? 'Analyse GEMIN CORE V7 PRO FINAL' : 'GEMIN CORE V7 PRO FINAL Analysis'}</span>
            </div>
            <p className="text-xs text-indigo-200/90 whitespace-pre-wrap leading-relaxed">
              {recording.aiSummary}
            </p>
          </div>
        )}

        {/* Transcription Editable Section */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>{isFrench ? 'Transcription Vocale' : 'Voice Transcription'}</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAutoScrollTeleprompter(!autoScrollTeleprompter)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 border transition-colors ${
                  autoScrollTeleprompter
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <ArrowDownCircle className="w-3 h-3" />
                <span>{autoScrollTeleprompter ? 'AUTO-SCROLL ON' : 'AUTO-SCROLL'}</span>
              </button>
              <button
                onClick={handleSaveTranscription}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                {isFrench ? 'Enregistrer les modifications' : 'Save edits'}
              </button>
            </div>
          </div>
          <textarea
            ref={transcriptionTextareaRef}
            value={transcriptionInput}
            onChange={(e) => setTranscriptionInput(e.target.value)}
            rows={4}
            className="w-full p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
            placeholder={isFrench ? 'Aucune transcription...' : 'No transcription...'}
          />
        </div>

        {/* Rclone CLI Command Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {isFrench ? 'Commande Rclone CLI' : 'Rclone CLI Command'}
          </label>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400">
            <span className="truncate flex-1">{rcloneCmd}</span>
            <button
              onClick={() => copyToClipboard(rcloneCmd)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
              title="Copier la commande"
            >
              {copiedCmd ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => {
              onDelete(recording);
              onDismiss();
            }}
            className="px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isFrench ? 'Supprimer la piste' : 'Delete track'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAnalyzeAi(recording)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isFrench ? 'Analyser IA' : 'AI Analysis'}</span>
            </button>

            <button
              onClick={() => {
                onSyncDrive(recording);
                onDismiss();
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>{isFrench ? 'Synchroniser Drive' : 'Sync to Drive'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
