const invitation = {
  names: "Aleena B S & Abhijith D S",
  countdownMonth: 6,
  countdownDay: 4,
  countdownHourIst: 17,
  mapQuery: "Izyan Sports City & Convention Centre Parippally",
  whatsappText:
    "Together with their families, Aleena B S and Abhijith D S warmly invite you to their wedding reception on Friday, 4 July 2025, 4:00 PM onwards at Izyan Sports City & Convention Centre, Parippally."
};

const $ = (selector) => document.querySelector(selector);

function setText(selector, value) {
  const node = $(selector);
  if (node) node.textContent = value;
}

function setupMusicButton() {
  const button = document.querySelector("#musicToggle");
  const audio = new Audio("assets/music.mp3");
  audio.loop = true;

  let isPlaying = false;

  function startMusic() {
    audio.play();
    isPlaying = true;
    button.classList.add("is-playing");
    button.setAttribute("aria-label", "Pause music");
  }

  function stopMusic() {
    audio.pause();
    isPlaying = false;
    button.classList.remove("is-playing");
    button.setAttribute("aria-label", "Play music");
  }

  button.addEventListener("click", () => {
    if (isPlaying) stopMusic();
    else startMusic();
  });

  return {
    start: startMusic,
    stop: stopMusic
  };
}

  function openInvitation() {
    opening.classList.add("opening--open");
    letter.setAttribute("aria-expanded", "true");
    music.start();

    window.setTimeout(() => {
      opening.classList.add("hidden");
      document.body.classList.remove("locked");
    }, 720);
  }

  button.addEventListener("click", openInvitation);

  document.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && !opening.classList.contains("hidden")) {
      event.preventDefault();
      openInvitation();
    }
  });

  if (window.location.hash) {
    opening.classList.add("hidden");
    document.body.classList.remove("locked");
  }
}

function startCountdown() {
  const target = getNextJulyFourthAtFiveIst().getTime();
  const ids = ["days", "hours", "minutes", "seconds"];

  function render() {
    const diff = Math.max(0, target - Date.now());
    const values = [
      Math.floor(diff / 86400000),
      Math.floor((diff / 3600000) % 24),
      Math.floor((diff / 60000) % 60),
      Math.floor((diff / 1000) % 60)
    ];

    ids.forEach((id, index) => {
      setText(`#${id}`, String(values[index]).padStart(2, "0"));
    });
  }

  render();
  window.setInterval(render, 1000);
}

function getNextJulyFourthAtFiveIst() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const targetUtcHour = invitation.countdownHourIst - 5;
  const targetUtcMinute = 30;
  let target = new Date(Date.UTC(currentYear, invitation.countdownMonth, invitation.countdownDay, targetUtcHour, targetUtcMinute, 0));

  if (target.getTime() <= now.getTime()) {
    target = new Date(Date.UTC(currentYear + 1, invitation.countdownMonth, invitation.countdownDay, targetUtcHour, targetUtcMinute, 0));
  }

  return target;
}

function setupLinks() {
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(invitation.mapQuery)}`;
  const mapLink = $("#mapLink");
  const whatsappLink = $("#whatsappLink");

  if (mapLink) mapLink.href = mapUrl;
  if (whatsappLink) {
    whatsappLink.href = `https://wa.me/+918129233735?text=Hi`;
  }
}

function setupMusicButton() {
  let enabled = false;
  const button = $("#musicToggle");
  let audioContext;
  let masterGain;
  let timers = [];
  const notes = [349.23, 392, 440, 523.25, 493.88, 440, 392, 349.23, 392, 440, 493.88, 587.33];

  function playNote(frequency, when, duration) {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, when);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(0.026, when + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    oscillator.connect(gain).connect(masterGain);
    oscillator.start(when);
    oscillator.stop(when + duration + 0.03);
  }

  function scheduleMelody() {
    if (!enabled || !audioContext) return;
    const start = audioContext.currentTime + 0.05;
    notes.forEach((note, index) => {
      playNote(note, start + index * 0.58, 0.5);
      if (index % 3 === 0) playNote(note / 2, start + index * 0.58, 1.5);
    });
    timers.push(window.setTimeout(scheduleMelody, notes.length * 580));
  }

  function startMusic() {
    if (enabled) return;
    audioContext = audioContext || new AudioContext();
    if (audioContext.state === "suspended") audioContext.resume();
    if (!masterGain) {
      masterGain = audioContext.createGain();
      masterGain.connect(audioContext.destination);
    }
    masterGain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.75, audioContext.currentTime + 0.8);
    enabled = true;
    button.classList.add("is-playing");
    button.setAttribute("aria-label", "Pause music");
    scheduleMelody();
  }

  function stopMusic() {
    if (!enabled) return;
    enabled = false;
    timers.forEach((timer) => window.clearTimeout(timer));
    timers = [];
    if (masterGain && audioContext) {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.45);
    }
    button.classList.remove("is-playing");
    button.setAttribute("aria-label", "Play music");
  }

  button.addEventListener("click", () => {
    if (enabled) stopMusic();
    else startMusic();
  });

  return {
    start: startMusic,
    stop: stopMusic
  };
}

function setupRevealAnimations() {
  const animated = document.querySelectorAll("main > section, .celebration-grid article, .couple-grid article, .travel-grid article, .map-frame");
  animated.forEach((node) => node.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  animated.forEach((node) => observer.observe(node));
}

function setupConfetti() {
  const canvas = $("#confettiCanvas");
  const context = canvas.getContext("2d");
  const colors = ["#f4c56f", "#ffffff", "#d9a79e", "#7a2435", "#f7e8d5"];
  const pieces = [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let lastScrollY = window.scrollY;
  let animationFrame;

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function addPiece(x) {
    pieces.push({
      x,
      y: -12,
      size: 5 + Math.random() * 8,
      speed: 1.6 + Math.random() * 3.4,
      drift: -1.2 + Math.random() * 2.4,
      spin: Math.random() * Math.PI,
      turn: -0.12 + Math.random() * 0.24,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  function burst(amount) {
    if (reduceMotion) return;
    for (let index = 0; index < amount; index += 1) {
      addPiece(Math.random() * width);
    }
  }

  function draw() {
    context.clearRect(0, 0, width, height);

    for (let index = pieces.length - 1; index >= 0; index -= 1) {
      const piece = pieces[index];
      piece.y += piece.speed;
      piece.x += piece.drift;
      piece.spin += piece.turn;

      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.spin);
      context.fillStyle = piece.color;
      context.fillRect(-piece.size / 2, -piece.size / 3, piece.size, piece.size * 0.62);
      context.restore();

      if (piece.y > height + 30) pieces.splice(index, 1);
    }

    animationFrame = window.requestAnimationFrame(draw);
  }

  window.addEventListener(
    "scroll",
    () => {
      const distance = Math.abs(window.scrollY - lastScrollY);
      if (distance > 8) burst(Math.min(14, Math.ceil(distance / 28)));
      lastScrollY = window.scrollY;
    },
    { passive: true }
  );

  window.addEventListener("resize", resize);
  resize();
  burst(24);
  animationFrame = window.requestAnimationFrame(draw);

  window.addEventListener("beforeunload", () => {
    window.cancelAnimationFrame(animationFrame);
  });
}

const music = setupMusicButton();
setupOpening(music);
setupLinks();
startCountdown();
setupRevealAnimations();
setupConfetti();
