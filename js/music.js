/**
 * music.js
 * Romantic music player with interactive vinyl animation, waveform visualizer,
 * timed lyric/memory toasts, and Web Audio API fallback.
 */

import { CONFIG } from '../config.js';
import { synth } from './audioSynth.js';

export class MusicPlayer {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.audio = document.getElementById('bg-audio');
    this.isPlaying = false;
    this.simulatedTime = 0;
    this.simulatedDuration = 90; // 1:30 min default duration
    this.isUsingSynthFallback = false;
    this.timerInterval = null;

    // DOM Elements
    this.headingEl = document.getElementById('song-heading');
    this.subheadingEl = document.getElementById('song-subheading');
    this.songTitleEl = document.getElementById('music-song-title');
    this.artistNameEl = document.getElementById('music-artist-name');
    this.coverImg = document.getElementById('music-cover-img');
    this.vinylDisc = document.getElementById('vinyl-disc');
    this.playBtn = document.getElementById('btn-play-pause');
    this.playIcon = document.getElementById('play-pause-icon');
    this.rewindBtn = document.getElementById('btn-rewind');
    this.forwardBtn = document.getElementById('btn-forward');

    this.currentTimeEl = document.getElementById('music-current-time');
    this.durationEl = document.getElementById('music-duration');
    this.progressContainer = document.getElementById('music-progress-container');
    this.progressBar = document.getElementById('music-progress-bar');
    this.waveformCanvas = document.getElementById('waveform-canvas');
    this.statusNotice = document.getElementById('audio-status-notice');

    this.lyricsBubble = document.getElementById('lyrics-bubble');
    this.lyricsText = document.getElementById('lyrics-text');

    this.bottomMsgEl = document.getElementById('music-bottom-message');
    this.btnToQuiz = document.getElementById('btn-song-to-quiz');
    this.btnToQuizText = document.getElementById('btn-song-to-quiz-text');

    // Visualizer variables
    this.waveformCtx = this.waveformCanvas ? this.waveformCanvas.getContext('2d') : null;
    this.wavePhase = 0;

