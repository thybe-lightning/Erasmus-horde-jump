const hurdles = [];
let speed = 10;          // Startgeschwindigkeit
let score = 0;          // Score
const scoreDisplay = document.querySelector(".score");

const spawnMin = 550;
const spawnMax = 1000;

let gameOver = false;
let animationId = null;
let spawnTimers = [];
const runnerElem = document.querySelector('.runner');
let started = false;
const laneLineElem = document.querySelector('.lane-line');

// ensure lane-line and ground animations are paused until start
if (laneLineElem) laneLineElem.style.animationPlayState = 'paused';
const groundElem = document.querySelector('.ground');
if (groundElem) groundElem.style.animationPlayState = 'paused';

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
};
function rectsOverlap(a, b) {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}

function checkCollision() {
    if (!runnerElem) return;
    const rRect = runnerElem.getBoundingClientRect();

    for (let i = 0; i < hurdles.length; i++) {
        const h = hurdles[i];
        const hRect = h.getBoundingClientRect();
        
        // Adjust hitbox to match original unscaled size (40px × 60px before 225% scale)
        const originalWidth = 40;
        const originalHeight = 60;
        const widthReduction = (hRect.width - originalWidth) / 2;
        const heightReduction = (hRect.height - originalHeight) / 2;
        
        const adjustedHRect = {
            left: hRect.left + widthReduction,
            right: hRect.right - widthReduction,
            top: hRect.top + heightReduction,
            bottom: hRect.bottom - heightReduction
        };
        
        if (rectsOverlap(rRect, adjustedHRect)) {
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
    // pause lane-line + ground visuals
    if (laneLineElem) laneLineElem.style.animationPlayState = 'paused';
    if (groundElem) groundElem.style.animationPlayState = 'paused';
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

function startGame() {
    if (started) return;
    started = true;
    // start runner loop if available
    if (window.startRunner) window.startRunner();

    // schedule first hurdle spawn after 3s
    const firstId = setTimeout(() => {
        if (!gameOver) spawnHurdle();
    }, 0);
    spawnTimers.push(firstId);

    // start the update loop
    update();
    // start lane-line + ground animations
    if (laneLineElem) laneLineElem.style.animationPlayState = 'running';
    if (groundElem) groundElem.style.animationPlayState = 'running';
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') startGame();
});