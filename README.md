# kuhaku 링크 페이지

밝고 귀여운 개인 링크 페이지예요. 한국어, English, Tiếng Việt로 볼 수 있고, 방문자와 실시간으로 1:1 채팅을 할 수 있어요.

- `index.html`: 방문자가 보는 페이지
- `admin.html`: 주인(나)만 들어가는 메시지함. 여기서 답장해요.
- `js/i18n.js`: 3개 언어 번역표와 버튼 동작
- `js/chat.js`: 방문자 채팅 (Firebase)
- `js/admin.js`: 메시지함 (Firebase)
- `js/firebase-config.js`: Firebase 설정값을 넣는 곳
- `firestore.rules`: 데이터베이스 보안 규칙
- `css/style.css`: 디자인

## 채팅이 작동하게 만드는 순서

### 1. Firebase 프로젝트 만들기
1. https://console.firebase.google.com 에 Google 계정으로 들어가요.
2. **프로젝트 추가** → 이름 입력 (예: `kuhaku-chat`) → Google 애널리틱스는 꺼도 돼요.

### 2. 웹 앱 등록하고 설정값 받기
1. 프로젝트 홈에서 **`</>` (웹)** 아이콘을 눌러요.
2. 앱 이름 입력 → **앱 등록** (Firebase 호스팅은 체크하지 않아요).
3. 화면에 나오는 `firebaseConfig = { ... }` 안의 값들을 `js/firebase-config.js` 에 복사해요.

### 3. 로그인 방법 켜기
1. 왼쪽 메뉴 **빌드 → Authentication → 시작하기**
2. **Sign-in method** 탭에서
   - **익명(Anonymous)** 사용 설정 → 방문자용
   - **Google** 사용 설정 → 주인(나) 로그인용
3. **Settings → 승인된 도메인**에 `kuhakuhtk.github.io` 를 추가해요.

### 4. 데이터베이스 만들기
1. **빌드 → Firestore Database → 데이터베이스 만들기**
2. 위치는 `asia-northeast3 (서울)` 추천, **프로덕션 모드**로 시작해요.

### 5. GitHub Pages 켜기
1. 이 파일들을 GitHub 저장소에 올려요.
2. 저장소 **Settings → Pages → Branch: `main` / `(root)` → Save**
3. 몇 분 뒤 `https://kuhakuhtk.github.io/-kuhaku/` 에서 열려요.

### 6. 내 사용자 ID 넣고 보안 규칙 게시하기
1. `https://kuhakuhtk.github.io/-kuhaku/admin.html` 에 들어가서 **Google로 로그인**해요.
2. 화면에 나온 **내 사용자 ID**를 복사해요.
3. `js/firebase-config.js` 의 `OWNER_UID` 에 넣고 다시 올려요.
4. `firestore.rules` 의 `"OWNER_UID"` 자리도 그 ID로 바꾼 뒤,
   Firebase 콘솔 **Firestore Database → 규칙** 탭에 통째로 붙여 넣고 **게시**해요.

이제 `index.html` 에서 메시지를 보내면 `admin.html` 에 바로 나타나고, 답장하면 방문자 화면에 바로 떠요.

## 알아 두기
- 방문자는 처음 대화창을 열 때 **닉네임**을 정해요. 비밀번호 없이 닉네임만으로 들어오는 방식이에요.
- **같은 브라우저**로 다시 오면 닉네임과 대화가 그대로 이어져요. 닉네임은 대화창의 "바꾸기"로 언제든 바꿀 수 있어요.
- 공용 컴퓨터에서는 **대화 끝내기**를 누르면 이 기기에서 대화가 지워지고 새로 시작해요. 보낸 메시지는 메시지함에 남아요.
- 대화창 위쪽에 개인정보(실명, 학교, 주소, 전화번호)를 보내지 말라는 안내가 3개 언어로 나와요.
- 메시지함(`admin.html`)에는 방문자 닉네임과 사용 언어가 함께 보여요.
- 방문자는 자기 대화만 볼 수 있어요. 다른 사람 대화는 보안 규칙이 막아요.
- 무료 요금제(Spark)로 충분해요. 하루 읽기 5만 번, 쓰기 2만 번까지 무료예요.
- 새 메시지가 와도 휴대폰 알림은 오지 않아요. `admin.html` 을 열어 두거나 가끔 확인해 주세요.

## 보안 체크리스트
- Firestore는 꼭 **프로덕션 모드**로 만들고 `firestore.rules` 를 게시하세요. (테스트 모드는 누구나 읽고 지울 수 있어요.)
- 관리자 Google 계정에 **2단계 인증**을 켜 두세요.
- 무료(Spark) 요금제를 유지하세요. 결제 수단이 없어서 공격을 받아도 요금이 나오지 않아요.
- 페이지와 채팅에 실명, 학교, 주소, 전화번호, 얼굴 사진을 올리지 마세요.
