import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  Camera,
  RefreshCw,
  Download,
  Trash2,
  Check,
  SwitchCamera,
  Image as ImageIcon
} from 'lucide-react';

interface Props {
  onDismiss: () => void;
  isFrench: boolean;
}

export const CameraCaptureDialog: React.FC<Props> = ({
  onDismiss,
  isFrench
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async (mode: 'user' | 'environment') => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        isFrench
          ? 'Impossible d\'accéder à la caméra (vérifiez les autorisations du navigateur).'
          : 'Unable to access camera (check browser permissions).'
      );
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const toggleFacingMode = () => {
    const next = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(next);
  };

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPhotos((prev) => [dataUrl, ...prev]);
      setSelectedPhoto(dataUrl);
    }
  };

  const downloadPhoto = (dataUrl: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `zcore_snapshot_${Date.now()}.jpg`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                {isFrench ? 'Caméra & Capture Documentaire' : 'Camera & Document Capture'}
              </h3>
              <p className="text-xs text-slate-400">
                {isFrench ? 'Capturez des pièces justificatives et associez-les au flux Z-CORE' : 'Capture documents and receipts linked to Z-CORE'}
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Viewport */}
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          {cameraError && (
            <div className="absolute inset-0 p-6 bg-slate-950/90 flex flex-col items-center justify-center text-center space-y-2">
              <Camera className="w-8 h-8 text-rose-400" />
              <p className="text-xs text-rose-300 max-w-sm">{cameraError}</p>
              <button
                onClick={() => startCamera(facingMode)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
              >
                {isFrench ? 'Réessayer' : 'Retry'}
              </button>
            </div>
          )}

          {/* Floating camera switch button */}
          {isCameraActive && (
            <button
              onClick={toggleFacingMode}
              className="absolute top-3 right-3 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-slate-200 backdrop-blur border border-slate-700/60 shadow-lg"
              title={isFrench ? 'Inverser la caméra' : 'Switch camera'}
            >
              <SwitchCamera className="w-4 h-4" />
            </button>
          )}

          {/* Floating trigger snapshot button */}
          {isCameraActive && (
            <button
              onClick={takeSnapshot}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/30 border-4 border-slate-950 active:scale-95 transition-all"
              title={isFrench ? 'Prendre une photo' : 'Take snapshot'}
            >
              <Camera className="w-6 h-6 fill-current" />
            </button>
          )}
        </div>

        {/* Captured Photo Strip */}
        {capturedPhotos.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{isFrench ? 'Photos Capturées' : 'Captured Photos'} ({capturedPhotos.length})</span>
            </span>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {capturedPhotos.map((photo, i) => (
                <div
                  key={i}
                  className="relative group rounded-xl overflow-hidden border border-slate-800 shrink-0 w-24 h-20"
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                    <button
                      onClick={() => downloadPhoto(photo)}
                      className="p-1 rounded bg-emerald-500 text-slate-950"
                      title="Télécharger"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        setCapturedPhotos((prev) => prev.filter((_, idx) => idx !== i));
                      }}
                      className="p-1 rounded bg-rose-500 text-white"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-1 border-t border-slate-800">
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
