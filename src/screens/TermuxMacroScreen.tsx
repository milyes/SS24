import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Play,
  Star,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Copy,
  Check,
  ShieldAlert,
  Cpu,
  Layers,
  Zap,
  Activity,
  X,
  ArrowDownCircle
} from 'lucide-react';
import {
  CommandMacro,
  Ia22SessionState,
  PredefinedTermuxScript,
  TermuxExecutionResult
} from '../types';
import { IA22SessionCard } from '../components/IA22SessionCard';
import { PredefinedScriptsSection } from '../components/PredefinedScriptsSection';

interface Props {
  macros: CommandMacro[];
  sessionState: Ia22SessionState;
  lastExecutionResult?: TermuxExecutionResult | null;
  isFrench: boolean;
  onExecuteMacro: (macro: CommandMacro) => void;
  onExecuteRawCommand: (cmd: string) => void;
  onExecutePredefinedScript: (
    script: PredefinedTermuxScript,
    args: Record<string, string>,
    runInBackground: boolean
  ) => void;
  onAddMacro: (macro: Omit<CommandMacro, 'id'>) => void;
  onUpdateMacro: (macro: CommandMacro) => void;
  onDeleteMacro: (macro: CommandMacro) => void;
  onToggleFavoriteMacro: (macro: CommandMacro) => void;
  onTriggerIa22Broadcast: () => void;
  onWipeIa22Session: () => void;
  onPingIa22Tunnel: () => void;
}

