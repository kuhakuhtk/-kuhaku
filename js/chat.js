// ===== 방문자용 실시간 채팅 =====
// 흐름: 대화창을 처음 열면 → 익명 로그인 → 닉네임 정하기(처음 한 번) → 내 대화방(chats/내ID/messages)을 실시간으로 구독
//       메시지를 보내면 Firestore에 저장 → 주인이 admin.html 에서 보고 답장 → 여기 바로 나타남
import { firebaseConfig, SDK } from "./firebase-config.js";

const fab = document.getElementById("chatFab");
const chat = document.getElementById("chat");
const list = document.getElementById("chatList");
const body = document.getElementById("chatBody");
const note = document.getElementById("chatNote");
const form = document.getElementById("chatForm");
const input = document.getElementById("chatInput");
const sendBtn = document.getElementById("chatSend");
const joinForm = document.getElementById("joinForm");
const joinInput = document.getElementById("joinInput");
const me = document.getElementById("chatMe");
const meText = document.getElementById("chatMeText");

let started = false;   // Firebase 연결을 이미 시작했는지
let fb = null;         // { db, uid, fs } 연결되면 채워짐
let nickname = "";     // 방문자가 정한 닉네임

// 브라우저에 닉네임 기억하기 (막혀 있어도 오류 없이 넘어가요)
function loadNick() { try { return localStorage.getItem("nick") || ""; } catch (e) { return ""; } }
function saveNick(n) { try { localStorage.setItem("nick", n); } catch (e) {} }

// ----- 대화창 열고 닫기 -----
function openChat(open) {
  chat.hidden = !open;
  fab.setAttribute("aria-expanded", open ? "true" : "false");
  if (open) {
    if (!started) { started = true; connect(); }
    if (!joinForm.hidden) joinInput.focus();
    else if (!input.disabled) input.focus();
  } else {
    fab.focus();
  }
}
fab.addEventListener("click", function () { openChat(chat.hidden); });
document.getElementById("chatClose").addEventListener("click", function () { openChat(false); });
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !chat.hidden) openChat(false);
});

// 안내 줄 바꾸기 (key는 i18n.js 번역표의 이름표)
function setNote(key) {
  note.dataset.i18n = key;
  note.textContent = window.t(key);
}

function scrollDown() { body.scrollTop = body.scrollHeight; }

// ----- 닉네임 단계 ↔ 대화 단계 -----
function showJoin() {
  me.hidden = true;
  document.getElementById("endConfirm").hidden = true;
  form.hidden = true;
  joinForm.hidden = false;
  joinInput.value = nickname;
  setNote("joinAsk");
  if (!chat.hidden) joinInput.focus();
}
function showChat() {
  joinForm.hidden = true;
  document.getElementById("endConfirm").hidden = true;
  form.hidden = false;
  me.hidden = false;
  meText.textContent = window.t("chatAs").replace("{name}", nickname);
  setNote("chatReady");
  input.disabled = false;
  sendBtn.disabled = false;
  if (!chat.hidden) input.focus();
}
document.getElementById("chatRename").addEventListener("click", showJoin);
// 언어를 바꾸면 "○○ 님으로 대화 중" 글자도 다시 써요.
document.addEventListener("langchange", function () {
  if (nickname) meText.textContent = window.t("chatAs").replace("{name}", nickname);
});

joinForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  if (!fb) return;
  const name = joinInput.value.trim().slice(0, 20);
  if (!name) return;
  const { db, uid, fs } = fb;
  try {
    await fs.setDoc(fs.doc(db, "chats", uid), { nickname: name, lang: window.currentLang() }, { merge: true });
    nickname = name;
    saveNick(name);
    showChat();
  } catch (err) {
    console.error(err);
    setNote("chatSendFail");
  }
});

