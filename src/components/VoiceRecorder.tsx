import React, { useState, useRef } from 'react';
import {
  Mic,
  Square,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  AlertTriangle,
  Upload,
  Info,
  Radio
} from 'lucide-react';
import { RecorderState } from '../types';
import { AudioWaveformVisualizer } from './AudioWaveformVisualizer';

interface Props {
  recorderState: RecorderState;
  isSimulatedMode: boolean;
  micPermissionNotice: string | null;
  isFrench: boolean;
  onStartRecording: (customName: string) => void;
  onPauseResume: () => void;
  onStopAndSave: () => void;
  onToggleSilenceDetection: (enabled: boolean) => void;
  onSimulateAudioInput: () => void;
  onClearNotice: () => void;
  onImportAudioFile: (file: File) => void;
}

export const VoiceRecorder: React.FC<Props> = ({
  recorderState,
  isSimulatedMode,
  micPermissionNotice,
  isFrench,
  onStartRecording,
  onPauseResume,
  onStopAndSave,
  onToggleSilenceDetection,
  onSimulateAudioInput,
  onClearNotice,
  onImportAudioFile
}) => {
  const [recordingNameInput, setRecordingNameInput] = useState(
    'enregistrement_ghost_vocal'
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportAudioFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 sm:p-6 shadow-xl space-y-4">
      {/* Background active glow */}
      {recorderState.isRecording && (
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      )}

      {/* Mic Permission / Sandbox Fallback Notice Banner */}
      {micPermissionNotice && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-amber-300 block">
                {isFrench
                  ? 'Accès Microphone : Mode Synthétiseur Z-CORE Actif'
                  : 'Microphone Access : Z-CORE Studio Synthesizer Active'}
              </span>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                {isFrench
                  ? "L'accès direct au microphone a été restreint par le navigateur ou les permissions d'iframe. Le mode de secours 'Générateur Studio Z-CORE' a pris le relais automatiquement pour vous permettre d'enregistrer des flux PCM réels, tester la forme d'onde, et synchroniser vers Google Drive sans blocage."
                  : 'Direct microphone access was restricted by browser/iframe policy. The fallback Z-CORE Studio Synthesizer has seamlessly engaged so you can record real PCM streams, test waveforms, and sync to Google Drive without disruption.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClearNotice}
            className="text-amber-400 hover:text-amber-200 font-bold px-2 py-1 rounded bg-amber-500/20 text-[11px] shrink-0"
          >
            OK
          </button>
        </div>
      )}

      {/* Header & Title / Mode Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-2xl border transition-all ${
              recorderState.isRecording
                ? recorderState.isPaused
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-base">
                {isFrench ? 'Capture Vocale HD (Flux WAY)' : 'HD Voice Capture (WAY Stream)'}
              </h3>
              {isSimulatedMode ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  SYNTHÉTISEUR PCM
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  MICRO DIRECT
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {recorderState.isRecording
                ? recorderState.isPaused
                  ? isFrench
                    ? '⏸ En pause'
                    : '⏸ Paused'
                  : isFrench
                  ? '● Enregistrement en cours (44.1 kHz PCM)'
                  : '● Recording active (44.1 kHz PCM)'
                : isFrench
                ? 'Prêt pour capture audio locale & synchronisation Drive'
                : 'Ready for local audio capture & Drive sync'}
            </p>
          </div>
        </div>

        {/* Top Controls: VAD Silence & File Import */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() =>
              onToggleSilenceDetection(!recorderState.isSilenceDetectionEnabled)
            }
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              recorderState.isSilenceDetectionEnabled
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {recorderState.isSilenceDetectionEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span>
              {isFrench ? 'VAD Silence (5s)' : 'Silence VAD (5s)'}
            </span>
          </button>

          {!recorderState.isRecording && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                title={isFrench ? 'Importer un fichier audio existant' : 'Import audio file'}
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {isFrench ? 'Importer Fichier' : 'Import File'}
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Name input when not recording */}
      {!recorderState.isRecording && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={recordingNameInput}
            onChange={(e) => setRecordingNameInput(e.target.value)}
            placeholder="Nom du fichier..."
            className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => onStartRecording(recordingNameInput)}
            className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
          >
            <Mic className="w-4 h-4 fill-current" />
            <span>{isFrench ? 'Démarrer' : 'Start'}</span>
          </button>
        </div>
      )}

      {/* Live Active Recording View */}
      {recorderState.isRecording && (
        <div className="space-y-3 pt-1">
          {/* Live waveform */}
          <AudioWaveformVisualizer
            liveAmplitudes={recorderState.liveAmplitudes}
            isRecording={!recorderState.isPaused}
            height={56}
          />

          {/* Time elapsed & Silence Countdown */}
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>{formatDuration(recorderState.durationSeconds)}</span>
              {isSimulatedMode && (
                <span className="text-[10px] text-amber-400 font-normal">
                  (Synthétiseur Studio)
                </span>
              )}
            </div>

            {recorderState.isSilenceDetectionEnabled && (
              <div className="text-slate-400 flex items-center gap-1.5">
                <span>{isFrench ? 'Silence :' : 'Silence :'}</span>
                <span
                  className={`font-semibold ${
                    recorderState.silenceDurationSeconds >= 4
                      ? 'text-rose-400 font-bold'
                      : 'text-emerald-400'
                  }`}
                >
                  {recorderState.silenceDurationSeconds.toFixed(1)}s / 5.0s
                </span>
              </div>
            )}
          </div>

          {/* Auto-pause notice if triggered */}
          {recorderState.isAutoPausedBySilence && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-2">
              <span>
                {isFrench
                  ? '⏸ Pause automatique après 5s de silence. Parlez pour reprendre !'
                  : '⏸ Auto-paused after 5s silence. Speak to resume!'}
              </span>
              <button
                onClick={onSimulateAudioInput}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[11px] font-bold flex items-center gap-1 shrink-0"
              >
                <Zap className="w-3 h-3" />
                {isFrench ? 'Reprendre' : 'Resume'}
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onPauseResume}
              className="flex-1 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              {recorderState.isPaused ? (
                <>
                  <Play className="w-4 h-4 text-emerald-400 fill-current" />
                  <span>{isFrench ? 'Reprendre' : 'Resume'}</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 text-amber-400" />
                  <span>{isFrench ? 'Pause' : 'Pause'}</span>
                </>
              )}
            </button>

            <button
              onClick={onStopAndSave}
              className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>{isFrench ? 'Arrêter & Sauvegarder' : 'Stop & Save'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
