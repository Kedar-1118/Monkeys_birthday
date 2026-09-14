/**
 * story.js
 * Cinematic chapter carousel with smooth blur/scale transitions,
 * dynamic pagination, graceful image fallbacks, and emotional story climax dialog.
 */

import { CONFIG } from '../config.js';
import { synth } from './audioSynth.js';

export class StoryManager {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.currentIndex = 0;
    this.chapters = CONFIG.story.chapters || [];

    // DOM Elements
    this.container = document.getElementById('story-card-container');
    this.currentNumEl = document.getElementById('chapter-current-num');
    this.totalNumEl = document.getElementById('chapter-total-num');
    this.headingEl = document.getElementById('story-heading');
    this.subheadingEl = document.getElementById('story-subheading');

    this.btnPrev = document.getElementById('btn-story-prev');
    this.btnNext = document.getElementById('btn-story-next');
    this.dotsContainer = document.getElementById('story-dots');

    this.endDialog = document.getElementById('story-end-dialog');
    this.endLine1 = document.getElementById('story-end-line1');
    this.endLine2 = document.getElementById('story-end-line2');
    this.endPrompt = document.getElementById('story-end-prompt');
    this.btnContinueSong = document.getElementById('btn-story-continue-song');
    this.btnContinueText = document.getElementById('btn-story-continue-text');

    this.init();
  }

  init() {
    this.setupHeaders();
    this.renderChapters();
    this.renderDots();
    this.setupEvents();
    this.updateView(0);
  }

  setupHeaders() {
    if (this.headingEl) this.headingEl.textContent = CONFIG.story.heading || "Our Story";
    if (this.subheadingEl) this.subheadingEl.textContent = CONFIG.story.subheading || "Every love story has a beginning.";
    if (this.totalNumEl) this.totalNumEl.textContent = String(this.chapters.length).padStart(2, '0');

    if (CONFIG.story.storyEnd) {
      if (this.endLine1) this.endLine1.textContent = CONFIG.story.storyEnd.line1 || "And somehow...";
      if (this.endLine2) this.endLine2.textContent = CONFIG.story.storyEnd.line2 || "You became my favorite part of every day.";
      if (this.endPrompt) this.endPrompt.textContent = CONFIG.story.storyEnd.transitionPrompt || "Every story needs a soundtrack.";
      if (this.btnContinueText) this.btnContinueText.textContent = CONFIG.story.storyEnd.buttonText || "CONTINUE 🎵";
    }
  }

  renderChapters() {
    if (!this.container) return;
    this.container.innerHTML = '';

    this.chapters.forEach((chapter, idx) => {
      const card = document.createElement('article');
      card.className = `story-card glass-card ${idx === 0 ? 'active' : ''}`;
      card.dataset.index = idx;

      // Fallback SVG illustration in case image fails to load
      const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%231a102a"/><circle cx="300" cy="200" r="80" fill="%23ff6b95" opacity="0.3"/><text x="50%" y="50%" fill="%23f8f6fc" font-family="sans-serif" font-size="20" text-anchor="middle" dy=".3em">✨ Cherished Memory ✨</text></svg>`;

      card.innerHTML = `
        <div class="story-media-frame">
          <img src="${chapter.image}" alt="${chapter.imageAlt || chapter.title}" class="story-img" onerror="this.onerror=null; this.src='${fallbackSvg}';">
          <div class="story-meta-badge">${chapter.date} • ${chapter.location}</div>
        </div>
        <div class="story-text-box">
          <h2 class="story-title">${chapter.title}</h2>
          <div class="story-date-loc">
            <span>📅 ${chapter.date}</span>
            <span>📍 ${chapter.location}</span>
          </div>
          <p class="story-body">${chapter.text}</p>
        </div>
      `;

      this.container.appendChild(card);
    });
  }

  renderDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';

    this.chapters.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `story-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to memory ${idx + 1}`);
      dot.addEventListener('click', () => {
        synth.playClick();
        this.goToChapter(idx);
      });
      this.dotsContainer.appendChild(dot);
    });
  }

  setupEvents() {
    if (this.btnPrev) {
      this.btnPrev.addEventListener('click', () => {
        synth.playClick();
        this.prevChapter();
      });
    }

    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => {
        synth.playClick();
        this.nextChapter();
      });
    }

    if (this.btnContinueSong) {
      this.btnContinueSong.addEventListener('click', () => {
        synth.playClick();
        if (this.endDialog) this.endDialog.hidden = true;
        if (typeof this.onComplete === 'function') {
          this.onComplete();
        }
      });
    }
  }

  goToChapter(index) {
    if (index < 0 || index >= this.chapters.length) return;
    this.currentIndex = index;
    this.updateView(index);
  }

  nextChapter() {
    if (this.currentIndex < this.chapters.length - 1) {
      this.goToChapter(this.currentIndex + 1);
    } else {
      // Reached the end of story chapters! Show climax dialog
      this.showStoryEnd();
    }
  }

  prevChapter() {
    if (this.currentIndex > 0) {
      this.goToChapter(this.currentIndex - 1);
    }
  }

  updateView(index) {
    if (this.currentNumEl) {
      this.currentNumEl.textContent = String(index + 1).padStart(2, '0');
    }

    // Toggle previous button state
    if (this.btnPrev) {
      this.btnPrev.disabled = index === 0;
    }

    // Update next button label for last slide
    if (this.btnNext) {
      const isLast = index === this.chapters.length - 1;
      this.btnNext.querySelector('span').textContent = isLast ? "COMPLETE STORY ❤️" : "NEXT MEMORY";
    }

    // Animate cards
    const cards = this.container.querySelectorAll('.story-card');
    cards.forEach((card, idx) => {
      if (idx === index) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Update dot indicators
    const dots = this.dotsContainer.querySelectorAll('.story-dot');
    dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  showStoryEnd() {
    if (this.endDialog) {
      this.endDialog.hidden = false;
      // Re-initialize Lucide icons in case dynamic DOM changed
      if (window.lucide) window.lucide.createIcons();
    }
  }
}
