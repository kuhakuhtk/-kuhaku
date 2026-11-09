// ===== Firebase 설정 =====
// Firebase 콘솔 → 프로젝트 설정 → 내 앱 → "SDK 설정 및 구성"에 나오는 값을 그대로 붙여 넣어요.
// (이 값들은 공개돼도 괜찮아요. 실제 보안은 firestore.rules 가 지켜요.)
export const firebaseConfig = {
  apiKey: "AIzaSyClJED6yHTav7B_MEmztCDHI6OpMCnCq8U",
  authDomain: "kuhaku-chat.firebaseapp.com",
  projectId: "kuhaku-chat",
  storageBucket: "kuhaku-chat.firebasestorage.app",
  messagingSenderId: "351162419850",
  appId: "1:351162419850:web:09b73c101890da35f63b73"
};

// 내(주인) Firebase 사용자 ID.
// admin.html 에서 Google로 로그인하면 화면에 나오는 값을 여기와 firestore.rules 에 넣어요.
export const OWNER_UID = "";

// 사용하는 Firebase 라이브러리 버전 (chat.js, admin.js 에서 같이 씀)
export const SDK = "https://www.gstatic.com/firebasejs/10.12.2";
