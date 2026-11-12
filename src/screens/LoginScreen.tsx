import React, { useState } from 'react';
import {
  User,
  Shield,
  Smartphone,
  LogOut,
  LogIn,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Edit2,
  Lock,
  Cpu,
  Layers,
  Zap,
  Globe
} from 'lucide-react';
import { NetsecureProLicenseCard } from '../components/NetsecureProLicenseCard';
import { RealDeviceParameters } from '../types';

interface Props {
  userEmail: string;
  userDisplayName: string;
  isConnected: boolean;
  realParams: RealDeviceParameters;
  isFrench: boolean;
  onLoginGoogle: () => void;
  onLogoutGoogle: () => void;
  onUpdateEmail: (email: string) => void;
  onOpenRealModeSettings: () => void;
}

export const LoginScreen: React.FC<Props> = ({
  userEmail,
  userDisplayName,
  isConnected,
  realParams,
  isFrench,
  onLoginGoogle,
  onLogoutGoogle,
  onUpdateEmail,
  onOpenRealModeSettings
}) => {
  const [showEditEmail, setShowEditEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(userEmail);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      onUpdateEmail(emailInput.trim());
      setShowEditEmail(false);
    }
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Top Profile & Google Authentication Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-blue-900/30">
              {userDisplayName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">
                  {userDisplayName}
                </h2>
                {isConnected ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle className="w-3 h-3" />
                    {isFrench ? 'Compte Google Connecté' : 'Google Connected'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                    {isFrench ? 'Hors Ligne' : 'Offline'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {userEmail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditEmail(!showEditEmail)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isFrench ? 'Éditer' : 'Edit'}</span>
            </button>

            {isConnected ? (
              <button
                onClick={onLogoutGoogle}
                className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>{isFrench ? 'Déconnecter' : 'Disconnect'}</span>
              </button>
            ) : (
              <button
                onClick={onLoginGoogle}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isFrench ? 'Connexion Google' : 'Google Sign-In'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Inline Email editor */}
        {showEditEmail && (
          <form
            onSubmit={handleEmailSubmit}
            className="pt-3 border-t border-slate-800 flex items-center gap-2 animate-in fade-in"
          >
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="votre_adresse@gmail.com"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
            >
              {isFrench ? 'Sauvegarder' : 'Save'}
            </button>
          </form>
        )}
      </div>

      {/* Real Device Mode Quick Status Card */}
      <div className="p-5 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">
                {isFrench ? 'Mode Appareil Réel (Device Mode)' : 'Real Device Mode'}
              </h3>
              <p className="text-xs text-slate-400">
                {isFrench
                  ? '9 paramètres matériels et d\'exécution native actifs'
                  : '9 hardware and native execution parameters active'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenRealModeSettings}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-slate-700"
          >
            {isFrench ? 'Gérer' : 'Manage'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono pt-1">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 flex items-center justify-between">
            <span>DAC PCM 44.1k</span>
            <span className="text-emerald-400 font-bold">✓ ON</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 flex items-center justify-between">
            <span>Silence VAD 5s</span>
            <span className="text-emerald-400 font-bold">✓ ON</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 flex items-center justify-between">
            <span>Rclone Live</span>
            <span className="text-emerald-400 font-bold">✓ ON</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 flex items-center justify-between">
            <span>Passerelle Termux</span>
            <span className="text-emerald-400 font-bold">✓ ON</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 flex items-center justify-between">
            <span>Auto Sync Drive</span>
            <span className="text-emerald-400 font-bold">✓ ON</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 flex items-center justify-between">
            <span>Retry Réseau</span>
            <span className="text-emerald-400 font-bold">✓ ON</span>
          </div>
        </div>
      </div>

      {/* Official NETSECUREPRO License Card */}
      <NetsecureProLicenseCard isInitiallyExpanded={true} />

      {/* Platform & Diagnostics Card */}
      <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3 text-xs">
        <h3 className="font-bold text-slate-100 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>{isFrench ? 'Diagnostics Système & Infrastructure' : 'System & Infrastructure Diagnostics'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400 font-mono">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-slate-500 block text-[10px]">APPLICATION ID</span>
            <span className="text-slate-200">com.aistudio.audiosynchub.dbcdca</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-slate-500 block text-[10px]">OAUTH CLIENT ID</span>
            <span className="text-slate-200 truncate block">
              739876417837-73odbgrntq5bkllpabloo06adrbbavb2
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-slate-500 block text-[10px]">STOCKAGE LOCAL</span>
            <span className="text-slate-200">IndexedDB + LocalStorage (Persistant)</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-slate-500 block text-[10px]">NOEUD MAÎTRE S24</span>
            <span className="text-emerald-400">SESSION IA22 ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
