/* ============================================================
   CONFIGURATION — Edit these values to personalize the website
   ============================================================ */
const CONFIG = {
  // ─── Names ───
  bestFriendName: 'pottiii💕',
  myName: 'Your Best Friend',

  // ─── Birthday Date (ISO format) ───
  birthdayDate: '2026-11-12T00:00:00',

  // ─── Screen 1: Intro Greeting ───
  greeting: 'Hey Bestie 🥹💜',
  greetingSubtext: 'Do you know how special you are to me?',

  // ─── Screen 2: Butterfly Messages ───
  butterflyMessages: [
    'Thanks for always listening to my nonsense 😂',
    'You somehow make boring days fun.',
    'Life is definitely more chaotic with you... but better. 😭😂',
    "Some memories wouldn't exist without you.",
    'You are one of the best things life gave me.',
    'My go-to person for everything. 🫂',
    'You always know how to make me smile. 😊',
  ],

  // ─── Screen 3: Memory Cards ───
  memoriesHeading: 'Your Beautiful Memories 🥹',
  memories: [
    { text: '', photo: 'images/memory1.jpg' },
    { text: '', photo: 'images/memory2.jpg' },
    { text: '', photo: 'images/memory3.jpg' },
    { text: '', photo: 'images/memory4.jpg' },
    { text: '', photo: 'images/memory5.jpg' },
    { text: '', photo: 'images/memory6.jpg' },
  ],

  // ─── Screen 4: Appreciation Messages (Typewriter) ───
  appreciationMessages: [
    'Thank you for being there.',
    'Thank you for understanding my nonsense.',
    'Thank you for making me laugh.',
    'Thank you for listening.',
    'Thank you for all the memories.',
    'And most importantly...',
    'Thank you for being my best friend. 🫂💜',
  ],

  // ─── Screen 5: Funny Cards ───
  funnyCards: [
    { emoji: '😭', text: 'Professional troublemaker' },
    { emoji: '🎭', text: 'Full-time drama creator' },
    { emoji: '😂', text: 'Part-time therapist' },
    { emoji: '🤦‍♂️', text: 'Unlimited nonsense generator' },
    { emoji: '🫡', text: 'Official partner in crime' },
    { emoji: '❤️', text: 'Somehow still my best friend' },
  ],

  // ─── Screen 6: Birthday Wishes ───
  birthdayWishes: [
    'More happiness ✨',
    'More adventures 🌎',
    'More success 🚀',
    'More laughter 😂',
    'More unforgettable memories 📸',
    'And everything you deserve. 💜',
  ],

  // ─── Screen 7: Personal Message ───
  personalMessage: `Life has a funny way of bringing certain people into our lives, and I'm genuinely grateful that it brought you into mine.

We've laughed at the stupidest things, shared countless memories, survived difficult days, and somehow managed to make every ordinary moment memorable.

I don't know what the future will look like, but I hope it gives us many more crazy adventures, random conversations, endless jokes, and unforgettable memories.

No matter how much things change, I'll always be grateful for the friendship we have.

Happy Birthday to the most important person in my life.

Stay healthy.
Stay happy.
And I hope you stay with me forever. 🫂💜`,

  // ─── Screen 8: Final Cinematic Messages ───
  finalMessages: [
    "You're not just a friend...",
    "You're family. 🫂",
    'My favorite partner in crime. 😂',
    'My safe place for random conversations.',
    'And one of my favorite people in this world.',
    'Forever grateful for our friendship. 💜',
  ],

  // ─── Background Music (URL or local path; leave empty to disable) ───
  backgroundMusic: '',
};


/* ============================================================
   SCREEN MANAGER — Handles smooth transitions between screens
   ============================================================ */
