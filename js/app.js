/**
 * app.js
 * Master application orchestrator and stage coordinator
 */

import { ParticleSystem } from './particles.js';
import { CountdownManager } from './countdown.js';
import { StoryManager } from './story.js';
import { MusicPlayer } from './music.js';
import { QuizManager } from './quiz.js';
import { FinalRevealManager } from './finalReveal.js';

class App {
  constructor() {
    this.currentScreenId = 'screen-countdown';
    this.screens = {
      countdown: document.getElementById('screen-countdown'),
      story: document.getElementById('screen-story'),
      song: document.getElementById('screen-song'),
      quiz: document.getElementById('screen-quiz'),
      reveal: document.getElementById('screen-reveal')
    };

    this.progressNav = document.getElementById('global-progress');
    this.progressFill = document.getElementById('progress-fill');
    this.progressDots = document.querySelectorAll('.step-dot');

    this.init();
  }

  init() {
    // 1. Initialize ambient starfield canvas
    this.particles = new ParticleSystem('particles-canvas');

    // 2. Initialize screen managers
    this.countdownMgr = new CountdownManager(() => this.goToScreen('story'));
    this.storyMgr = new StoryManager(() => this.goToScreen('song'));
    this.musicMgr = new MusicPlayer(() => this.goToScreen('quiz'));
    this.quizMgr = new QuizManager(() => this.goToScreen('reveal'));
    this.revealMgr = new FinalRevealManager(() => this.goToScreen('story'));

    // 3. Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  goToScreen(screenKey) {
    const targetScreen = this.screens[screenKey];
    if (!targetScreen) return;

    // Remove active class from all screens
    Object.values(this.screens).forEach(screen => {
      if (screen) screen.classList.remove('active');
    });

    // Activate selected screen
    targetScreen.classList.add('active');
    this.currentScreenId = targetScreen.id;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update global progress indicator
    this.updateProgress(screenKey);

    // Trigger screen-specific hooks
    if (screenKey === 'reveal') {
      this.revealMgr.startSequence();
    } else {
      this.revealMgr.stopCelebration();
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  updateProgress(screenKey) {
    if (screenKey === 'countdown') {
      if (this.progressNav) this.progressNav.hidden = true;
      return;
    }

    if (this.progressNav) this.progressNav.hidden = false;

    const screenStepMap = {
      story: { step: 1, percent: 25 },
      song: { step: 2, percent: 50 },
      quiz: { step: 3, percent: 75 },
      reveal: { step: 4, percent: 100 }
    };

    const info = screenStepMap[screenKey];
    if (info) {
      if (this.progressFill) this.progressFill.style.width = `${info.percent}%`;
      this.progressDots.forEach(dot => {
        const stepNum = parseInt(dot.dataset.step, 10);
        if (stepNum <= info.step) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.__ROMANTIC_APP__ = new App();
});
