import React, { useState, useEffect, useRef } from 'react';
import {
  Tv,
  Radio,
  RefreshCw,
  Maximize2,
  Minimize2,
  ExternalLink,
  Edit,
  Copy,
  Check,
  AlertCircle,
  Play,
  Volume2,
  VolumeX,
  Shield,
  Globe
} from 'lucide-react';
import Hls from 'hls.js';
import { StreamChannelPreset } from '../types';
import { STREAM_PRESETS } from '../data/initialData';

interface Props {
  currentStreamUrl: string;
  currentStreamTitle: string;
  isFrench: boolean;
  onSetStream: (url: string, title: string) => void;
  onRecordAudioShortcut: () => void;
}

export const LiveStreamScreen: React.FC<Props> = ({
  currentStreamUrl,
  currentStreamTitle,
  isFrench,
  onSetStream,
  onRecordAudioShortcut
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlayerLoading, setIsPlayerLoading] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [customTitleInput, setCustomTitleInput] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [useIframeMode, setUseIframeMode] = useState(false);

  const isM3u8 = currentStreamUrl.toLowerCase().includes('.m3u8');

  // Load stream
  useEffect(() => {
    // If URL is an html page or trycloudflare, use iframe mode
    if (currentStreamUrl.includes('.html') || (!isM3u8 && currentStreamUrl.startsWith('http'))) {
      setUseIframeMode(true);
      return;
    }

    setUseIframeMode(false);
    setIsPlayerLoading(true);
    setPlaybackError(null);

    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported() && isM3u8) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsRef.current = hls;

      hls.loadSource(currentStreamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsPlayerLoading(false);
        setPlaybackError(null);
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setPlaybackError(
                isFrench
                  ? 'Flux momentanément hors ligne ou restreint par le réseau distant.'
                  : 'Stream offline or remote server unreachable.'
              );
              setIsPlayerLoading(false);
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari HLS
      video.src = currentStreamUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsPlayerLoading(false);
        video.play().catch(() => {});
      });
      video.addEventListener('error', () => {
        setPlaybackError(isFrench ? 'Flux inaccessible' : 'Stream unreachable');
        setIsPlayerLoading(false);
      });
    } else {
      video.src = currentStreamUrl;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentStreamUrl, isM3u8, isFrench]);

  const reloadStream = () => {
    const url = currentStreamUrl;
    onSetStream('', currentStreamTitle);
    setTimeout(() => onSetStream(url, currentStreamTitle), 100);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(currentStreamUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      onSetStream(
        customUrlInput.trim(),
        customTitleInput.trim() || 'Flux Personnalisé'
      );
      setShowCustomModal(false);
    }
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-black p-0' : 'pb-16'}`}>
      {/* Top Header if not fullscreen */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-600/15 text-rose-500 border border-rose-600/30">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">
                  {currentStreamTitle}
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider bg-rose-600 text-white animate-pulse">
                  ● LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {useIframeMode
                  ? 'Tunnel Cloudflare Web UI (979V11 Gatekeeper)'
                  : 'Moteur HLS Stagefright / Hls.js High Frequency'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={reloadStream}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Recharger le flux"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setCustomUrlInput(currentStreamUrl);
                setCustomTitleInput(currentStreamTitle);
                setShowCustomModal(true);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Éditer l'URL"
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsFullscreen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{isFrench ? 'Plein Écran' : 'Fullscreen'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Video Viewport */}
      <div
        className={`relative overflow-hidden bg-black flex items-center justify-center ${
          isFullscreen
            ? 'w-full h-full'
            : 'rounded-3xl border border-slate-800 aspect-video shadow-2xl'
        }`}
      >
        {useIframeMode ? (
          <iframe
            src={currentStreamUrl}
            title={currentStreamTitle}
            className="w-full h-full border-0"
            allow="autoplay; encrypted-media; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : (
          <video
            ref={videoRef}
            playsInline
            muted={isMuted}
            controls
            className="w-full h-full object-contain"
          />
        )}

        {/* Live Badge Overlay */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-lg shadow-rose-600/40">
            ● EN DIRECT
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-900/80 text-slate-200 backdrop-blur border border-slate-700">
            {currentStreamTitle}
          </span>
        </div>

        {/* Fullscreen Exit button */}
        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur border border-slate-700 shadow-xl"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        )}

        {/* Loading Spinner */}
        {isPlayerLoading && !playbackError && !useIframeMode && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center space-y-2 z-10">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-xs text-slate-300 font-mono">
              {isFrench ? 'Chargement du flux...' : 'Connecting to stream...'}
            </span>
          </div>
        )}

        {/* Offline / Error Overlay */}
        {playbackError && (
          <div className="absolute inset-0 p-6 bg-slate-950/90 flex flex-col items-center justify-center text-center space-y-3 z-10">
            <AlertCircle className="w-10 h-10 text-rose-500" />
            <div>
              <h4 className="font-bold text-slate-100 text-sm">
                {isFrench ? 'Flux Temporairement Indisponible' : 'Stream Currently Offline'}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1">{playbackError}</p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={reloadStream}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                {isFrench ? 'Réessayer' : 'Retry'}
              </button>
              <button
                onClick={() =>
                  onSetStream(
                    'https://retailers-mitchell-customs-rotation.trycloudflare.com/logic_cover.html',
                    'Z-CORE Logic Cover (979V11)'
                  )
                }
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
              >
                {isFrench ? 'Ouvrir Z-CORE Tunnel' : 'Open Z-CORE Tunnel'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls & Presets list (Only if not fullscreen) */}
      {!isFullscreen && (
        <div className="space-y-4">
          {/* Quick Info & Action Bar */}
          <div className="p-4 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-mono truncate">
              <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{currentStreamUrl}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={copyUrl}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? (isFrench ? 'Copié' : 'Copied') : (isFrench ? 'Copier URL' : 'Copy URL')}</span>
              </button>

              <button
                onClick={onRecordAudioShortcut}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{isFrench ? 'Enregistrer Audio' : 'Record Audio'}</span>
              </button>
            </div>
          </div>

          {/* Stream Channel Presets */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200">
              {isFrench ? 'Chaînes & Tunnels Disponibles' : 'Available Streams & Tunnels'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {STREAM_PRESETS.map((preset) => {
                const isSelected = preset.streamUrl === currentStreamUrl;
                return (
                  <div
                    key={preset.id}
                    onClick={() => onSetStream(preset.streamUrl, preset.title)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/20 shadow-md shadow-emerald-950/30'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Tv className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-100 text-xs sm:text-sm truncate">
                          {preset.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate font-mono">
                          {preset.category} • {preset.resolution}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                        ACTIF
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Custom URL Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-100 text-base">
              {isFrench ? 'Éditer le Flux Vidéo' : 'Edit Stream URL'}
            </h3>

            <form onSubmit={handleCustomSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Titre du Flux</label>
                <input
                  type="text"
                  value={customTitleInput}
                  onChange={(e) => setCustomTitleInput(e.target.value)}
                  placeholder="BEIN 1 HF, Live M3U8..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">URL du Flux (HLS .m3u8 ou Web UI)</label>
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://...m3u8"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  {isFrench ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  {isFrench ? 'Charger le flux' : 'Load Stream'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
