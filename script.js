
/* ==================================
   LITTLE LETTER - INTERACTIONS
   ================================== */

const home = document.getElementById("home");
const letterPage = document.getElementById("letterPage");
const ending = document.getElementById("ending");

const envelope = document.getElementById("envelope");
const openButton = document.getElementById("openButton");
const finishButton = document.getElementById("finishButton");
const restartButton = document.getElementById("restartButton");

const musicButton = document.getElementById("musicButton");
const backgroundMusic = document.getElementById("backgroundMusic");
const backgroundBubbles = document.getElementById("backgroundBubbles");

let musicPlaying = false;

// Berpindah ke halaman yang dipilih
function showScreen(screen) {
  [home, letterPage, ending].forEach((page) => {
    page.classList.remove("active");
  });

  screen.classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// Membuka amplop dan surat
openButton.addEventListener("click", () => {
  envelope.classList.add("open");
  openButton.disabled = true;
  openButton.textContent = "Membuka surat...";

  setTimeout(() => {
    showScreen(letterPage);
    openButton.disabled = false;
    openButton.innerHTML = 'Buka suratku <span>↗</span>';
  }, 750);
});

// Melanjutkan ke halaman penutup
finishButton.addEventListener("click", () => {
  showScreen(ending);
});

// Kembali ke halaman awal
restartButton.addEventListener("click", () => {
  envelope.classList.remove("open");
  showScreen(home);
});

// Musik opsional
musicButton.addEventListener("click", async () => {
  if (musicPlaying) {
    backgroundMusic.pause();
    musicPlaying = false;
    musicButton.textContent = "♫ Musik: Mati";
    return;
  }

  try {
    await backgroundMusic.play();
    musicPlaying = true;
    musicButton.textContent = "♫ Musik: Nyala";
  } catch (error) {
    musicButton.textContent = "Musik belum tersedia";

    alert(
      "Musik belum bisa diputar. Pastikan file music.mp3 " +
      "sudah ada di folder assets."
    );
  }
});

// Menyesuaikan tombol jika audio dihentikan
backgroundMusic.addEventListener("ended", () => {
  musicPlaying = false;
  musicButton.textContent = "♫ Musik: Mati";
});

// Gelembung yang melayang di background
function createBubble(initial = false) {
  const bubble = document.createElement("span");
  const size = 8 + Math.random() * 24;

  bubble.className = "floating-bubble";
  bubble.style.left = `${Math.random() * 100}%`;
  bubble.style.width = bubble.style.height = `${size}px`;
  bubble.style.animationDuration = `${8 + Math.random() * 10}s`;
  if (initial) bubble.style.animationDelay = `-${Math.random() * 8}s`;

  backgroundBubbles.appendChild(bubble);
  bubble.addEventListener("animationend", () => bubble.remove());
}

for (let i = 0; i < 12; i++) createBubble(true);
setInterval(createBubble, 900);

// Percikan gelembung saat dimaafkan
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

function burst(x, y, n = 60) {
  if (reduceMotion) return;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("i");
    p.className = "spark";
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    document.body.appendChild(p);

    const a = Math.random() * Math.PI * 2;
    const d = 60 + Math.random() * 170;
    p.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px) scale(.2)`, opacity: 0 }
      ],
      { duration: 900 + Math.random() * 600, easing: "cubic-bezier(.2,.7,.3,1)" }
    ).onfinish = () => p.remove();
  }
}

// Pertanyaan maaf: 2 pilihan
const NO_LABELS = ["Belum dulu", "Yakin nih?", "Coba pikir lagi", "Tombolnya kabur"];
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const choices = document.getElementById("choices");
const reply = document.getElementById("reply");
let dodge = 0;

// Tombol "Belum dulu" kabur kalau didekati / disentuh
function dodgeNo(e) {
  e.preventDefault();
  noButton.textContent = NO_LABELS[++dodge % NO_LABELS.length];
  noButton.classList.add("flee");
  noButton.style.left = `${12 + Math.random() * (innerWidth - noButton.offsetWidth - 24)}px`;
  noButton.style.top = `${12 + Math.random() * (innerHeight - noButton.offsetHeight - 24)}px`;
}
["pointerenter", "pointerdown", "click"].forEach((t) => noButton.addEventListener(t, dodgeNo));

// Tombol "Iya, dimaafin"
yesButton.addEventListener("click", () => {
  const r = yesButton.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2);
  choices.hidden = true;
  reply.hidden = false;
  
  // TAMBAHKAN BARIS INI UNTUK MEMUNCULKAN TOMBOL RESTART
  restartButton.hidden = false; 
});

// Reset pertanyaan saat baca ulang
restartButton.addEventListener("click", () => {
  choices.hidden = false;
  reply.hidden = true;
  noButton.classList.remove("flee");
  noButton.style.left = noButton.style.top = "";
  noButton.textContent = NO_LABELS[0];
  dodge = 0;
  
  // TAMBAHKAN BARIS INI UNTUK MENYEMBUNYIKAN KEMBALI TOMBOL RESTART
  restartButton.hidden = true; 
});