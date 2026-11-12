import React from 'react';

interface Props {
  waveformData?: string;
  liveAmplitudes?: number[];
  isRecording?: boolean;
  isPlaying?: boolean;
  progressPercent?: number; // 0 to 100
  onSeekPercent?: (percent: number) => void;
  barColor?: string;
  activeColor?: string;
  height?: number;
}

export const AudioWaveformVisualizer: React.FC<Props> = ({
  waveformData = '20,40,65,80,95,70,50,85,90,60,40,75,85,90,65,50,80,95,70,40',
  liveAmplitudes,
  isRecording = false,
  isPlaying = false,
  progressPercent = 0,
  onSeekPercent,
  barColor = 'bg-slate-700',
  activeColor = 'bg-emerald-500',
  height = 56
}) => {
  const amplitudes: number[] = React.useMemo(() => {
    if (isRecording && liveAmplitudes && liveAmplitudes.length > 0) {
      return liveAmplitudes;
    }
    return waveformData
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
  }, [waveformData, liveAmplitudes, isRecording]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeekPercent) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    onSeekPercent(pct);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative flex items-center justify-between gap-1 w-full px-2 rounded-xl bg-slate-900/60 border border-slate-800 select-none ${
        onSeekPercent ? 'cursor-pointer hover:border-slate-700' : ''
      }`}
      style={{ height: `${height}px` }}
    >
      {/* Progress background glow if playing */}
      {isPlaying && (
        <div
          className="absolute top-0 bottom-0 left-0 bg-emerald-500/10 pointer-events-none rounded-l-xl transition-all duration-150"
          style={{ width: `${progressPercent}%` }}
        />
      )}

      {amplitudes.map((amp, idx) => {
        const itemPercent = (idx / (amplitudes.length - 1 || 1)) * 100;
        const isPassed = isPlaying && itemPercent <= progressPercent;
        const normalizedHeight = Math.max(12, Math.min(100, amp));

        return (
          <div
            key={idx}
            className="flex-1 flex items-center justify-center h-full min-w-[2px]"
          >
            <div
              className={`w-full max-w-[5px] rounded-full transition-all duration-150 ${
                isRecording
                  ? 'bg-rose-500 animate-pulse'
                  : isPassed
                  ? activeColor
                  : barColor
              }`}
              style={{
                height: `${normalizedHeight}%`,
                opacity: isRecording ? Math.max(0.4, amp / 100) : 1
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
