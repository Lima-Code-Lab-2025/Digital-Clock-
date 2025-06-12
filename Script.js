function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

let width, height, fontSize, columns, drops;
const nameWord = "Lima";
let activeWords = {};

function initMatrix() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  fontSize = Math.max(14, width / 80);
  columns = Math.floor(width / fontSize);
  drops = Array.from({ length: columns }, () =>
    Math.floor(Math.random() * height / fontSize)
  );
  activeWords = {};
}
initMatrix();
window.addEventListener('resize', initMatrix);

function getBGColor(alpha = 1) {
  return document.body.classList.contains('dark')
    ? `rgba(0,0,0,${alpha})`
    : `rgba(255,255,255,${alpha})`;
}
function getTextColor() {
  return getComputedStyle(document.body).color;
}

function drawMatrix() {
  ctx.fillStyle = getBGColor(0.1);
  ctx.fillRect(0, 0, width, height);
  ctx.font = fontSize + 'px monospace';
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";

  for (let i = 0; i < columns; i++) {
    ctx.fillStyle = getTextColor();

    if (activeWords[i]) {
      const { startDrop } = activeWords[i];
      const letterIndex = drops[i] - startDrop;

      if (letterIndex >= 0 && letterIndex < nameWord.length) {
        ctx.fillText(nameWord.charAt(letterIndex), i * fontSize, drops[i] * fontSize);
      } else {
        delete activeWords[i];
        ctx.fillText(charset.charAt(Math.floor(Math.random() * charset.length)), i * fontSize, drops[i] * fontSize);
      }
    } else {
      ctx.fillText(charset.charAt(Math.floor(Math.random() * charset.length)), i * fontSize, drops[i] * fontSize);
      if (Math.random() > 0.995) {
        activeWords[i] = { startDrop: drops[i] };
      }
    }

    drops[i]++;
    if (drops[i] * fontSize > height) {
      drops[i] = 0;
    }
  }
}
setInterval(drawMatrix, 33);

// 🔊 Light/Dark Mode Toggle
const toggleBtn = document.getElementById('toggle-mode');
toggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
  toggleBtn.textContent = isDark ? '☀️' : '🌙';

  if (isDark) {
    document.getElementById('dark-sound').play();
  } else {
    document.getElementById('light-sound').play();
  }
});