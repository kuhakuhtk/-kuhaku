// ===== 주인용 메시지함 =====
// Google로 로그인 → 내 ID가 OWNER_UID 와 같으면 모든 대화방을 보고 답장할 수 있어요.
import { firebaseConfig, OWNER_UID, SDK } from "./firebase-config.js";

const $ = function (id) { return document.getElementById(id); };
const LANG_NAME = { ko: "한국어", en: "English", vi: "Tiếng Việt" };

if (!firebaseConfig.apiKey) {
  $("gateText").textContent = "js/firebase-config.js 에 Firebase 설정값을 먼저 넣어 주세요.";
} else {
  start().catch(function (err) {
    console.error(err);
    $("gateText").textContent = "연결 오류: " + err.message;
  });
}

async function start() {
  const { initializeApp } = await import(SDK + "/firebase-app.js");
  const A = await import(SDK + "/firebase-auth.js");
  const fs = await import(SDK + "/firebase-firestore.js");

  const app = initializeApp(firebaseConfig);
  const auth = A.getAuth(app);
  const db = fs.getFirestore(app);

  $("loginBtn").addEventListener("click", function () {
    // 매번 계정 선택 화면이 나오게 해요 (휴대폰이 다른 계정으로 자동 로그인하는 것 방지)
    const provider = new A.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    A.signInWithPopup(auth, provider).catch(function (err) {
      $("gateText").textContent = "로그인 실패: " + err.message;
    });
  });
  $("logoutBtn").addEventListener("click", function () { A.signOut(auth); });

  let stopThreads = null;

  A.onAuthStateChanged(auth, function (user) {
    if (stopThreads) { stopThreads(); stopThreads = null; }
    closeThread();
    const isGoogle = user && !user.isAnonymous;

    $("loginBtn").hidden = isGoogle;
    $("logoutBtn").hidden = !isGoogle;
    $("uidBox").hidden = !isGoogle;
    if (isGoogle) $("uid").textContent = user.uid;

    if (!isGoogle) {
      $("gate").hidden = false;
      $("inbox").hidden = true;
      $("gateText").textContent = "주인만 볼 수 있는 페이지예요. Google로 로그인해 주세요.";
      return;
    }
    if (!OWNER_UID) {
      $("gate").hidden = false;
      $("inbox").hidden = true;
      $("gateText").textContent = "처음 설정 중이에요. 아래 ID를 복사해서 설정에 넣고 다시 올려 주세요.";
      return;
    }
    if (user.uid !== OWNER_UID) {
      $("gate").hidden = false;
      $("inbox").hidden = true;
      $("gateText").textContent = "이 계정은 주인 계정이 아니에요.";
      return;
    }
    $("gate").hidden = true;
    $("inbox").hidden = false;
    stopThreads = watchThreads(db, fs);
  });
}

// ----- 새 메시지 알림 (탭 제목 + 소리) -----
const BASE_TITLE = document.title;
let audio = null;
let lastUnread = -1;   // -1 = 아직 처음 불러오기 전

// 브라우저는 사용자가 화면을 한 번 누른 뒤에만 소리를 허락해요.
function unlockSound() {
  try {
    if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === "suspended") audio.resume();
  } catch (e) {}
}
document.addEventListener("pointerdown", unlockSound);
document.addEventListener("keydown", unlockSound);

// "띵동" 두 음을 짧게 울려요 (소리 파일 없이 브라우저가 직접 만들어요)
function ding() {
  if (!audio || audio.state !== "running") return;
  [880, 1320].forEach(function (hz, i) {
    const o = audio.createOscillator();
    const g = audio.createGain();
    const t = audio.currentTime + i * 0.12;
    o.frequency.value = hz;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.15, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    o.connect(g).connect(audio.destination);
    o.start(t);
    o.stop(t + 0.3);
  });
}

function setUnread(n) {
  document.title = n > 0 ? "(" + n + ") " + BASE_TITLE : BASE_TITLE;
  if (lastUnread >= 0 && n > lastUnread) ding();   // 처음 불러올 때는 울리지 않아요
  lastUnread = n;
}

// ----- 보낸 시간: 오늘이면 "오후 3:05", 다른 날이면 "11. 9. 오후 3:05" -----
function timeLabel(ts) {
  if (!ts || !ts.toDate) return "";
  const d = ts.toDate();
  const time = d.toLocaleTimeString("ko", { hour: "numeric", minute: "2-digit" });
  if (d.toDateString() === new Date().toDateString()) return time;
  return d.toLocaleDateString("ko", { month: "numeric", day: "numeric" }) + " " + time;
}

// ----- 대화방 목록 (최근 메시지 순) -----
let openId = null;
let stopMessages = null;
let blockedIds = new Set();

function watchThreads(db, fs) {
  let lastSnap = null;

  // 차단 목록도 실시간으로 지켜봐요.
  const stopBlocked = fs.onSnapshot(fs.collection(db, "blocked"), function (snap) {
    blockedIds = new Set(snap.docs.map(function (d) { return d.id; }));
    if (lastSnap) drawThreads(db, fs, lastSnap);
    updateActions();
  }, function () {});

  const q = fs.query(fs.collection(db, "chats"), fs.orderBy("updatedAt", "desc"), fs.limit(100));
  const stopChats = fs.onSnapshot(q, function (snap) {
    lastSnap = snap;
    drawThreads(db, fs, snap);
  }, function (err) {
    $("threadCount").textContent = "목록을 불러오지 못했어요: " + err.message;
  });

  return function () {
    stopBlocked();
    stopChats();
    lastUnread = -1;
    document.title = BASE_TITLE;
  };
}