class ScreenManager {
  constructor() {
    this.screenIds = [
      'screen-countdown',
      'screen-intro',
      'screen-butterflies',
      'screen-memories',
      'screen-appreciation',
      'screen-funny',
      'screen-birthday',
      'screen-personal',
      'screen-final',
      'screen-end',
    ];
    this.currentIndex = 0;
    this.isTransitioning = false;
    this.screenElements = this.screenIds.map(id => document.getElementById(id));
    this.dots = document.querySelectorAll('#progress-dots .dot');
    this.screenCallbacks = {};

    // Initialize: hide all screens except the first
    this.screenElements.forEach((el, i) => {
      if (!el) return;
      if (i === 0) {
        el.classList.add('active');
        el.style.display = 'flex';
      } else {
        el.classList.remove('active');
        el.style.display = 'none';
      }
    });
    this.updateDots();
  }

  updateDots() {
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex);
    });
  }

  onEnter(screenId, callback) {
    this.screenCallbacks[screenId] = callback;
  }

  goToScreen(targetIndex) {
    if (this.isTransitioning) return;
    if (targetIndex < 0 || targetIndex >= this.screenIds.length) return;
    if (targetIndex === this.currentIndex) return;

    this.isTransitioning = true;

    const currentEl = this.screenElements[this.currentIndex];
    const targetEl = this.screenElements[targetIndex];

    // Fade out current
    if (currentEl) {
      currentEl.classList.remove('active');
      currentEl.classList.add('exiting');
    }

    setTimeout(() => {
      if (currentEl) {
        currentEl.style.display = 'none';
        currentEl.classList.remove('exiting');
      }

      this.currentIndex = targetIndex;
      this.updateDots();

      if (targetEl) {
        targetEl.scrollTop = 0;
        targetEl.style.display = 'flex';
        // Force reflow for animation
        void targetEl.offsetWidth;
        targetEl.classList.add('entering');

        requestAnimationFrame(() => {
          targetEl.classList.add('active');
          targetEl.classList.remove('entering');
        });
      }

      setTimeout(() => {
        this.isTransitioning = false;
        // Fire the screen enter callback
        const cb = this.screenCallbacks[this.screenIds[targetIndex]];
        if (cb) cb();
      }, 600);
    }, 500);
  }

  nextScreen() {
    this.goToScreen(this.currentIndex + 1);
  }

  prevScreen() {
    this.goToScreen(this.currentIndex - 1);
  }

  reset() {
    // Immediately reset to screen 0
    this.isTransitioning = false;
    this.screenElements.forEach((el, i) => {
      if (!el) return;
      el.classList.remove('active', 'entering', 'exiting');
      el.style.display = 'none';
    });
    this.currentIndex = 0;
    const first = this.screenElements[0];
    if (first) {
      first.style.display = 'flex';
      first.classList.add('active');
    }
    this.updateDots();
    // Re-trigger the first screen's callback
    const cb = this.screenCallbacks[this.screenIds[0]];
    if (cb) cb();
  }
}


/* ============================================================
   BACKGROUND EFFECTS — Particles, stars, butterflies, confetti
   ============================================================ */
