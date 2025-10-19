const canvas = document.getElementById('fireworkCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Particle class for fireworks
class Particle {
  constructor(x, y, color, velocity) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
    this.gravity = 0.02;
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.y += this.gravity;
    this.alpha -= 0.01;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Firework class to handle explosion of particles
class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.particles = [];
    this.colors = ['#ffd700', '#ff6b35', '#d84315', '#ff1744', '#e91e63', '#673ab7'];

    for (let i = 0; i < 50; i++) {
      const angle = (Math.PI * 2 * i) / 50;
      const speed = Math.random() * 6 + 2;
      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      };
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.particles.push(new Particle(x, y, color, velocity));
    }
  }

  update() {
    this.particles.forEach((p) => p.update());
    this.particles = this.particles.filter((p) => p.alpha > 0);
  }

  draw() {
    this.particles.forEach((p) => p.draw());
  }

  isDead() {
    return this.particles.length === 0;
  }
}

let fireworks = [];

// Animation loop
function animate() {
  ctx.fillStyle = 'rgba(26, 15, 46, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((firework) => {
    firework.update();
    firework.draw();
  });

  fireworks = fireworks.filter((firework) => !firework.isDead());

  requestAnimationFrame(animate);
}

animate();

// Create random fireworks periodically
function createRandomFirework() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height * 0.6 + canvas.height * 0.1;
  fireworks.push(new Firework(x, y));
}

setInterval(createRandomFirework, 2000);

// Fireworks on click
document.addEventListener('click', (e) => {
  fireworks.push(new Firework(e.clientX, e.clientY));
});

// Personalized wish link generation logic
window.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('friendName');
  const msgInput = document.getElementById('friendMessage');
  const btn = document.getElementById('generateLinkBtn');
  const output = document.getElementById('linkOutput');

  function generateWishLink(name, msg) {
    // Adjust base URL accordingly if hosted in a GitHub repo folder
    const base = `${window.location.origin}/friend-wish-display.html`;
    const params = new URLSearchParams({
      name: encodeURIComponent(name),
      msg: encodeURIComponent(msg),
    });
    return `${base}?${params.toString()}`;
  }

  btn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const msg = msgInput.value.trim();

    if (!name) {
      alert("Please enter your friend's name.");
      return;
    }
    if (!msg) {
      alert('Please enter a personalized message.');
      return;
    }

    const url = generateWishLink(name, msg);
    output.textContent = `Your personalized wish link: ${url}`;
    output.style.cursor = 'pointer';

    output.onclick = () => {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied! Share it with your friend.');
      });
    };
  });
});