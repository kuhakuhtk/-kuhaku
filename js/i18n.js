// ===== 번역표 =====
// 글자를 바꾸고 싶으면 여기만 고치면 돼요. 세 언어 모두 같은 이름표(key)를 써요.
const texts = {
  ko: {
    kana: "空白 · 빈칸에 하나씩 채워 가는 중",
    bio: "게임이랑 노는 걸 제일 좋아하는 학생이에요. 같이 게임할 사람 언제든 환영!",
    tag1: "게임", tag2: "음악 듣기", tag3: "그림 그리기", tag4: "애니 보기", tag5: "산책",
    label: "여기로 놀러 오세요",
    game: "게임 프로필",
    gameDesc: "같이 게임해요 (디스코드 / 스팀)",
    instaDesc: "일상 사진",
    ytDesc: "게임 플레이 영상",
    tiktokDesc: "짧은 영상",
    fbDesc: "친구하고 소식 나눠요",
    example: "예시",
    soon: "{name} 링크는 곧 열려요!",
    chatFab: "대화하기",
    chatStatus: "보통 하루 안에 답장해요",
    chatClose: "닫기",
    chatHello1: "안녕하세요! kuhaku예요.",
    chatHello2: "메시지를 남겨 주세요. 제가 확인하고 여기로 답장할게요!",
    chatPlaceholder: "메시지 입력…",
    chatSend: "보내기",
    chatConnecting: "연결하는 중…",
    chatReady: "이 브라우저로 다시 오면 대화가 이어져요.",
    chatNotReady: "채팅은 아직 준비 중이에요. 조금만 기다려 주세요!",
    chatError: "연결이 안 돼요. 잠시 후 다시 열어 주세요.",
    chatSendFail: "메시지를 보내지 못했어요. 다시 시도해 주세요.",
    joinAsk: "대화하려면 먼저 닉네임을 정해 주세요!",
    joinPlaceholder: "닉네임 (최대 20자)",
    joinBtn: "시작하기",
    chatAs: "{name} 님으로 대화 중",
    rename: "바꾸기",
    privacy: "개인정보(실명, 학교, 주소, 전화번호)는 보내지 마세요.",
    endChat: "대화 끝내기",
    endAsk: "이 기기에서 대화가 사라지고 새로 시작해요. 보낸 메시지는 kuhaku에게 남아요.",
    endYes: "끝내기",
    endNo: "취소",
    ended: "대화를 끝냈어요. 새로 시작하려면 닉네임을 정해 주세요."
  },
  en: {
    kana: "空白 · filling in the blanks, one by one",
    bio: "I'm a student who loves games and hanging out. Always happy to find people to play with!",
    tag1: "Games", tag2: "Music", tag3: "Drawing", tag4: "Anime", tag5: "Walks",
    label: "Come hang out here",
    game: "Game profile",
    gameDesc: "Let's play together (Discord / Steam)",
    instaDesc: "Everyday photos",
    ytDesc: "Gameplay videos",
    tiktokDesc: "Short videos",
    fbDesc: "Let's be friends",
    example: "Example",
    soon: "{name} link is coming soon!",
    chatFab: "Chat",
    chatStatus: "Usually replies within a day",
    chatClose: "Close",
    chatHello1: "Hi! I'm kuhaku.",
    chatHello2: "Leave me a message. I'll read it and reply right here!",
    chatPlaceholder: "Type a message…",
    chatSend: "Send",
    chatConnecting: "Connecting…",
    chatReady: "Come back in this browser to pick up the conversation.",
    chatNotReady: "Chat isn't ready yet. Check back soon!",
    chatError: "Can't connect right now. Please try again later.",
    chatSendFail: "Your message didn't send. Please try again.",
    joinAsk: "Pick a nickname to start chatting!",
    joinPlaceholder: "Nickname (up to 20 characters)",
    joinBtn: "Start",
    chatAs: "Chatting as {name}",
    rename: "Change",
    privacy: "Please don't send personal info (real name, school, address, phone number).",
    endChat: "End chat",
    endAsk: "This clears the chat from this device so you can start fresh. Messages you sent stay with kuhaku.",
    endYes: "End",
    endNo: "Cancel",
    ended: "Chat ended. Pick a nickname to start a new one."
  },
  vi: {
    kana: "空白 · lấp đầy từng khoảng trống một",
    bio: "Mình là học sinh thích chơi game và đi chơi nhất. Luôn chào đón bạn cùng chơi game!",
    tag1: "Chơi game", tag2: "Nghe nhạc", tag3: "Vẽ tranh", tag4: "Xem anime", tag5: "Đi dạo",
    label: "Ghé chơi với mình nhé",
    game: "Hồ sơ game",
    gameDesc: "Cùng chơi game nhé (Discord / Steam)",
    instaDesc: "Ảnh đời thường",
    ytDesc: "Video chơi game",
    tiktokDesc: "Video ngắn",
    fbDesc: "Kết bạn với mình nhé",
    example: "Ví dụ",
    soon: "Liên kết {name} sắp ra mắt!",
    chatFab: "Nhắn tin",
    chatStatus: "Thường trả lời trong một ngày",
    chatClose: "Đóng",
    chatHello1: "Chào bạn! Mình là kuhaku.",
    chatHello2: "Để lại tin nhắn cho mình nhé. Mình sẽ đọc và trả lời ngay tại đây!",
    chatPlaceholder: "Nhập tin nhắn…",
    chatSend: "Gửi",
    chatConnecting: "Đang kết nối…",
    chatReady: "Quay lại bằng trình duyệt này để tiếp tục trò chuyện.",
    chatNotReady: "Chat chưa sẵn sàng. Bạn quay lại sau nhé!",
    chatError: "Không kết nối được. Bạn thử lại sau nhé.",
    chatSendFail: "Chưa gửi được tin nhắn. Bạn thử lại nhé.",
    joinAsk: "Hãy chọn biệt danh để bắt đầu trò chuyện nhé!",
    joinPlaceholder: "Biệt danh (tối đa 20 ký tự)",
    joinBtn: "Bắt đầu",
    chatAs: "Đang trò chuyện với tên {name}",
    rename: "Đổi",
    privacy: "Đừng gửi thông tin cá nhân (tên thật, trường, địa chỉ, số điện thoại) nhé.",
    endChat: "Kết thúc",
    endAsk: "Cuộc trò chuyện sẽ bị xóa khỏi thiết bị này để bắt đầu lại. Tin nhắn bạn đã gửi vẫn được lưu ở chỗ kuhaku.",
    endYes: "Kết thúc",
    endNo: "Hủy",
    ended: "Đã kết thúc. Hãy chọn biệt danh để bắt đầu cuộc trò chuyện mới."
  }
};

