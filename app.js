/* Gentle stars, golden light, and soft blessing chimes */

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
const nameInput = document.getElementById("honoredName");
const displayName = document.getElementById("displayName");
const blessBtn = document.getElementById("blessBtn");
const wishLines = [...document.querySelectorAll(".wish-line")];

let particles = [];
let frameId = null;
let audioCtx = null;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

function seedStars() {
  particles = [];
  const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000));
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.5 + Math.random() * 1.5,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.008 + Math.random() * 0.02,
      drift: (Math.random() - 0.5) * 0.15,
    });
  }
}

seedStars();
window.addEventListener("resize", seedStars);

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const t = Date.now() * 0.001;

  for (const p of particles) {
    const alpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * p.speed * 60 + p.twinkle));
    p.y -= p.drift;
    if (p.y < 0) p.y = canvas.height;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 248, 230, ${alpha})`;
    ctx.fill();
  }

  frameId = requestAnimationFrame(drawStars);
}

drawStars();

function syncName() {
  const name = nameInput.value.trim();
  displayName.textContent = name || "friend";
}

nameInput.addEventListener("input", syncName);
syncName();

function playChime() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();

    const notes = [523.25, 659.25, 783.99, 1046.5];
    const now = audioCtx.currentTime;

    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const start = now + i * 0.22;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.08, start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 1.2);
      osc.start(start);
      osc.stop(start + 1.3);
    });
  } catch {
    /* audio optional */
  }
}

function burstLight() {
  const extra = 40;
  for (let i = 0; i < extra; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height * 0.35 + (Math.random() - 0.5) * 100,
      r: 1 + Math.random() * 2,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.02,
      drift: -0.3 - Math.random() * 0.5,
    });
  }
  setTimeout(() => {
    particles = particles.slice(0, 80);
    seedStars();
  }, 4000);
}

function receiveBlessing() {
  if (document.body.classList.contains("blessed")) return;

  document.body.classList.add("blessed");
  blessBtn.disabled = true;
  blessBtn.textContent = "Blessings upon you";

  wishLines.forEach((line, i) => {
    setTimeout(() => line.classList.add("revealed"), 80 + i * 280);
  });

  playChime();
  burstLight();
}

blessBtn.addEventListener("click", receiveBlessing);