const Effects = {
  particleContainer: null,
  starContainer: null,
  butterflyContainer: null,
  confettiContainer: null,

  init() {
    this.particleContainer = document.getElementById('bg-particles');
    this.starContainer = document.getElementById('bg-stars');
    this.butterflyContainer = document.getElementById('bg-butterflies');
    this.confettiContainer = document.getElementById('confetti-container');
  },

  clearAll() {
    [this.particleContainer, this.starContainer, this.butterflyContainer, this.confettiContainer]
      .forEach(c => { if (c) c.innerHTML = ''; });
  },

  clearContainer(container) {
    if (container) container.innerHTML = '';
  },

  /* ── Floating Particles ── */
  spawnParticles(count = 35) {
    if (!this.particleContainer) return;
    this.clearContainer(this.particleContainer);
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}vw;
        bottom:${-10 - Math.random() * 20}%;
        animation-duration:${Math.random() * 8 + 10}s;
        animation-delay:${Math.random() * 8}s;
        opacity:${Math.random() * 0.6 + 0.2};
      `;
      this.particleContainer.appendChild(p);
    }
  },

  /* ── Twinkling Stars ── */
  spawnStars(count = 40) {
    if (!this.starContainer) return;
    this.clearContainer(this.starContainer);
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'star';
      const size = Math.random() * 3 + 1;
      s.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}vw;
        top:${Math.random() * 100}vh;
        animation-duration:${Math.random() * 3 + 1}s;
        animation-delay:${Math.random() * 3}s;
      `;
      this.starContainer.appendChild(s);
    }
  },

  /* ── Background Butterflies (decorative, non-interactive) ── */
  spawnBgButterflies(count = 6) {
    if (!this.butterflyContainer) return;
    this.clearContainer(this.butterflyContainer);
    for (let i = 0; i < count; i++) {
      const b = document.createElement('span');
      b.className = 'bg-butterfly';
      b.textContent = '🦋';
      const size = Math.random() * 16 + 20;
      b.style.cssText = `
        font-size:${size}px;
        left:${Math.random() * 90 + 5}vw;
        top:${Math.random() * 80 + 10}vh;
        animation-duration:${Math.random() * 12 + 10}s;
        animation-delay:${Math.random() * 5}s;
      `;
      this.butterflyContainer.appendChild(b);
    }
  },

  /* ── Confetti Burst ── */
  launchConfetti(count = 150) {
    if (!this.confettiContainer) return;
    this.clearContainer(this.confettiContainer);
    const colors = ['#ff69b4', '#c084fc', '#a855f7', '#f472b6', '#818cf8', '#fbbf24', '#34d399', '#f9a8d4', '#e879f9'];
    for (let i = 0; i < count; i++) {
      const c = document.createElement('span');
      c.className = 'confetti-piece';
      const w = Math.random() * 8 + 4;
      const h = Math.random() * 12 + 6;
      c.style.cssText = `
        width:${w}px; height:${h}px;
        left:${Math.random() * 100}vw;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration:${Math.random() * 3 + 2.5}s;
        animation-delay:${Math.random() * 1.5}s;
        transform: rotate(${Math.random() * 360}deg);
      `;
      this.confettiContainer.appendChild(c);
    }
    // Clean up after animation
    setTimeout(() => this.clearContainer(this.confettiContainer), 8000);
  },
};


/* ============================================================
   MUSIC CONTROLLER
   ============================================================ */
const Music = {
  audio: null,
  isPlaying: false,
  controlEl: null,
  toggleBtn: null,
  volumeSlider: null,

  init() {
    this.controlEl = document.getElementById('music-control');
    this.toggleBtn = document.getElementById('music-toggle');
    this.volumeSlider = document.getElementById('volume-slider');
    this.audio = document.getElementById('bg-music');

    if (!CONFIG.backgroundMusic) {
      if (this.controlEl) this.controlEl.style.display = 'none';
      return;
    }

    // Show controls and set source
    if (this.controlEl) this.controlEl.style.display = 'flex';
    if (this.audio) this.audio.src = CONFIG.backgroundMusic;

    // Volume slider
    if (this.volumeSlider && this.audio) {
      this.audio.volume = this.volumeSlider.value / 100;
      this.volumeSlider.addEventListener('input', () => {
        this.audio.volume = this.volumeSlider.value / 100;
      });
    }

    // Toggle button
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    // Auto-play on first interaction
    const startOnInteraction = () => {
      this.play();
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('touchstart', startOnInteraction);
    };
    document.addEventListener('click', startOnInteraction, { once: false });
    document.addEventListener('touchstart', startOnInteraction, { once: false });
  },

  play() {
    if (!this.audio || !this.audio.src) return;
    this.audio.play().then(() => {
      this.isPlaying = true;
      this.updateIcon();
    }).catch(() => {});
  },

  pause() {
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying = false;
    this.updateIcon();
  },

  toggle() {
    this.isPlaying ? this.pause() : this.play();
  },

  updateIcon() {
    if (!this.toggleBtn) return;
    const icon = this.toggleBtn.querySelector('.music-icon');
    if (icon) icon.textContent = this.isPlaying ? '🎵' : '🔇';
    this.toggleBtn.classList.toggle('playing', this.isPlaying);
  },
};


