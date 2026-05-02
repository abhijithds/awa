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

//
// 🎵 MUSIC (MP3 VERSION)
//
function setupMusicButton() {
  const button = $("#musicToggle");
  const audio = new Audio("assets/music.mp3");
  audio.loop = true;

  let isPlaying = false;

  function startMusic() {
    audio.play().catch(() => {}); // avoid autoplay error
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

//
// ✉️ OPENING ENVELOPE
//
function setupOpening(music) {
  const opening = $("#opening");
  const letter = $("#letter");
  const button = $("#openInvite");

  function openInvitation() {
    opening.classList.add("opening--open");
    letter.setAttribute("aria-expanded", "true");
    music.start();

    setTimeout(() => {
      opening.classList.add("hidden");
      document.body.classList.remove("locked");
    }, 700);
  }

  button.addEventListener("click", openInvitation);

  document.addEventListener("keydown", (event) => {
    if (
      (event.key === "Enter" || event.key === " ") &&
      !opening.classList.contains("hidden")
    ) {
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
// ⏳ COUNTDOWN
//
function startCountdown() {
  const target = getNextDate().getTime();
  const ids = ["days", "hours", "minutes", "seconds"];

  function render() {
    const diff = Math.max(0, target - Date.now());

    const values = [
      Math.floor(diff / 86400000),
      Math.floor((diff / 3600000) % 24),
      Math.floor((diff / 60000) % 60),
      Math.floor((diff / 1000) % 60)
    ];

    ids.forEach((id, i) => {
      setText(`#${id}`, String(values[i]).padStart(2, "0"));
    });
  }

  render();
  setInterval(render, 1000);
}

function getNextDate() {
  const now = new Date();
  const year = now.getFullYear();

  let target = new Date(
    Date.UTC(year, invitation.countdownMonth, invitation.countdownDay, 11, 30)
  );

  if (target <= now) {
    target = new Date(
      Date.UTC(year + 1, invitation.countdownMonth, invitation.countdownDay, 11, 30)
    );
  }

  return target;
}

//
// 🔗 LINKS (MAP + WHATSAPP)
//
function setupLinks() {
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(invitation.mapQuery)}`;

  const mapLink = $("#mapLink");
  const whatsappLink = $("#whatsappLink");

  if (mapLink) mapLink.href = mapUrl;

  if (whatsappLink) {
    whatsappLink.href =
      `https://wa.me/?text=${encodeURIComponent(invitation.whatsappText)}`;
  }
}

//
// ✨ SCROLL ANIMATIONS
//
function setupRevealAnimations() {
  const elements = document.querySelectorAll(
    "main > section, .celebration-grid article, .couple-grid article, .travel-grid article, .map-frame"
  );

  elements.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  });

  elements.forEach((el) => observer.observe(el));
}

//
// 🎊 CONFETTI
//
function setupConfetti() {
  const canvas = $("#confettiCanvas");
  const ctx = canvas.getContext("2d");

  let pieces = [];
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createPiece() {
    return {
      x: Math.random() * width,
      y: -10,
      size: 5 + Math.random() * 5,
      speed: 2 + Math.random() * 3
    };
  }

  function update() {
    ctx.clearRect(0, 0, width, height);

    pieces.forEach((p) => {
      p.y += p.speed;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    pieces = pieces.filter((p) => p.y < height);
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", () => {
    for (let i = 0; i < 10; i++) pieces.push(createPiece());
  });

  resize();
  update();
}

//
// 🚀 INIT
//
const music = setupMusicButton();
setupOpening(music);
setupLinks();
startCountdown();
setupRevealAnimations();
setupConfetti();
