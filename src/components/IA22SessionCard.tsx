import React, { useState } from 'react';
import {
  Terminal,
  Shield,
  Activity,
  Radio,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Globe,
  Server
} from 'lucide-react';
import { Ia22SessionState } from '../types';

interface Props {
  sessionState: Ia22SessionState;
  isFrench: boolean;
  onTriggerBroadcast: () => void;
  onWipeSession: () => void;
  onPingTunnel: () => void;
}

export const IA22SessionCard: React.FC<Props> = ({
  sessionState,
  isFrench,
  onTriggerBroadcast,
  onWipeSession,
  onPingTunnel
}) => {
  const [copiedBatch, setCopiedBatch] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);

  const batchScript = `@echo off
TITLE Windows System Core Update - IA22 Logic (Noeud S24)
COLOR 0A
echo ========================================================
echo  SCRIPT WINDOWS BATCH (.BAT) & COMPAGNON TERMUX S24
echo  TITRE: Windows System Core Update - IA22 Logic
echo  NOEUD MAITRE: S24 | OPERATEUR: M.I. ZOUBIROU
echo  TUNNEL CLOUDFLARE: ${sessionState.tunnelUrl}
echo ========================================================
adb devices
adb shell am broadcast -a com.example.audiosynchub.IA22_SESSION_ACTIVE --es message "IA22 : SESSION ACTIVE - M.I. ZOUBIROU"
adb shell am broadcast -a android.intent.action.MAIN --es message "IA22 : SESSION ACTIVE - M.I. ZOUBIROU"
echo [LOG] Nettoyage RAM & traces de session pour mx76...
adb shell pkill -u mx76 2>nul
adb shell history -c 2>nul
echo [LOG] System Secure. Deconnexion du S24 autorisee.
pause`;

  const copyBatchScript = () => {
    navigator.clipboard.writeText(batchScript);
    setCopiedBatch(true);
    setTimeout(() => setCopiedBatch(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20 p-5 shadow-xl space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-sm">
                IA22 - Windows Core Update (Noeud {sessionState.masterNode})
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                MASTER S24
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {isFrench ? 'Opérateur :' : 'Operator :'} {sessionState.operatorName} • {isFrench ? 'Protocole ADB & Tunnel Cloudflare' : 'ADB & Cloudflare Protocol'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPingTunnel}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{isFrench ? 'Tester Tunnel' : 'Ping Tunnel'}</span>
          </button>
        </div>
      </div>

      {/* Cloudflare Tunnel Status Box */}
      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-mono flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tunnel Cloudflare (Ghost 979V11) :</span>
          </span>
          <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {sessionState.tunnelStatus}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 font-mono">
          <a
            href={sessionState.tunnelUrl}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 hover:underline truncate"
          >
            {sessionState.tunnelUrl}
          </a>
          <a
            href={`${sessionState.tunnelUrl}/logic_cover.html`}
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-slate-200 shrink-0 flex items-center gap-1"
          >
            <span>Logic Cover</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Action Buttons: ADB Broadcast & Wipe Traces & Batch Script */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
        <button
          onClick={onTriggerBroadcast}
          className="p-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Radio className="w-4 h-4 text-emerald-400" />
          <span>{isFrench ? 'Émettre Intent ADB' : 'Send ADB Intent'}</span>
        </button>

        <button
          onClick={onWipeSession}
          className="p-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Trash2 className="w-4 h-4 text-rose-400" />
          <span>{isFrench ? 'Nettoyer RAM (mx76)' : 'Wipe RAM (mx76)'}</span>
        </button>

        <button
          onClick={() => setShowBatchModal(true)}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Terminal className="w-4 h-4 text-slate-400" />
          <span>{isFrench ? 'Script Windows .BAT' : 'Windows .BAT Script'}</span>
        </button>
      </div>

      {/* Windows Batch Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Script Windows Batch (.BAT) IA22</span>
              </h4>
              <button
                onClick={() => setShowBatchModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 rounded bg-slate-800"
              >
                Fermer
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-60 border border-slate-800">
              {batchScript}
            </pre>
            <div className="flex justify-end gap-2">
              <button
                onClick={copyBatchScript}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                {copiedBatch ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedBatch ? 'Copié !' : 'Copier dans le presse-papier'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
