import React from 'react';
import {
  X,
  Zap,
  CheckCircle,
  Sliders,
  Shield,
  Mic,
  Volume2,
  Cloud,
  Terminal,
  RotateCw,
  HardDrive
} from 'lucide-react';
import { RealDeviceParameters } from '../types';

interface Props {
  realParams: RealDeviceParameters;
  isFrench: boolean;
  onDismiss: () => void;
  onToggleParam: (key: keyof RealDeviceParameters, value: boolean) => void;
  onActivateAll: () => void;
}

export const RealModeSettingsDialog: React.FC<Props> = ({
  realParams,
  isFrench,
  onDismiss,
  onToggleParam,
  onActivateAll
}) => {
  const paramItems: {
    key: keyof RealDeviceParameters;
    labelFr: string;
    labelEn: string;
    descFr: string;
    descEn: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'realHardwareDac',
      labelFr: 'DAC Audio Matériel & PCM 44.1 kHz',
      labelEn: 'Hardware DAC & 44.1 kHz PCM',
      descFr: 'Capture non-compressée haute fidélité broadcast',
      descEn: 'Uncompressed high-fidelity broadcast recording',
      icon: <Volume2 className="w-4 h-4 text-emerald-400" />
    },
    {
      key: 'realMicrophoneDirect',
      labelFr: 'Accès Direct Microphone',
      labelEn: 'Direct Hardware Mic Access',
      descFr: 'Liaison directe avec le composant audio physique',
      descEn: 'Direct interface with physical audio device',
      icon: <Mic className="w-4 h-4 text-emerald-400" />
    },
    {
      key: 'realSilenceVAD',
      labelFr: 'Détection Silence & VAD Actif',
      labelEn: 'Silence Detection & Active VAD',
      descFr: 'Pause automatique après 5s et reprise vocale automatique',
      descEn: 'Auto-pause after 5s silence and speech auto-resume',
      icon: <Volume2 className="w-4 h-4 text-emerald-400" />
    },
    {
      key: 'realRcloneExecution',
      labelFr: 'Transfert Rclone Réel (dryRun = false)',
      labelEn: 'Real Rclone Sync (dryRun = false)',
      descFr: 'Envoi direct des fichiers vers Google Drive distant',
      descEn: 'Live transmission to remote Google Drive',
      icon: <Cloud className="w-4 h-4 text-emerald-400" />
    },
    {
      key: 'realGoogleAuthOAuth',
      labelFr: 'Authentification Google Drive OAuth2',
      labelEn: 'Google Drive OAuth2 Authentication',
      descFr: 'Jeton API officiel pour le stockage multi-cloud',
      descEn: 'Official API token for multi-cloud storage',
      icon: <Shield className="w-4 h-4 text-emerald-400" />
    },
    {
      key: 'realAutoCloudSync',
      labelFr: 'Synchronisation Arrière-Plan Auto',
      labelEn: 'Automatic Background Sync',
      descFr: 'Transfert instantané dès la fin de l\'enregistrement',
      descEn: 'Instant transmission upon recording stop',
      icon: <RotateCw className="w-4 h-4 text-emerald-400" />
    },
    {
      key: 'realTermuxSocket',
      labelFr: 'Passerelle Termux & ADB Intent',
      labelEn: 'Termux Gateway & ADB Intents',
      descFr: 'Exécution shell native com.termux.RUN_COMMAND',
      descEn: 'Native shell execution via com.termux.RUN_COMMAND',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />
    },
    {
      key: 'realExponentialRetry',
      labelFr: 'Reprise Exponentielle Réseau',
      labelEn: 'Exponential Network Retry',
      descFr: 'Relance automatique des uploads en cas d\'interruption',
      descEn: 'Auto-retry uploads on network disconnect',
      icon: <RotateCw className="w-4 h-4 text-emerald-400" />
    },
    {
      key: 'realStorageAccess',
      labelFr: 'Accès Stockage Fichiers Local',
      labelEn: 'Local Storage Directory Access',
      descFr: 'Dossier dédié ./storage/ et permissions intégrales',
      descEn: 'Scoped storage directory and full permissions',
      icon: <HardDrive className="w-4 h-4 text-emerald-400" />
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-emerald-500/40 bg-slate-900 p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>{isFrench ? 'Paramètres du Mode Réel' : 'Real Device Mode Settings'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Z-CORE PRO
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isFrench
                  ? 'Configuration du matériel, de la transmission réseau et du démon de synchronisation'
                  : 'Hardware, network transmission and synchronization daemon configuration'}
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

        {/* Quick activate all button */}
        <button
          onClick={onActivateAll}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>
            {isFrench
              ? '⚡ ACTIVER TOUS LES PARAMÈTRES DU MODE RÉEL'
              : '⚡ ACTIVATE ALL REAL DEVICE PARAMETERS'}
          </span>
        </button>

        {/* Toggles list */}
        <div className="space-y-2.5">
          {paramItems.map((item) => {
            const isEnabled = realParams[item.key];
            return (
              <div
                key={item.key}
                onClick={() => onToggleParam(item.key, !isEnabled)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  isEnabled
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl border ${
                      isEnabled
                        ? 'bg-emerald-500/20 border-emerald-500/30'
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200 text-xs">
                      {isFrench ? item.labelFr : item.labelEn}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {isFrench ? item.descFr : item.descEn}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                    isEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onDismiss}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
          >
            {isFrench ? 'Fermer' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