// ----- 대화 끝내기 (공용 컴퓨터용) -----
// 이 브라우저의 익명 로그인을 지워서, 다음 사람이 이전 대화를 볼 수 없게 해요.
// 보낸 메시지는 지워지지 않고 주인 메시지함에 남아요.
const endConfirm = document.getElementById("endConfirm");
document.getElementById("chatEnd").addEventListener("click", function () {
  me.hidden = true;
  endConfirm.hidden = false;
});
document.getElementById("endNo").addEventListener("click", function () {
  endConfirm.hidden = true;
  me.hidden = false;
});
document.getElementById("endYes").addEventListener("click", async function () {
  endConfirm.hidden = true;
  if (!fb || !sdk) return;
  fb.stop();               // 실시간 구독 멈추기
  fb = null;
  nickname = "";
  try { localStorage.removeItem("nick"); } catch (e) {}
  list.textContent = "";   // 화면의 말풍선 지우기
  input.value = "";
  input.disabled = true;
  sendBtn.disabled = true;
  try {
    await sdk.A.signOut(sdk.auth);
    await connect();       // 새 익명 ID로 다시 연결 → 닉네임부터 새로 시작
    setNote("ended");
  } catch (err) {
    console.error(err);
    setNote("chatError");
  }
});

// ----- Firebase 연결 -----
let sdk = null;   // Firebase 라이브러리 (한 번만 불러와요)

async function connect() {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    setNote("chatNotReady");
    return;
  }
  try {
    if (!sdk) {
      const { initializeApp } = await import(SDK + "/firebase-app.js");
      const A = await import(SDK + "/firebase-auth.js");
      const fs = await import(SDK + "/firebase-firestore.js");
      const app = initializeApp(firebaseConfig);
      sdk = { A, fs, auth: A.getAuth(app), db: fs.getFirestore(app) };
    }
    const { A, fs, auth, db } = sdk;

    // 익명 로그인: 같은 브라우저로 다시 오면 같은 ID가 유지돼서 대화가 이어져요.
    await auth.authStateReady();   // 전에 로그인한 기록이 있으면 먼저 불러와요
    const user = auth.currentUser || (await A.signInAnonymously(auth)).user;
    const uid = user.uid;

    // 내 대화방 메시지를 시간 순서대로 실시간 구독
    const q = fs.query(
      fs.collection(db, "chats", uid, "messages"),
      fs.orderBy("createdAt", "asc"),
      fs.limitToLast(200)
    );
    const stop = fs.onSnapshot(q, function (snap) {
      render(snap.docs.map(function (d) { return d.data(); }));
    }, function () {
      setNote("chatError");
    });
    fb = { db, uid, fs, stop };

    // 전에 정한 닉네임이 있으면 바로 대화, 없으면 닉네임부터
    const mine = await fs.getDoc(fs.doc(db, "chats", uid));
    nickname = (mine.exists() && mine.data().nickname) || loadNick();
    if (nickname) showChat(); else showJoin();
  } catch (err) {
    console.error(err);
    setNote("chatError");
  }
}

// ----- 말풍선 그리기 -----
function render(messages) {
  list.textContent = "";
  messages.forEach(function (m) {
    const p = document.createElement("p");
    // 방문자(나)는 오른쪽 분홍, 주인(kuhaku)은 왼쪽 흰색
    p.className = "msg " + (m.from === "owner" ? "bot" : "me");
    if (!m.createdAt) p.classList.add("pending"); // 아직 서버에 저장되는 중
    p.textContent = m.text;                        // textContent: 남이 쓴 글을 안전하게 표시
    list.appendChild(p);
  });
  scrollDown();
}

// ----- 메시지 보내기 -----
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  if (!fb) return;
  const text = input.value.trim().slice(0, 500);
  if (!text) return;
  input.value = "";
  const { db, uid, fs } = fb;
  try {
    // 1) 대화방 정보 갱신 (주인 목록에 "새 메시지"로 보이게)
    await fs.setDoc(fs.doc(db, "chats", uid), {
      nickname: nickname,
      updatedAt: fs.serverTimestamp(),
      lastText: text,
      lastFrom: "visitor",
      unreadByOwner: true,
      lang: window.currentLang()
    }, { merge: true });
    // 2) 메시지 저장
    await fs.addDoc(fs.collection(db, "chats", uid, "messages"), {
      from: "visitor",
      text: text,
      createdAt: fs.serverTimestamp()
    });
  } catch (err) {
    console.error(err);
    input.value = text;
    setNote("chatSendFail");
  }
});
