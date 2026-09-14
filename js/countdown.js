/**
 * countdown.js
 * Real-time countdown engine with timezone awareness, typewriter intro lines,
 * and cinematic unlock sequence.
 */

import { CONFIG } from '../config.js';
import { synth } from './audioSynth.js';

export class CountdownManager {
  constructor(onUnlocked) {
    this.onUnlocked = onUnlocked;
    this.timerInterval = null;
    this.isUnlocked = false;

    // DOM Elements
    this.line1El = document.getElementById('intro-line-1');
    this.line2El = document.getElementById('intro-line-2');
    this.line3El = document.getElementById('intro-line-3');

    this.lockedStateEl = document.getElementById('countdown-locked-state');
    this.unlockedStateEl = document.getElementById('countdown-unlocked-state');

    this.daysEl = document.getElementById('timer-days');
    this.hoursEl = document.getElementById('timer-hours');
    this.minutesEl = document.getElementById('timer-minutes');
    this.secondsEl = document.getElementById('timer-seconds');
    this.waitTextEl = document.getElementById('countdown-wait-text');

    this.welcomeTextEl = document.getElementById('welcome-text');
    this.readyPromptEl = document.getElementById('ready-prompt');
    this.btnStart = document.getElementById('btn-start-story');
    this.btnStartText = document.getElementById('btn-start-story-text');

    this.init();
  }

  init() {
    this.setupContent();
    this.startTypewriterIntro();
    this.startCountdown();

    if (this.btnStart) {
      this.btnStart.addEventListener('click', () => {
        synth.playClick();
        if (typeof this.onUnlocked === 'function') {
          this.onUnlocked();
        }
      });
    }
  }

  setupContent() {
    const nickname = CONFIG.herNickname || "My Love";
    if (this.waitTextEl) this.waitTextEl.textContent = CONFIG.birthday.waitSubtext || "Some things are worth waiting for. ❤️";
    if (this.welcomeTextEl) this.welcomeTextEl.textContent = `Welcome, ${nickname}.`;
    if (this.readyPromptEl) this.readyPromptEl.textContent = CONFIG.birthday.readyPrompt || "Are you ready to begin our story?";
    if (this.btnStartText) this.btnStartText.textContent = CONFIG.birthday.startButtonText || "START OUR STORY ❤️";
  }

  // Typewriter / Sequential fade of intro text
  startTypewriterIntro() {
    const nickname = CONFIG.herNickname || "My Love";
    const lines = CONFIG.birthday.introLines || [
      `Hey, ${nickname}...`,
      "I made something for you.",
      "But you're going to have to wait."
    ];

    const processedLines = lines.map(line => line.replace('{NICKNAME}', nickname));

    // Sequence Line 1
    setTimeout(() => {
      if (this.line1El) {
        this.line1El.textContent = processedLines[0];
        this.line1El.classList.add('visible');
      }
    }, 400);

    // Sequence Line 2
    setTimeout(() => {
      if (this.line2El) {
        this.line2El.textContent = processedLines[1];
        this.line2El.classList.add('visible');
      }
    }, 2200);

    // Sequence Line 3
    setTimeout(() => {
      if (this.line3El) {
        this.line3El.textContent = processedLines[2];
        this.line3El.classList.add('visible');
      }
    }, 4000);
  }

  // Compute remaining time taking timezone into account
  getTimeRemaining() {
    const now = new Date();
    // Parse target date string
    const target = new Date(CONFIG.birthday.targetDate);
    
    // Total difference in milliseconds
    const total = target.getTime() - now.getTime();
    
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
      total,
      days: Math.max(0, days),
      hours: Math.max(0, hours),
      minutes: Math.max(0, minutes),
      seconds: Math.max(0, seconds)
    };
  }

  startCountdown() {
    // If preview unlock is explicitly configured, unlock immediately
    if (CONFIG.birthday.previewUnlock) {
      this.triggerUnlock(true);
      return;
    }

    const updateTimer = () => {
      const t = this.getTimeRemaining();

      this.daysEl.textContent = String(t.days).padStart(2, '0');
      this.hoursEl.textContent = String(t.hours).padStart(2, '0');
      this.minutesEl.textContent = String(t.minutes).padStart(2, '0');
      this.secondsEl.textContent = String(t.seconds).padStart(2, '0');

      if (t.total <= 0 && !this.isUnlocked) {
        clearInterval(this.timerInterval);
        this.triggerUnlock(false);
      }
    };

    updateTimer();
    this.timerInterval = setInterval(updateTimer, 1000);
  }

  // Cinematic unlock transition
  triggerUnlock(instant = false) {
    if (this.isUnlocked) return;
    this.isUnlocked = true;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    if (instant) {
      if (this.lockedStateEl) this.lockedStateEl.hidden = true;
      if (this.unlockedStateEl) this.unlockedStateEl.hidden = false;
      return;
    }

    // Set numbers to 00
    this.daysEl.textContent = "00";
    this.hoursEl.textContent = "00";
    this.minutesEl.textContent = "00";
    this.secondsEl.textContent = "00";

    // Play celestial unlock chime
    synth.playUnlockChime();

    // Spawn light burst effect
    const burst = document.createElement('div');
    burst.className = 'light-burst-effect';
    burst.style.top = '50%';
    burst.style.left = '50%';
    burst.style.transform = 'translate(-50%, -50%)';
    this.lockedStateEl.appendChild(burst);

    // Smoothly fade out locked card and fade in unlocked card
    setTimeout(() => {
      this.lockedStateEl.style.opacity = '0';
      this.lockedStateEl.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.lockedStateEl.hidden = true;
        this.unlockedStateEl.hidden = false;
      }, 500);
    }, 1200);
  }

  // Force unlock from preview bar
  forceUnlock() {
    this.triggerUnlock(false);
  }
}
