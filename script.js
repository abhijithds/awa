const invitation = {
  names: "Aleena B S & Abhijith D S",
   countdownYear: 2026,
  countdownMonth: 6,
  countdownDay: 4,
  countdownHourIst: 16,
  mapQuery: "Izyan Sports City & Convention Centre Parippally",
  whatsappText:
    "Together with their families, Aleena B S and Abhijith D S warmly invite you to their wedding reception on Friday, 4 July 2026, 4:00 PM onwards at Izyan Sports City & Convention Centre, Parippally."
};

const $ = (selector) => document.querySelector(selector);

function setText(selector, value) {
  const node = $(selector);
  if (node) node.textContent = value;
}

//
// 🎵 MUSIC (MP3 VERSION ONLY — FIXED)
//
function setupMusicButton() {
  const button = document.querySelector("#musicToggle");
  const audio = new Audio("assets/music.mp3");
  audio.volume = 0.4;
  audio.loop = true;

  let isPlaying = false;

  function startMusic() {
    audio.play().catch(() => {});
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

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // tab is minimized / switched
    if (isPlaying) {
      audio.pause();
    }
  } else {
    // tab is active again
    if (isPlaying) {
      audio.play().catch(() => {});
    }
  }
});
  
  return {
    start: startMusic,
    stop: stopMusic
  };
}

//
// ✉️ OPENING FIXED (THIS WAS BROKEN BEFORE)
//
function setupOpening(music) {
  const opening = $("#opening");
  const letter = $("#letter");
  const button = $("#openInvite");

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

//
// ⏳ COUNTDOWN (UNCHANGED)
//
function startCountdown() {
  const target = getEventDateIst().getTime();
  const ids = ["days", "hours", "minutes", "seconds"];

  function render() {
   const diff = Math.max(0, target - Date.now());

  if (diff === 0) {
    setText("#countdownStatus", "The celebration has begun 🎉");
    document.querySelector(".countdown").style.display = "none";
    return;
  }

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
function getEventDateIst() {
  const targetUtcHour = invitation.countdownHourIst - 5;
  const targetUtcMinute = 30;

  return new Date(
    Date.UTC(
      invitation.countdownYear,
      invitation.countdownMonth,
      invitation.countdownDay,
      targetUtcHour,
      targetUtcMinute,
      0
    )
  );
}

//
// 🔗 LINKS (RESTORED PROPERLY)
//
function setupLinks() {
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(invitation.mapQuery)}`;
  const mapLink = $("#mapLink");
  const whatsappLink = $("#whatsappLink");

  if (mapLink) mapLink.href = mapUrl;

  if (whatsappLink) {
    whatsappLink.href = `https://wa.me/+918129233735?text=Hi`;
  }
}

//
// ✨ REVEAL ANIMATIONS (UNCHANGED)
//
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

//
// 🎊 CONFETTI (100% ORIGINAL — NOT TOUCHED)
//
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

//
// 🚀 INIT (UNCHANGED)
//
const music = setupMusicButton();

setupOpening(music);
setupLinks();
startCountdown();
setupRevealAnimations();
setupConfetti();
