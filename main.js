const checkboxes = document.querySelectorAll('input');
const button = document.querySelector('button');
const canvas = document.querySelector('canvas');
const container = document.querySelector('.canvas-container');
canvas.style.opacity = 1;
const computedStyle = getComputedStyle(container);
canvas.width = parseInt(computedStyle.width);
canvas.height = parseInt(computedStyle.height);
const ctx = canvas.getContext('2d');

let circles = [];
let canvasId;
const radius = window.innerWidth > 600 ? 30 : 7;
const seeker = window.innerWidth > 600 ? radius * 8 : radius * 12;
const colors = ['#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#2F4F4F', '#696969', '#A52A2A', '#8B4513'];

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cancelAnimationFrame(canvasId);

  for (let i = 0; i < circles.length; i++) {
    let circleA = circles[i];
    circleA.x += circleA.dx;
    circleA.y += circleA.dy;

    if (
      Math.pow(circleA.x, 2) + Math.pow(circleA.y - canvas.height / 2, 2) < Math.pow(seeker, 2) ||
      Math.pow(circleA.x - canvas.width, 2) + Math.pow(circleA.y - canvas.height / 2, 2) < Math.pow(seeker, 2)
    ) {
      circleA.dx = 0;
      circleA.dy = 0;

      const label = Array.from(checkboxes).find(checkbox => checkbox.parentElement.textContent === circleA.name).parentElement;

      if (Math.pow(circleA.x, 2) + Math.pow(circleA.y - canvas.height / 2, 2) < Math.pow(seeker, 2)) {
        label.style.color = 'red';
      }

      if (Math.pow(circleA.x - canvas.width, 2) + Math.pow(circleA.y - canvas.height / 2, 2) < Math.pow(seeker, 2)) {
        label.style.color = 'blue';
      }
    } else {
      if (circleA.x - radius < 0 || circleA.x + radius > canvas.width) {
        circleA.dx = -circleA.dx;
      }
      if (circleA.y - radius < 0 || circleA.y + radius > canvas.height) {
        circleA.dy = -circleA.dy;
      }
    }

    for (let j = i + 1; j < circles.length; j++) {
      let circleB = circles[j];
    
      let dx = circleB.x - circleA.x;
      let dy = circleB.y - circleA.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
    
      if (distance < radius * 2) {
        if (circleA.dx === 0 && circleA.dy === 0) {
          circleB.dx = -circleB.dx;
          circleB.dy = -circleB.dy;
        }
        else if (circleB.dx === 0 && circleB.dy === 0) {
          circleA.dx = -circleA.dx;
          circleA.dy = -circleA.dy;
        }
        else {
          if ((circleA.dx > 0 && circleB.dx < 0) || (circleA.dx < 0 && circleB.dx > 0)) {
            circleA.dx = -circleA.dx;
            circleB.dx = -circleB.dx;
          }
        
          if ((circleA.dy > 0 && circleB.dy < 0) || (circleA.dy < 0 && circleB.dy > 0)) {
            circleA.dy = -circleA.dy;
            circleB.dy = -circleB.dy;
          }
        }
      }
    }

    ctx.beginPath();
    ctx.arc(circleA.x, circleA.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = circleA.color;
    ctx.fill();

    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(circleA.name, circleA.x, circleA.y);
  }

  ctx.beginPath();
  ctx.arc(0, canvas.height / 2, seeker, 0, 2 * Math.PI);
  ctx.strokeStyle = 'red';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(canvas.width, canvas.height / 2, seeker, 0, 2 * Math.PI);
  ctx.strokeStyle = 'blue';
  ctx.stroke();

  canvasId = requestAnimationFrame(draw);
};

const handleCheckboxes = () => {
  const names = [];
  checkboxes.forEach(checkbox => {
    const label = checkbox.parentElement;
    label.style.color = 'black';
    if (checkbox.checked) {
      names.push(label.textContent);
    }
  });
  circles = names.map((name, i) => {
    const dx = (Math.random() - 0.5) * 10;
    const dy = (Math.random() - 0.5) * 10;
    const x = Math.random() * (canvas.width - 2 * radius) + radius;
    const y = Math.random() * (canvas.height - 2 * radius) + radius;
    const color = colors[i % colors.length];
    return { x, y, dx, dy, name, color };
  });
};

button.onclick = () => {
  handleCheckboxes();
  draw();
};

button.ontouchstart = () => button.classList.add('active');
button.ontouchend = () => button.classList.remove('active');

canvas.addEventListener('click', function(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const clickRadius = radius * 1.5;

  const clickedCircle = circles.find(circle => {
    const distance = Math.sqrt(Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2));
    return distance < clickRadius;
  });

  if (clickedCircle) {
    circles = circles.filter(circle => circle !== clickedCircle);
    const dx = (Math.random() - 0.5) * 10;
    const dy = (Math.random() - 0.5) * 10;
    const x = Math.random() * (canvas.width - 2 * radius) + radius;
    const y = Math.random() * (canvas.height - 2 * radius) + radius;
    circles.push({ x, y, dx, dy, name: clickedCircle.name, color: clickedCircle.color });
  }
});
