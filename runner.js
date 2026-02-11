let runnerPos = 120;
let runnerBottom = 80;
let isJumping = false;
let velocityY = 0;
const gravity = 0.6;
const jumpPower = 15;
const groundLevel = 160;

const runner = document.querySelector('.runner');

// Keyboard input
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !isJumping) {
    isJumping = true;
    velocityY = jumpPower;
  }
});

function gameLoop() {
  // Apply gravity
  if (isJumping) {
    velocityY -= gravity;
    runnerBottom += velocityY;

    // Check if runner lands
    if (runnerBottom <= groundLevel) {
      runnerBottom = groundLevel;
      velocityY = 0;
      isJumping = false;
    }
  }

  // Update runner position
  runner.style.bottom = runnerBottom + 'px';
  runner.style.left = runnerPos + 'px';

  requestAnimationFrame(gameLoop);
}

// Start game loop
gameLoop();