/* ============================================================
   COUNTDOWN — Screen 0
   ============================================================ */
let countdownInterval = null;

function startCountdown(onComplete) {
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-minutes');
  const secsEl = document.getElementById('cd-seconds');
  const waitText = document.getElementById('countdown-waiting-text');
  const belowText = document.getElementById('countdown-below-text');
  const target = new Date(CONFIG.birthdayDate).getTime();

  function update() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      clearInterval(countdownInterval);
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      if (waitText) waitText.textContent = "It's time! 🎉✨";
      if (belowText) belowText.textContent = 'The celebration begins NOW! 🎂';
      setTimeout(() => onComplete(), 2000);
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(m).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  countdownInterval = setInterval(update, 1000);
}


/* ============================================================
   BUTTERFLY GAME — Screen 2
   ============================================================ */
let butterflyAnimFrame = null;

function initButterflyGame() {
  const playground = document.getElementById('butterfly-playground');
  const counterEl = document.getElementById('butterfly-counter');
  const continueBtn = document.getElementById('butterfly-continue');
  const popup = document.getElementById('butterfly-popup');
  const popupMsg = document.getElementById('butterfly-message');
  const popupClose = document.getElementById('close-popup');

  if (!playground) return;
  playground.innerHTML = '';
  if (continueBtn) continueBtn.style.display = 'none';

  const messages = CONFIG.butterflyMessages;
  let caughtCount = 0;
  const totalCount = messages.length;

  if (counterEl) counterEl.textContent = `Caught: 0/${totalCount} 🦋`;

  const butterflies = [];

  messages.forEach((msg, i) => {
    const el = document.createElement('div');
    el.className = 'game-butterfly';
    el.innerHTML = '<span class="bf-emoji">🦋</span>';
    el.setAttribute('data-index', i);

    // Random position and velocity
    const x = Math.random() * (window.innerWidth - 60) + 10;
    const y = Math.random() * (window.innerHeight * 0.6) + window.innerHeight * 0.15;
    const vx = (Math.random() - 0.5) * 3;
    const vy = (Math.random() - 0.5) * 2;

    el.style.left = x + 'px';
    el.style.top = y + 'px';

    playground.appendChild(el);

    const bfObj = { el, x, y, vx, vy, caught: false, msg };
    butterflies.push(bfObj);

    el.addEventListener('click', () => {
      if (bfObj.caught) return;
      bfObj.caught = true;
      caughtCount++;
      el.classList.add('caught');

      // Show popup message
      if (popup && popupMsg) {
        popupMsg.textContent = msg;
        popup.classList.remove('hidden');
      }

      if (counterEl) counterEl.textContent = `Caught: ${caughtCount}/${totalCount} 🦋`;

      if (caughtCount >= 3 && continueBtn) {
        continueBtn.style.display = '';
      }
    });
  });

  // Close popup
  if (popupClose && popup) {
    popupClose.onclick = () => popup.classList.add('hidden');
  }

  // Animate butterflies
  function animate() {
    butterflies.forEach(b => {
      if (b.caught) return;
      b.x += b.vx;
      b.y += b.vy;

      // Bounce off edges
      const maxX = window.innerWidth - 50;
      const maxY = window.innerHeight - 50;
      if (b.x <= 10 || b.x >= maxX) b.vx *= -1;
      if (b.y <= 60 || b.y >= maxY) b.vy *= -1;

      // Keep in bounds
      b.x = Math.max(10, Math.min(maxX, b.x));
      b.y = Math.max(60, Math.min(maxY, b.y));

      b.el.style.left = b.x + 'px';
      b.el.style.top = b.y + 'px';

      // Flip direction visually
      b.el.style.transform = b.vx < 0 ? 'scaleX(-1)' : 'scaleX(1)';
    });

    butterflyAnimFrame = requestAnimationFrame(animate);
  }

  animate();
}

