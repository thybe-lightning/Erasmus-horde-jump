

const hurdles = [];
let speed = 4;          // Startgeschwindigkeit
let score = 0;          // Score
const scoreDisplay = document.querySelector(".score");

const spawnMin = 2500;
const spawnMax = 7000;

let gameOver = false;
let animationId = null;
let spawnTimers = [];
const runnerElem = document.querySelector('.runner');

function spawnHurdle() {
    const hurdle = document.createElement("div");
    hurdle.classList.add("hurdle");

    hurdle.style.left = window.innerWidth + 200 + "px";

    document.body.appendChild(hurdle);
    hurdles.push(hurdle);

    const nextSpawn = Math.random() * (spawnMax - spawnMin) + spawnMin;
    // schedule next spawn only if game not over
    const id = setTimeout(() => {
        if (!gameOver) spawnHurdle();
    }, nextSpawn);
    spawnTimers.push(id);
}

setTimeout(spawnHurdle, 3000);

function rectsOverlap(a, b) {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}

function checkCollision() {
    if (!runnerElem) return;
    const rRect = runnerElem.getBoundingClientRect();

    for (let i = 0; i < hurdles.length; i++) {
        const h = hurdles[i];
        const hRect = h.getBoundingClientRect();
        if (rectsOverlap(rRect, hRect)) {
            stopGame();
            return;
        }
    }
}

function stopGame() {
    if (gameOver) return;
    gameOver = true;

    // stop animation frame
    if (animationId) cancelAnimationFrame(animationId);

    // clear pending spawn timers
    spawnTimers.forEach(id => clearTimeout(id));
    spawnTimers = [];

    // show game over (simple overlay)
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.left = 0;
    overlay.style.top = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.background = 'rgba(0,0,0,0.6)';
    overlay.style.color = '#fff';
    overlay.style.fontSize = '36px';
    overlay.textContent = 'Game Over — Score: ' + score;
    document.body.appendChild(overlay);
    // reset button
    const btn = document.createElement('button');
    btn.textContent = 'Restart';
    btn.style.marginTop = '20px';
    btn.style.padding = '10px 20px';
    btn.style.fontSize = '18px';
    overlay.appendChild(btn);
    btn.addEventListener('click', () => {
        location.reload();
    });
}

function update() {
    if (gameOver) return;

    // Geschwindigkeit langsam erhöhen
    speed += 0.0015;

    for (let i = hurdles.length - 1; i >= 0; i--) {
        const h = hurdles[i];
        const x = parseInt(h.style.left);

        h.style.left = (x - speed) + "px";

        // Wenn Hürde links raus ist → Score +1
        if (x < -200) {
            h.remove();
            hurdles.splice(i, 1);

            score++;
            scoreDisplay.textContent = "Score: " + score;
        }
    }

    // collision check
    checkCollision();

    animationId = requestAnimationFrame(update);
}

update();
