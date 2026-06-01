// Snake game module - extracted for code splitting
export function initSnake(container: HTMLElement, instructions: HTMLElement): () => void {
  container.innerHTML = `
    <div class="flex flex-col items-center">
      <div class="flex justify-between w-[420px] mb-3 text-sm">
        <div>Score: <span id="snake-score">0</span></div>
        <div class="flex gap-2">
          <button id="snake-start" class="px-4 py-1 bg-[var(--accent)] text-black rounded text-sm">Start</button>
          <button id="snake-pause" class="px-4 py-1 border border-[var(--border)] rounded text-sm" disabled>Pause</button>
          <button id="snake-reset" class="px-4 py-1 border border-[var(--border)] rounded text-sm">Reset</button>
        </div>
      </div>
      <canvas id="snake-canvas" width="420" height="420" class="border border-[var(--border)] rounded-lg bg-[#0a0a0a] touch-none"></canvas>
    </div>
  `;
  instructions.textContent = "Arrow keys / WASD • Swipe on mobile. Tap to start.";

  const canvas = container.querySelector('#snake-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  const scoreEl = container.querySelector('#snake-score') as HTMLElement;
  const startBtn = container.querySelector('#snake-start') as HTMLButtonElement;
  const pauseBtn = container.querySelector('#snake-pause') as HTMLButtonElement;
  const resetBtn = container.querySelector('#snake-reset') as HTMLButtonElement;

  const GRID = 21;
  const CELL = 20;
  let snake: { x: number; y: number }[] = [{ x: 10, y: 10 }];
  let dir = { x: 1, y: 0 };
  let food = { x: 15, y: 10 };
  let score = 0;
  let running = false;
  let paused = false;
  let loopId: number | null = null;

  function placeFood() {
    do {
      food = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    } while (snake.some(s => s.x === food.x && s.y === food.y));
  }

  function draw() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#222';
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(canvas.width, i * CELL); ctx.stroke();
    }

    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);

    ctx.fillStyle = '#67e8f9';
    snake.forEach((seg, i) => {
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
      if (i === 0) {
        ctx.fillStyle = '#0e7490';
        ctx.fillRect(seg.x * CELL + 5, seg.y * CELL + 5, 6, 6);
        ctx.fillStyle = '#67e8f9';
      }
    });
  }

  function update() {
    if (!running || paused) return;

    const head = { ...snake[0] };
    head.x += dir.x; head.y += dir.y;

    if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) { gameOver(); return; }
    if (snake.some((s, i) => i > 0 && s.x === head.x && s.y === head.y)) { gameOver(); return; }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 10; scoreEl.textContent = score.toString();
      placeFood();
    } else {
      snake.pop();
    }
  }

  function gameLoop() {
    if (!running || paused) return;
    update(); draw();
    loopId = window.setTimeout(gameLoop, 140);
  }

  function gameOver() {
    running = false;
    if (loopId) clearTimeout(loopId);
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 28px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '16px sans-serif';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    startBtn.textContent = 'Restart';
    pauseBtn.disabled = true;
  }

  function reset() {
    if (loopId) clearTimeout(loopId);
    snake = [{ x: 10, y: 10 }];
    dir = { x: 1, y: 0 };
    score = 0;
    scoreEl.textContent = '0';
    placeFood();
    running = false; paused = false;
    startBtn.textContent = 'Start';
    pauseBtn.disabled = true;
    draw();
  }

  function changeDirection(newDir: { x: number; y: number }) {
    if (newDir.x === -dir.x && newDir.y === -dir.y) return;
    dir = newDir;
  }

  const keyHandler = (e: KeyboardEvent) => {
    if (!running || paused) return;
    if (['ArrowUp', 'w', 'W'].includes(e.key)) changeDirection({ x: 0, y: -1 });
    if (['ArrowDown', 's', 'S'].includes(e.key)) changeDirection({ x: 0, y: 1 });
    if (['ArrowLeft', 'a', 'A'].includes(e.key)) changeDirection({ x: -1, y: 0 });
    if (['ArrowRight', 'd', 'D'].includes(e.key)) changeDirection({ x: 1, y: 0 });
  };
  document.addEventListener('keydown', keyHandler);

  let touchStartX = 0, touchStartY = 0;
  const touchStart = (e: TouchEvent) => { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; };
  const touchEnd = (e: TouchEvent) => {
    if (!running || paused) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30) changeDirection({ x: 1, y: 0 });
      else if (dx < -30) changeDirection({ x: -1, y: 0 });
    } else {
      if (dy > 30) changeDirection({ x: 0, y: 1 });
      else if (dy < -30) changeDirection({ x: 0, y: -1 });
    }
  };
  canvas.addEventListener('touchstart', touchStart, { passive: true });
  canvas.addEventListener('touchend', touchEnd, { passive: true });

  startBtn.onclick = () => {
    if (!running) {
      running = true; paused = false;
      startBtn.textContent = 'Resume'; pauseBtn.disabled = false;
      gameLoop();
    } else {
      paused = !paused;
      if (!paused) gameLoop();
    }
  };
  pauseBtn.onclick = () => { paused = !paused; if (!paused) gameLoop(); };
  resetBtn.onclick = reset;
  canvas.onclick = () => {
    if (!running) { running = true; gameLoop(); startBtn.textContent = 'Resume'; pauseBtn.disabled = false; }
  };

  reset(); draw();

  return () => {
    if (loopId) clearTimeout(loopId);
    document.removeEventListener('keydown', keyHandler);
    canvas.removeEventListener('touchstart', touchStart);
    canvas.removeEventListener('touchend', touchEnd);
  };
}
