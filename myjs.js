

const hurdles = [];
let speed = 4;          // Startgeschwindigkeit
let score = 0;          // Score
const scoreDisplay = document.querySelector(".score");

const spawnMin = 2500;
const spawnMax = 7000;

function spawnHurdle() {
    const hurdle = document.createElement("div");
    hurdle.classList.add("hurdle");

    hurdle.style.left = window.innerWidth + 200 + "px";

    document.body.appendChild(hurdle);
    hurdles.push(hurdle);

    const nextSpawn = Math.random() * (spawnMax - spawnMin) + spawnMin;
    setTimeout(spawnHurdle, nextSpawn);
}

setTimeout(spawnHurdle, 3000);

function update() {
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

    requestAnimationFrame(update);
}

update();
