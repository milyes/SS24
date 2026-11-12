import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Copy,
  Check,
  Smartphone,
  Shield,
  Star,
  ExternalLink
} from 'lucide-react';

interface Props {
  onDismiss: () => void;
  isFrench: boolean;
}

export const PlayStoreListingDialog: React.FC<Props> = ({
  onDismiss,
  isFrench
}) => {
  const [copied, setCopied] = useState(false);

  const title = 'Audio Sync Hub - Z-CORE Voice & Drive Sync';
  const shortDescription = isFrench
    ? 'Enregistreur vocal HD avec synchronisation auto Google Drive/rclone & macros Termux.'
    : 'HD voice recorder with automated Google Drive & rclone multi-cloud sync and Termux macros.';
  const fullDescription = isFrench
    ? `Audio Sync Hub Z-CORE est une solution complète d'enregistrement vocal et de synchronisation multi-cloud.

FONCTIONNALITÉS CLÉS:
• Enregistrement audio HD avec visualiseur de forme d'onde en temps réel.
• Synchronisation automatique Google Drive & rclone CLI via service arrière-plan.
• Gestionnaire de macros et d'intents de commandes Termux / Z_GHOST.
• Analyseur vocal IA propulsé par Google Gemini.
• Mode de sélection en masse pour les transferts cloud volumineux.

Version: 1.0.0
Package: com.aistudio.audiosynchub.dbcdca
Cible SDK: 35 (Android 15 Ready)`
    : `Audio Sync Hub Z-CORE is an all-in-one voice recorder and multi-cloud synchronization solution.

KEY FEATURES:
• HD Audio recording with real-time waveform visualizer.
• Automated Google Drive & rclone background synchronization daemon.
• Termux & Z_GHOST macro and ADB intent manager.
• Gemini AI voice analyzer and transcribers.
• Batch selection mode for large-scale multi-cloud transfers.

Version: 1.0.0
Package: com.aistudio.audiosynchub.dbcdca
Target SDK: 35 (Android 15 Ready)`;

  const copyListing = () => {
    navigator.clipboard.writeText(`${title}\n\n${shortDescription}\n\n${fullDescription}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                Google Play Store Listing
              </h3>
              <p className="text-xs text-slate-400">
                {isFrench ? 'Fiche descriptive & Spécifications de publication' : 'Listing description & Release specs'}
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Play Store Info Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              {isFrench ? 'Titre de l\'Application' : 'App Title'}
            </label>
            <p className="text-sm font-semibold text-slate-200 mt-0.5">{title}</p>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              {isFrench ? 'Description Courte' : 'Short Description'}
            </label>
            <p className="text-xs text-slate-300 mt-0.5">{shortDescription}</p>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              {isFrench ? 'Description Complète' : 'Full Description'}
            </label>
            <pre className="text-xs text-slate-400 mt-1 whitespace-pre-wrap font-sans bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              {fullDescription}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={copyListing}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (isFrench ? 'Copié !' : 'Copied!') : (isFrench ? 'Copier la Fiche' : 'Copy Listing')}</span>
          </button>

          <button
            onClick={onDismiss}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
          >
            {isFrench ? 'Fermer' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
