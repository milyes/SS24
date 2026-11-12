import React, { useState } from 'react';
import {
  Terminal,
  Play,
  Settings2,
  Code,
  Copy,
  Check,
  Cloud,
  Volume2,
  HardDrive,
  Radio,
  Activity,
  Battery,
  Sliders
} from 'lucide-react';
import {
  PredefinedTermuxScript,
  TermuxScriptCategory,
  TermuxExecutionResult
} from '../types';
import { PREDEFINED_SCRIPTS } from '../data/initialData';

interface Props {
  isFrench: boolean;
  onExecuteScript: (
    script: PredefinedTermuxScript,
    args: Record<string, string>,
    runInBackground: boolean
  ) => void;
  lastExecutionResult?: TermuxExecutionResult | null;
}

export const PredefinedScriptsSection: React.FC<Props> = ({
  isFrench,
  onExecuteScript,
  lastExecutionResult
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'ALL' | TermuxScriptCategory
  >('ALL');
  const [activeConfigScript, setActiveConfigScript] =
    useState<PredefinedTermuxScript | null>(null);
  const [scriptArgs, setScriptArgs] = useState<Record<string, string>>({});
  const [runInBackground, setRunInBackground] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState(false);

  const categories: { id: 'ALL' | TermuxScriptCategory; labelFr: string; labelEn: string }[] = [
    { id: 'ALL', labelFr: 'Tous les scripts', labelEn: 'All scripts' },
    { id: 'RCLONE_CLOUD', labelFr: 'Cloud & Rclone', labelEn: 'Cloud & Rclone' },
    { id: 'AUDIO_PROCESSING', labelFr: 'Audio (FFmpeg)', labelEn: 'Audio (FFmpeg)' },
    { id: 'STORAGE_SYSTEM', labelFr: 'Stockage & Système', labelEn: 'Storage & System' },
    { id: 'TELEMETRY_GHOST', labelFr: 'Télémétrie Z-GHOST', labelEn: 'Z-GHOST Telemetry' },
    { id: 'DIAGNOSTICS', labelFr: 'Réseau & Ping', labelEn: 'Network & Diagnostics' },
    { id: 'TERMUX_API', labelFr: 'Capteurs API', labelEn: 'Termux:API Sensors' }
  ];

  const filteredScripts = PREDEFINED_SCRIPTS.filter((s) => {
    if (selectedCategory === 'ALL') return true;
    return s.category === selectedCategory;
  });

  const openConfigModal = (script: PredefinedTermuxScript) => {
    const defaultArgs: Record<string, string> = {};
    script.arguments?.forEach((arg) => {
      defaultArgs[arg.key] = arg.defaultValue;
    });
    setScriptArgs(defaultArgs);
    setRunInBackground(script.defaultRunInBackground ?? true);
    setActiveConfigScript(script);
  };

  const handleRunConfigured = () => {
    if (!activeConfigScript) return;
    onExecuteScript(activeConfigScript, scriptArgs, runInBackground);
    setActiveConfigScript(null);
  };

  const generatedCode = activeConfigScript
    ? activeConfigScript.templateScript(scriptArgs)
    : '';

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === cat.id
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
            }`}
          >
            {isFrench ? cat.labelFr : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Script Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredScripts.map((script) => (
          <div
            key={script.id}
            className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 flex flex-col justify-between gap-3 transition-all"
          >
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-slate-100 text-xs sm:text-sm">
                  {isFrench ? script.titleFr : script.titleEn}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                  {script.category.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isFrench ? script.descriptionFr : script.descriptionEn}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
              <button
                onClick={() => openConfigModal(script)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isFrench ? 'Configurer' : 'Configure'}</span>
              </button>

              <button
                onClick={() => {
                  const defArgs: Record<string, string> = {};
                  script.arguments?.forEach((a) => (defArgs[a.key] = a.defaultValue));
                  onExecuteScript(script, defArgs, script.defaultRunInBackground ?? true);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isFrench ? 'Exécuter' : 'Run'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Script Config & Code Preview Modal */}
      {activeConfigScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                  <span>
                    {isFrench
                      ? activeConfigScript.titleFr
                      : activeConfigScript.titleEn}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isFrench
                    ? activeConfigScript.descriptionFr
                    : activeConfigScript.descriptionEn}
                </p>
              </div>
              <button
                onClick={() => setActiveConfigScript(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                Fermer
              </button>
            </div>

            {/* Config Arguments Fields */}
            {activeConfigScript.arguments && activeConfigScript.arguments.length > 0 && (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {isFrench ? 'Paramètres du script' : 'Script Arguments'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeConfigScript.arguments.map((arg) => (
                    <div key={arg.key} className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">
                        {isFrench ? arg.labelFr : arg.labelEn}
                      </label>
                      {arg.options && arg.options.length > 0 ? (
                        <select
                          value={scriptArgs[arg.key] || arg.defaultValue}
                          onChange={(e) =>
                            setScriptArgs({ ...scriptArgs, [arg.key]: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                        >
                          {arg.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={arg.isSecret ? 'password' : 'text'}
                          value={scriptArgs[arg.key] || ''}
                          onChange={(e) =>
                            setScriptArgs({ ...scriptArgs, [arg.key]: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      )}
                      <p className="text-[10px] text-slate-500">
                        {isFrench ? arg.descriptionFr : arg.descriptionEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generated Code Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-emerald-400" />
                  <span>{isFrench ? 'Code Shell Généré' : 'Generated Shell Code'}</span>
                </span>
                <button
                  onClick={copyCode}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? (isFrench ? 'Copié' : 'Copied') : (isFrench ? 'Copier' : 'Copy')}</span>
                </button>
              </div>

              <pre className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto max-h-56 leading-relaxed">
                {generatedCode}
              </pre>
            </div>

            {/* Background mode toggle & Run Button */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={runInBackground}
                  onChange={(e) => setRunInBackground(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-400 bg-slate-800"
                />
                <span>
                  {isFrench ? 'Exécuter en arrière-plan (Background Intent)' : 'Run in background (Daemon Intent)'}
                </span>
              </label>

              <button
                onClick={handleRunConfigured}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isFrench ? 'Transmettre à Termux' : 'Dispatch to Termux'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
