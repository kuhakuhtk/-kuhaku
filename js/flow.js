// ===== 화면 전환과 효과 =====
// 1) 링크 표(LINKS): 주소를 바꾸거나 새 링크를 넣고 싶으면 여기만 고치면 돼요.
// 2) 화면 전환: 인사말 → 채팅 소개 → 설문 → 처음 화면 → 답 화면
// 3) 마우스 커서
// ===== 링크 표 (기존 사이트 js/flow.js 와 같은 주소) =====
const LINKS = {
  discord:   { name: "Discord",   url: "https://discord.gg/q6X3NZs8J", icon: '<path d="M7 8h10a4 4 0 0 1 4 4v1a3 3 0 0 1-5.4 1.8L14.5 14h-5l-1.1 0.8A3 3 0 0 1 3 13v-1a4 4 0 0 1 4-4z"/><path d="M8 10.5v3M6.5 12h3"/><circle cx="15.5" cy="11" r="0.6"/><circle cx="17.5" cy="13" r="0.6"/>' },
  valorant:  { name: "Valorant",  url: "https://tracker.gg/valorant/profile/riot/%D0%BA%CF%85%D0%BD%CE%B1%D0%BA%CF%85%E5%A5%B3%23777/overview?platform=pc&playlist=competitive", icon: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2.2"/><path d="M12 1.5v5M12 17.5v5M1.5 12h5M17.5 12h5"/>' },
  instagram: { name: "Instagram", url: "https://www.instagram.com/khai__trinh/", icon: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6"/>' },
  tiktok:    { name: "TikTok",    url: "https://www.tiktok.com/@kuhakuhtk", icon: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.4 2.6 2.2 4.4 5 4.6"/>' },
  spotify:   { name: "Spotify",   url: "https://open.spotify.com/user/31tmoryjkrek3jyhl2c2g6soq3uq", icon: '<circle cx="12" cy="12" r="9.5"/><path d="M7 9.5c3.5-1 7-.7 10 .9M7.6 12.6c2.8-.7 5.6-.4 8 .8M8.2 15.5c2.2-.5 4.3-.3 6.2.6"/>' },
  facebook:  { name: "Facebook",  url: "https://www.facebook.com/khai.trinh.37669528/", icon: '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M15.5 8h-1.8A1.7 1.7 0 0 0 12 9.7V21M9.5 13h5"/>' }
};

(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;   // "동작 줄이기"를 켠 사람

  // 링크 버튼 만들기: index.html 의 data-links="discord valorant" 처럼 이름을 적으면 그 화면에 버튼이 생겨요.
  document.querySelectorAll("[data-links]").forEach(function (nav) {
    nav.dataset.links.split(/\s+/).forEach(function (key) {
      const link = LINKS[key];
      if (!link) return;
      const a = document.createElement("a");
      a.className = "dest";
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.innerHTML = '<span class="ico" aria-hidden="true"><svg viewBox="0 0 24 24">' + link.icon + '</svg></span><b></b>' +
        '<svg class="go" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16L16 8M9 8h7v7"/></svg>';
      a.querySelector("b").textContent = link.name;
      nav.appendChild(a);
    });
  });

  // 이름(kuhaku)을 한 글자씩 나눠서 차례로 나타나게 해요
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

  // ---------- 화면 전환 ----------
  const screens = {};
  document.querySelectorAll(".screen").forEach(function (s) {
    screens[s.dataset.screen] = s;
    // 나타나는 순서 번호 (0, 1, 2 …)
    s.querySelectorAll("[data-r]").forEach(function (el, i) { el.style.setProperty("--i", i); });
  });

  // 처음 온 사람이 지나가는 순서: 인사말 → 채팅 소개 → 설문 3문제. 다 지나야 처음 화면으로 들어가요.
  // 순서를 바꾸거나 빼고 싶으면 이 줄만 고치면 돼요. (이름은 index.html 의 data-screen)
  const SURVEY = ["hello", "intro", "q1", "q2", "q3"].filter(function (n) { return screens[n]; });
  const answers = {};
  let step = 0;
  let surveyDone = SURVEY.length === 0;
  try { if (localStorage.getItem("surveyDone") === "1") surveyDone = true; } catch (e) {}
  document.body.classList.toggle("in-survey", !surveyDone);

  let current = null;
  let timer = 0;

  function nameFromHash() {
    if (!surveyDone) return SURVEY[step];            // 설문 중에는 주소를 바꿔도 건너뛸 수 없어요
    const name = location.hash.replace("#", "");
    return screens[name] && SURVEY.indexOf(name) < 0 ? name : "home";
  }

  function show(name, instant) {
    const next = screens[name];
    const prev = current;
    if (!next || next === prev) return;
    current = next;
    clearTimeout(timer);                              // 빠르게 연달아 눌러도 꼬이지 않게

    const finish = function () {
      Object.keys(screens).forEach(function (k) {
        screens[k].hidden = screens[k] !== next;
        screens[k].classList.remove("is-in", "is-out");
      });
      document.body.dataset.screen = name;            // css 가 화면마다 다르게 꾸밀 때 써요
      void next.offsetWidth;                          // 애니메이션을 처음부터 다시 시작하게 해요
      next.classList.add("is-in");
      if (!instant) {
        window.scrollTo(0, 0);
        const head = next.querySelector("[data-focus]");   // 화면 읽기 프로그램이 새 화면을 읽게 해요
        if (head) head.focus({ preventScroll: true });
      }
    };

    if (!prev || instant || reduce) { finish(); return; }
    prev.classList.add("is-out");                     // 지금 화면이 먼저 사라지고
    timer = setTimeout(finish, 240);                  // 잠깐 뒤 다음 화면이 나타나요
  }

  window.addEventListener("hashchange", function () { show(nameFromHash()); });
  show(nameFromHash(), true);

  function advance() {
    step++;
    if (step < SURVEY.length) show(SURVEY[step]);
    else finishSurvey();
  }

  // 인사말·채팅 소개의 "다음" 버튼
  document.querySelectorAll("[data-next]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (surveyDone || current !== btn.closest(".screen")) return;
      advance();
    });
  });

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
        setTimeout(function () { picking = false; advance(); }, reduce ? 0 : 280);
      });
    });
    const prevBtn = sc.querySelector("[data-prev]");
    if (prevBtn) prevBtn.addEventListener("click", function () {
      if (picking || step === 0) return;
      step--;
      show(SURVEY[step]);
    });
  });

  function finishSurvey() {
    surveyDone = true;
    answers.lang = window.currentLang ? window.currentLang() : "ko";
    try {
      localStorage.setItem("surveyDone", "1");                       // 다음에 오면 인사말과 설문을 건너뛰어요
      localStorage.setItem("surveyPending", JSON.stringify(answers)); // js/survey.js 가 저장해요
    } catch (e) {}
    document.dispatchEvent(new Event("surveydone"));
    document.body.classList.remove("in-survey");
    show(nameFromHash());
  }

  // "메시지 보내기" 버튼 → 대화창 열기
  document.querySelectorAll("[data-open-chat]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const chat = document.getElementById("chat");
      const fab = document.getElementById("chatFab");
      if (chat && fab && chat.hidden) fab.click();
    });
  });
})();

