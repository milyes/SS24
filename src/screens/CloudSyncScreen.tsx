import React, { useState } from 'react';
import {
  Cloud,
  CheckCircle2,
  Sliders,
  Play,
  RotateCw,
  HardDrive,
  Mail,
  Shield,
  Zap,
  Terminal,
  ExternalLink,
  Edit2
} from 'lucide-react';
import { RcloneSyncConfig, SyncLog } from '../types';
import { SyncProgressDashboard } from '../components/SyncProgressDashboard';

interface Props {
  syncLogs: SyncLog[];
  rcloneConfig: RcloneSyncConfig;
  userEmail: string;
  isGoogleConnected: boolean;
  isAutoSyncEnabled: boolean;
  isSyncingActive: boolean;
  syncProgressPercent: number;
  activeSyncCommand: string;
  isFrench: boolean;
  onUpdateRcloneConfig: (cfg: RcloneSyncConfig) => void;
  onToggleAutoSync: (enabled: boolean) => void;
  onRunCustomRcloneCommand: (cmd: string) => void;
  onTriggerBackgroundSync: () => void;
  onUpdateUserEmail: (email: string) => void;
  onDisconnectGoogle: () => void;
}

export const CloudSyncScreen: React.FC<Props> = ({
  syncLogs,
  rcloneConfig,
  userEmail,
  isGoogleConnected,
  isAutoSyncEnabled,
  isSyncingActive,
  syncProgressPercent,
  activeSyncCommand,
  isFrench,
  onUpdateRcloneConfig,
  onToggleAutoSync,
  onRunCustomRcloneCommand,
  onTriggerBackgroundSync,
  onUpdateUserEmail,
  onDisconnectGoogle
}) => {
  const [customCmdInput, setCustomCmdInput] = useState(
    'rclone copy ./storage/ gdrive:/Z-CORE/Captures/ --progress -v'
  );
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [configForm, setConfigForm] = useState<RcloneSyncConfig>(rcloneConfig);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(userEmail);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRcloneConfig(configForm);
    setIsEditingConfig(false);
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      onUpdateUserEmail(emailInput.trim());
      setIsEditingEmail(false);
    }
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Google Account & OAuth Connection Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">
                  Google Drive Cloud Storage
                </h3>
                {isGoogleConnected ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> CONNECTÉ
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                    DÉCONNECTÉ
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {userEmail} • Destination: {rcloneConfig.remoteName}:{rcloneConfig.remotePath}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingEmail(!isEditingEmail)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
              title="Changer de compte Google"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isFrench ? 'Compte' : 'Account'}</span>
            </button>

            <button
              onClick={onTriggerBackgroundSync}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <RotateCw className="w-4 h-4" />
              <span>{isFrench ? 'Synchroniser Maintenant' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        {/* Inline Email editor */}
        {isEditingEmail && (
          <form
            onSubmit={handleSaveEmail}
            className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              placeholder="votre_compte@gmail.com"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              {isFrench ? 'Valider' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditingEmail(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
            >
              {isFrench ? 'Annuler' : 'Cancel'}
            </button>
          </form>
        )}
      </div>

      {/* Rclone Configuration Card */}
      <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/70 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-slate-100 text-sm">
                {isFrench ? 'Configuration Rclone CLI & Paramètres Réseau' : 'Rclone CLI & Network Settings'}
              </h3>
              <p className="text-xs text-slate-400">
                {isFrench ? 'Optimisation du débit et des règles de transfert' : 'Bandwidth and transfer tuning rules'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditingConfig(!isEditingConfig)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            {isEditingConfig
              ? isFrench ? 'Fermer' : 'Close'
              : isFrench ? 'Modifier' : 'Edit'}
          </button>
        </div>

        {/* Config Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">REMOTE DRIVE</span>
            <span className="text-slate-200 font-bold">{rcloneConfig.remoteName}:{rcloneConfig.remotePath}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">DÉBIT MAX (BWLIMIT)</span>
            <span className="text-emerald-400 font-bold">{rcloneConfig.bandwidthLimit || 'Illimité'}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">TRANSFERS / RETRIES</span>
            <span className="text-slate-200 font-bold">{rcloneConfig.transfers} / {rcloneConfig.maxRetries}x</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">MODE RÉEL (DRY RUN)</span>
            <span
              className={`font-bold ${
                rcloneConfig.dryRun ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {rcloneConfig.dryRun ? 'Simulation' : 'Envoi Réel Actif'}
            </span>
          </div>
        </div>

        {/* Editable form if opened */}
        {isEditingConfig && (
          <form
            onSubmit={handleSaveConfig}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 pt-3 animate-in fade-in"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Remote Name</label>
                <input
                  type="text"
                  value={configForm.remoteName}
                  onChange={(e) =>
                    setConfigForm({ ...configForm, remoteName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Remote Path</label>
                <input
                  type="text"
                  value={configForm.remotePath}
                  onChange={(e) =>
                    setConfigForm({ ...configForm, remotePath: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Bandwidth Limit (--bwlimit)</label>
                <input
                  type="text"
                  value={configForm.bandwidthLimit}
                  onChange={(e) =>
                    setConfigForm({ ...configForm, bandwidthLimit: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Drive Chunk Size</label>
                <input
                  type="text"
                  value={configForm.chunkSize}
                  onChange={(e) =>
                    setConfigForm({ ...configForm, chunkSize: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={configForm.autoSyncEnabled}
                  onChange={(e) =>
                    setConfigForm({ ...configForm, autoSyncEnabled: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-700 text-emerald-500 bg-slate-800"
                />
                <span>Synchro automatique après enregistrement</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!configForm.dryRun}
                  onChange={(e) =>
                    setConfigForm({ ...configForm, dryRun: !e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-700 text-emerald-500 bg-slate-800"
                />
                <span className="text-emerald-400 font-semibold">
                  Mode Réel (Transmission Live directe)
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                {isFrench ? 'Enregistrer les paramètres' : 'Save parameters'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Custom Command Runner */}
      <div className="p-4 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>{isFrench ? 'Exécuter une commande Rclone manuelle' : 'Execute custom Rclone command'}</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={customCmdInput}
            onChange={(e) => setCustomCmdInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => onRunCustomRcloneCommand(customCmdInput)}
            disabled={isSyncingActive}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
            <span>{isFrench ? 'Lancer' : 'Run'}</span>
          </button>
        </div>
      </div>

      {/* 30-Day Metrics Dashboard */}
      <SyncProgressDashboard
        syncLogs={syncLogs}
        isSyncingActive={isSyncingActive}
        syncProgressPercent={syncProgressPercent}
        activeSyncCommand={activeSyncCommand}
        isFrench={isFrench}
        onTriggerSyncNow={onTriggerBackgroundSync}
      />
    </div>
  );
};
