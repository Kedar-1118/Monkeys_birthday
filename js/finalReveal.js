/**
 * finalReveal.js
 * Dramatic cinematic entrance with screen blackout, line-by-line letter reveal,
 * fireworks and floating hearts celebration canvas, and secret easter egg.
 */

import { CONFIG } from '../config.js';
import { synth } from './audioSynth.js';

export class FinalRevealManager {
  constructor(onReplay) {
    this.onReplay = onReplay;
    this.fireworksCanvas = document.getElementById('fireworks-canvas');
    this.fireworksCtx = this.fireworksCanvas ? this.fireworksCanvas.getContext('2d') : null;
    this.fireworks = [];
    this.isCelebrating = false;
    this.animationId = null;

    // DOM Elements
    this.blackout = document.getElementById('reveal-blackout');
    this.headingEl = document.getElementById('final-heading');
    this.herNameEl = document.getElementById('final-her-name');
    this.photoImg = document.getElementById('final-photo-img');
    this.videoEl = document.getElementById('final-video-el');

    this.letterContent = document.getElementById('letter-content');
    this.closing1 = document.getElementById('final-closing-1');
    this.closing2 = document.getElementById('final-closing-2');
    this.signature = document.getElementById('final-signature');

    this.easterEggTrigger = document.getElementById('easter-egg-trigger');
    this.easterEggModal = document.getElementById('easter-egg-modal');
    this.modalTitle = document.getElementById('modal-title');
    this.modalText = document.getElementById('modal-text');
    this.btnCloseModal = document.getElementById('btn-close-modal');

    this.btnReplay = document.getElementById('btn-replay-experience');

    this.init();
  }

