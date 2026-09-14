/**
 * quiz.js
 * Interactive relationship quiz with custom feedback, celebratory confetti,
 * audio chime synthesis, and personalized score tiers.
 */

import { CONFIG } from '../config.js';
import { synth } from './audioSynth.js';

export class QuizManager {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.currentIndex = 0;
    this.score = 0;
    this.questions = CONFIG.quiz.questions || [];

    // DOM Elements
    this.headingEl = document.getElementById('quiz-heading');
    this.subheadingEl = document.getElementById('quiz-subheading');
    this.badgeEl = document.getElementById('quiz-badge');
    this.qNumEl = document.getElementById('quiz-q-num');
    this.scoreEl = document.getElementById('quiz-current-score');
    this.questionTextEl = document.getElementById('quiz-question-text');
    this.optionsContainer = document.getElementById('quiz-options-container');

    this.feedbackCard = document.getElementById('quiz-feedback-card');
    this.feedbackIcon = document.getElementById('feedback-icon');
    this.feedbackTitle = document.getElementById('feedback-title');
    this.feedbackMsg = document.getElementById('feedback-message');
    this.btnNextLevel = document.getElementById('btn-quiz-next');

    this.quizCard = document.getElementById('quiz-card');
    this.finishCard = document.getElementById('quiz-finish-card');
    this.finalScoreEl = document.getElementById('quiz-final-score');
    this.scoreFeedbackMsgEl = document.getElementById('quiz-score-message');
    this.passedTextEl = document.getElementById('quiz-passed-text');
    this.finalLevelTextEl = document.getElementById('quiz-final-level-text');
    this.btnUnlockReveal = document.getElementById('btn-unlock-reveal');
    this.btnUnlockText = document.getElementById('btn-unlock-reveal-text');

    this.init();
  }

  init() {
    this.setupHeaders();
    this.setupEvents();
    this.loadQuestion(0);
  }

  setupHeaders() {
    if (this.headingEl) this.headingEl.textContent = CONFIG.quiz.heading || "Okay... let's see how well you remember us.";
    if (this.subheadingEl) this.subheadingEl.textContent = CONFIG.quiz.subheading || "Time to prove you're actually my girlfriend. 😂❤️";
    if (this.passedTextEl) this.passedTextEl.textContent = CONFIG.quiz.passedPrompt || "You passed.";
    if (this.finalLevelTextEl) this.finalLevelTextEl.textContent = CONFIG.quiz.finalLevelPrompt || "But there's one last surprise waiting...";
    if (this.btnUnlockText) this.btnUnlockText.textContent = CONFIG.quiz.buttonText || "UNLOCK THE FINAL SURPRISE 🔓";
  }

  setupEvents() {
    if (this.btnNextLevel) {
      this.btnNextLevel.addEventListener('click', () => {
        synth.playClick();
        this.nextQuestion();
      });
    }

    if (this.btnUnlockReveal) {
      this.btnUnlockReveal.addEventListener('click', () => {
        synth.playClick();
        if (typeof this.onComplete === 'function') {
          this.onComplete();
        }
      });
    }
  }

  loadQuestion(index) {
    if (index >= this.questions.length) {
      this.showFinalScore();
      return;
    }

    const q = this.questions[index];
    this.currentIndex = index;

    if (this.badgeEl) this.badgeEl.textContent = `LEVEL ${index + 1} / ${this.questions.length}`;
    if (this.qNumEl) this.qNumEl.textContent = `QUESTION ${String(index + 1).padStart(2, '0')}`;
    if (this.scoreEl) this.scoreEl.textContent = `Score: ${this.score}`;
    if (this.questionTextEl) this.questionTextEl.textContent = q.question;

    if (this.feedbackCard) this.feedbackCard.hidden = true;

    // Render options
    if (this.optionsContainer) {
      this.optionsContainer.innerHTML = '';

      q.options.forEach((optText, optIdx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.textContent = optText;
        btn.addEventListener('click', () => this.handleAnswer(optIdx));
        this.optionsContainer.appendChild(btn);
      });
    }
  }

  handleAnswer(selectedIndex) {
    const q = this.questions[this.currentIndex];
    const isCorrect = (selectedIndex === q.correctAnswer);

    // Disable all option buttons
    const buttons = this.optionsContainer.querySelectorAll('.quiz-option-btn');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === selectedIndex) {
        btn.classList.add(isCorrect ? 'selected-correct' : 'selected-wrong');
      }
      if (!isCorrect && idx === q.correctAnswer) {
        btn.classList.add('selected-correct');
      }
    });

    if (isCorrect) {
      this.score++;
      if (this.scoreEl) this.scoreEl.textContent = `Score: ${this.score}`;
      synth.playCorrect();
      this.spawnConfetti();

      if (this.feedbackIcon) this.feedbackIcon.textContent = "❤️";
      if (this.feedbackTitle) this.feedbackTitle.textContent = "CORRECT ❤️";
      if (this.feedbackMsg) this.feedbackMsg.textContent = q.correctMessage || "You remembered! ❤️";
    } else {
      synth.playWrong();

      if (this.feedbackIcon) this.feedbackIcon.textContent = "😂";
      if (this.feedbackTitle) this.feedbackTitle.textContent = "Oops 😂";
      if (this.feedbackMsg) this.feedbackMsg.textContent = q.wrongMessage || "Hmm... we need to have a talk! 😂";
    }

    if (this.feedbackCard) {
      this.feedbackCard.hidden = false;
      const isLast = this.currentIndex === this.questions.length - 1;
      this.btnNextLevel.querySelector('span').textContent = isLast ? "View Results 🏆" : "Next Level";
    }
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.loadQuestion(this.currentIndex + 1);
    } else {
      this.showFinalScore();
    }
  }

  showFinalScore() {
    if (this.quizCard) this.quizCard.hidden = true;
    if (this.finishCard) {
      this.finishCard.hidden = false;

      if (this.finalScoreEl) this.finalScoreEl.textContent = String(this.score);

      const total = this.questions.length;
      let feedback = "";
      const feedbacks = CONFIG.quiz.scoreFeedback || {};

      if (this.score === total) {
        feedback = feedbacks.perfect || "5 / 5! Okay, you officially know us better than I do! ❤️";
      } else if (this.score >= Math.ceil(total * 0.6)) {
        feedback = feedbacks.good || "Not bad at all! I'll definitely keep you around. 😂❤️";
      } else {
        feedback = feedbacks.low || "Clearly this is just proof we need to make way more memories together! ❤️";
      }

      if (this.scoreFeedbackMsgEl) this.scoreFeedbackMsgEl.textContent = feedback;
    }
  }

  spawnConfetti() {
    // Micro DOM confetti burst
    const colors = ['#ff6b95', '#b18cfe', '#f6d396', '#ffffff'];
    for (let i = 0; i < 20; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = Math.random() > 0.5 ? '❤️' : '✨';
      heart.style.left = `${Math.random() * 80 + 10}%`;
      heart.style.top = '60%';
      heart.style.fontSize = `${Math.random() * 14 + 14}px`;
      heart.style.color = colors[Math.floor(Math.random() * colors.length)];
      this.quizCard.appendChild(heart);

      setTimeout(() => heart.remove(), 3500);
    }
  }
}
