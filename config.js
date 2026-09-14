/**
 * ===================================================================
 * ROMANTIC BIRTHDAY SURPRISE - CONFIGURATION FILE
 * ===================================================================
 * 
 * Edit this file to customize all names, dates, memories, photos,
 * quiz questions, song details, and personal messages!
 * 
 * 💡 TIPS:
 * - Replace photo paths in /assets/photos/ with your girlfriend's pictures.
 * - Replace the audio path in /assets/audio/ with your special song.
 * - Set 'previewUnlock: true' during testing to bypass the countdown timer.
 */

export const CONFIG = {
  // ─── 1. RECIPIENT INFORMATION ──────────────────────────────────────
  herName: "Ravisha",             // Her real name (used in the final birthday reveal)
  herNickname: "Koala ",        // Her cute nickname (used in intro, countdown, etc.)
  partnerName: "Yours Forever",  // Your name or sign-off

  // ─── 2. COUNTDOWN & UNLOCK SETTINGS ────────────────────────────────
  birthday: {
    // Format: "YYYY-MM-DDTHH:MM:SS" (e.g. "2026-10-15T00:00:00")
    targetDate: "2026-09-15T00:00:00",
    
    // Timezone string (e.g., "Asia/Kolkata", "America/New_York", "Europe/London")
    timezone: "Asia/Kolkata",

    // Set to true to test/unlock the website immediately regardless of the date!
    previewUnlock: false,

    // Messages displayed during the cinematic countdown
    introLines: [
      "Hey, Makuuu...",
      "I made something special just for you.",
      "But you're going to have to wait a little bit..."
    ],
    waitSubtext: "Some things are worth waiting for. ❤️",
    unlockedHeading: "✨ SURPRISE UNLOCKED ✨",
    readyPrompt: "Are you ready to begin our story?",
    startButtonText: "START OUR STORY ❤️"
  },

  // ─── 3. SCREEN 2: OUR STORY CHAPTERS ───────────────────────────────
  story: {
    heading: "Our Story",
    subheading: "Every great love story has a beginning.",
    chapters: [
      {
        chapterNumber: "01",
        title: "Where It All Began",
        date: "January 15, 2020",
        location: "A WhatsApp Chat & That First Smile",
        text: "It all started with simple late-night texts, but the moment we met in person, you in that bright yellow shirt, everything changed. Your gentle smile made my whole world stop.",
        image: "assets/photos/1.jpeg",
        imageAlt: "That unforgettable first smile"
      },
      {
        chapterNumber: "02",
        title: "Movie Dates & Neon Nights",
        date: "Our Cinema Escapes",
        location: "Cinema Hall",
        text: "Sitting side-by-side in the dimly lit theater under the neon lights. Half the time I wasn't even watching the movie—I was just smiling, looking over at you, happy to have you right next to me.",
        image: "assets/photos/2.jpeg",
        imageAlt: "Cinema date under neon lights"
      },
      {
        chapterNumber: "03",
        title: "Winding Roads & Wild Wind",
        date: "Road Trips With You",
        location: "Green Hills & Open Roads",
        text: "The cool breeze messing up our hair, roads curving through lush green hills, and nothing but laughter between us. Every road trip with you feels like pure freedom.",
        image: "assets/photos/3.jpeg",
        imageAlt: "Scenic road trip together"
      },
      {
        chapterNumber: "04",
        title: "Our Quiet Sanctuary",
        date: "Every Sweet Cuddle",
        location: "Right In Your Arms",
        text: "Cheeks pressed close, holding you from behind while the rest of the busy world fades away. In those quiet little candid moments, I know I've found my forever home.",
        image: "assets/photos/4.jpeg",
        imageAlt: "Tender hugs and candid love"
      },
      {
        chapterNumber: "05",
        title: "Sun-Kissed & Radiant",
        date: "Golden Hour Memories",
        location: "Under The Warm Sun",
        text: "Golden rays touching your face, that sweet little bindi, and that beautiful smile that can melt any bad day away. You bring so much sunshine into my life, Ravuu.",
        image: "assets/photos/5.jpeg",
        imageAlt: "Sun-kissed smiles together"
      }
    ],
    storyEnd: {
      line1: "And somehow...",
      line2: "You became my favorite part of every single day.",
      transitionPrompt: "Every beautiful story deserves its own soundtrack.",
      buttonText: "CONTINUE TO OUR SONG 🎵"
    }
  },

  // ─── 4. SCREEN 3: OUR SONG EXPERIENCE ──────────────────────────────
  music: {
    heading: "Our Song",
    subheading: "Some songs sound completely different once they become ours.",
    title: "Love Me Like You Do",
    artist: "The Soundtrack of Us",
    audioFile: "assets/audio/our-song.mp3",
    coverArt: "assets/photos/2.jpeg",
    lyricsMoments: [
      { time: 8, message: "This opening melody always reminds me of your smile ✨" },
      { time: 22, message: "Remember when we listened to this on repeat during those long convos at midnight? 🚗💨" },
      { time: 42, message: "If I could pause time in any moment, it would be with you right now ❤️" },
      { time: 65, message: "No song could ever be as beautiful as having you in my life 🎶" }
    ],
    bottomMessage: "I could stay right here with you forever...",
    buttonText: "CONTINUE TO THE GAME →"
  },

  // ─── 5. SCREEN 4: THE MEMORY GAME (RELATIONSHIP QUIZ) ──────────────
  quiz: {
    heading: "Okay... let's see how well you remember us.",
    subheading: "Time to prove you're actually my girlfriend! 😂❤️",
    questions: [
      {
        question: "Where did we have our very first date?",
        options: [
          "The cute cozy coffee shop downtown",
          "A rooftop dinner under the stars",
          "Walk in the botanical park",
          "None of these! We are yet to get our perfect date, but we have endless memories ❤️"
        ],
        correctAnswer: 3,
        correctMessage: "You know us so well! We are yet to get that 'official' picture-perfect date, but every memory we've made is already priceless. ❤️",
        wrongMessage: "None of these is right! We are yet to get our official perfect date, but we have so many unforgettable memories together! 😂❤️"
      },
      {
        question: "Who takes longer to get ready when we go out?",
        options: [
          "Definitely you (by at least 45 minutes)",
          "Me (I'm an over-thinker)",
          "We both take 5 minutes flat",
          "Depends on how good the food is going to be"
        ],
        correctAnswer: 0,
        correctMessage: "Spot on! But hey, perfection takes time and you always look stunning. 🥰",
        wrongMessage: "Haha nice try! You know the truth! 😂"
      },
      {
        question: "What is my absolute favorite thing about you?",
        options: [
          "Your contagious laugh that brightens any room",
          "The way your eyes crinkle when you're truly happy",
          "Your kindness and big beautiful heart",
          "All of the above and a thousand more reasons"
        ],
        correctAnswer: 3,
        correctMessage: "Trick question, because I love every single tiny detail about you. ❤️",
        wrongMessage: "You picked well, but the real answer is truly ALL of the above! ❤️"
      },
      {
        question: "What is our official comfort activity?",
        options: [
          "Ordering food and bingeing shows in oversized hoodies",
          "Getting dressed up for a fancy night out",
          "Arguing for 40 minutes over what to eat",
          "Spontaneous late night drives with loud music"
        ],
        correctAnswer: 0,
        correctMessage: "There is nothing better than cozy couch cuddles and takeout! 🍕🛋️",
        wrongMessage: "Close, but cozy hoodies + delicious food wins every single time! 😋"
      },
      {
        question: "If we could travel anywhere tomorrow, where would we go?",
        options: [
          "A quiet cabin in the misty mountains",
          "A warm tropical beach with turquoise waters",
          "Any place in the world, as long as we're together",
          "To the nearest bakery for dessert"
        ],
        correctAnswer: 2,
        correctMessage: "Anywhere in the world is paradise as long as you're holding my hand. 🌍✨",
        wrongMessage: "A great destination, but anywhere with you is home! ❤️"
      }
    ],
    scoreFeedback: {
      perfect: "5 / 5! Okay, you officially know us better than I do! You passed with flying colors! 🏆❤️",
      good: "Not bad at all! You definitely proved your girlfriend credentials. I'll let you stay! 😂❤️",
      low: "Clearly this is just undeniable proof that we need to make way more memories together! ❤️"
    },
    passedPrompt: "You passed.",
    finalLevelPrompt: "But there's one last surprise waiting...",
    buttonText: "UNLOCK THE FINAL SURPRISE 🔓"
  },

  // ─── 6. SCREEN 5: FINAL BIRTHDAY REVEAL & LETTER ───────────────────
  finalReveal: {
    heading: "Happy Birthday, Ravuu ❤️",
    
    // Media settings: "image" or "video"
    mediaType: "image",
    mediaUrl: "assets/photos/final.jpg",
    mediaAlt: "My favorite picture of you",
    
    // Your personal birthday letter - revealed line by line
    letterLines: [
      "Out of all the people in this entire world,",
      "I am the luckiest person alive that I found you.",
      "",
      "Thank you for all the laughter that makes my cheeks hurt,",
      "for the quiet comfort when the world gets loud,",
      "for your gentle heart, your crazy ideas,",
      "and everything that makes you uniquely you.",
      "",
      "I hope this year brings you all the magic,",
      "the happiness, and the dreams your heart has been holding.",
      "",
      "And I hope I get to stand beside you",
      "for as many of those beautiful moments as possible.",
      "",
      "Happy Birthday, my love."
    ],

    finalLines: {
      line1: "Here's to all the memories we've made...",
      line2: "...and all the ones we haven't made yet.",
      signature: "I love you endlessly. ❤️"
    },

    // ─── 7. SECRET EASTER EGG ─────────────────────────────────────────
    easterEgg: {
      enabled: true,
      hintTooltip: "A secret star just for you... ✨",
      title: "P.S. You thought that was everything?",
      message: "There is still so much more love, laughter, and adventures waiting for us. You are my greatest adventure. Now go give me a huge hug! 🐒❤️✨",
      closeButtonText: "I Love You! 💖"
    }
  },

  // ─── 8. SOUND EFFECTS CONFIGURATION ────────────────────────────────
  audioEffects: {
    enabled: true, // Uses browser Web Audio synthesizer for subtle tactile sounds
    volume: 0.15   // Gentle, non-intrusive volume
  }
};
