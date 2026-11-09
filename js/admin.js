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
    A.signInWithPopup(auth, new A.GoogleAuthProvider()).catch(function (err) {
      $("gateText").textContent = "로그인 실패: " + err.message;
    });
  });
  $("logoutBtn").addEventListener("click", function () { A.signOut(auth); });

  let stopThreads = null;

  A.onAuthStateChanged(auth, function (user) {
    if (stopThreads) { stopThreads(); stopThreads = null; }
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

// ----- 대화방 목록 (최근 메시지 순) -----
let openId = null;
let stopMessages = null;

function watchThreads(db, fs) {
  const q = fs.query(fs.collection(db, "chats"), fs.orderBy("updatedAt", "desc"), fs.limit(100));
  return fs.onSnapshot(q, function (snap) {
    const ul = $("threads");
    ul.textContent = "";
    $("threadCount").textContent = "대화 " + snap.size + "개";
    snap.docs.forEach(function (d, i) {
      const c = d.data();
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button";
      b.className = "thread";
      if (d.id === openId) b.setAttribute("aria-current", "true");

      const top = document.createElement("span");
      top.className = "top";
      const name = document.createElement("span");
      // 닉네임이 있으면 닉네임, 없으면 "방문자 + ID 앞 5자리"
      name.textContent = (c.nickname || ("방문자 " + d.id.slice(0, 5))) + " · " + (LANG_NAME[c.lang] || "?");
      top.appendChild(name);
      if (c.unreadByOwner) {
        const n = document.createElement("span");
        n.className = "new";
        n.textContent = "새 메시지";
        top.appendChild(n);
      }
      const last = document.createElement("span");
      last.className = "last";
      last.textContent = (c.lastFrom === "owner" ? "나: " : "") + (c.lastText || "");

      b.append(top, last);
      b.addEventListener("click", function () { openThread(db, fs, d.id, name.textContent); });
      li.appendChild(b);
      ul.appendChild(li);
    });
  }, function (err) {
    $("threadCount").textContent = "목록을 불러오지 못했어요: " + err.message;
  });
}

// ----- 대화 하나 열기 -----
function openThread(db, fs, id, title) {
  openId = id;
  document.querySelectorAll(".thread").forEach(function (b) { b.removeAttribute("aria-current"); });
  if (stopMessages) stopMessages();
  $("threadTitle").textContent = title;
  $("replyInput").disabled = false;
  $("replyBtn").disabled = false;
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
}
