/* ============================================================
   LEO SOUZA — 1996 EDITION (JS moderno com vibes retrô)
   ============================================================ */

/* ============================================================
   1) EFEITO DE DIGITAÇÃO (typewriter)
   Cicla uma lista de frases dentro do "monitor CRT".
   Estado como máquina: digita → pausa → apaga → próxima frase.
   ============================================================ */
const typing = document.querySelector(".typing");
const typingPhrases = [
  "dir /w",
  "cd leonardo",
  "runtime status",
  "instrutor.exe running...",
  "developer.exe loading...",
  "bem-vindo()",
  "hello world!",
];
let phraseIdx = 0;
let charIdx = 0;
let deleting = false;

function typeLoop() {
  if (!typing) return;
  const current = typingPhrases[phraseIdx];
  if (!deleting) {
    typing.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400); // pausa no final
      return;
    }
  } else {
    typing.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % typingPhrases.length;
    }
  }
  // mais devagar para digitar, mais rápido para apagar — sensação natural
  setTimeout(typeLoop, deleting ? 40 : 90);
}
typeLoop();

/* ============================================================
   2) CONTADOR DE VISITAS persistido via localStorage
   Cada reload incrementa — mimetiza os hit counters de 1996,
   mas usando tecnologia que eles não tinham.
   ============================================================ */
const counter = document.getElementById("counter");
if (counter) {
  const KEY = "leo-visits-1996";
  let visits = parseInt(localStorage.getItem(KEY) || "133700", 10);
  visits++;
  localStorage.setItem(KEY, String(visits));
  // padStart garante o formato "000042" clássico de odômetro
  counter.textContent = String(visits).padStart(6, "0");
}

/* ============================================================
   3) MELODIA SINTETIZADA via WebAudio
   Substitui o <audio src="Top-Gear.mp3"> — zero dependência
   de arquivo, roda em qualquer navegador moderno.
   ============================================================ */
const musicBtn = document.getElementById("musicBtn");
let audioCtx = null;
let melodyTimer = null;
let isPlaying = false;

/* Uma melodia infantil de 16 notas (frequências em Hz).
   Misturando arpejos maiores com variações — soa "videogame". */
const melody = [
  523, 659, 784, 1046, 784, 659, 523, 392,
  440, 554, 659, 880, 659, 554, 440, 330,
];
let noteIdx = 0;

function ensureAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AC();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

/* Toca uma nota como chip-tune: onda quadrada + envelope decay.
   Isso imita 8-bit (Nintendo/Atari), não os 90s exatamente —
   mas é nostalgia adjacente e serve perfeitamente ao tema. */
function playNote(freq, duration = 0.18) {
  const ctx = ensureAudio();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.value = freq;
  // ataque rápido → decay exponencial
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function tickMelody() {
  playNote(melody[noteIdx]);
  noteIdx = (noteIdx + 1) % melody.length;
}

if (musicBtn) {
  musicBtn.addEventListener("click", () => {
    if (isPlaying) {
      clearInterval(melodyTimer);
      isPlaying = false;
      musicBtn.classList.remove("playing");
      musicBtn.textContent = "▶ TOCAR MUSIQUINHA";
    } else {
      tickMelody();
      melodyTimer = setInterval(tickMelody, 200);
      isPlaying = true;
      musicBtn.classList.add("playing");
      musicBtn.textContent = "■ PAUSAR ♪♪♪";
    }
  });
}

/* ============================================================
   4) CURSOR SPARKLE TRAIL
   Efeito clássico dos 90s (scripts que vendiam .js como "cool
   effects for your homepage"). Versão moderna: throttled e com
   autolimpeza.
   ============================================================ */
const sparkleColors = ["#ff2f9c", "#00eaff", "#39ff14", "#ffff00", "#ff00ff"];
let lastSparkle = 0;

document.addEventListener("mousemove", (e) => {
  const now = performance.now();
  // throttle: no máximo 1 faísca a cada 40ms (≈ 25/seg)
  if (now - lastSparkle < 40) return;
  lastSparkle = now;

  const s = document.createElement("div");
  s.className = "cursor-sparkle";
  s.style.left = e.clientX + "px";
  s.style.top = e.clientY + "px";
  // cor aleatória → cada faísca diferente
  const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
  s.style.color = color;
  s.style.background = color;
  document.body.appendChild(s);

  // autolimpeza via animationend — garantido a disparar ao término
  s.addEventListener("animationend", () => s.remove(), { once: true });
});

/* ============================================================
   5) KONAMI CODE easter egg
   ↑↑↓↓←→←→BA → modo turbo: hue-rotate infinito no body.
   Referência cultural: cheat code da Konami de 1986, fazia
   rounds em jogos como Contra.
   ============================================================ */
const konami = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
];
let konamiIdx = 0;

document.addEventListener("keydown", (e) => {
  // comparação case-insensitive pra aceitar B maiúsculo
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  const expected = konami[konamiIdx];
  if (key === expected) {
    konamiIdx++;
    if (konamiIdx === konami.length) {
      document.body.classList.toggle("turbo");
      // som de vitória (arpejo ascendente)
      const fanfare = [523, 659, 784, 1046, 1318];
      fanfare.forEach((f, i) => {
        setTimeout(() => playNote(f, 0.25), i * 120);
      });
      konamiIdx = 0;
    }
  } else {
    konamiIdx = 0;
  }
});

/* ============================================================
   6) SMOOTH SCROLL para links do menu
   Pequeno polish: os #anchors descem com animação.
   ============================================================ */
document.querySelectorAll('.menu a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* ============================================================
   7) BOAS-VINDAS no console (tradição hacker dos 90s)
   ============================================================ */
console.log(
  "%c★ BEM-VINDO À HOMEPAGE DO LEO SOUZA ★",
  "color:#ff2f9c;font-size:20px;font-weight:bold;text-shadow:2px 2px 0 #00eaff"
);
console.log(
  "%cdica: experimente o Konami Code ↑↑↓↓←→←→BA",
  "color:#39ff14;font-family:monospace"
);
