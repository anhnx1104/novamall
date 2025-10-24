# API Documentation

이 디렉토리는 Novamall 프로젝트의 REST API 엔드포인트에 대한 문서를 포함합니다.

## API 구조

모든 API는 `/pages/api/` 디렉토리에 있으며, Next.js API Routes를 사용합니다.

## API 카테고리

### 인증 (Authentication)
- [Auth APIs](auth.md) - 회원가입, 로그인, 비밀번호 재설정

### 공개 API (Public)
- [Home APIs](home.md) - 홈페이지, 상품 목록, 검색 등 (인증 불필요)

### 상품 (Products)
- [Product APIs](product.md) - 상품 CRUD, 스페셜 상품
- [Review APIs](review.md) - 리뷰 작성, 조회, 통계
- [Question APIs](question.md) - 상품 문의

### 주문/결제 (Orders & Checkout)
- [Order APIs](order.md) - 주문 생성, 조회, 관리
- [Checkout APIs](checkout.md) - 결제 처리 (Stripe, SSLCommerz, Razorpay)

### 사용자 (User)
- [Profile APIs](profile.md) - 프로필, 주소, 포인트
- [Address APIs](address.md) - 주소록 관리
- [Wishlist APIs](wishlist.md) - 찜 목록

### 포인트/그룹 (Points & Groups)
- [Point APIs](point.md) - 포인트 조회, 내역
- [Group APIs](group.md) - 그룹 가입, 스페셜 상품

### 카테고리/브랜드
- [Category APIs](category.md) - 카테고리 CRUD
- [Brand APIs](brand.md) - 브랜드 관리
- [Attributes APIs](attributes.md) - 속성 관리
- [Colors APIs](colors.md) - 색상 관리

### 쿠폰/배송
- [Coupon APIs](coupon.md) - 쿠폰 관리, 검증
- [Shipping APIs](shipping.md) - 배송비 조회/수정

### 컨텐츠 관리
- [Page APIs](page.md) - 웹페이지 컨텐츠 관리
- [Notice APIs](notice.md) - 공지사항
- [Event APIs](event.md) - 이벤트
- [FAQ APIs](faq.md) - 자주 묻는 질문
- [Newsletter APIs](newsletter.md) - 뉴스레터 구독

### 시스템
- [Settings APIs](settings.md) - 사이트 설정
- [Notification APIs](notification.md) - 알림
- [Dashboard APIs](dashboard.md) - 대시보드 통계
- [File Upload APIs](fileupload.md) - 파일 업로드 (Local, S3)

### 관리자 (Admin)
- [Admin APIs](admin.md) - 관리자 전용 API
- [Staff APIs](staff.md) - 직원 관리
- [Users Management APIs](users.md) - 사용자 관리

### 기타
- [Refund APIs](refund.md) - 환불 요청/처리
- [Gallery APIs](gallery.md) - 갤러리

## 인증 방식

### NextAuth.js (Session-based)
대부분의 API는 NextAuth.js 세션 기반 인증을 사용합니다.

```javascript
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // API 로직
}
```

### 권한 체크
권한 체크는 `/lib/sessionPermission.js`를 사용합니다.

```javascript
import sessionChecker from "~/lib/sessionPermission";

const hasPermission = await sessionChecker(req, "products", false);
if (!hasPermission) {
  return res.status(403).json({ message: "Forbidden" });
}
```

#### 권한 레벨
1. **Admin** (`user.a === true`) - 전체 권한
2. **Staff** (`user.s.status === true`) - 세부 권한 설정
3. **User** - 일반 사용자
4. **Public** - 인증 불필요

## HTTP 메서드

- `GET` - 데이터 조회
- `POST` - 데이터 생성
- `PUT` - 데이터 수정
- `DELETE` - 데이터 삭제

## 응답 형식

### 성공 응답
```json
{
  "success": true,
  "data": { ... }
}
```

### 에러 응답
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

## 페이지네이션

목록 조회 API는 일반적으로 다음 쿼리 파라미터를 지원합니다:

- `page` - 페이지 번호 (기본값: 1)
- `limit` - 페이지당 항목 수 (기본값: 10)

```javascript
// 예시
GET /api/product?page=2&limit=20
```

## 필터링

상품, 주문 등의 목록 API는 필터링을 지원합니다:

```javascript
// 카테고리로 필터링
GET /api/product?category=electronics

// 가격 범위 필터링
GET /api/product?minPrice=1000&maxPrice=5000

// 정렬
GET /api/product?sort=price&order=asc
```

## 데이터베이스 연결

모든 API는 요청 시작 시 MongoDB에 연결합니다:

```javascript
import dbConnect from "~/utils/dbConnect";

export default async function handler(req, res) {
  await dbConnect();
  // API 로직
}
```

## 에러 핸들링

```javascript
export default async function handler(req, res) {
  try {
    await dbConnect();
    // API 로직
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}
```

## CORS

기본적으로 Next.js API Routes는 Same-Origin Policy를 따릅니다. CORS가 필요한 경우 `/next.config.js`의 headers 설정을 확인하세요.

## Rate Limiting

현재 Rate Limiting은 구현되어 있지 않습니다. 프로덕션 환경에서는 미들웨어나 리버스 프록시(Nginx)를 통해 구현하는 것을 권장합니다.

## 환경 변수

API에서 사용하는 주요 환경 변수:

```env
# Database
MONGO_URI=mongodb://...

# Authentication
AUTH_SECRET=...

# Payment Gateways
STRIPE_SECRET_KEY=...
PAYPAL_CLIENT_ID=...
SSLCOMMERZ_STORE_ID=...
RAZORPAY_KEY_ID=...

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...

# File Upload
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=...
AWS_BUCKET_NAME=...

# Email
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
```

## 테스트

API 테스트는 Postman, Insomnia 또는 curl을 사용할 수 있습니다.

```bash
# 예시: 상품 목록 조회
curl http://localhost:8080/api/home/products

# 예시: 로그인 후 프로필 조회
curl -H "Cookie: next-auth.session-token=..." \
  http://localhost:8080/api/profile
```

## 문서 규칙

각 API 문서는 다음 형식을 따릅니다:

1. **엔드포인트** - API 경로
2. **메서드** - HTTP 메서드
3. **권한** - 필요한 권한 레벨
4. **파라미터** - 쿼리/바디 파라미터
5. **응답** - 성공/실패 응답 예시
6. **예시** - 실제 사용 예시
