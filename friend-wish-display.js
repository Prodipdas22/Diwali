const canvas = document.getElementById('fireworkCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Firework classes and animation same as main script...

let fireworks = [];

function animate() {
  ctx.fillStyle = 'rgba(26, 15, 46, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  fireworks.forEach((fw) => {
    fw.update();
    fw.draw();
  });
  fireworks = fireworks.filter((fw) => !fw.isDead());
  requestAnimationFrame(animate);
}

animate();

function createRandomFirework() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height * 0.6 + canvas.height * 0.1;
  fireworks.push(new Firework(x, y));
}

setInterval(createRandomFirework, 2000);

document.addEventListener('click', (e) => {
  fireworks.push(new Firework(e.clientX, e.clientY));
});

function getUrlParams() {
  const params = {};
  window.location.search
    .substring(1)
    .split('&')
    .forEach((pair) => {
      const [key, value] = pair.split('=');
      if (key) params[key] = decodeURIComponent(value || '');
    });
  return params;
}

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

  
  }
});