function drawThreads(db, fs, snap) {
  const ul = $("threads");
  ul.textContent = "";
  $("threadCount").textContent = "대화 " + snap.size + "개";
  let unread = 0;

  snap.docs.forEach(function (d) {
    const c = d.data();
    const isOpen = d.id === openId;
    // 지금 열어 둔 대화에 새 메시지가 오면 바로 읽음으로 바꿔요.
    if (isOpen && c.unreadByOwner) {
      fs.updateDoc(fs.doc(db, "chats", d.id), { unreadByOwner: false }).catch(function () {});
    } else if (c.unreadByOwner) {
      unread++;
    }

    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button";
    b.className = "thread";
    if (isOpen) b.setAttribute("aria-current", "true");

    const top = document.createElement("span");
    top.className = "top";
    const name = document.createElement("span");
    // 닉네임이 있으면 닉네임, 없으면 "방문자 + ID 앞 5자리"
    name.textContent = (c.nickname || ("방문자 " + d.id.slice(0, 5))) + " · " + (LANG_NAME[c.lang] || "?");
    top.appendChild(name);
    if (blockedIds.has(d.id)) {
      const n = document.createElement("span");
      n.className = "new blocked";
      n.textContent = "차단됨";
      top.appendChild(n);
    } else if (c.unreadByOwner && !isOpen) {
      const n = document.createElement("span");
      n.className = "new";
      n.textContent = "새 메시지";
      top.appendChild(n);
    }

    const last = document.createElement("span");
    last.className = "last";
    last.textContent = (c.lastFrom === "owner" ? "나: " : "") + (c.lastText || "");
    const when = document.createElement("span");
    when.className = "when";
    when.textContent = timeLabel(c.updatedAt);

    b.append(top, last, when);
    b.addEventListener("click", function () { openThread(db, fs, d.id, name.textContent); });
    li.appendChild(b);
    ul.appendChild(li);
  });

  setUnread(unread);
}

// ----- 대화 하나 열기 -----
function openThread(db, fs, id, title) {
  openId = id;
  document.querySelectorAll(".thread").forEach(function (b) { b.removeAttribute("aria-current"); });
  if (stopMessages) stopMessages();
  $("threadTitle").textContent = title;
  $("replyInput").disabled = false;
  $("replyBtn").disabled = false;
  $("threadActions").hidden = false;
  updateActions();
  $("replyInput").focus();

  // 읽음 표시
  fs.updateDoc(fs.doc(db, "chats", id), { unreadByOwner: false }).catch(function () {});

  const q = fs.query(fs.collection(db, "chats", id, "messages"), fs.orderBy("createdAt", "asc"), fs.limitToLast(200));
  stopMessages = fs.onSnapshot(q, function (snap) {
    const box = $("adminBody");
    box.textContent = "";
    snap.docs.forEach(function (d) {
      const m = d.data();
      const p = document.createElement("p");
      // 관리자 화면에서는 내가 쓴 답장이 오른쪽
      p.className = "msg " + (m.from === "owner" ? "me" : "bot");
      p.textContent = m.text;
      const when = timeLabel(m.createdAt);
      if (when) {
        const t = document.createElement("time");
        t.className = "msg-time";
        t.textContent = when;
        p.appendChild(t);
      }
      box.appendChild(p);
    });
    box.scrollTop = box.scrollHeight;
  });

  $("replyForm").onsubmit = async function (e) {
    e.preventDefault();
    const text = $("replyInput").value.trim().slice(0, 500);
    if (!text) return;
    $("replyInput").value = "";
    try {
      await fs.addDoc(fs.collection(db, "chats", id, "messages"), {
        from: "owner", text: text, createdAt: fs.serverTimestamp()
      });
      await fs.updateDoc(fs.doc(db, "chats", id), {
        updatedAt: fs.serverTimestamp(), lastText: text, lastFrom: "owner", unreadByOwner: false
      });
    } catch (err) {
      $("replyInput").value = text;
      alert("보내지 못했어요: " + err.message);
    }
  };

  // 차단하기 / 차단 풀기
  $("blockBtn").onclick = async function () {
    const ref = fs.doc(db, "blocked", id);
    try {
      if (blockedIds.has(id)) {
        await fs.deleteDoc(ref);
      } else {
        if (!confirm("이 방문자를 차단할까요? 차단하면 더 이상 메시지를 보낼 수 없어요. (나중에 풀 수 있어요)")) return;
        await fs.setDoc(ref, { at: fs.serverTimestamp(), nickname: title });
      }
    } catch (err) {
      alert("바꾸지 못했어요: " + err.message);
    }
  };

  // 대화 통째로 지우기 (메시지들 → 대화방 순서로)
  $("deleteBtn").onclick = async function () {
    if (!confirm("이 대화를 완전히 지울까요? 되돌릴 수 없어요.")) return;
    try {
      const msgs = await fs.getDocs(fs.collection(db, "chats", id, "messages"));
      const docs = msgs.docs;
      for (let i = 0; i < docs.length; i += 400) {   // 한 번에 500개까지라 나눠서 지워요
        const batch = fs.writeBatch(db);
        docs.slice(i, i + 400).forEach(function (d) { batch.delete(d.ref); });
        await batch.commit();
      }
      await fs.deleteDoc(fs.doc(db, "chats", id));
      closeThread();
    } catch (err) {
      alert("지우지 못했어요: " + err.message);
    }
  };
}

function updateActions() {
  if (!openId) return;
  $("blockBtn").textContent = blockedIds.has(openId) ? "차단 풀기" : "차단하기";
}

function closeThread() {
  openId = null;
  if (stopMessages) { stopMessages(); stopMessages = null; }
  $("threadTitle").textContent = "왼쪽에서 대화를 골라 주세요.";
  $("adminBody").textContent = "";
  $("replyInput").disabled = true;
  $("replyBtn").disabled = true;
  $("threadActions").hidden = true;
}
