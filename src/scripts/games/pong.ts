// Pong game module - extracted for code splitting
export function initPong(container: HTMLElement, instructions: HTMLElement): () => void {
  container.innerHTML = `
    <div class="w-full max-w-[640px]">
      <canvas id="pong-canvas" width="640" height="400" class="border border-[var(--border)] rounded-lg bg-black cursor-crosshair w-full"></canvas>
      <div class="flex gap-3 justify-center mt-4">
        <button id="p-start" class="px-6 py-2 bg-[var(--accent)] text-black rounded-lg font-medium text-sm">Start</button>
        <button id="p-pause" class="px-6 py-2 border border-[var(--border)] rounded-lg text-sm" disabled>Pause</button>
        <button id="p-reset" class="px-6 py-2 border border-[var(--border)] rounded-lg text-sm">Reset</button>
      </div>
    </div>
  `;
  instructions.textContent = "Mouse or ↑ ↓ keys. First to 11 wins.";

  const canvas = container.querySelector('#pong-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  const startBtn = container.querySelector('#p-start') as HTMLButtonElement;
  const pauseBtn = container.querySelector('#p-pause') as HTMLButtonElement;
  const resetBtn = container.querySelector('#p-reset') as HTMLButtonElement;

  let state = { running: false, paused: false, ps: 0, as: 0 };
  let ball = { x: 320, y: 200, vx: 4, vy: 3 };
  let py = 160, ay = 160, my = 200;

  function resetB() {
    ball.x = 320; ball.y = 200;
    ball.vx = (Math.random() > 0.5 ? 1 : -1) * 3.5;
    ball.vy = Math.random() * 4 - 2;
  }

  function draw() {
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, 640, 400);
    ctx.fillStyle = '#34d399'; ctx.fillRect(0, py, 10, 80); ctx.fillRect(630, ay, 10, 80);
    ctx.fillStyle = '#fff'; ctx.fillRect(ball.x, ball.y, 8, 8);
    ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 42px monospace'; ctx.textAlign = 'center';
    ctx.fillText(state.ps.toString(), 160, 60); ctx.fillText(state.as.toString(), 480, 60);
  }

  function update() {
    if (!state.running || state.paused) return;
    const t = my - 40; py += (t - py) * 0.2; py = Math.max(0, Math.min(320, py));
    const ac = ay + 40; const sp = 3.6 + (state.ps + state.as) * 0.06;
    if (ball.y < ac - 8) ay -= sp; else if (ball.y > ac + 8) ay += sp; ay = Math.max(0, Math.min(320, ay));
    ball.x += ball.vx; ball.y += ball.vy;
    if (ball.y <= 0 || ball.y >= 400) ball.vy = -ball.vy;
    if (ball.x <= 12 && ball.y >= py && ball.y <= py + 80) { ball.vx = Math.abs(ball.vx) * 1.05; ball.vy += (ball.y - (py + 40)) * 0.1; }
    if (ball.x >= 628 && ball.y >= ay && ball.y <= ay + 80) { ball.vx = -Math.abs(ball.vx) * 1.05; ball.vy += (ball.y - (ay + 40)) * 0.1; }
    if (ball.x < 0) { state.as++; resetB(); }
    if (ball.x > 640) { state.ps++; resetB(); }
    if (state.ps >= 11 || state.as >= 11) state.running = false;
  }

  function loop() {
    update(); draw();
    if (state.running && !state.paused) requestAnimationFrame(loop);
  }

  const mouseHandler = (e: MouseEvent) => {
    const r = canvas.getBoundingClientRect();
    my = ((e.clientY - r.top) / r.height) * 400;
  };
  container.addEventListener('mousemove', mouseHandler);

  startBtn.onclick = () => {
    if (!state.running) {
      state.running = true; state.paused = false;
      if (state.ps >= 11 || state.as >= 11) { state.ps = 0; state.as = 0; resetB(); }
      startBtn.textContent = 'Resume'; pauseBtn.disabled = false; loop();
    } else {
      state.paused = !state.paused;
    }
  };
  pauseBtn.onclick = () => { state.paused = !state.paused; };
  resetBtn.onclick = () => {
    state.running = false; state.paused = false; state.ps = 0; state.as = 0; resetB();
    startBtn.textContent = 'Start'; pauseBtn.disabled = true; draw();
  };
  canvas.onclick = () => { if (!state.running) { state.running = true; loop(); } };

  resetB(); draw();

  return () => {
    state.running = false;
    container.removeEventListener('mousemove', mouseHandler);
  };
}