let current = "ko";

// 다른 파일(chat.js)에서도 번역을 쓸 수 있게 열어 둬요.
window.t = function (key) { return texts[current][key]; };
window.currentLang = function () { return current; };

// 언어 바꾸기: data-i18n 이 붙은 모든 글자를 선택한 언어로 바꿔요.
function setLang(lang) {
  if (!texts[lang]) lang = "ko";
  current = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    el.textContent = texts[lang][el.dataset.i18n];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
    el.placeholder = texts[lang][el.dataset.i18nPh];
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
    el.setAttribute("aria-label", texts[lang][el.dataset.i18nAria]);
  });
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.setAttribute("aria-pressed", b.dataset.lang === lang ? "true" : "false");
  });
  try { localStorage.setItem("lang", lang); } catch (e) {}
  // chat.js 처럼 글자를 직접 만드는 곳에 "언어 바뀜"을 알려 줘요.
  document.dispatchEvent(new Event("langchange"));
}

document.querySelectorAll(".lang button").forEach(function (b) {
  b.addEventListener("click", function () { setLang(b.dataset.lang); });
});

// 처음 열 때: 전에 고른 언어 → 없으면 브라우저 언어 → 없으면 한국어
let start = "ko";
try {
  const saved = localStorage.getItem("lang");
  const browser = (navigator.language || "").slice(0, 2);
  start = saved || (texts[browser] ? browser : "ko");
} catch (e) {}
setLang(start);

// ===== 주소가 아직 없는 버튼(data-todo)을 누르면 안내 문구를 잠깐 보여줘요 =====
const toast = document.getElementById("toast");
let timer;
document.querySelectorAll("[data-todo]").forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const name = btn.querySelector("strong").textContent;
    toast.textContent = texts[current].soon.replace("{name}", name);
    toast.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(function () { toast.classList.remove("show"); }, 1800);
  });
});