function stopButterflyGame() {
  if (butterflyAnimFrame) {
    cancelAnimationFrame(butterflyAnimFrame);
    butterflyAnimFrame = null;
  }
}


/* ============================================================
   MEMORY CARDS — Screen 3
   ============================================================ */
function populateMemoryCards() {
  const heading = document.getElementById('memories-heading');
  if (heading && CONFIG.memoriesHeading) {
    heading.textContent = CONFIG.memoriesHeading;
  }

  const grid = document.getElementById('memory-grid');
  if (!grid) return;
  grid.innerHTML = '';

  CONFIG.memories.forEach((mem, i) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.style.animationDelay = `${i * 0.15}s`;

    if (mem.photo && mem.photo.trim() !== '') {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'memory-img-wrap';
      const img = document.createElement('img');
      img.src = mem.photo;
      img.alt = mem.text;
      img.loading = 'lazy';
      imgWrap.appendChild(img);
      card.appendChild(imgWrap);
    } else {
      card.classList.add('text-only');
    }

    if (mem.text && mem.text.trim() !== '') {
      const caption = document.createElement('p');
      caption.className = 'memory-caption';
      caption.textContent = mem.text;
      card.appendChild(caption);
    }
    grid.appendChild(card);
  });
}


/* ============================================================
   TYPEWRITER — Screen 4 (Appreciation)
   ============================================================ */
let typewriterTimeout = null;

function startTypewriter() {
  const container = document.getElementById('typewriter-container');
  const continueBtn = document.getElementById('appreciation-continue');
  if (!container) return;

  container.innerHTML = '';
  if (continueBtn) continueBtn.style.display = 'none';

  const messages = CONFIG.appreciationMessages;
  let msgIdx = 0;

  function typeMessage() {
    if (msgIdx >= messages.length) {
      if (continueBtn) continueBtn.style.display = '';
      return;
    }

    const msg = messages[msgIdx];
    const line = document.createElement('p');
    line.className = 'typewriter-line';
    container.appendChild(line);

    // Auto-scroll container
    container.scrollTop = container.scrollHeight;

    let charIdx = 0;

    function typeChar() {
      if (charIdx < msg.length) {
        line.textContent += msg[charIdx];
        charIdx++;
        container.scrollTop = container.scrollHeight;
        typewriterTimeout = setTimeout(typeChar, 45);
      } else {
        line.classList.add('done');
        msgIdx++;
        typewriterTimeout = setTimeout(typeMessage, 900);
      }
    }

    typeChar();
  }

  typeMessage();
}

function stopTypewriter() {
  if (typewriterTimeout) {
    clearTimeout(typewriterTimeout);
    typewriterTimeout = null;
  }
}


/* ============================================================
   FUNNY CARDS — Screen 5
   ============================================================ */
let funnyTimeouts = [];

function animateFunnyCards() {
  const grid = document.getElementById('funny-grid');
  const continueBtn = document.getElementById('funny-continue');
  if (!grid) return;

  grid.innerHTML = '';
  if (continueBtn) continueBtn.style.display = 'none';
  funnyTimeouts = [];

  CONFIG.funnyCards.forEach((card, i) => {
    const el = document.createElement('div');
    el.className = 'funny-card hidden-card';

    el.innerHTML = `
      <span class="funny-emoji">${card.emoji}</span>
      <p class="funny-text">${card.text}</p>
    `;

    grid.appendChild(el);

    const t = setTimeout(() => {
      el.classList.remove('hidden-card');
      el.classList.add('bounce-in');

      if (i === CONFIG.funnyCards.length - 1) {
        setTimeout(() => {
          if (continueBtn) continueBtn.style.display = '';
        }, 800);
      }
    }, i * 600 + 300);

    funnyTimeouts.push(t);
  });
}

