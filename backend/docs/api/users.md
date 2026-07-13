# 👤 Users API

Version : 1.0

---

# 1. 회원가입 API

## URL

POST /api/users/signup

예시 : http://localhost:3000/api/users/signup

---

## 설명

사용자를 회원가입시키는 API입니다.

회원가입 시

- 이름(name)
- 이메일(email)
- 비밀번호(password)
- 닉네임(nickname)

을 입력받습니다.

비밀번호는 bcrypt로 암호화하여 저장됩니다.

---

## Request

Content-Type

application/json

```json
{
    "name": "홍길동",
    "email": "hong@test.com",
    "password": "12345678",
    "nickname": "길동이"
}
```

---

## Success Response

HTTP Status

201 Created

```json
{
    "message": "회원가입 성공!"
}
```

---

## Error Response

### 모든 항목 미입력

HTTP Status

400 Bad Request

```json
{
    "message": "모든 항목을 입력해주세요."
}
```

---

### 이메일 형식 오류

HTTP Status

400 Bad Request

```json
{
    "message": "올바른 이메일 형식이 아닙니다."
}
```

---

### 비밀번호 길이 부족

HTTP Status

400 Bad Request

```json
{
    "message": "비밀번호는 8자 이상이어야 합니다."
}
```

---

### 이메일 중복

HTTP Status

400 Bad Request

```json
{
    "message": "이미 사용 중인 이메일입니다."
}
```

---

### 닉네임 중복

HTTP Status

400 Bad Request

```json
{
    "message": "이미 사용 중인 닉네임입니다."
}
```

---

# 2. 로그인 API

## URL

POST /api/users/login

---

## 설명

회원 로그인을 수행하는 API입니다.

로그인 성공 시 JWT 토큰을 발급합니다.

---

## Request

Content-Type

application/json

```json
{
    "email": "hong@test.com",
    "password": "12345678"
}
```

---

## Success Response

HTTP Status

200 OK

```json
{
    "message": "로그인 성공!",
    "token": "JWT 토큰"
}
```

---

## Error Response

### 이메일 또는 비밀번호 미입력

HTTP Status

400 Bad Request

```json
{
    "message": "이메일과 비밀번호를 입력해주세요."
}
```

---

### 존재하지 않는 이메일

HTTP Status

400 Bad Request

```json
{
    "message": "존재하지 않는 이메일입니다."
}
```

---

### 비밀번호 불일치

HTTP Status

400 Bad Request

```json
{
    "message": "비밀번호가 일치하지 않습니다."
}
```

---

# JWT 사용 방법

로그인 성공 시 발급되는 JWT를

HTTP Header에 포함하여 전송합니다.

Header

```
Authorization: Bearer JWT토큰
```

예시

```
Authorization: Bearer eyJhbGcOiJIUzI1NiIsInR5cCI6...
```

로그인이 필요한 API는 모두 위 Header를 포함해야 합니다.

---

# 개발 완료

- 회원가입
- 로그인
- bcrypt 암호화
- JWT 발급
- JWT 인증(Middleware)