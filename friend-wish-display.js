const canvas = document.getElementById('fireworkCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Particle class for individual spark particles
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

// Firework class to create explosion with many particles
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
    this.particles.forEach(p => p.update());
    this.particles = this.particles.filter(p => p.alpha > 0);
  }

  draw() {
    this.particles.forEach(p => p.draw());
  }

  isDead() {
    return this.particles.length === 0;
  }
}

let fireworks = [];

// Main animation loop
function animate() {
  // Draw semi-transparent background for trail effect
  ctx.fillStyle = 'rgba(26, 15, 46, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update and draw fireworks
  fireworks.forEach(firework => {
    firework.update();
    firework.draw();
  });

  // Remove dead fireworks
  fireworks = fireworks.filter(firework => !firework.isDead());

  requestAnimationFrame(animate);
}

animate();

// Periodically create random fireworks on screen
function createRandomFirework() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height * 0.6 + canvas.height * 0.1;
  fireworks.push(new Firework(x, y));
}

setInterval(createRandomFirework, 2000);

// Create firework where user clicks
document.addEventListener('click', e => {
  fireworks.push(new Firework(e.clientX, e.clientY));
});

// Parse URL parameters using URLSearchParams for proper decoding
function getUrlParams() {
  const params = {};
  const urlParams = new URLSearchParams(window.location.search);
  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }
  return params;
}

// Display the personalized wish on the page
function showPersonalizedWish() {
  const params = getUrlParams();
  if (params.name && params.msg) {
    document.getElementById('title-main').textContent = `शुभ दीपावली, ${params.name}!`;
    document.getElementById('wishHeading').textContent = `To ${params.name},`;
    document.getElementById('wishMessageContent').textContent = params.msg;
    return true;
  }
  return false;
}

window.addEventListener('DOMContentLoaded', () => {
  showPersonalizedWish();

  // Share your wish button functionality
  const shareBtn = document.getElementById('shareWishBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const params = getUrlParams();
      const shareLink = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(params.name)}&msg=${encodeURIComponent(params.msg)}`;
      navigator.clipboard.writeText(shareLink).then(() => {
        alert('Wish link copied! Share it with your friends.');
      });
    });
  }
});
