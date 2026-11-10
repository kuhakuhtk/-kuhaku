// ===== 밤하늘 배경 =====
// 달 하나, 깜빡이는 작은 별, 반짝이는 큰 별, 가끔 지나가는 별똥별을 만들어요.
// 개수를 바꾸고 싶으면 아래 숫자만 고치면 돼요.
(function () {
  const layer = document.querySelector(".bg");
  if (!layer) return;

  const small = window.innerWidth < 600;
  const SMALL_STARS = small ? 60 : 110;   // 작은 별 개수
  const BIG_STARS = small ? 5 : 9;        // 큰 반짝이 별 개수
  const SHOOTING = 2;                     // 별똥별 개수 (동시에 날아다니는 수)

  const SPARKLE = '<svg viewBox="0 0 24 24"><path d="M12 1c.8 6.4 3.6 10.2 11 11-7.4.8-10.2 3.6-11 11-.8-7.4-3.6-10.2-11-11 7.4-.8 10.2-4.6 11-11z"/></svg>';
  const COLORS = ["#ffffff", "#fff3b8", "#c3b0f5", "#a9d2f5", "#f7a8c8"];

  function rand(min, max) { return min + Math.random() * (max - min); }
  function add(cls, vars, html) {
    const el = document.createElement("span");
    el.className = cls;
    Object.keys(vars).forEach(function (k) { el.style.setProperty("--" + k, vars[k]); });
    if (html) el.innerHTML = html;
    layer.appendChild(el);
  }

  // 달
  add("moon", {});

  // 작은 별: 위쪽에 더 많이 (밤하늘 위가 더 어두워서 별이 잘 보여요)
  for (let i = 0; i < SMALL_STARS; i++) {
    const dur = rand(1.5, 4.5);
    add("star", {
      x: rand(0, 100).toFixed(2) + "vw",
      y: (Math.pow(Math.random(), 1.6) * 100).toFixed(2) + "vh",
      size: rand(1, 3).toFixed(1) + "px",
      dur: dur.toFixed(2) + "s",
      delay: (-rand(0, dur)).toFixed(2) + "s"
    });
  }

  // 큰 반짝이 별
  for (let i = 0; i < BIG_STARS; i++) {
    const dur = rand(2.5, 5);
    add("star big", {
      x: rand(3, 95).toFixed(2) + "vw",
      y: rand(3, 85).toFixed(2) + "vh",
      size: Math.round(rand(10, 20)) + "px",
      dur: dur.toFixed(2) + "s",
      delay: (-rand(0, dur)).toFixed(2) + "s",
      fill: COLORS[i % COLORS.length]
    }, SPARKLE);
  }

  // 별똥별: 각자 다른 간격(9~16초)으로 오른쪽 위에서 왼쪽 아래로
  for (let i = 0; i < SHOOTING; i++) {
    add("shoot", {
      x: rand(35, 95).toFixed(2) + "vw",
      y: rand(2, 35).toFixed(2) + "vh",
      dur: rand(9, 16).toFixed(1) + "s",
      delay: (i * 4 + rand(1, 3)).toFixed(1) + "s"
    });
  }
})();
