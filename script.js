const canvas = document.getElementById('fireworkCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

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

function createRandomFirework() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height * 0.6 + canvas.height * 0.1;
  fireworks.push(new Firework(x, y));
}

function createBigFirework() {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.5 + canvas.height * 0.1;
      fireworks.push(new Firework(x, y));
    }, i * 200);
  }
}

setInterval(createRandomFirework, 2000);

document.addEventListener('click', (e) => {
  fireworks.push(new Firework(e.clientX, e.clientY));
});

function flickerDiyas() {
  const diyas = document.querySelectorAll('.diya');
  diyas.forEach((diya) => {
    const brightness = 0.8 + Math.random() * 0.4;
    diya.style.filter = `brightness(${brightness}) drop-shadow(0 0 ${10 + Math.random() * 10}px #ffd700)`;
  });
}

setInterval(flickerDiyas, 500);