    this.init();
  }

  init() {
    this.setupContent();
    this.setupAudio();
    this.setupEvents();
    this.startWaveformVisualizer();
  }

  setupContent() {
    const musicCfg = CONFIG.music;
    if (this.headingEl) this.headingEl.textContent = musicCfg.heading || "Our Song";
    if (this.subheadingEl) this.subheadingEl.textContent = musicCfg.subheading || "Some songs sound different once they become ours.";
    if (this.songTitleEl) this.songTitleEl.textContent = musicCfg.title || "Our Special Melody";
    if (this.artistNameEl) this.artistNameEl.textContent = musicCfg.artist || "The Soundtrack of Us";
    if (this.bottomMsgEl) this.bottomMsgEl.textContent = musicCfg.bottomMessage || "I could stay here with you forever...";
    if (this.btnToQuizText) this.btnToQuizText.textContent = musicCfg.buttonText || "CONTINUE TO THE GAME →";

    // Set cover image with SVG fallback
    const fallbackCover = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="%231a0e28"/><circle cx="150" cy="150" r="60" fill="%23ff6b95" opacity="0.4"/><text x="50%" y="50%" fill="%23fff" font-family="sans-serif" font-size="14" text-anchor="middle" dy=".3em">🎵 Our Song</text></svg>`;
    
    if (this.coverImg) {
      this.coverImg.src = musicCfg.coverArt || fallbackCover;
      this.coverImg.onerror = () => {
        this.coverImg.src = fallbackCover;
      };
    }
  }

  setupAudio() {
    if (!this.audio) return;
    this.audio.src = CONFIG.music.audioFile || "";

    this.audio.addEventListener('loadedmetadata', () => {
      this.isUsingSynthFallback = false;
      this.updateDurationDisplay(this.audio.duration);
      if (this.statusNotice) this.statusNotice.textContent = "✨ Playing Audio Track";
    });

    this.audio.addEventListener('error', () => {
      // Graceful fallback to ambient synthesizer
      this.isUsingSynthFallback = true;
      this.updateDurationDisplay(this.simulatedDuration);
      if (this.statusNotice) this.statusNotice.textContent = "✨ Ambient Romantic Melody Active";
    });

    this.audio.addEventListener('timeupdate', () => {
      if (!this.isUsingSynthFallback) {
        this.onTimeUpdate(this.audio.currentTime, this.audio.duration);
      }
    });

    this.audio.addEventListener('ended', () => {
      this.pause();
    });
  }

  setupEvents() {
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => {
        synth.playClick();
        this.togglePlay();
      });
    }

    if (this.rewindBtn) {
      this.rewindBtn.addEventListener('click', () => {
        synth.playClick();
        this.seekRelative(-10);
      });
    }

    if (this.forwardBtn) {
      this.forwardBtn.addEventListener('click', () => {
        synth.playClick();
        this.seekRelative(10);
      });
    }

    if (this.progressContainer) {
      this.progressContainer.addEventListener('click', (e) => {
        const rect = this.progressContainer.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.seekPercent(percent);
      });
    }

    if (this.btnToQuiz) {
      this.btnToQuiz.addEventListener('click', () => {
        synth.playClick();
        this.pause();
        if (typeof this.onComplete === 'function') {
          this.onComplete();
        }
      });
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.isPlaying = true;
    this.updatePlayStateUI(true);

    if (!this.isUsingSynthFallback && this.audio && this.audio.src) {
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser policy blocks file or audio fails, switch seamlessly to synth!
          this.isUsingSynthFallback = true;
          synth.startRomanticAmbient();
          this.startSimulatedTimer();
        });
      }
    } else {
      this.isUsingSynthFallback = true;
      synth.startRomanticAmbient();
      this.startSimulatedTimer();
    }
  }

  pause() {
    this.isPlaying = false;
    this.updatePlayStateUI(false);

    if (this.audio) {
      this.audio.pause();
    }
    synth.stopRomanticAmbient();

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  startSimulatedTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (!this.isPlaying) return;
      this.simulatedTime += 0.5;
      if (this.simulatedTime >= this.simulatedDuration) {
        this.simulatedTime = 0;
      }
      this.onTimeUpdate(this.simulatedTime, this.simulatedDuration);
    }, 500);
  }

  seekRelative(delta) {
    if (this.isUsingSynthFallback) {
      this.simulatedTime = Math.max(0, Math.min(this.simulatedDuration, this.simulatedTime + delta));
      this.onTimeUpdate(this.simulatedTime, this.simulatedDuration);
    } else if (this.audio) {
      this.audio.currentTime = Math.max(0, Math.min(this.audio.duration || 0, this.audio.currentTime + delta));
    }
  }

  seekPercent(percent) {
    if (this.isUsingSynthFallback) {
      this.simulatedTime = percent * this.simulatedDuration;
      this.onTimeUpdate(this.simulatedTime, this.simulatedDuration);
    } else if (this.audio && this.audio.duration) {
      this.audio.currentTime = percent * this.audio.duration;
    }
  }

  onTimeUpdate(current, total) {
    if (!total || isNaN(total)) total = this.simulatedDuration;
    const percent = Math.min(100, (current / total) * 100);

    if (this.progressBar) {
      this.progressBar.style.width = `${percent}%`;
    }
    if (this.currentTimeEl) {
      this.currentTimeEl.textContent = this.formatTime(current);
    }

    // Check timed lyric moments
    this.checkTimedMoments(current);
  }

  checkTimedMoments(currentSeconds) {
    const moments = CONFIG.music.lyricsMoments || [];
    const activeMoment = moments.find(m => Math.abs(currentSeconds - m.time) < 4);

    if (activeMoment) {
      if (this.lyricsText && this.lyricsText.textContent !== activeMoment.message) {
        this.lyricsText.textContent = activeMoment.message;
        if (this.lyricsBubble) {
          this.lyricsBubble.style.borderColor = 'var(--accent-rose)';
          this.lyricsBubble.style.background = 'rgba(255, 107, 149, 0.25)';
        }
      }
    }
  }

  updatePlayStateUI(isPlaying) {
    if (this.vinylDisc) {
      if (isPlaying) {
        this.vinylDisc.classList.add('playing');
        this.vinylDisc.classList.remove('paused');
      } else {
        this.vinylDisc.classList.add('paused');
      }
    }

    if (this.playIcon) {
      this.playIcon.setAttribute('data-lucide', isPlaying ? 'pause' : 'play');
      if (window.lucide) window.lucide.createIcons();
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  updateDurationDisplay(duration) {
    if (this.durationEl) {
      this.durationEl.textContent = this.formatTime(duration);
    }
  }

  // Waveform visualization
  startWaveformVisualizer() {
    if (!this.waveformCtx) return;

    const draw = () => {
      const w = this.waveformCanvas.width;
      const h = this.waveformCanvas.height;
      this.waveformCtx.clearRect(0, 0, w, h);

      const bars = 36;
      const barWidth = w / bars - 2;

      for (let i = 0; i < bars; i++) {
        // Generate gentle romantic sine waves if playing, flat if paused
        let heightMultiplier = 0.2;
        if (this.isPlaying) {
          heightMultiplier = 0.3 + 0.5 * Math.abs(Math.sin(this.wavePhase + i * 0.35) * Math.cos(this.wavePhase * 0.5 + i * 0.2));
        }

        const barHeight = Math.max(4, h * heightMultiplier);
        const x = i * (barWidth + 2);
        const y = (h - barHeight) / 2;

        const grad = this.waveformCtx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#ff6b95');
        grad.addColorStop(1, '#c084fc');

        this.waveformCtx.fillStyle = grad;
        this.waveformCtx.beginPath();
        this.waveformCtx.roundRect(x, y, barWidth, barHeight, 2);
        this.waveformCtx.fill();
      }

      if (this.isPlaying) {
        this.wavePhase += 0.08;
      }

      requestAnimationFrame(draw);
    };

    draw();
  }
}