function stopFunnyCards() {
  funnyTimeouts.forEach(t => clearTimeout(t));
  funnyTimeouts = [];
}


/* ============================================================
   BIRTHDAY REVEAL — Screen 6
   ============================================================ */
let birthdayTimeouts = [];

function animateBirthdayReveal() {
  const heading = document.getElementById('birthday-heading');
  const subtitle = document.getElementById('birthday-subtitle');
  const joke = document.getElementById('birthday-joke');
  const hope = document.getElementById('birthday-hope');
  const wishesContainer = document.getElementById('wishes-container');
  const continueBtn = document.getElementById('birthday-continue');

  if (heading) {
    heading.textContent = `Happy Birthday, ${CONFIG.bestFriendName}! 🎂🎉`;
    heading.style.display = 'none';
  }
  if (subtitle) subtitle.style.display = 'none';
  if (joke) joke.style.display = 'none';
  if (hope) hope.style.display = 'none';
  if (wishesContainer) wishesContainer.innerHTML = '';
  if (continueBtn) continueBtn.style.display = 'none';

  birthdayTimeouts = [];

  // Sequence the reveals
  const show = (el, delay) => {
    const t = setTimeout(() => {
      if (el) {
        el.style.display = '';
        el.classList.add('fade-in-up-anim');
      }
    }, delay);
    birthdayTimeouts.push(t);
  };

  show(heading, 300);
  show(subtitle, 2000);
  show(joke, 4000);
  show(hope, 6000);

  // Birthday wishes
  CONFIG.birthdayWishes.forEach((wish, i) => {
    const t = setTimeout(() => {
      const p = document.createElement('p');
      p.className = 'wish-item fade-in-up-anim';
      p.textContent = wish;
      if (wishesContainer) wishesContainer.appendChild(p);
    }, 7500 + i * 1000);
    birthdayTimeouts.push(t);
  });

  // Show continue button after all wishes
  const t = setTimeout(() => {
    if (continueBtn) {
      continueBtn.style.display = '';
      continueBtn.classList.add('fade-in-up-anim');
    }
  }, 7500 + CONFIG.birthdayWishes.length * 1000 + 1000);
  birthdayTimeouts.push(t);

  // Confetti!
  Effects.launchConfetti(180);
}


/* ============================================================
   PERSONAL MESSAGE — Screen 7
   ============================================================ */
function populatePersonalMessage() {
  const msgEl = document.getElementById('personal-message-text');
  const signEl = document.getElementById('message-sign');

  if (msgEl) {
    const paragraphs = CONFIG.personalMessage.split('\n\n');
    msgEl.innerHTML = paragraphs.map((p, i) =>
      `<p class="msg-paragraph fade-in-up-anim" style="animation-delay:${i * 0.4}s">${p.replace(/\n/g, '<br>')}</p>`
    ).join('');
  }

  if (signEl) {
    signEl.textContent = `— ${CONFIG.myName}`;
  }
}


/* ============================================================
   FINAL CINEMATIC MESSAGES — Screen 8
   ============================================================ */
let finalTimeouts = [];