  init() {
    this.setupContent();
    this.setupEasterEgg();
    this.setupReplay();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  setupContent() {
    const herName = CONFIG.herName || "My Love";
    if (this.herNameEl) this.herNameEl.textContent = herName;

    const revealCfg = CONFIG.finalReveal || {};

    // Setup Media
    const fallbackPhoto = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%231b112c"/><circle cx="300" cy="200" r="100" fill="%23ff6b95" opacity="0.35"/><text x="50%" y="50%" fill="%23fff" font-family="sans-serif" font-size="22" text-anchor="middle" dy=".3em">❤️ Happy Birthday ${herName} ❤️</text></svg>`;

    if (revealCfg.mediaType === 'video' && revealCfg.mediaUrl) {
      if (this.photoImg) this.photoImg.hidden = true;
      if (this.videoEl) {
        this.videoEl.hidden = false;
        this.videoEl.src = revealCfg.mediaUrl;
      }
    } else if (this.photoImg) {
      this.photoImg.src = revealCfg.mediaUrl || fallbackPhoto;
      this.photoImg.onerror = () => {
        this.photoImg.src = fallbackPhoto;
      };
    }

    // Setup Final Lines
    if (revealCfg.finalLines) {
      if (this.closing1) this.closing1.textContent = revealCfg.finalLines.line1 || "Here's to all the memories we've made...";
      if (this.closing2) this.closing2.textContent = revealCfg.finalLines.line2 || "...and all the ones we haven't made yet.";
      if (this.signature) this.signature.textContent = revealCfg.finalLines.signature || "I love you. ❤️";
    }
  }

  setupEasterEgg() {
    const eggCfg = (CONFIG.finalReveal && CONFIG.finalReveal.easterEgg) || {};
    if (!eggCfg.enabled && this.easterEggTrigger) {
      this.easterEggTrigger.hidden = true;
      return;
    }

    if (this.easterEggTrigger) {
      this.easterEggTrigger.addEventListener('click', () => {
        synth.playCorrect();
        if (this.modalTitle) this.modalTitle.textContent = eggCfg.title || "P.S. You thought that was everything?";
        if (this.modalText) this.modalText.textContent = eggCfg.message || "There's still so much more I want to do with you.";
        if (this.easterEggModal) this.easterEggModal.hidden = false;
      });
    }

    if (this.btnCloseModal) {
      this.btnCloseModal.addEventListener('click', () => {
        synth.playClick();
        if (this.easterEggModal) this.easterEggModal.hidden = true;
      });
    }
  }

  setupReplay() {
    if (this.btnReplay) {
      this.btnReplay.addEventListener('click', () => {
        synth.playClick();
        if (typeof this.onReplay === 'function') {
          this.onReplay();
        }
      });
    }
  }

  // Trigger cinematic reveal sequence
  startSequence() {
    // 1. Blackout screen
    if (this.blackout) {
      this.blackout.classList.add('active');
    }

    // Play chime
    synth.playUnlockChime();

    // 2. Wait 1.5s then fade blackout out smoothly
    setTimeout(() => {
      if (this.blackout) {
        this.blackout.classList.remove('active');
      }

      // Start celebration fireworks / hearts
      this.startCelebration();

      // 3. Line by line letter reveal
      this.revealLetterLines();
    }, 1500);
  }

  revealLetterLines() {
    if (!this.letterContent) return;
    this.letterContent.innerHTML = '';

    const lines = (CONFIG.finalReveal && CONFIG.finalReveal.letterLines) || [];

    lines.forEach((lineText, idx) => {
      const p = document.createElement('p');
      if (lineText.trim() === '') {
        p.className = 'letter-line empty-space';
      } else {
        p.className = 'letter-line';
        p.textContent = lineText;
      }
      this.letterContent.appendChild(p);

      // Staggered reveal
      setTimeout(() => {
        p.classList.add('visible');
      }, 600 + idx * 750);
    });

    const totalLinesTime = 600 + lines.length * 750;

    // Reveal closing lines
    setTimeout(() => {
      if (this.closing1) this.closing1.classList.add('visible');
    }, totalLinesTime + 600);

    setTimeout(() => {
      if (this.closing2) this.closing2.classList.add('visible');
    }, totalLinesTime + 1800);

    setTimeout(() => {
      if (this.signature) this.signature.classList.add('visible');
      synth.playCorrect();
    }, totalLinesTime + 3000);
  }

  // ─── FIREWORKS & HEARTS CANVAS CELEBRATION ─────────────────────
  resizeCanvas() {
    if (!this.fireworksCanvas) return;
    this.fireworksCanvas.width = window.innerWidth;
    this.fireworksCanvas.height = window.innerHeight;
  }

  startCelebration() {
    if (this.isCelebrating) return;
    this.isCelebrating = true;
    this.fireworks = [];

    // Periodic fireworks rocket launcher
    const launchInterval = setInterval(() => {
      if (!this.isCelebrating) {
        clearInterval(launchInterval);
        return;
      }
      this.launchRocket();
    }, 1200);

    this.renderFireworks();
  }

  launchRocket() {
    if (!this.fireworksCanvas) return;
    const w = this.fireworksCanvas.width;
    const h = this.fireworksCanvas.height;

    const x = Math.random() * (w * 0.7) + (w * 0.15);
    const targetY = Math.random() * (h * 0.4) + (h * 0.1);

    const colors = ['#ff6b95', '#f6d396', '#c084fc', '#ffffff', '#ff94b8'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Create explosion sparks
    const sparkCount = 35;
    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.PI * 2 / sparkCount) * i + (Math.random() * 0.2);
      const speed = Math.random() * 3.5 + 1.5;
      this.fireworks.push({
        x: x,
        y: targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: color,
        decay: Math.random() * 0.015 + 0.01,
        isHeart: Math.random() > 0.6
      });
    }
  }

  renderFireworks() {
    if (!this.fireworksCtx) return;
    this.fireworksCtx.clearRect(0, 0, this.fireworksCanvas.width, this.fireworksCanvas.height);

    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const p = this.fireworks[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04; // gravity
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.fireworks.splice(i, 1);
        continue;
      }

      this.fireworksCtx.save();
      this.fireworksCtx.globalAlpha = p.alpha;
      this.fireworksCtx.fillStyle = p.color;

      if (p.isHeart) {
        this.fireworksCtx.font = "14px sans-serif";
        this.fireworksCtx.fillText("❤️", p.x, p.y);
      } else {
        this.fireworksCtx.beginPath();
        this.fireworksCtx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        this.fireworksCtx.fill();
      }
      this.fireworksCtx.restore();
    }

    if (this.isCelebrating) {
      this.animationId = requestAnimationFrame(() => this.renderFireworks());
    }
  }

  stopCelebration() {
    this.isCelebrating = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.fireworksCtx && this.fireworksCanvas) {
      this.fireworksCtx.clearRect(0, 0, this.fireworksCanvas.width, this.fireworksCanvas.height);
    }
  }
}
