// ===== 번역표 =====
// 글자를 바꾸고 싶으면 여기만 고치면 돼요. 세 언어 모두 같은 이름표(key)를 써요.
const texts = {
  ko: {
    kana: "空白 · 빈칸에 하나씩 채워 가는 중",
    // 묻고 답하는 화면
    // 설문
    svHello: "들어가기 전에 3가지만 물어볼게요",
    svNote: "익명으로 저장돼요. 이름은 묻지 않아요.",
    svPrev: "이전 질문",
    sv1: "먼저, 성별을 알려 주세요",
    sv2: "나이는 어떻게 되나요?",
    sv3: "이 사이트를 어디서 알게 됐나요?",
    gMale: "남자", gFemale: "여자", gOther: "기타", secret: "비밀이에요",
    a1: "13세 이하", a2: "14~16세", a3: "17~19세", a4: "20~24세", a5: "25세 이상",
    sFriend: "친구가 알려 줬어요", sOther: "다른 곳에서",
    ask: "무엇을 찾고 있나요?",
    askSub: "하나를 고르면 딱 맞는 곳으로 안내할게요.",
    qPlay: "같이 게임하고 싶어요",
    qWatch: "사진이랑 영상을 보고 싶어요",
    qMusic: "무슨 노래를 듣는지 궁금해요",
    qFriend: "친구가 되고 싶어요",
    qTalk: "의견이나 아이디어를 전하고 싶어요",
    qAll: "전부 다 보고 싶어요",
    aPlay: "좋아요! 디스코드로 놀러 오거나, 발로란트 전적을 구경해 보세요.",
    aWatch: "일상 사진은 인스타그램에, 짧은 영상은 틱톡에 올려요.",
    aMusic: "요즘은 이 노래를 제일 많이 들어요. 더 궁금하면 스포티파이로!",
    aFriend: "반가워요! 편한 곳에서 친구 추가해 주세요.",
    aAll: "여기 전부 모아 뒀어요. 마음 가는 곳으로!",
    back: "처음으로",
    openChat: "메시지 보내기",
    bio: "이 페이지에 대한 의견이나 좋은 아이디어가 있으면 언제든 메시지 보내 주세요!",
    tag1: "게임", tag2: "음악 듣기", tag4: "애니 보기", tag5: "산책",
    music: "요즘 듣는 노래",
    label: "여기로 놀러 오세요",
    game: "게임 프로필",
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
    ended: "대화를 끝냈어요. 새로 시작하려면 닉네임을 정해 주세요.",
    slowDown: "조금 천천히 보내 주세요! (3초에 한 번)",
    blocked: "이 대화는 더 이상 메시지를 보낼 수 없어요."
  },
  en: {
    kana: "空白 · filling in the blanks, one by one",
    // 묻고 답하는 화면
    // 설문
    svHello: "Just 3 quick questions before you come in",
    svNote: "Saved anonymously. I never ask for your name.",
    svPrev: "Previous question",
    sv1: "First, what's your gender?",
    sv2: "How old are you?",
    sv3: "Where did you find this site?",
    gMale: "Male", gFemale: "Female", gOther: "Other", secret: "I'd rather not say",
    a1: "13 or under", a2: "14–16", a3: "17–19", a4: "20–24", a5: "25 or older",
    sFriend: "A friend told me", sOther: "Somewhere else",
    ask: "What are you looking for?",
    askSub: "Pick one and I'll point you to the right place.",
    qPlay: "I want to play games together",
    qWatch: "I want to see photos and videos",
    qMusic: "I'm curious what you listen to",
    qFriend: "I want to be friends",
    qTalk: "I have feedback or an idea",
    qAll: "Just show me everything",
    aPlay: "Nice! Hop into my Discord, or take a look at my Valorant stats.",
    aWatch: "Everyday photos go on Instagram, short videos on TikTok.",
    aMusic: "This one's on repeat lately. Want more? Head to my Spotify!",
    aFriend: "Nice to meet you! Add me wherever you like.",
    aAll: "Everything's right here. Go wherever you like!",
    back: "Back to start",
    openChat: "Send a message",
    bio: "Got feedback or a cool idea for this page? Send me a message anytime!",
    tag1: "Games", tag2: "Music", tag4: "Anime", tag5: "Walks",
    music: "On repeat lately",
    label: "Come hang out here",
    game: "Game profile",
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
    ended: "Chat ended. Pick a nickname to start a new one.",
    slowDown: "Slow down a little! (one message every 3 seconds)",
    blocked: "You can no longer send messages in this chat."
  },
  vi: {
    kana: "空白 · lấp đầy từng khoảng trống một",
    // 묻고 답하는 화면
    // 설문
    svHello: "Trước khi vào, cho mình hỏi nhanh 3 câu nhé",
    svNote: "Lưu ẩn danh. Mình không hỏi tên bạn.",
    svPrev: "Câu trước",
    sv1: "Trước tiên, giới tính của bạn là gì?",
    sv2: "Bạn bao nhiêu tuổi?",
    sv3: "Bạn biết trang này từ đâu?",
    gMale: "Nam", gFemale: "Nữ", gOther: "Khác", secret: "Mình không muốn nói",
    a1: "13 tuổi trở xuống", a2: "14–16 tuổi", a3: "17–19 tuổi", a4: "20–24 tuổi", a5: "25 tuổi trở lên",
    sFriend: "Bạn bè giới thiệu", sOther: "Nơi khác",
    ask: "Bạn đang tìm gì nào?",
    askSub: "Chọn một mục, mình sẽ chỉ đúng chỗ cho bạn.",
    qPlay: "Mình muốn chơi game cùng",
    qWatch: "Mình muốn xem ảnh và video",
    qMusic: "Mình tò mò bạn nghe nhạc gì",
    qFriend: "Mình muốn kết bạn",
    qTalk: "Mình có góp ý hoặc ý tưởng",
    qAll: "Cho mình xem tất cả",
    aPlay: "Tuyệt! Vào Discord chơi với mình, hoặc xem thành tích Valorant của mình nhé.",
    aWatch: "Ảnh đời thường mình đăng trên Instagram, video ngắn thì ở TikTok.",
    aMusic: "Dạo này mình nghe bài này nhiều nhất. Muốn nghe thêm thì qua Spotify nhé!",
    aFriend: "Rất vui được gặp bạn! Kết bạn với mình ở đâu cũng được nhé.",
    aAll: "Tất cả ở đây nè. Thích chỗ nào thì ghé nhé!",
    back: "Về đầu",
    openChat: "Gửi tin nhắn",
    bio: "Nếu bạn có góp ý hay ý tưởng hay cho trang này, cứ nhắn tin cho mình nhé!",
    tag1: "Chơi game", tag2: "Nghe nhạc", tag4: "Xem anime", tag5: "Đi dạo",
    music: "Dạo này mình hay nghe",
    label: "Ghé chơi với mình nhé",
    game: "Hồ sơ game",
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
    ended: "Đã kết thúc. Hãy chọn biệt danh để bắt đầu cuộc trò chuyện mới.",
    slowDown: "Gửi chậm lại một chút nhé! (3 giây một tin)",
    blocked: "Bạn không thể gửi tin nhắn trong cuộc trò chuyện này nữa."
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
