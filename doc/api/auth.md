# Authentication APIs

사용자 인증 관련 API입니다.

## 엔드포인트 목록

- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/[...nextauth]` - NextAuth.js 인증 (로그인)
- `GET /api/reset?token={token}` - 비밀번호 재설정 토큰 검증
- `POST /api/reset` - 비밀번호 재설정 이메일 발송
- `PUT /api/reset` - 비밀번호 재설정 완료

---

## POST /api/auth/signup

회원가입 API입니다.

### 권한
- **Public** (인증 불필요)

### Request Body
```json
{
  "name": "홍길동",
  "email": "hong@example.com",
  "password": "password123"
}
```

### Response

#### 성공
```json
{
  "success": true
}
```

#### 실패 - 이메일 중복
```json
{
  "success": false,
  "duplicate": true
}
```

#### 실패 - 기타 에러
```json
{
  "success": false,
  "duplicate": false
}
```

### 구현 세부사항
- 비밀번호는 bcrypt로 해시화 (salt rounds: 6)
- 이메일은 unique 제약조건으로 중복 방지
- `parseForm` 유틸리티 사용 (multipart/form-data)

### 예시
```javascript
const response = await fetch("/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "홍길동",
    email: "hong@example.com",
    password: "password123"
  })
});

const data = await response.json();
if (data.success) {
  // 회원가입 성공
} else if (data.duplicate) {
  // 이메일 중복
}
```

---

## POST /api/auth/[...nextauth]

NextAuth.js를 통한 로그인 API입니다.

### 권한
- **Public** (인증 불필요)

### 지원되는 Provider

#### 1. Credentials (이메일/비밀번호)
```javascript
await signIn("credentials", {
  username: "hong@example.com",
  password: "password123",
  redirect: false
});
```

#### 2. Google OAuth
```javascript
await signIn("google");
```

#### 3. Facebook OAuth
```javascript
await signIn("facebook");
```

### Session 정보
로그인 성공 시 세션에 저장되는 정보:

```javascript
{
  user: {
    id: "userId",
    name: "홍길동",
    email: "hong@example.com",
    a: false,  // isAdmin
    s: {       // isStaff
      status: false,
      permissions: []
    }
  }
}
```

### Session 조회
```javascript
import { getSession } from "next-auth/react";

const session = await getSession();
console.log(session.user);
```

### 로그아웃
```javascript
import { signOut } from "next-auth/react";

await signOut();
```

### 설정 위치
- `/pages/api/auth/[...nextauth].js`
- 세션 만료: 3시간

---

## GET /api/reset?token={token}

비밀번호 재설정 토큰의 유효성을 검증합니다.

### 권한
- **Public** (인증 불필요)

### Query Parameters
- `token` (required) - 비밀번호 재설정 토큰

### Response

#### 성공
```json
{
  "success": true,
  "token": "abc123xyz789",
  "err": null
}
```

#### 실패 - 토큰 무효/만료
```json
{
  "success": false,
  "token": "abc123xyz789",
  "err": "Password reset token is invalid or has expired."
}
```

### 예시
```javascript
const response = await fetch(`/api/reset?token=${token}`);
const data = await response.json();

if (data.success) {
  // 유효한 토큰 - 비밀번호 재설정 폼 표시
} else {
  // 무효한 토큰 - 에러 메시지 표시
  alert(data.err);
}
```

---

## POST /api/reset

비밀번호 재설정 이메일을 발송합니다.

### 권한
- **Public** (인증 불필요)

### Request Body
```json
{
  "email": "hong@example.com"
}
```

### Response

#### 성공
```json
{
  "success": true
}
```

#### 실패 - 계정 없음
```json
{
  "success": false,
  "err": "No account with that email address (hong@example.com) exists."
}
```

#### 실패 - 이메일 발송 오류
```json
{
  "success": false,
  "err": "Unable to send email cause an internal server error"
}
```

### 이메일 내용
- 재설정 링크: `http://domain.com/reset/{token}`
- 토큰 유효기간: 1시간

### 예시
```javascript
const response = await fetch("/api/reset", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "hong@example.com"
  })
});

const data = await response.json();
if (data.success) {
  alert("비밀번호 재설정 이메일이 발송되었습니다.");
} else {
  alert(data.err);
}
```

---

## PUT /api/reset

비밀번호를 재설정합니다.

### 권한
- **Public** (인증 불필요)

### Request Body
```json
{
  "token": "abc123xyz789",
  "pass": "newPassword123"
}
```

### Response

#### 성공
```json
{
  "success": true,
  "err": null
}
```

#### 실패 - 토큰 무효/만료
```json
{
  "success": false,
  "err": "Password reset token is invalid or has expired."
}
```

### 구현 세부사항
- 새 비밀번호는 bcrypt로 해시화
- 토큰은 사용 후 삭제됨 (`resetPasswordToken`, `resetPasswordExpires` 필드를 undefined로 설정)

### 예시
```javascript
const response = await fetch("/api/reset", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    token: token,
    pass: "newPassword123"
  })
});

const data = await response.json();
if (data.success) {
  alert("비밀번호가 재설정되었습니다. 로그인해주세요.");
  router.push("/signin");
} else {
  alert(data.err);
}
```

---

## 보안 고려사항

1. **비밀번호 해싱**: bcrypt 사용 (salt rounds: 6)
2. **토큰 만료**: 비밀번호 재설정 토큰은 1시간 후 만료
3. **이메일 검증**: 회원가입 시 이메일 형식 검증 권장
4. **HTTPS**: 프로덕션 환경에서는 HTTPS 필수
5. **Rate Limiting**: 비밀번호 재설정 요청에 대한 Rate Limiting 권장
6. **CSRF 보호**: NextAuth.js가 자동으로 CSRF 토큰 관리
