import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  HardDrive,
  RefreshCw,
  Zap,
  Filter,
  TrendingUp,
  ArrowDownCircle
} from 'lucide-react';
import { SyncLog } from '../types';

interface Props {
  syncLogs: SyncLog[];
  isSyncingActive: boolean;
  syncProgressPercent: number;
  activeSyncCommand: string;
  isFrench: boolean;
  onTriggerSyncNow: () => void;
}

export const SyncProgressDashboard: React.FC<Props> = ({
  syncLogs,
  isSyncingActive,
  syncProgressPercent,
  activeSyncCommand,
  isFrench,
  onTriggerSyncNow
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'FAILED'>('ALL');
  const [autoScrollLogs, setAutoScrollLogs] = useState(true);
  const logsContainerRef = useRef<HTMLDivElement | null>(null);

  const totalLogs = syncLogs.length;
  const successLogs = syncLogs.filter((l) => l.status === 'SUCCESS').length;
  const failedLogs = syncLogs.filter((l) => l.status === 'FAILED').length;
  const successRate = totalLogs > 0 ? Math.round((successLogs / totalLogs) * 100) : 100;

  const filteredLogs = syncLogs
    .filter((l) => {
      if (statusFilter === 'SUCCESS') return l.status === 'SUCCESS';
      if (statusFilter === 'FAILED') return l.status === 'FAILED';
      return true;
    })
    .slice(-25)
    .reverse();

  // Auto-scroll audit logs when new sync events occur
  useEffect(() => {
    if (autoScrollLogs && logsContainerRef.current) {
      logsContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [syncLogs.length, isSyncingActive, autoScrollLogs]);

  // Group last 14 days for mini sparkline
  const daysData = React.useMemo(() => {
    const buckets = Array(14).fill(0);
    const now = Date.now();
    const dayMs = 86400000;
    syncLogs.forEach((l) => {
      if (l.status === 'SUCCESS') {
        const diffDays = Math.floor((now - l.timestamp) / dayMs);
        if (diffDays >= 0 && diffDays < 14) {
          buckets[13 - diffDays]++;
        }
      }
    });
    const max = Math.max(...buckets, 1);
    return buckets.map((count) => ({ count, pct: Math.round((count / max) * 100) }));
  }, [syncLogs]);

  return (
    <div className="space-y-4">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              {isFrench ? 'Taux de Réussite' : 'Success Rate'}
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">
            {successRate}%
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {successLogs} / {totalLogs} {isFrench ? 'transferts' : 'transfers'}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              {isFrench ? 'Succès (30J)' : 'Successful'}
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">
            {successLogs}
          </div>
          <span className="text-[10px] text-emerald-500 font-mono">
            {isFrench ? 'Transférés sans erreur' : 'Transferred cleanly'}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              {isFrench ? 'Échecs & Retries' : 'Failed & Retries'}
            </span>
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400 font-mono">
            {failedLogs}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {isFrench ? 'Auto-récupérés' : 'Auto-retried'}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              {isFrench ? 'Service Arrière-Plan' : 'Background Daemon'}
            </span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ACTIF</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Rclone / Termux VAD
          </span>
        </div>
      </div>

      {/* Active Sync Progress Banner if syncing */}
      {isSyncingActive && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-300 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
              <span>{isFrench ? 'Synchronisation Google Drive en cours...' : 'Google Drive sync in progress...'}</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              {syncProgressPercent}%
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300 shadow-sm shadow-emerald-500"
              style={{ width: `${syncProgressPercent}%` }}
            />
          </div>

          {activeSyncCommand && (
            <p className="text-[11px] font-mono text-slate-400 truncate">
              $ {activeSyncCommand}
            </p>
          )}
        </div>
      )}

      {/* 14-day Activity Mini Chart */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">
            {isFrench ? 'Activité des 14 Derniers Jours' : '14-Day Activity Sparkline'}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {isFrench ? 'Syncs réussies / jour' : 'Successful syncs / day'}
          </span>
        </div>
        <div className="flex items-end gap-1.5 h-16 pt-2">
          {daysData.map((d, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative"
            >
              <div
                className="w-full rounded-t bg-emerald-500/80 group-hover:bg-emerald-400 transition-colors"
                style={{ height: `${Math.max(8, d.pct)}%` }}
              />
              <span className="absolute -top-6 hidden group-hover:block bg-slate-800 text-[10px] text-emerald-300 px-1.5 py-0.5 rounded shadow font-mono">
                {d.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Logs Table / List with Filter */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-slate-100 text-sm">
              {isFrench ? 'Journal d\'Audit des Transferts' : 'Transfer Audit Logs'}
            </h3>
            <button
              type="button"
              onClick={() => setAutoScrollLogs(!autoScrollLogs)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 border transition-colors ${
                autoScrollLogs
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title={isFrench ? 'Défilement automatique des logs' : 'Auto-scroll logs'}
            >
              <ArrowDownCircle className="w-3 h-3" />
              <span>{autoScrollLogs ? 'AUTO-SCROLL' : 'MANUEL'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-slate-700 text-slate-100'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isFrench ? 'Tous' : 'All'}
            </button>
            <button
              onClick={() => setStatusFilter('SUCCESS')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'SUCCESS'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isFrench ? 'Succès' : 'Success'}
            </button>
            <button
              onClick={() => setStatusFilter('FAILED')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === 'FAILED'
                  ? 'bg-rose-500/20 text-rose-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isFrench ? 'Échecs' : 'Failed'}
            </button>
          </div>
        </div>

        {/* List of sync logs */}
        <div
          ref={logsContainerRef}
          className="space-y-2 max-h-72 overflow-y-auto pr-1 scroll-smooth"
        >
          {filteredLogs.map((log) => {
            const isSuccess = log.status === 'SUCCESS';
            const dateStr = new Date(log.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });

            return (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    {isSuccess ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-mono text-slate-200 text-[11px] truncate">
                      {log.commandExecuted}
                    </p>
                    {log.errorMessage ? (
                      <p className="text-[11px] text-rose-400 font-sans">
                        {log.errorMessage}
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-500 font-mono">
                        {log.bytesTransferred} • {log.progressPercent}%
                      </p>
                    )}
                  </div>
                </div>

                <span className="font-mono text-[10px] text-slate-500 shrink-0">
                  {dateStr}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

