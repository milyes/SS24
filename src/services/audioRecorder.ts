export interface StartRecordingResult {
  success: boolean;
  isSimulated: boolean;
  error?: string;
}

export class AudioRecorderManager {
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private animFrameId: number | null = null;
  private oscNode: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;

  public isRecording = false;
  public isPaused = false;
  public isAutoPausedBySilence = false;
  public silenceDetectionEnabled = true;
  public isSimulatedMode = false;

  private onAmplitudeCallback?: (amp: number, isSilent: boolean) => void;

  async start(
    onAmplitude: (amp: number, isSilent: boolean) => void,
    forceSimulated = false
  ): Promise<StartRecordingResult> {
    this.chunks = [];
    this.onAmplitudeCallback = onAmplitude;

    if (!forceSimulated && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
          }
        });

        this.isSimulatedMode = false;
        this.setupMediaRecorder(this.stream);
        this.setupAudioContext(this.stream);

        this.mediaRecorder?.start(200);
        this.isRecording = true;
        this.isPaused = false;
        this.isAutoPausedBySilence = false;

        this.startAmplitudeMonitoring();
        return { success: true, isSimulated: false };
      } catch (err: any) {
        console.warn('Physical microphone access unavailable or denied:', err.message);
        // Fallback to Web Audio Synthesizer stream so user can still record
        const simResult = this.startSimulatedAudioStream();
        return {
          success: simResult,
          isSimulated: true,
          error: err.name === 'NotAllowedError' || err.message?.includes('Permission denied')
            ? 'Permission denied'
            : err.message
        };
      }
    }

    // Direct simulated mode
    const simResult = this.startSimulatedAudioStream();
    return { success: simResult, isSimulated: true };
  }

  private startSimulatedAudioStream(): boolean {
    try {
      this.isSimulatedMode = true;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();

      // Create stream destination for MediaRecorder
      const destination = this.audioContext.createMediaStreamDestination();

      // Create audio oscillator with gentle harmonic tone for voice simulation
      this.oscNode = this.audioContext.createOscillator();
      this.oscNode.type = 'triangle';
      this.oscNode.frequency.setValueAtTime(220, this.audioContext.currentTime);

      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime);

      // Connect: Oscillator -> Gain -> Destination & Analyser
      this.oscNode.connect(this.gainNode);
      this.gainNode.connect(destination);

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.gainNode.connect(this.analyser);

      this.oscNode.start();

      this.stream = destination.stream;
      this.setupMediaRecorder(this.stream);

      this.mediaRecorder?.start(200);
      this.isRecording = true;
      this.isPaused = false;
      this.isAutoPausedBySilence = false;

      this.startSimulatedAmplitudeMonitoring();
      return true;
    } catch (err) {
      console.error('Failed to start simulated audio generator:', err);
      return false;
    }
  }

  private setupMediaRecorder(stream: MediaStream) {
    const mimeTypes = ['audio/webm', 'audio/mp4', 'audio/ogg', ''];
    let selectedMime = '';
    for (const m of mimeTypes) {
      if (!m || MediaRecorder.isTypeSupported(m)) {
        selectedMime = m;
        break;
      }
    }

    this.mediaRecorder = selectedMime
      ? new MediaRecorder(stream, { mimeType: selectedMime })
      : new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.chunks.push(e.data);
      }
    };
  }

  private setupAudioContext(stream: MediaStream) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new AudioCtx();
    const source = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    source.connect(this.analyser);
  }

  private startAmplitudeMonitoring() {
    if (!this.analyser) return;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const update = () => {
      if (!this.isRecording) return;
      this.analyser?.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      const normalized = Math.min(98, Math.max(15, Math.round((avg / 128) * 85 + 15)));
      const isSilent = avg < 8;

      if (this.onAmplitudeCallback) {
        this.onAmplitudeCallback(normalized, isSilent);
      }

      this.animFrameId = requestAnimationFrame(update);
    };

    this.animFrameId = requestAnimationFrame(update);
  }

  private startSimulatedAmplitudeMonitoring() {
    let tick = 0;
    const update = () => {
      if (!this.isRecording) return;
      tick++;

      // Dynamic voice-like wave simulation
      const base = 40 + Math.sin(tick * 0.1) * 30 + Math.cos(tick * 0.05) * 15;
      const isSilent = tick % 120 > 95; // periodic silence pause for VAD testing
      const amp = isSilent ? 15 : Math.min(95, Math.max(20, Math.round(base)));

      if (this.gainNode && this.audioContext) {
        this.gainNode.gain.setValueAtTime(isSilent ? 0 : 0.08, this.audioContext.currentTime);
      }

      if (this.onAmplitudeCallback) {
        this.onAmplitudeCallback(amp, isSilent);
      }

      this.animFrameId = requestAnimationFrame(update);
    };

    this.animFrameId = requestAnimationFrame(update);
  }

  pause() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      this.isPaused = true;
    }
  }

  resume() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      this.isPaused = false;
      this.isAutoPausedBySilence = false;
    }
  }

  stop(): Promise<{ blob: Blob; mimeType: string } | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        this.cleanup();
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const blob = new Blob(this.chunks, { type: mimeType });
        this.cleanup();
        resolve({ blob, mimeType });
      };

      this.mediaRecorder.stop();
    });
  }

  cancel() {
    this.cleanup();
  }

  private cleanup() {
    this.isRecording = false;
    this.isPaused = false;
    this.isAutoPausedBySilence = false;

    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.oscNode) {
      try {
        this.oscNode.stop();
        this.oscNode.disconnect();
      } catch {}
      this.oscNode = null;
    }

    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {}
      this.gainNode = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }

    this.mediaRecorder = null;
    this.chunks = [];
  }
}
