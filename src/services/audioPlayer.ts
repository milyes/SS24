export class AudioPlayerManager {
  private audioElement: HTMLAudioElement | null = null;
  private onEndCallback?: () => void;
  private onTimeUpdateCallback?: (currentTime: number, duration: number) => void;
  public isPlaying = false;
  public playbackSpeed = 1.0;

  constructor() {
    this.audioElement = new Audio();
    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      if (this.onEndCallback) this.onEndCallback();
    });
    this.audioElement.addEventListener('timeupdate', () => {
      if (this.audioElement && this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(
          this.audioElement.currentTime,
          this.audioElement.duration || 0
        );
      }
    });
  }

  play(
    url: string,
    speed: number = 1.0,
    onEnd?: () => void,
    onTimeUpdate?: (currentTime: number, duration: number) => void
  ): boolean {
    if (!this.audioElement) return false;
    this.onEndCallback = onEnd;
    this.onTimeUpdateCallback = onTimeUpdate;
    this.playbackSpeed = speed;

    this.audioElement.src = url;
    this.audioElement.playbackRate = speed;
    this.audioElement.currentTime = 0;

    this.audioElement
      .play()
      .then(() => {
        this.isPlaying = true;
      })
      .catch((err) => {
        console.warn('Playback error (possibly no direct audio track or user gesture needed):', err);
        this.isPlaying = true; // Fallback to simulated playback in component
      });

    return true;
  }

  pause() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.isPlaying = false;
  }

  resume() {
    if (this.audioElement) {
      this.audioElement.playbackRate = this.playbackSpeed;
      this.audioElement.play().catch(() => {});
      this.isPlaying = true;
    }
  }

  stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.isPlaying = false;
  }

  seekTo(seconds: number) {
    if (this.audioElement && !isNaN(seconds)) {
      this.audioElement.currentTime = seconds;
    }
  }

  setSpeed(speed: number) {
    this.playbackSpeed = speed;
    if (this.audioElement) {
      this.audioElement.playbackRate = speed;
    }
  }

  getCurrentTime(): number {
    return this.audioElement ? this.audioElement.currentTime : 0;
  }
}
