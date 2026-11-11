// ===== 하늘 배경 =====
// 오로라, 달, 깜빡이는 작은 별, 반짝이는 큰 별, 가끔 지나가는 별똥별을 만들어요.
// 별은 "먼 층"과 "가까운 층"으로 나뉘어서, 마우스를 움직이면 깊이감 있게 따라 움직여요. (js/flow.js)
// 개수를 바꾸고 싶으면 아래 숫자만 고치면 돼요.
(function () {
  const sky = document.querySelector(".bg");
  if (!sky) return;

  const small = window.innerWidth < 600;
  const SMALL_STARS = small ? 60 : 120;   // 작은 별 개수
  const BIG_STARS = small ? 6 : 12;       // 큰 반짝이 별 개수
  const SHOOTING = 2;                     // 별똥별 개수 (동시에 날아다니는 수)

  const SPARKLE = '<svg viewBox="0 0 24 24"><path d="M12 1c.8 6.4 3.6 10.2 11 11-7.4.8-10.2 3.6-11 11-.8-7.4-3.6-10.2-11-11 7.4-.8 10.2-4.6 11-11z"/></svg>';
  const COLORS = ["#ffffff", "#fff3b8", "#d9ccff", "#c4e4ff", "#ffc6dd"];

  function rand(min, max) { return min + Math.random() * (max - min); }
  function add(parent, cls, vars, html) {
    const el = document.createElement("span");
    el.className = cls;
    Object.keys(vars || {}).forEach(function (k) { el.style.setProperty("--" + k, vars[k]); });
    if (html) el.innerHTML = html;
    parent.appendChild(el);
    return el;
  }

  // 오로라: 아주 천천히 떠다니는 빛 덩어리 세 개
  add(sky, "aurora a1");
  add(sky, "aurora a2");
  add(sky, "aurora a3");

  // 깊이 층 (--depth 가 클수록 마우스를 많이 따라와요)
  const far = add(sky, "layer", { depth: "8" });
  const near = add(sky, "layer", { depth: "20" });
  const front = add(sky, "layer", { depth: "34" });

  // 달
  add(front, "moon");

  // 작은 별: 위쪽에 더 많이
  for (let i = 0; i < SMALL_STARS; i++) {
    const dur = rand(1.5, 4.5);
    add(i % 3 === 0 ? near : far, "star", {
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
    add(i % 2 ? near : front, "star big", {
      x: rand(3, 95).toFixed(2) + "vw",
      y: rand(3, 85).toFixed(2) + "vh",
      size: Math.round(rand(10, 22)) + "px",
      dur: dur.toFixed(2) + "s",
      delay: (-rand(0, dur)).toFixed(2) + "s",
      fill: COLORS[i % COLORS.length]
    }, SPARKLE);
  }

  // 별똥별: 각자 다른 간격(9~16초)으로 오른쪽 위에서 왼쪽 아래로
  for (let i = 0; i < SHOOTING; i++) {
    add(sky, "shoot", {
      x: rand(35, 95).toFixed(2) + "vw",
      y: rand(2, 35).toFixed(2) + "vh",
      dur: rand(9, 16).toFixed(1) + "s",
      delay: (i * 4 + rand(1, 3)).toFixed(1) + "s"
    });
  }
})();