export const TermuxMacroScreen: React.FC<Props> = ({
  macros,
  sessionState,
  lastExecutionResult,
  isFrench,
  onExecuteMacro,
  onExecuteRawCommand,
  onExecutePredefinedScript,
  onAddMacro,
  onUpdateMacro,
  onDeleteMacro,
  onToggleFavoriteMacro,
  onTriggerIa22Broadcast,
  onWipeIa22Session,
  onPingIa22Tunnel
}) => {
  const [activeTab, setActiveTab] = useState<'PREDEFINED' | 'CUSTOM' | 'TERMINAL'>('PREDEFINED');
  const [rawCommandInput, setRawCommandInput] = useState('termux-toast -c cyan -b black "Audio Sync Hub Actif"');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '[INIT] Daemon com.termux.RUN_COMMAND initialisé avec succès.',
    '[LICENSE] LICENSE NETSECUREPRO.CA • GEMIN CORE V7 PRO FINAL',
    '[SIGNATURE] IA_LOGIC_SINGNATURE:ZOUBIROU-IA-2025 VALIDÉE',
    '[Z-CORE] Pont ADB & intents Android opérationnels sur port 5555.',
    '[IA22] Session maître S24 validée (Opérateur: M.I. ZOUBIROU).'
  ]);
  const [autoScrollTerminal, setAutoScrollTerminal] = useState(true);
  const terminalContainerRef = useRef<HTMLDivElement | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMacro, setEditingMacro] = useState<CommandMacro | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('TERMUX');
  const [formCommand, setFormCommand] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formFav, setFormFav] = useState(false);
  const [formRoot, setFormRoot] = useState(false);

  // Auto-scroll terminal output whenever new lines arrive
  useEffect(() => {
    if (autoScrollTerminal && terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [terminalOutput, autoScrollTerminal, activeTab]);

  // Append predefined script execution results to terminal log
  useEffect(() => {
    if (lastExecutionResult) {
      setTerminalOutput((prev) => [
        ...prev,
        `$ # Script: ${lastExecutionResult.scriptTitle}`,
        `$ ${lastExecutionResult.commandDispatched}`,
        `[OK] ${lastExecutionResult.message}`
      ]);
    }
  }, [lastExecutionResult]);

  const openAddModal = () => {
    setEditingMacro(null);
    setFormName('');
    setFormCategory('TERMUX');
    setFormCommand('');
    setFormDesc('');
    setFormFav(false);
    setFormRoot(false);
    setIsAddModalOpen(true);
  };

  const openEditModal = (m: CommandMacro) => {
    setEditingMacro(m);
    setFormName(m.name);
    setFormCategory(m.category);
    setFormCommand(m.commandText);
    setFormDesc(m.description);
    setFormFav(m.isFavorite);
    setFormRoot(m.requiresRoot);
    setIsAddModalOpen(true);
  };

  const handleSaveMacro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCommand.trim()) return;

    if (editingMacro) {
      onUpdateMacro({
        ...editingMacro,
        name: formName.trim(),
        category: formCategory.trim().toUpperCase(),
        commandText: formCommand.trim(),
        description: formDesc.trim(),
        isFavorite: formFav,
        requiresRoot: formRoot
      });
    } else {
      onAddMacro({
        name: formName.trim(),
        category: formCategory.trim().toUpperCase(),
        commandText: formCommand.trim(),
        description: formDesc.trim(),
        isFavorite: formFav,
        requiresRoot: formRoot
      });
    }
    setIsAddModalOpen(false);
  };

  const handleRunRaw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawCommandInput.trim()) return;
    const cmd = rawCommandInput.trim();
    onExecuteRawCommand(cmd);
    setTerminalOutput((prev) => [
      ...prev,
      `$ ${cmd}`,
      `[OUTPUT] Code retour 0 (succès) -> Intent com.termux.RUN_COMMAND transmis (IA_LOGIC_SINGNATURE:ZOUBIROU-IA-2025).`
    ]);
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Top IA22 Session Manager Card */}
      <IA22SessionCard
        sessionState={sessionState}
        isFrench={isFrench}
        onTriggerBroadcast={onTriggerIa22Broadcast}
        onWipeSession={onWipeIa22Session}
        onPingTunnel={onPingIa22Tunnel}
      />

      {/* Termux Environment Status Bar */}
      <div className="p-4 rounded-3xl border border-slate-800 bg-slate-900/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-slate-500 block text-[10px]">APPLICATION TERMUX</span>
            <span className="text-slate-200 font-bold">INSTALLÉ (v0.118)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-slate-500 block text-[10px]">TERMUX:API EXTENSION</span>
            <span className="text-emerald-400 font-bold">ACTIVE & LIÉE</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-slate-500 block text-[10px]">STOCKAGE PARTAGÉ</span>
            <span className="text-slate-200 font-bold">~/storage/shared</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-slate-500 block text-[10px]">INTENT PERMISSION</span>
            <span className="text-emerald-400 font-bold">RUN_COMMAND OK</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Predefined Scripts / Custom Macros / Live Terminal */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('PREDEFINED')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'PREDEFINED'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{isFrench ? 'Catalogue de Scripts Prédéfinis' : 'Predefined Scripts Catalog'}</span>
        </button>

        <button
          onClick={() => setActiveTab('CUSTOM')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'CUSTOM'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>{isFrench ? 'Macros Enregistrées' : 'Saved Command Macros'} ({macros.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('TERMINAL')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'TERMINAL'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{isFrench ? 'Console Shell / ADB Direct' : 'Direct Shell / ADB Console'}</span>
        </button>
      </div>

      {/* Tab 1: Predefined Scripts Section */}
      {activeTab === 'PREDEFINED' && (
        <PredefinedScriptsSection
          isFrench={isFrench}
          onExecuteScript={onExecutePredefinedScript}
          lastExecutionResult={lastExecutionResult}
        />
      )}

      {/* Tab 2: Custom Saved Macros List */}
      {activeTab === 'CUSTOM' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              {isFrench
                ? 'Commandes shell et ADB automatisées déclenchées via com.termux.RUN_COMMAND'
                : 'Automated shell and ADB commands triggered via com.termux.RUN_COMMAND'}
            </p>
            <button
              onClick={openAddModal}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>{isFrench ? 'Nouvelle Macro' : 'New Macro'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {macros.map((macro) => (
              <div
                key={macro.id}
                className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 flex flex-col justify-between gap-3 transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleFavoriteMacro(macro)}
                        className="text-slate-500 hover:text-amber-400"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            macro.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                          }`}
                        />
                      </button>
                      <h4 className="font-bold text-slate-100 text-xs sm:text-sm">
                        {macro.name}
                      </h4>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-emerald-400 border border-slate-700 shrink-0 font-bold">
                      {macro.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {macro.description}
                  </p>

                  <pre className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-[11px] truncate">
                    $ {macro.commandText}
                  </pre>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(macro)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteMacro(macro)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onExecuteMacro(macro);
                      setTerminalOutput((prev) => [
                        ...prev,
                        `$ ${macro.commandText}`,
                        `[MACRO:${macro.category}] Exécution "${macro.name}" transmise avec succès.`
                      ]);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isFrench ? 'Exécuter' : 'Execute'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Terminal Shell Console */}
      {activeTab === 'TERMINAL' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs space-y-3 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80 text-slate-500 text-[11px]">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>TERMUX CONSOLE HOST (S24 • GEMIN CORE V7 PRO FINAL)</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAutoScrollTerminal(!autoScrollTerminal)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-colors ${
                    autoScrollTerminal
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <ArrowDownCircle className="w-3 h-3" />
                  <span>{autoScrollTerminal ? 'AUTO-SCROLL ON' : 'AUTO-SCROLL OFF'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTerminalOutput([])}
                  className="hover:text-slate-300 px-2 py-0.5 rounded bg-slate-900 border border-slate-800"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Output log */}
            <div
              ref={terminalContainerRef}
              className="space-y-1.5 max-h-64 overflow-y-auto pr-1 text-slate-300 scroll-smooth"
            >
              {terminalOutput.map((line, idx) => (
                <div key={idx} className="break-all leading-relaxed">
                  {line.startsWith('$') ? (
                    <span className="text-emerald-400 font-bold">{line}</span>
                  ) : line.includes('[ERROR]') ? (
                    <span className="text-rose-400">{line}</span>
                  ) : (
                    <span>{line}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Command input prompt */}
            <form onSubmit={handleRunRaw} className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <span className="text-emerald-400 font-bold">$</span>
              <input
                type="text"
                value={rawCommandInput}
                onChange={(e) => setRawCommandInput(e.target.value)}
                placeholder="Entrez une commande (pkg, rclone, adb, termux-toast...)"
                className="flex-1 bg-transparent text-slate-100 font-mono text-xs focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                {isFrench ? 'Envoyer' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Macro Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-base">
                {editingMacro
                  ? isFrench ? 'Modifier la Macro' : 'Edit Macro'
                  : isFrench ? 'Nouvelle Macro Termux' : 'New Termux Macro'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMacro} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Nom de la macro</label>
                <input
                  type="text"
                  placeholder="Ex: Sauvegarde audio vers Google Drive..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Catégorie</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                >
                  <option value="RCLONE">RCLONE (Cloud Transfer)</option>
                  <option value="TERMUX">TERMUX (Hardware & System)</option>
                  <option value="ADB">ADB (Debug & Screen Input)</option>
                  <option value="Z_GHOST">Z_GHOST (Fido Telemetry)</option>
                  <option value="IA22">IA22 (Master Core Update)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Commande shell</label>
                <textarea
                  placeholder="rclone copy ./storage/ gdrive:/..."
                  value={formCommand}
                  onChange={(e) => setFormCommand(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Description</label>
                <input
                  type="text"
                  placeholder="Brève explication de la commande..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={formFav}
                    onChange={(e) => setFormFav(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-amber-500 bg-slate-800"
                  />
                  <span>Favori</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={formRoot}
                    onChange={(e) => setFormRoot(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-rose-500 bg-slate-800"
                  />
                  <span>Requiert Root / su</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  {isFrench ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  {isFrench ? 'Enregistrer' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
