// ===== 움직이는 밤하늘: 반짝이는 별, 별똥별, 마우스를 따라오는 깊이감 =====
(function () {
  const sky = document.getElementById("sky");
  const cv = document.getElementById("stars");
  const ctx = cv.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const css = getComputedStyle(document.documentElement);
  const cStar = css.getPropertyValue("--color-neutral-200").trim();
  const cTint = css.getPropertyValue("--color-accent-300").trim();
  let w = 0, h = 0, stars = [], shots = [];
  let px = 0, py = 0, tx = 0, ty = 0, last = 0, nextShot = 2200, raf = 0;

  function resize() {
    const dpr = 1;   // 고해상도로 그리면 칠할 픽셀이 4배라 랙이 생겨요. 별은 작은 점이라 1배로도 충분해요
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(240, (w * h) / 6500));
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * w, y: Math.random() * h,
        r: 0.3 + Math.pow(Math.random(), 3) * 1.3,   // 대부분 작고, 가끔 큰 별
        z: 0.2 + Math.random() * 0.8,                 // 깊이 (클수록 가까워요)
        p: Math.random() * 6.283, s: 0.5 + Math.random() * 1.6,
        tint: Math.random() < 0.3
      });
    }
    if (reduce) draw(0);
  }

  function spawnShot() {
    const a = (148 + Math.random() * 20) * Math.PI / 180;   // 왼쪽 아래로
    const v = 620 + Math.random() * 380;
    shots.push({ x: w * (0.35 + Math.random() * 0.65), y: h * Math.random() * 0.45, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 0.8 + Math.random() * 0.5, len: 110 + Math.random() * 90 });
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const tw = reduce ? 0.75 : 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t / 1000 * s.s + s.p));
      let x = s.x - px * s.z * 30;
      let y = s.y - py * s.z * 30 - (t * 0.0035 * s.z);     // 아주 천천히 위로 흘러요
      x = ((x % w) + w) % w; y = ((y % h) + h) % h;
      ctx.globalAlpha = tw * (0.35 + 0.65 * s.z);
      ctx.fillStyle = s.tint ? cTint : cStar;
      ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.283); ctx.fill();
      if (s.r > 1.2) {                                        // 큰 별은 십자 빛
        const l = s.r * 4.5 * tw;
        ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(x - l, y); ctx.lineTo(x + l, y); ctx.moveTo(x, y - l); ctx.lineTo(x, y + l); ctx.stroke();
      }
    }
    for (let i = 0; i < shots.length; i++) {
      const m = shots[i];
      const k = m.life / m.max;
      const d = Math.hypot(m.vx, m.vy);
      const tx2 = m.x - (m.vx / d) * m.len, ty2 = m.y - (m.vy / d) * m.len;
      const g = ctx.createLinearGradient(m.x, m.y, tx2, ty2);
      g.addColorStop(0, cStar); g.addColorStop(0.3, cTint); g.addColorStop(1, "transparent");
      ctx.globalAlpha = Math.sin(Math.PI * Math.min(k, 1)) * 0.9;
      ctx.strokeStyle = g; ctx.lineWidth = 1.4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(tx2, ty2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function frame(t) {
    if (t - last < 33) { raf = requestAnimationFrame(frame); return; }   // 초당 30번만 그려요 (60번 → 절반)
    const dt = Math.min(t - (last || t), 60); last = t;
    px += (tx - px) * 0.04; py += (ty - py) * 0.04;
    nextShot -= dt;
    if (nextShot <= 0) { spawnShot(); nextShot = 3500 + Math.random() * 5500; }
    for (let i = shots.length - 1; i >= 0; i--) {
      const m = shots[i];
      m.life += dt / 1000; m.x += m.vx * dt / 1000; m.y += m.vy * dt / 1000;
      if (m.life >= m.max) shots.splice(i, 1);
    }
    draw(t);
    raf = requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  resize();
  if (reduce) return;
  window.addEventListener("pointermove", function (e) {
    tx = e.clientX / window.innerWidth - 0.5; ty = e.clientY / window.innerHeight - 0.5;
    sky.style.setProperty("--px", tx.toFixed(3)); sky.style.setProperty("--py", ty.toFixed(3));
  });
  // 누른 자리에서 별똥별 하나
  window.addEventListener("pointerdown", function () { if (shots.length < 3) spawnShot(); });
  document.addEventListener("visibilitychange", function () {
    cancelAnimationFrame(raf);
    if (!document.hidden) { last = 0; raf = requestAnimationFrame(frame); }
  });
  raf = requestAnimationFrame(frame);
})();
