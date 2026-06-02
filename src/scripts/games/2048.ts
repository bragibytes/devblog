// 2048 game module - extracted for code splitting
export function init2048(container: HTMLElement, instructions: HTMLElement): () => void {
  container.innerHTML = `
    <div style="width:420px">
      <div class="flex justify-between mb-3 text-sm">
        <div>Score: <span id="s">0</span></div>
        <button id="n" class="px-4 py-1 bg-[var(--accent)] text-black rounded text-sm">New</button>
      </div>
      <div id="b" style="width:420px;height:420px;background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:12px;position:relative"></div>
    </div>
  `;
  instructions.textContent = "Arrows / WASD / Swipe • Tap New to restart";

  const boardEl = container.querySelector('#b') as HTMLElement;
  const sEl = container.querySelector('#s') as HTMLElement;
  const nBtn = container.querySelector('#n') as HTMLButtonElement;

  let g: number[][] = Array(4).fill(null).map(() => Array(4).fill(0));
  let sc = 0;

  function add() {
    const e: [number, number][] = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (!g[r][c]) e.push([r, c]);
    if (e.length) {
      const [r, c] = e[Math.floor(Math.random() * e.length)];
      g[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function rdr() {
    boardEl.innerHTML = '';
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const d = document.createElement('div');
        d.style.cssText = `position:absolute;width:90px;height:90px;left:${c * 102 + 12}px;top:${r * 102 + 12}px;background:#27272a;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;color:white;`;
        if (g[r][c]) {
          d.textContent = g[r][c].toString();
          d.style.background = g[r][c] >= 512 ? '#3b82f6' : '#52525b';
        }
        boardEl.appendChild(d);
      }
    }
    sEl.textContent = sc.toString();
  }

  function slide(r: number[]) {
    let a = r.filter(x => x);
    for (let i = 0; i < a.length - 1; i++) if (a[i] === a[i + 1]) { a[i] *= 2; sc += a[i]; a[i + 1] = 0; }
    a = a.filter(x => x);
    while (a.length < 4) a.push(0);
    return a;
  }

  function mv(d: string) {
    const o = JSON.stringify(g);
    if (d === 'left') g = g.map(slide);
    if (d === 'right') g = g.map(r => slide([...r].reverse()).reverse());
    if (d === 'up') {
      for (let c = 0; c < 4; c++) {
        let col = g.map(row => row[c]);
        col = slide(col);
        g.forEach((row, r) => row[c] = col[r]);
      }
    }
    if (d === 'down') {
      for (let c = 0; c < 4; c++) {
        let col = g.map(row => row[c]);
        col = slide([...col].reverse()).reverse();
        g.forEach((row, r) => row[c] = col[r]);
      }
    }
    if (JSON.stringify(g) !== o) { add(); rdr(); }
  }

  const keyHandler = (e: KeyboardEvent) => {
    if (['ArrowLeft', 'a', 'A'].includes(e.key)) mv('left');
    if (['ArrowRight', 'd', 'D'].includes(e.key)) mv('right');
    if (['ArrowUp', 'w', 'W'].includes(e.key)) mv('up');
    if (['ArrowDown', 's', 'S'].includes(e.key)) mv('down');
  };
  document.addEventListener('keydown', keyHandler);

  // Mobile swipe support
  let touchStartX = 0, touchStartY = 0;
  const touchStart = (e: TouchEvent) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  };
  const touchEnd = (e: TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30) mv('right');
      else if (dx < -30) mv('left');
    } else {
      if (dy > 30) mv('down');
      else if (dy < -30) mv('up');
    }
  };
  if (boardEl) {
    boardEl.addEventListener('touchstart', touchStart, { passive: true });
    boardEl.addEventListener('touchend', touchEnd, { passive: true });
  }

  nBtn.onclick = () => {
    g = Array(4).fill(null).map(() => Array(4).fill(0));
    sc = 0; add(); add(); rdr();
  };

  add(); add(); rdr();

  return () => {
    document.removeEventListener('keydown', keyHandler);
    if (boardEl) {
      boardEl.removeEventListener('touchstart', touchStart);
      boardEl.removeEventListener('touchend', touchEnd);
    }
  };
}
