# 🐒 Romantic Birthday Surprise Website ✨

A cinematic, interactive, romantic birthday experience built for your girlfriend.

---

## 🌟 Features & Journey

1. **Screen 1 — The Mystery Intro & Countdown:**
   - Dark cinematic screen with typewriter intro: *"Hey, {NICKNAME}... I made something for you..."*
   - Real-time countdown timer with timezone support (`Asia/Kolkata`).
   - Smooth unlock animation with light bloom burst, chime, and *"START OUR STORY ❤️"* trigger when the countdown reaches zero.

2. **Screen 2 — Our Story (Cinematic Chapters):**
   - 5 custom chapters created specifically from your real photos:
     - **Chapter 1:** *"Where It All Began"* (A WhatsApp Chat & That First Smile)
     - **Chapter 2:** *"Movie Dates & Neon Nights"* (Cinema Hall under the neon lights)
     - **Chapter 3:** *"Winding Roads & Wild Wind"* (Scenic road trip through green hills)
     - **Chapter 4:** *"Our Quiet Sanctuary"* (Candid tender cuddle)
     - **Chapter 5:** *"Sun-Kissed & Radiant"* (Golden sunlight & sweet bindi)
   - Smooth scale/blur transitions and pagination dots.
   - Story climax dialog that leads into the music experience.

3. **Screen 3 — Our Song (Soundtrack Experience):**
   - Vinyl record spinning animation with glowing neon album art.
   - Song title: *"Love Me Like You Do"* (The Soundtrack of Us).
   - Play/pause controls, interactive scrubber, and romantic waveform visualizer.
   - Timed lyric/memory toast messages popping up at moments during playback.
   - Built-in Web Audio API romantic melody synth fallback if an MP3 file is absent.

4. **Screen 4 — The Memory Game (Relationship Quiz):**
   - Playful multiple-choice questions with custom feedback.
   - Question 1 customized with your note: *"We are yet to get our perfect date, but we have endless memories ❤️"*.
   - Confetti and heart bursts on correct answers.
   - Real-time score tracking and personalized tier messages.

5. **Screen 5 — The Final Birthday Reveal:**
   - Cinematic fade-to-black transition.
   - Glowing gold & rose title: *"Happy Birthday, Ravuu ❤️"*.
   - Radiant sun-kissed birthday photo portrait.
   - Line-by-line letter typewriter reveal.
   - Celebration canvas with fireworks and floating glowing hearts.
   - **Secret Easter Egg:** Click the subtle star in the bottom right corner to reveal a secret intimate message!

---

## 📁 Folder Structure

```
Monkeys_birthday/
├── index.html            # Main web page
├── config.js             # ⚡ SINGLE CONFIGURATION FILE (edit all content here!)
├── package.json          # Dev dependencies (Vite)
├── README.md             # This guide
├── css/
│   ├── main.css          # Design system, dark romance palette, typography
│   ├── animations.css    # Keyframe animations (pulse, stardust, light burst)
│   ├── components.css    # Buttons, cards, progress track, dialogs
│   └── screens.css       # Layouts and mobile responsiveness for all 5 screens
├── js/
│   ├── app.js            # App coordinator & screen navigation
│   ├── particles.js      # Canvas starfield & ambient stardust system
│   ├── countdown.js      # Countdown engine & unlock sequence
│   ├── story.js          # Story carousel & transitions
│   ├── music.js          # Music player & waveform visualizer
│   ├── quiz.js           # Relationship quiz & confetti
│   ├── finalReveal.js    # Birthday reveal, line-by-line letter & fireworks
│   └── audioSynth.js     # Web Audio API sound synthesizer
└── assets/
    ├── photos/           # 1.jpeg, 2.jpeg, 3.jpeg, 4.jpeg, 5.jpeg, final.jpg, music-cover.jpg
    ├── audio/            # our-song.mp3
    └── video/            # final-video.mp4 (optional)
```

---

## 🛠️ How to Customize

All content is managed in **`config.js`**:

- **Names & Nicknames:** Edit `herName` and `herNickname`.
- **Target Birthday Date:** Edit `birthday.targetDate` (format: `"YYYY-MM-DDTHH:MM:SS"`) and `birthday.timezone`.
- **Instant Unlock / Test:** Set `birthday.previewUnlock: true` in `config.js` if you want to bypass the countdown while testing.
- **Photos:** Put pictures inside `assets/photos/`.
- **Song Audio:** Place your MP3 inside `assets/audio/our-song.mp3` or update `music.audioFile` in `config.js`.
- **Quiz Questions:** Add or edit questions and answers in `quiz.questions`.
- **Birthday Letter:** Edit lines in `finalReveal.letterLines`.
- **Secret Easter Egg:** Edit `finalReveal.easterEgg.message`.

---

## 🚀 How to Run Locally

```bash
# Install dependencies
npm install

# Start local server
npm run dev
```

Open `http://localhost:5173/` in your browser (or on your phone connected to the same Wi-Fi using the Network address printed by Vite).

---

## 🌐 How to Deploy (Static Hosting)

This website uses pure modern static HTML/CSS/JS and can be hosted for free on:
- **Vercel:** Drag & drop the project folder or import via Git.
- **Netlify:** Drag & drop the project folder.
- **GitHub Pages:** Push the repository and enable GitHub Pages under Settings > Pages.
