import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Brain,
  FileAudio,
  Copy,
  Check,
  RefreshCw,
  MessageSquare,
  ArrowDownCircle,
  ShieldCheck
} from 'lucide-react';
import { AudioRecording } from '../types';
import { NetsecureProLicenseCard } from '../components/NetsecureProLicenseCard';

interface Props {
  recordings: AudioRecording[];
  isAiAnalyzing: boolean;
  aiAnalysisResult: string | null;
  isFrench: boolean;
  onAnalyzeAudio: (recording: AudioRecording, customPrompt: string) => void;
}

export const AiStudioScreen: React.FC<Props> = ({
  recordings,
  isAiAnalyzing,
  aiAnalysisResult,
  isFrench,
  onAnalyzeAudio
}) => {
  const [selectedRecordingId, setSelectedRecordingId] = useState<number | null>(
    recordings.length > 0 ? recordings[0].id : null
  );
  const [promptInput, setPromptInput] = useState(
    'Analyse la structure, le sentiment et les points clés de cette capture vocale Z-CORE [GEMIN CORE V7 PRO FINAL | IA_LOGIC_SINGNATURE:ZOUBIROU-IA-2025].'
  );
  const [copiedResult, setCopiedResult] = useState(false);
  const [autoScrollReport, setAutoScrollReport] = useState(true);
  const [teleprompterActive, setTeleprompterActive] = useState(false);

  const reportCardRef = useRef<HTMLDivElement | null>(null);
  const reportTextContainerRef = useRef<HTMLDivElement | null>(null);

  const selectedRecording =
    recordings.find((r) => r.id === selectedRecordingId) || recordings[0];

  // Auto-scroll to report card when AI analysis completes
  useEffect(() => {
    if (aiAnalysisResult && autoScrollReport && reportCardRef.current) {
      reportCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [aiAnalysisResult, autoScrollReport]);

  // Teleprompter auto-scroll inside report container
  useEffect(() => {
    if (!teleprompterActive || !reportTextContainerRef.current) return;
    const timer = window.setInterval(() => {
      const el = reportTextContainerRef.current;
      if (!el) return;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
        el.scrollTop = 0;
      } else {
        el.scrollTop += 1.5;
      }
    }, 45);
    return () => clearInterval(timer);
  }, [teleprompterActive]);

  const handleAnalyze = () => {
    if (!selectedRecording) return;
    onAnalyzeAudio(selectedRecording, promptInput);
  };

  const copyAnalysis = () => {
    if (!aiAnalysisResult) return;
    navigator.clipboard.writeText(aiAnalysisResult);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2000);
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">
                  GEMIN CORE V7 PRO FINAL
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  IA_LOGIC_SINGNATURE:ZOUBIROU-IA-2025
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  LICENSE NETSECUREPRO.CA
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isFrench
                  ? 'Analyse sémantique, transcription vocale & moteur neuronal Z-CORE certifié'
                  : 'Semantic analysis, voice transcription & certified Z-CORE neural engine'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAutoScrollReport(!autoScrollReport)}
            className={`self-start sm:self-center px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold flex items-center gap-1.5 border transition-all ${
              autoScrollReport
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <ArrowDownCircle className="w-3.5 h-3.5" />
            <span>{autoScrollReport ? 'AUTO-SCROLL ON' : 'AUTO-SCROLL OFF'}</span>
          </button>
        </div>
      </div>

      {/* Official NETSECUREPRO License Card */}
      <NetsecureProLicenseCard isInitiallyExpanded={true} />

      {/* Target Audio Recording Selector */}
      <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <FileAudio className="w-4 h-4 text-emerald-400" />
            <span>{isFrench ? 'Sélectionner un fichier audio Z-CORE' : 'Select a Z-CORE Audio Track'}</span>
          </label>

          {recordings.length === 0 ? (
            <p className="text-xs text-slate-500 italic">
              {isFrench
                ? 'Aucun enregistrement disponible dans le coffre-fort.'
                : 'No audio recordings currently in vault.'}
            </p>
          ) : (
            <select
              value={selectedRecordingId || ''}
              onChange={(e) => setSelectedRecordingId(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            >
              {recordings.map((rec) => (
                <option key={rec.id} value={rec.id}>
                  {rec.title} ({rec.fileName}) • {rec.durationSeconds}s
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Selected Track Specs Preview */}
        {selectedRecording && (
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs font-mono grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div>
              <span className="text-slate-500 block text-[10px]">DURÉE & TAILLE</span>
              <span className="text-slate-200">{selectedRecording.durationSeconds}s ({selectedRecording.fileSizeMb} MB)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">SOURCE FLUX</span>
              <span className="text-slate-200">{selectedRecording.sourceStream}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">TRANSCRIPTION</span>
              <span className="text-emerald-400 truncate block">
                {selectedRecording.transcription
                  ? isFrench ? 'Disponible' : 'Available'
                  : isFrench ? 'À générer' : 'Pending'}
              </span>
            </div>
          </div>
        )}

        {/* Custom Prompt Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span>{isFrench ? 'Instruction GEMIN CORE V7 PRO FINAL' : 'GEMIN CORE V7 PRO FINAL Prompt'}</span>
          </label>
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            rows={3}
            placeholder={isFrench ? 'Instruction pour l\'IA...' : 'Instruction for AI...'}
            className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
          />
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={isAiAnalyzing || !selectedRecording}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
        >
          {isAiAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>{isFrench ? 'Analyse GEMIN CORE V7 PRO FINAL en cours...' : 'Analyzing with GEMIN CORE V7 PRO FINAL...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300 fill-current" />
              <span>{isFrench ? 'Lancer l\'Analyse GEMIN CORE V7 PRO FINAL' : 'Run GEMIN CORE V7 PRO FINAL Analysis'}</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Result Display */}
      {aiAnalysisResult && (
        <div
          ref={reportCardRef}
          className="p-5 rounded-3xl border border-indigo-500/30 bg-slate-900/80 space-y-3 shadow-xl animate-in fade-in"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-400" />
              <span>{isFrench ? 'Rapport Généré • GEMIN CORE V7 PRO FINAL' : 'Generated Report • GEMIN CORE V7 PRO FINAL'}</span>
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTeleprompterActive(!teleprompterActive)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 border transition-colors ${
                  teleprompterActive
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <ArrowDownCircle className="w-3.5 h-3.5" />
                <span>{teleprompterActive ? 'TELEPROMPTER ON' : 'TELEPROMPTER'}</span>
              </button>
              <button
                onClick={copyAnalysis}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                {copiedResult ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedResult ? (isFrench ? 'Copié' : 'Copied') : (isFrench ? 'Copier' : 'Copy')}</span>
              </button>
            </div>
          </div>

          <div
            ref={reportTextContainerRef}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-indigo-200/90 whitespace-pre-wrap leading-relaxed font-sans max-h-60 overflow-y-auto scroll-smooth"
          >
            {aiAnalysisResult}
            {'\n\n'}
            <span className="text-[10px] font-mono text-emerald-400 block pt-2 border-t border-slate-800/80">
              LICENSE NETSECUREPRO.CA • GEMIN CORE V7 PRO FINAL • IA_LOGIC_SINGNATURE:ZOUBIROU-IA-2025
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

