/**
 * particles.js
 * High performance, canvas-based ambient starfield and floating romantic stardust
 */

export class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.stars = [];
    this.width = 0;
    this.height = 0;
    this.animationFrameId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.createStars(90);
    this.createFloatingDust(40);
    this.start();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createStars(count) {
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.4 + 0.3,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        color: Math.random() > 0.4 ? '255, 255, 255' : '255, 200, 220'
      });
    }
  }

  createFloatingDust(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2.5 + 0.8,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.45 - 0.1, // Gently floating upwards
        alpha: Math.random() * 0.5 + 0.15,
        baseAlpha: Math.random() * 0.5 + 0.15,
        color: Math.random() > 0.5 ? '255, 107, 149' : '177, 140, 254' // Rose or lavender
      });
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw subtle ambient radial glow in background
    const gradient = this.ctx.createRadialGradient(
      this.width * 0.5, this.height * 0.4, 10,
      this.width * 0.5, this.height * 0.4, this.width * 0.75
    );
    gradient.addColorStop(0, 'rgba(28, 16, 48, 0.4)');
    gradient.addColorStop(0.6, 'rgba(15, 10, 26, 0.2)');
    gradient.addColorStop(1, 'rgba(6, 5, 11, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 2. Draw & twinkle stars
    for (const star of this.stars) {
      star.alpha += star.twinkleSpeed * star.twinkleDir;
      if (star.alpha > 0.9) {
        star.alpha = 0.9;
        star.twinkleDir = -1;
      } else if (star.alpha < 0.15) {
        star.alpha = 0.15;
        star.twinkleDir = 1;
      }

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${star.color}, ${star.alpha})`;
      this.ctx.fill();
    }

    // 3. Draw & drift romantic stardust
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around bounds seamlessly
      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = `rgba(${p.color}, 0.6)`;
      this.ctx.fill();
      this.ctx.shadowBlur = 0; // reset
    }

    this.animationFrameId = requestAnimationFrame(() => this.render());
  }

  start() {
    if (!this.animationFrameId) {
      this.render();
    }
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