function animateFinalMessages() {
  const heading = document.getElementById('final-heading');
  const container = document.getElementById('final-messages-container');

  if (heading) {
    heading.textContent = `Happy Birthday, ${CONFIG.bestFriendName} 🥹💜`;
    heading.style.display = 'none';
  }

  if (container) container.innerHTML = '';

  finalTimeouts = [];

  // Show heading first
  const t1 = setTimeout(() => {
    if (heading) {
      heading.style.display = '';
      heading.classList.add('fade-in-up-anim');
    }
  }, 500);
  finalTimeouts.push(t1);

  // Each message fades in and stays
  let delay = 2500;
  CONFIG.finalMessages.forEach((msg, i) => {
    const t = setTimeout(() => {
      const p = document.createElement('p');
      p.className = 'cinematic-line';
      p.textContent = msg;
      if (container) container.appendChild(p);

      // Trigger animation
      requestAnimationFrame(() => p.classList.add('visible'));
    }, delay);
    finalTimeouts.push(t);
    delay += 2800;
  });

  // Auto-advance to end screen
  const tEnd = setTimeout(() => {
    if (window.sm) window.sm.nextScreen();
  }, delay + 2000);
  finalTimeouts.push(tEnd);
}


/* ============================================================
   POPULATE DYNAMIC CONTENT FROM CONFIG
   ============================================================ */
function populateConfig() {
  // Screen 1 — Intro
  const greetEl = document.getElementById('intro-greeting');
  const subEl = document.getElementById('intro-subtext');
  if (greetEl) greetEl.textContent = CONFIG.greeting;
  if (subEl) subEl.textContent = CONFIG.greetingSubtext;

  // Screen 9 — End
  const endBday = document.getElementById('end-birthday-text');
  const endCredits = document.getElementById('end-credits');
  if (endBday) endBday.textContent = `Happy Birthday, ${CONFIG.bestFriendName}! 🎂🎉`;
  if (endCredits) endCredits.textContent = `Made with 💜 by ${CONFIG.myName}`;
}


/* ============================================================
   SWIPE DETECTION (Mobile)
   ============================================================ */
function setupSwipe() {
  let startX = 0;
  let startY = 0;

  document.addEventListener('touchstart', e => {
    startX = e.changedTouches[0].screenX;
    startY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - startX;
    const dy = e.changedTouches[0].screenY - startY;
    // Only count horizontal swipes
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
      if (dx < 0) window.sm.nextScreen();
      else window.sm.prevScreen();
    }
  }, { passive: true });
}


/* ============================================================
   KEYBOARD NAVIGATION
   ============================================================ */
function setupKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      window.sm.nextScreen();
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      window.sm.prevScreen();
    }
  });
}


