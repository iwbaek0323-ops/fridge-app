# 🥗 NaengTeol Backend

자취생 냉장고 관리 애플리케이션 백엔드 서버입니다.

## 개발 환경

- Node.js
- Express
- MySQL
- JWT
- Groq API (AI 레시피 추천)

---

## 프로젝트 구조

```
backend
├── config
├── controllers
├── database
├── docs
├── middleware
├── models
├── public
├── routes
├── uploads
├── app.js
├── package.json
└── package-lock.json
```

---

## 설치 방법

프로젝트를 받은 후 backend 폴더에서 아래 명령어를 실행합니다.

```bash
npm install
```

---

## 환경 변수 (.env)

backend 폴더에 `.env` 파일을 생성한 후 아래 내용을 입력합니다.

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=naengteol_db

PORT=3000

JWT_SECRET=

GROQ_API_KEY=
```

※ DB 정보와 API KEY는 개인 환경에 맞게 입력합니다.

---

## 서버 실행

개발 모드

```bash
npm run dev
```

일반 실행

```bash
npm start
```

---

## API 문서

API 명세서는 아래 문서를 참고합니다.

```
docs/api/
```

- users.md
- ingredients.md
- posts.md
- comments.md
- likes.md
- notifications.md
- recipes.md

---

## 주요 기능

- 회원가입 / 로그인 (JWT 인증)
- 재료 등록 / 조회 / 수정 / 삭제
- 유통기한 알림 조회
- 게시판
- 댓글
- 좋아요
- AI 레시피 추천 (Groq API)

---

## 사용 기술

- Express
- MySQL2
- bcrypt
- jsonwebtoken
- multer
- dotenv
- groq-sdk

---

## 주의사항

GitHub에는 아래 파일 및 폴더를 업로드하지 않습니다.

```
.env
node_modules/
.DS_Store
```

패키지는 아래 명령어로 설치합니다.

```bash
npm install
```