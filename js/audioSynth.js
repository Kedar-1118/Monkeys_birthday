/**
 * audioSynth.js
 * Browser-native Web Audio API synthesizer for romantic UI micro-interactions
 * and simulated ambient romantic music when no MP3 file is present.
 */

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMelodyPlaying = false;
    this.melodyTimer = null;
    this.melodyStep = 0;
  }

  // Initialize AudioContext upon first user interaction
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft tactile UI click
  playClick() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      console.warn("Synth click error:", e);
    }
  }

  // Correct answer celestial sparkle
  playCorrect() {
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);

        gain.gain.setValueAtTime(0.08, this.ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.09 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.09);
        osc.stop(this.ctx.currentTime + idx * 0.09 + 0.4);
      });
    } catch (e) {
      console.warn("Synth correct error:", e);
    }
  }

  // Gentle soft boop for wrong answer
  playWrong() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {
      console.warn("Synth wrong error:", e);
    }
  }

  // Unlock chime cascade (major pentatonic bells)
  playUnlockChime() {
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [392.00, 440.00, 523.25, 659.25, 783.99, 880.00, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.12 + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.12);
        osc.stop(this.ctx.currentTime + idx * 0.12 + 0.8);
      });
    } catch (e) {
      console.warn("Synth unlock error:", e);
    }
  }

  // Romantic ambient background music synth (gentle piano-like arpeggio in D Major)
  startRomanticAmbient() {
    this.init();
    if (!this.ctx || this.isMelodyPlaying) return;
    this.isMelodyPlaying = true;

    // Dmaj9 / Gmaj7 romantic chord progression notes
    const chords = [
      [293.66, 369.99, 440.00, 554.37], // D, F#, A, C#
      [246.94, 329.63, 392.00, 493.88], // B, E, G, B
      [196.00, 293.66, 369.99, 440.00], // G, D, F#, A
      [220.00, 277.18, 329.63, 440.00]  // A, C#, E, A
    ];

    let chordIdx = 0;
    let noteIdx = 0;

    const playNextNote = () => {
      if (!this.isMelodyPlaying) return;
      try {
        const currentChord = chords[chordIdx];
        const freq = currentChord[noteIdx];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Soft, gentle piano decay
        gain.gain.setValueAtTime(0.045, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0005, this.ctx.currentTime + 1.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 1.4);

        noteIdx++;
        if (noteIdx >= currentChord.length) {
          noteIdx = 0;
          chordIdx = (chordIdx + 1) % chords.length;
        }

        this.melodyTimer = setTimeout(playNextNote, 600);
      } catch (e) {
        console.warn("Ambient synth note error:", e);
      }
    };

    playNextNote();
  }

  stopRomanticAmbient() {
    this.isMelodyPlaying = false;
    if (this.melodyTimer) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }
  }
}

export const synth = new AudioSynthesizer();