/* ============================================================
   INITIALIZATION
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize
  const sm = new ScreenManager();
  window.sm = sm;

  Effects.init();
  Music.init();
  populateConfig();
  populateMemoryCards();
  setupSwipe();
  setupKeyboard();

  // ── Progress dot click navigation ──
  document.querySelectorAll('#progress-dots .dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.screen, 10);
      if (!isNaN(idx)) sm.goToScreen(idx);
    });
  });

  // ══════════════════════════════════
  //  SCREEN ENTER CALLBACKS
  // ══════════════════════════════════

  // Screen 0 — Countdown
  sm.onEnter('screen-countdown', () => {
    Effects.spawnParticles(40);
    Effects.spawnStars(30);
    startCountdown(() => {
      if (sm.currentIndex === 0) sm.nextScreen();
    });
  });

  // Screen 1 — Intro
  sm.onEnter('screen-intro', () => {
    Effects.spawnBgButterflies(6);
    Effects.spawnStars(20);
  });

  // Screen 2 — Butterfly Game
  sm.onEnter('screen-butterflies', () => {
    Effects.clearAll();
    initButterflyGame();
  });

  // Screen 3 — Memories
  sm.onEnter('screen-memories', () => {
    stopButterflyGame();
    Effects.spawnParticles(25);
    Effects.spawnStars(15);
    populateMemoryCards();
  });

  // Screen 4 — Appreciation
  sm.onEnter('screen-appreciation', () => {
    Effects.spawnStars(20);
    Effects.spawnBgButterflies(3);
    startTypewriter();
  });

  // Screen 5 — Funny Cards
  sm.onEnter('screen-funny', () => {
    stopTypewriter();
    Effects.spawnParticles(20);
    animateFunnyCards();
  });

  // Screen 6 — Birthday Reveal
  sm.onEnter('screen-birthday', () => {
    stopFunnyCards();
    Effects.spawnStars(40);
    animateBirthdayReveal();
  });

  // Screen 7 — Personal Message
  sm.onEnter('screen-personal', () => {
    Effects.spawnStars(25);
    Effects.spawnBgButterflies(4);
    populatePersonalMessage();
  });

  // Screen 8 — Final Cinematic
  sm.onEnter('screen-final', () => {
    Effects.spawnStars(50);
    Effects.spawnParticles(30);
    animateFinalMessages();
  });

  // Screen 9 — End
  sm.onEnter('screen-end', () => {
    finalTimeouts.forEach(t => clearTimeout(t));
    Effects.spawnStars(40);
    Effects.spawnParticles(35);
    Effects.spawnBgButterflies(5);
    Effects.launchConfetti(100);
  });

  // ══════════════════════════════════
  //  BUTTON EVENT LISTENERS
  // ══════════════════════════════════

  // Skip countdown
  document.getElementById('skip-countdown')?.addEventListener('click', () => sm.nextScreen());

  // Intro buttons
  document.getElementById('btn-yes')?.addEventListener('click', () => sm.nextScreen());

  // "Maybe..." button — runs away forever when hovered/tapped!
  const maybeBtn = document.getElementById('btn-maybe');
  if (maybeBtn) {
    function dodgeButton() {
      const parent = maybeBtn.closest('.screen-content') || maybeBtn.parentElement;
      const parentRect = parent.getBoundingClientRect();

      const maxX = Math.min(parentRect.width - maybeBtn.offsetWidth, window.innerWidth * 0.6);
      const maxY = Math.min(200, window.innerHeight * 0.3);

      const randX = (Math.random() - 0.5) * maxX;
      const randY = (Math.random() * maxY) - maxY * 0.3;

      maybeBtn.style.position = 'relative';
      maybeBtn.style.transition = 'all 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      maybeBtn.style.left = randX + 'px';
      maybeBtn.style.top = randY + 'px';
      maybeBtn.style.transform = 'rotate(' + (Math.random() * 20 - 10) + 'deg)';
    }

    maybeBtn.addEventListener('mouseenter', dodgeButton);
    maybeBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      dodgeButton();
    }, { passive: false });

    maybeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  // Butterfly continue
  document.getElementById('butterfly-continue')?.addEventListener('click', () => {
    stopButterflyGame();
    sm.nextScreen();
  });

  // Memories continue
  document.getElementById('memories-continue')?.addEventListener('click', () => sm.nextScreen());

  // Appreciation continue
  document.getElementById('appreciation-continue')?.addEventListener('click', () => {
    stopTypewriter();
    sm.nextScreen();
  });

  // Funny continue
  document.getElementById('funny-continue')?.addEventListener('click', () => {
    stopFunnyCards();
    sm.nextScreen();
  });

  // Birthday continue
  document.getElementById('birthday-continue')?.addEventListener('click', () => {
    birthdayTimeouts.forEach(t => clearTimeout(t));
    sm.nextScreen();
  });

  // Personal message continue
  document.getElementById('personal-continue')?.addEventListener('click', () => sm.nextScreen());

  // Replay button
  document.getElementById('replay-btn')?.addEventListener('click', () => {
    Effects.clearAll();
    if (countdownInterval) clearInterval(countdownInterval);
    stopButterflyGame();
    stopTypewriter();
    stopFunnyCards();
    birthdayTimeouts.forEach(t => clearTimeout(t));
    finalTimeouts.forEach(t => clearTimeout(t));
    sm.reset();
  });

  // ── Fire the first screen's enter callback ──
  Effects.spawnParticles(40);
  Effects.spawnStars(30);
  startCountdown(() => {
    if (sm.currentIndex === 0) sm.nextScreen();
  });
});
