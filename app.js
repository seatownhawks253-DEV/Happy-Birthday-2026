/* Happy Birthday DJ Party — melody + voice + visuals */

const NOTE_FREQ = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  "C5": 523.25,
  REST: 0,
};

// Classic Happy Birthday melody (note, duration in beats @ 120 BPM)
const MELODY = [
  ["C4", 0.5], ["C4", 0.5], ["D4", 1], ["C4", 1], ["F4", 1], ["E4", 2],
  ["C4", 0.5], ["C4", 0.5], ["D4", 1], ["C4", 1], ["G4", 1], ["F4", 2],
  ["C4", 0.5], ["C4", 0.5], ["C5", 1], ["A4", 1], ["F4", 1], ["E4", 1], ["D4", 2],
  ["A4", 0.5], ["A4", 0.5], ["A#4", 1], ["A4", 1], ["F4", 1], ["G4", 1], ["F4", 2],
];

// Map A#4 for Web Audio (not in NOTE_FREQ yet)
NOTE_FREQ["A#4"] = 466.16;

const LYRIC_LINES = [
  "Happy birthday to you",
  "Happy birthday to you",
  null, // filled with name
  "Happy birthday to you!",
];

const BEAT_MS = 500; // 120 BPM

let audioCtx = null;
let muted = false;
let playing = false;
let eqAnimationId = null;

const guestName = document.getElementById("guestName");
const lyricName = document.getElementById("lyricName");
const playBtn = document.getElementById("playBtn");
const confettiBtn = document.getElementById("confettiBtn");
const muteBtn = document.getElementById("muteBtn");
const djStatus = document.getElementById("djStatus");
const eqBars = document.getElementById("eqBars");
const lyricEls = [...document.querySelectorAll(".lyric-line")];

// Build EQ bars
for (let i = 0; i < 12; i++) {
  const bar = document.createElement("div");
  bar.className = "eq-bar";
  eqBars.appendChild(bar);
}
const eqBarEls = [...eqBars.querySelectorAll(".eq-bar")];

function getDisplayName() {
  const n = guestName.value.trim();
  return n || "friend";
}

function syncName() {
  const name = getDisplayName();
  lyricName.textContent = name;
}

guestName.addEventListener("input", syncName);
syncName();

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(freq, durationSec, startTime, type = "sine") {
  if (muted || freq <= 0) return;

  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = type;
  osc.frequency.value = freq;
  filter.type = "lowpass";
  filter.frequency.value = 2400;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  const t = startTime;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.22, t + 0.02);
  gain.gain.setValueAtTime(0.18, t + durationSec * 0.6);
  gain.gain.exponentialRampToValueAtTime(0.001, t + durationSec);

  osc.start(t);
  osc.stop(t + durationSec + 0.05);
}

function speakLine(text, index) {
  return new Promise((resolve) => {
    if (muted || !window.speechSynthesis) {
      highlightLyric(index);
      setTimeout(resolve, BEAT_MS * 4);
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.92;
    utter.pitch = 1.15;
    utter.volume = 1;

    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Samantha") ||
          v.name.includes("Google") ||
          v.name.includes("Female") ||
          v.name.includes("Karen"))
    );
    if (preferred) utter.voice = preferred;

    utter.onstart = () => {
      highlightLyric(index);
      setDjStatus("🎤 Singing live…");
    };
    utter.onend = () => {
      markSung(index);
      resolve();
    };
    utter.onerror = () => resolve();

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  });
}

function highlightLyric(index) {
  lyricEls.forEach((el, i) => {
    el.classList.remove("active");
    if (i === index) el.classList.add("active");
  });
}

function markSung(index) {
  const el = lyricEls[index];
  if (el) {
    el.classList.remove("active");
    el.classList.add("sung");
  }
}

function resetLyrics() {
  lyricEls.forEach((el) => {
    el.classList.remove("active", "sung");
  });
}

function setDjStatus(msg) {
  djStatus.textContent = msg;
}

function animateEq(active) {
  if (!active) {
    cancelAnimationFrame(eqAnimationId);
    eqBarEls.forEach((b) => (b.style.height = "12px"));
    return;
  }

  function tick() {
    eqBarEls.forEach((bar) => {
      const h = 12 + Math.random() * 52;
      bar.style.height = `${h}px`;
    });
    eqAnimationId = requestAnimationFrame(tick);
  }
  tick();
}

/* Confetti */
const canvas = document.getElementById("confetti");
const ctx2d = canvas.getContext("2d");
let particles = [];
let confettiRunning = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const COLORS = ["#ff2d95", "#00f5ff", "#b24dff", "#ffe566", "#fff"];

function blastConfetti(count = 120) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height * 0.35,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -14 - 4,
      size: 4 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.3,
      life: 1,
    });
  }
  if (!confettiRunning) {
    confettiRunning = true;
    requestAnimationFrame(drawConfetti);
  }
}

function drawConfetti() {
  ctx2d.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter((p) => p.life > 0);

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.35;
    p.vx *= 0.99;
    p.life -= 0.008;
    p.rot += p.spin;

    ctx2d.save();
    ctx2d.translate(p.x, p.y);
    ctx2d.rotate(p.rot);
    ctx2d.globalAlpha = Math.max(0, p.life);
    ctx2d.fillStyle = p.color;
    ctx2d.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    ctx2d.restore();
  }

  if (particles.length > 0) {
    requestAnimationFrame(drawConfetti);
  } else {
    confettiRunning = false;
  }
}

async function playMelody() {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") await ctx.resume();

  let time = ctx.currentTime + 0.1;

  for (const [note, beats] of MELODY) {
    const freq = NOTE_FREQ[note] || 0;
    const dur = beats * (BEAT_MS / 1000);
    if (freq > 0) {
      playTone(freq, dur * 0.95, time, "triangle");
      // Soft harmony layer
      playTone(freq * 2, dur * 0.5, time + 0.02, "sine");
    }
    time += dur;
  }

  return time - ctx.currentTime;
}

async function performSong() {
  if (playing) return;
  playing = true;
  playBtn.disabled = true;
  document.body.classList.add("party-mode");
  resetLyrics();
  syncName();

  setDjStatus("🎧 Mixing the track…");
  animateEq(true);
  blastConfetti(80);

  const name = getDisplayName();
  const lines = [
    LYRIC_LINES[0],
    LYRIC_LINES[1],
    `Happy birthday dear ${name}`,
    LYRIC_LINES[3],
  ];

  const melodyPromise = playMelody();

  // Stagger vocals with lyric timing (~4 beats per line)
  for (let i = 0; i < lines.length; i++) {
    await new Promise((r) => setTimeout(r, i === 0 ? 400 : BEAT_MS * 4));
    await speakLine(lines[i], i);
  }

  await melodyPromise;

  setDjStatus("🎉 Track dropped! Happy birthday!");
  playBtn.disabled = false;
  playing = false;

  setTimeout(() => {
    if (!playing) {
      document.body.classList.remove("party-mode");
      animateEq(false);
      setDjStatus("Ready for an encore…");
    }
  }, 3000);
}

playBtn.addEventListener("click", performSong);
confettiBtn.addEventListener("click", () => blastConfetti(150));

muteBtn.addEventListener("click", () => {
  muted = !muted;
  muteBtn.setAttribute("aria-pressed", String(muted));
  muteBtn.textContent = muted ? "Sound Off" : "Sound On";
  if (muted) speechSynthesis?.cancel();
});

// Preload speech voices (Chrome loads async)
if (window.speechSynthesis) {
  speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}

// Welcome confetti on load
window.addEventListener("load", () => {
  setTimeout(() => blastConfetti(40), 600);
});
