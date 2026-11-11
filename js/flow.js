// ===== 화면 전환과 효과 =====
// 1) 링크 표(LINKS): 주소를 바꾸거나 새 링크를 넣고 싶으면 여기만 고치면 돼요.
// 2) 화면 전환: 처음 화면에서 하나를 고르면 → 답 화면으로 부드럽게 바뀌어요. (주소 끝의 #play 같은 글자로 구분)
// 3) 효과: 버튼 기울기, 마우스 별빛, 눌렀을 때 별가루, 배경 깊이감
(function () {

  // ---------- 1) 링크 표 ----------
  // name: 버튼 이름 / url: 주소 / tint: 버튼 색 / icon: 24x24 선 그림
  // index.html 의 data-links="discord valorant" 처럼 이름을 적으면 그 화면에 버튼이 생겨요.
  const LINKS = {
    discord: {
      name: "Discord",
      url: "https://discord.gg/q6X3NZs8J",
      tint: "#7c8cff",
      icon: '<path d="M7 8h10a4 4 0 0 1 4 4v1a3 3 0 0 1-5.4 1.8L14.5 14h-5l-1.1 0.8A3 3 0 0 1 3 13v-1a4 4 0 0 1 4-4z"/><path d="M8 10.5v3M6.5 12h3"/><circle cx="15.5" cy="11" r="0.6"/><circle cx="17.5" cy="13" r="0.6"/>'
    },
    valorant: {
      // 발로란트 전적 (tracker.gg). 주소 모양: .../riot/이름%23태그/overview  (# 은 %23 으로 써요)
      name: "Valorant",
      url: "https://tracker.gg/valorant/profile/riot/%D0%BA%CF%85%D0%BD%CE%B1%D0%BA%CF%85%E5%A5%B3%23777/overview?platform=pc&playlist=competitive",
      tint: "#ff5d6c",
      icon: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2.2"/><path d="M12 1.5v5M12 17.5v5M1.5 12h5M17.5 12h5"/>'
    },
    instagram: {
      name: "Instagram",
      url: "https://www.instagram.com/khai__trinh/",
      tint: "#ff7eb6",
      icon: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6"/>'
    },
    tiktok: {
      name: "TikTok",
      url: "https://www.tiktok.com/@kuhakuhtk",
      tint: "#ff8a5c",
      icon: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.4 2.6 2.2 4.4 5 4.6"/>'
    },
    spotify: {
      name: "Spotify",
      url: "https://open.spotify.com/user/31tmoryjkrek3jyhl2c2g6soq3uq",
      tint: "#35c98b",
      icon: '<circle cx="12" cy="12" r="9.5"/><path d="M7 9.5c3.5-1 7-.7 10 .9M7.6 12.6c2.8-.7 5.6-.4 8 .8M8.2 15.5c2.2-.5 4.3-.3 6.2.6"/>'
    },
    facebook: {
      name: "Facebook",
      url: "https://www.facebook.com/khai.trinh.37669528/",
      tint: "#5b9dff",
      icon: '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M15.5 8h-1.8A1.7 1.7 0 0 0 12 9.7V21M9.5 13h5"/>'
    }
  };

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;   // "동작 줄이기"를 켠 사람
  const mouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;  // 마우스가 있는 기기

  // 링크 버튼 만들기
  document.querySelectorAll("[data-links]").forEach(function (nav) {
    nav.dataset.links.split(/\s+/).forEach(function (key) {
      const link = LINKS[key];
      if (!link) return;
      const a = document.createElement("a");
      a.className = "dest tilt";
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("data-r", "");
      a.style.setProperty("--tint", link.tint);
      a.innerHTML =
        '<span class="ico" aria-hidden="true"><svg viewBox="0 0 24 24">' + link.icon + "</svg></span>" +
        "<b></b>" +
        '<svg class="go" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16L16 8M9 8h7v7"/></svg>';
      a.querySelector("b").textContent = link.name;
      nav.appendChild(a);
    });
  });

  // 이름(kuhaku)을 한 글자씩 나눠서 차례로 빛나며 나타나게 해요
  const title = document.querySelector(".title");
  if (title) {
    const word = title.textContent.trim();
    title.textContent = "";
    title.setAttribute("aria-label", word);
    Array.from(word).forEach(function (ch, i) {
      const s = document.createElement("span");
      s.textContent = ch;
      s.setAttribute("aria-hidden", "true");
      s.style.setProperty("--i", i);
      title.appendChild(s);
    });
  }

  // ---------- 2) 화면 전환 ----------
  const stage = document.getElementById("stage");
  const veil = document.getElementById("veil");
  const screens = {};
  document.querySelectorAll(".screen").forEach(function (s) {
    screens[s.dataset.screen] = s;
    // 나타나는 순서 번호 (0, 1, 2 …)
    s.querySelectorAll("[data-r]").forEach(function (el, i) { el.style.setProperty("--i", i); });
  });

  let current = null;
  let finish = null;   // 아직 끝나지 않은 전환을 마무리하는 함수
  let timer = 0;

  // ----- 설문: 처음 온 사람은 3문제를 다 골라야 처음 화면으로 들어가요 -----
  const SURVEY = ["q1", "q2", "q3"].filter(function (n) { return screens[n]; });
  const answers = {};
  let step = 0;
  let surveyDone = SURVEY.length === 0;
  try { if (localStorage.getItem("surveyDone") === "1") surveyDone = true; } catch (e) {}
  document.body.classList.toggle("in-survey", !surveyDone);

  function nameFromHash() {
    if (!surveyDone) return SURVEY[step];            // 설문 중에는 주소를 바꿔도 건너뛸 수 없어요
    const name = location.hash.replace("#", "");
    return screens[name] && SURVEY.indexOf(name) < 0 ? name : "home";
  }

  function show(name, instant, dir) {
    if (finish) { clearTimeout(timer); finish(); }   // 빠르게 연달아 눌러도 꼬이지 않게
    const next = screens[name];
    const prev = current;
    if (!next || next === prev) return;
    current = next;
    stage.dataset.dir = dir || (name === "home" ? "back" : "forward");

    finish = function () {
      finish = null;
      Object.keys(screens).forEach(function (k) {
        screens[k].hidden = screens[k] !== next;
        screens[k].classList.remove("is-in", "is-out");
      });
      void next.offsetWidth;            // 애니메이션을 처음부터 다시 시작하게 해요
      next.classList.add("is-in");
      if (!instant) {
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        const head = next.querySelector("[data-focus]");   // 화면 읽기 프로그램이 새 화면을 읽게 해요
        if (head) head.focus({ preventScroll: true });
      }
    };

    if (!prev || instant || reduce) { finish(); return; }
    prev.classList.add("is-out");       // 지금 화면이 먼저 사라지고
    timer = setTimeout(finish, 300);    // 0.3초 뒤 다음 화면이 나타나요
  }

  window.addEventListener("hashchange", function () { show(nameFromHash()); });
  show(nameFromHash(), true);

  // 설문 답 고르기: 고르면 잠깐 표시한 뒤 다음 질문으로 (답을 골라야만 넘어가요)
  let picking = false;
  SURVEY.forEach(function (name) {
    const sc = screens[name];
    sc.querySelectorAll("[data-answer]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (picking || surveyDone || current !== sc) return;
        picking = true;
        answers[sc.dataset.q] = btn.dataset.answer;
        sc.querySelectorAll("[data-answer]").forEach(function (b) { b.classList.toggle("picked", b === btn); });
        setTimeout(function () {
          picking = false;
          step++;
          if (step < SURVEY.length) show(SURVEY[step], false, "forward");
          else finishSurvey();
        }, reduce ? 0 : 280);
      });
    });
    const prevBtn = sc.querySelector("[data-prev]");
    if (prevBtn) prevBtn.addEventListener("click", function () {
      if (picking || step === 0) return;
      step--;
      show(SURVEY[step], false, "back");
    });
  });

  function finishSurvey() {
    surveyDone = true;
    answers.lang = window.currentLang ? window.currentLang() : "ko";
    try {
      localStorage.setItem("surveyDone", "1");                       // 다음에 오면 설문을 건너뛰어요
      localStorage.setItem("surveyPending", JSON.stringify(answers)); // js/survey.js 가 저장해요
    } catch (e) {}
    document.dispatchEvent(new Event("surveydone"));
    document.body.classList.remove("in-survey");
    show(nameFromHash(), false, "forward");
  }

  // 화면을 바꾸는 버튼을 누르면, 누른 자리에서 빛이 퍼져요
  document.addEventListener("click", function (e) {
    const a = e.target.closest('a[href^="#"], [data-answer], [data-prev]');
    if (!a || !veil || reduce) return;
    const box = a.getBoundingClientRect();
    veil.style.left = (e.clientX || box.left + box.width / 2) + "px";
    veil.style.top = (e.clientY || box.top + box.height / 2) + "px";
    veil.classList.remove("go");
    void veil.offsetWidth;
    veil.classList.add("go");
  });

  // "메시지 보내기" 버튼 → 대화창 열기
  document.querySelectorAll("[data-open-chat]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const chat = document.getElementById("chat");
      const fab = document.getElementById("chatFab");
      if (chat && fab && chat.hidden) fab.click();
    });
  });

  // ---------- 3) 효과 ----------
  if (reduce) return;

  const fx = document.getElementById("fx");
  const SPARK_COLORS = ["#ffffff", "#ffe6a8", "#ffc6dd", "#d9ccff", "#c4e4ff"];

  function spark(x, y, cls, vars) {
    if (!fx || fx.childElementCount > 70) return;   // 너무 많이 쌓이지 않게
    const s = document.createElement("span");
    s.className = cls;
    s.style.left = x + "px";
    s.style.top = y + "px";
    s.style.setProperty("--c", SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)]);
    Object.keys(vars || {}).forEach(function (k) { s.style.setProperty("--" + k, vars[k]); });
    s.addEventListener("animationend", function () { s.remove(); });
    fx.appendChild(s);
  }

  // 누른 자리에서 별가루가 터져요 (휴대폰에서도)
  document.addEventListener("pointerdown", function (e) {
    const N = 10;
    for (let i = 0; i < N; i++) {
      const angle = (Math.PI * 2 * i) / N + Math.random() * 0.5;
      const far = 26 + Math.random() * 38;
      spark(e.clientX, e.clientY, "spark burst", {
        dx: (Math.cos(angle) * far).toFixed(1) + "px",
        dy: (Math.sin(angle) * far).toFixed(1) + "px",
        s: (4 + Math.random() * 5).toFixed(1) + "px"
      });
    }
  });

  if (!mouse) return;   // 아래 효과는 마우스가 있는 컴퓨터에서만

  // 마우스를 따라 별빛 꼬리가 남아요 + 배경이 깊이감 있게 움직여요
  const sky = document.querySelector(".bg");
  let lastX = 0, lastY = 0, lastT = 0, raf = 0, px = 0, py = 0;
  window.addEventListener("pointermove", function (e) {
    const now = performance.now();
    if (now - lastT > 45 && Math.hypot(e.clientX - lastX, e.clientY - lastY) > 16) {
      lastT = now; lastX = e.clientX; lastY = e.clientY;
      spark(e.clientX, e.clientY, "spark trail", {
        dx: ((Math.random() - 0.5) * 16).toFixed(1) + "px",
        s: (3 + Math.random() * 4).toFixed(1) + "px"
      });
    }
    px = (e.clientX / window.innerWidth - 0.5) * 2;    // -1(왼쪽) ~ 1(오른쪽)
    py = (e.clientY / window.innerHeight - 0.5) * 2;
    if (!raf && sky) {
      raf = requestAnimationFrame(function () {
        raf = 0;
        sky.style.setProperty("--px", px.toFixed(3));
        sky.style.setProperty("--py", py.toFixed(3));
      });
    }
  }, { passive: true });

  // 버튼이 마우스 쪽으로 살짝 기울고, 마우스 자리에 빛이 비쳐요
  document.querySelectorAll(".tilt").forEach(function (el) {
    el.addEventListener("pointermove", function (e) {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;    // 0 ~ 1
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--ry", ((x - 0.5) * 10).toFixed(2) + "deg");
      el.style.setProperty("--rx", ((0.5 - y) * 10).toFixed(2) + "deg");
      el.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
      el.style.setProperty("--my", (y * 100).toFixed(1) + "%");
    });
    el.addEventListener("pointerleave", function () {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  });
})();