// ===== 마우스 커서 바꾸기 (마우스가 있는 기기에서만) =====
(function () {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dot = document.createElement("div"), ring = document.createElement("div");
  dot.className = "cursor-dot"; ring.className = "cursor-ring";
  dot.setAttribute("aria-hidden", "true"); ring.setAttribute("aria-hidden", "true");
  document.body.append(ring, dot);
  let x = 0, y = 0, rx = 0, ry = 0, on = false;

  function move(e) {
    if (e.pointerType && e.pointerType !== "mouse") return;
    x = e.clientX; y = e.clientY;
    if (!on) { on = true; rx = x; ry = y; document.body.classList.add("has-cursor"); requestAnimationFrame(loop); }
    dot.style.transform = "translate3d(" + x + "px," + y + "px,0)";
    const el = e.target.closest ? e.target : null;
    document.body.classList.toggle("cursor-hover", !!(el && el.closest("a, button")));
    // 글자 입력칸과 스포티파이 플레이어 위에서는 원래 커서를 써요
    document.body.classList.toggle("cursor-away", !!(el && el.closest("input, iframe")));
  }
  function loop() {
    const k = reduce ? 1 : 0.18;       // 고리는 점을 부드럽게 따라와요
    rx += (x - rx) * k; ry += (y - ry) * k;
    ring.style.transform = "translate3d(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px,0)";
    requestAnimationFrame(loop);
  }
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerdown", function () { document.body.classList.add("cursor-down"); });
  window.addEventListener("pointerup", function () { document.body.classList.remove("cursor-down"); });
  document.addEventListener("mouseleave", function () { document.body.classList.add("cursor-away"); });
  document.addEventListener("mouseenter", function () { document.body.classList.remove("cursor-away"); });
})();
