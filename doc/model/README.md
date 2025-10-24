# Database Schema Documentation

이 디렉토리는 Novamall 프로젝트에서 사용하는 MongoDB 스키마에 대한 문서를 포함합니다.

## 스키마 목록

### 핵심 스키마
- [User](user.md) - 사용자 정보, 포인트, 레벨 시스템
- [Product](product.md) - 상품 정보, 스페셜 상품, 리뷰, 질문
- [Order](order.md) - 주문 정보, 결제, 배송 정보
- [Category](category.md) - 카테고리, 서브카테고리, 차일드 카테고리

### 상품 관련 스키마
- [Brand](brand.md) - 브랜드 정보
- [Attributes](attributes.md) - 상품 속성 (색상, 사이즈 등)
- [Colors](colors.md) - 색상 정보

### 결제/할인 스키마
- [Coupon](coupon.md) - 쿠폰 정보
- [ShippingCharge](shipping-charge.md) - 배송비 정보

### 사용자 활동 스키마
- [Address](address.md) - 사용자 주소록
- [Refund](refund.md) - 환불 요청

### 포인트/그룹 시스템
- [PointHistory](point-history.md) - 포인트 적립/사용 내역
- [Group](group.md) - 스페셜 상품 그룹
- [GroupRanking](group-ranking.md) - 그룹 참여 및 순위

### 컨텐츠 관리
- [Webpages](webpages.md) - 홈페이지, About, FAQ 등 페이지 컨텐츠
- [Notice](notice.md) - 공지사항
- [Event](event.md) - 이벤트 정보
- [FAQ](faq.md) - 자주 묻는 질문

### 시스템 설정
- [Settings](settings.md) - 사이트 설정, 결제 게이트웨이, 통화, SEO
- [Notification](notification.md) - 시스템 알림 (자동 삭제)
- [Newsletter](newsletter.md) - 뉴스레터 구독자
- [Form](form.md) - 카테고리별 동적 폼 필드

## 스키마 정의 위치

모든 스키마 정의는 `/utils/modelData.mjs` 파일에 중앙화되어 있으며, 각 모델 파일(`/models/*.js`)에서 이를 import하여 사용합니다.

```javascript
// Example: /models/user.js
import { model, models, Schema } from "mongoose";
import { user } from "~/utils/modelData.mjs";

const userSchema = new Schema(user);
export default models.user || model("user", userSchema);
```

## 특별 기능

### 1. 포인트 시스템
- **Withdrawable Point**: 출금 가능한 포인트
- **Shopping Point**: 쇼핑몰에서만 사용 가능한 포인트
- 스페셜 상품 구매 시 포인트 적립
- 포인트 내역은 `PointHistory` 스키마에 기록

### 2. 레벨 시스템
- 사용자는 활동에 따라 레벨업
- `level`과 `level_exp` 필드로 관리

### 3. 스페셜 상품 시스템
- `Product.isSpecial = true`인 상품
- 그룹 가입이 필요한 상품
- 리베이트 및 포인트 적립률 설정 가능

### 4. 권한 시스템
- Admin: 전체 권한
- Staff: 세부 권한 설정 가능 (`isStaff.permissions`)
- User: 일반 사용자

### 5. 다국어 지원
- 지원 언어: en, bn, ar, fr, kr
- 설정: `Settings.language`
