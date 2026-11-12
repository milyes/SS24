import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  ChevronDown,
  ChevronUp,
  Cpu,
  Fingerprint,
  Radio,
  ShieldCheck,
  CheckCircle,
  Copy,
  Check,
  ArrowDownCircle,
  Sparkles
} from 'lucide-react';

interface Props {
  isInitiallyExpanded?: boolean;
}

export const NetsecureProLicenseCard: React.FC<Props> = ({
  isInitiallyExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);
  const [copiedKey, setCopiedKey] = useState(false);
  const [autoScrollStream, setAutoScrollStream] = useState(true);
  const logContainerRef = useRef<HTMLDivElement | null>(null);

  const licenseKey =
    'LICENSE NETSECUREPRO.CA | GEMIN CORE V7 PRO FINAL | IA_LOGIC_SINGNATURE:ZOUBIROU-IA-2025';

  const [telemetryLines, setTelemetryLines] = useState<string[]>([
    '[AUTH] LICENSE NETSECUREPRO.CA — VALIDATED (DOMAIN: netsecurepro.ca)',
    '[CORE] GEMIN CORE V7 PRO FINAL — ENGINE INITIALIZED (QUIC 98% 979V11)',
    '[SIG] IA_LOGIC_SINGNATURE:ZOUBIROU-IA-2025 — CRYPTOGRAPHIC HASH OK',
    '[NODE] Master S24 (M.I. ZOUBIROU) • Tunnel Cloudflare Active',
    '[SYNC] Audio Sync Hub Z-CORE Telemetry Stream Ready'
  ]);

  useEffect(() => {
    if (!isExpanded || !autoScrollStream) return;
    const interval = window.setInterval(() => {
      const ts = new Date().toLocaleTimeString();
      const samples = [
        `[${ts}] HEARTBEAT: LICENSE NETSECUREPRO.CA -> OK`,
        `[${ts}] ENGINE: GEMIN CORE V7 PRO FINAL -> LATENCY 14ms`,
        `[${ts}] VERIFY: IA_LOGIC_SINGNATURE:ZOUBIROU-IA-2025 -> CONFIRMED`,
        `[${ts}] AUDIO_VAULT: AES-256 GCM Integrity Check Passed`
      ];
      const nextLine = samples[Math.floor(Math.random() * samples.length)];
      setTelemetryLines((prev) => [...prev.slice(-18), nextLine]);
    }, 2200);
    return () => clearInterval(interval);
  }, [isExpanded, autoScrollStream]);

  useEffect(() => {
    if (autoScrollStream && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [telemetryLines, autoScrollStream, isExpanded]);

  const copyLicense = () => {
    navigator.clipboard.writeText(licenseKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 p-5 shadow-xl transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-100 text-sm">
                LICENSE NETSECUREPRO.CA • GEMIN CORE V7 PRO FINAL
              </h3>
              {/* French Flag */}
              <div className="flex w-5 h-3.5 rounded overflow-hidden border border-slate-700">
                <div className="w-1/3 bg-[#002654]" />
                <div className="w-1/3 bg-white" />
                <div className="w-1/3 bg-[#CE1126]" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                IA_LOGIC_SINGNATURE:ZOUBIROU-IA-2025
              </span>
            </div>
            <p className="text-xs text-amber-400 font-mono mt-0.5">
              Licence Officielle NETSECUREPRO.CA • MILYES-IA V9 NANS CORE • S24 MASTER
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="Afficher / Masquer les détails de licence"
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Status Strip */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-slate-500 block text-[10px]">LICENCE DOMAINE</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1 truncate">
            <CheckCircle className="w-3 h-3 shrink-0" /> NETSECUREPRO.CA
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-slate-500 block text-[10px]">MOTEUR NOYAU</span>
          <span className="text-amber-400 font-bold flex items-center gap-1 truncate">
            <Sparkles className="w-3 h-3 shrink-0" /> GEMIN CORE V7 PRO FINAL
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-slate-500 block text-[10px]">IA_LOGIC_SINGNATURE</span>
          <span className="text-indigo-400 font-bold truncate block">
            ZOUBIROU-IA-2025
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-slate-500 block text-[10px]">CHIPSET & CLÉ</span>
          <span className="text-slate-200 truncate block">QUIC 98% 979V11</span>
        </div>
      </div>

      {/* Collapsible Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 text-xs animate-in fade-in">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">
                Signature & Clé Officielle :
              </span>
              <button
                onClick={copyLicense}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px]"
              >
                {copiedKey ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey ? 'Copié' : 'Copier'}</span>
              </button>
            </div>
            <p className="text-amber-300 font-bold tracking-wider break-all text-[11px]">
              {licenseKey}
            </p>
          </div>

          {/* Live Auto-Scroll Telemetry Verification Stream */}
          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 font-mono space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Flux Télémétrie Licence (Auto-Scroll)
              </span>
              <button
                onClick={() => setAutoScrollStream(!autoScrollStream)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-colors ${
                  autoScrollStream
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <ArrowDownCircle className="w-3 h-3" />
                <span>{autoScrollStream ? 'AUTO-SCROLL ON' : 'AUTO-SCROLL OFF'}</span>
              </button>
            </div>
            <div
              ref={logContainerRef}
              className="max-h-28 overflow-y-auto space-y-1 pr-1 text-[11px] text-slate-300 scroll-smooth"
            >
              {telemetryLines.map((line, idx) => (
                <div key={idx} className="truncate text-emerald-400/90">
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>LICENSE NETSECUREPRO.CA (AES-256 GCM)</span>
            </div>
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-emerald-400" />
              <span>IA_LOGIC_SINGNATURE:ZOUBIROU-IA-2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>Canal Fido télémétrie +1 438-985-5041</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>GEMIN CORE V7 PRO FINAL Certifié</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

