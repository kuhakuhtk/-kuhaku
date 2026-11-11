// ===== 설문 답 저장 =====
// 방문자가 설문 3문제를 다 고르면 js/flow.js 가 답을 브라우저에 잠깐 적어 두고 "surveydone" 신호를 보내요.
// 여기서는 그 답을 Firebase 의 surveys/방문자ID 에 저장해요. (이름 없이, 익명 로그인 ID로만)
// 저장에 실패하면 지우지 않고 뒀다가, 다음에 페이지를 열 때 다시 시도해요.
import { firebaseConfig, SDK } from "./firebase-config.js";

let sending = false;

async function send() {
  if (sending || !firebaseConfig.apiKey) return;
  let raw = null;
  try { raw = localStorage.getItem("surveyPending"); } catch (e) {}
  if (!raw) return;
  sending = true;
  try {
    const a = JSON.parse(raw);
    const { initializeApp } = await import(SDK + "/firebase-app.js");
    const A = await import(SDK + "/firebase-auth.js");
    const fs = await import(SDK + "/firebase-firestore.js");
    const app = initializeApp(firebaseConfig);   // chat.js 와 같은 설정이라 같은 연결을 같이 써요
    const auth = A.getAuth(app);
    const db = fs.getFirestore(app);
    await auth.authStateReady();
    const user = auth.currentUser || (await A.signInAnonymously(auth)).user;
    await fs.setDoc(fs.doc(db, "surveys", user.uid), {
      gender: a.gender,
      age: a.age,
      source: a.source,
      lang: a.lang,
      createdAt: fs.serverTimestamp()
    });
    try { localStorage.removeItem("surveyPending"); } catch (e) {}
  } finally {
    sending = false;
  }
}

function trySend() { send().catch(function (err) { console.error(err); }); }
document.addEventListener("surveydone", trySend);
trySend();
