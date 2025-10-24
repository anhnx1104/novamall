# Admin APIs

관리자 전용 API 목록입니다.

## 카테고리별 API 목록

### 사용자 관리
- `GET /api/users` - 사용자 목록
- `GET /api/users/search?email={email}` - 사용자 검색
- `PUT /api/users/status` - 사용자 상태 변경
- `PUT /api/users/level` - 사용자 레벨 관리
- `GET /api/staffs` - 직원 목록
- `POST /api/staffs` - 직원 추가
- `PUT /api/staffs` - 직원 수정
- `DELETE /api/staffs` - 직원 삭제

### 포인트 관리
- `GET /api/users/point?userId={userId}` - 사용자 포인트 조회
- `POST /api/users/point` - 포인트 수동 지급
- `GET /api/users/point/history?userId={userId}` - 포인트 내역
- `GET /api/users/point/shoppingPoint` - Shopping Point 통계
- `GET /api/users/point/withdrawablePoint` - Withdrawable Point 통계
- `GET /api/users/rebate?userId={userId}` - 리베이트 내역

### 상품 관리
- `GET /api/product` - 상품 목록 (관리자)
- `POST /api/product/create` - 상품 생성
- `PUT /api/product/edit` - 상품 수정
- `DELETE /api/product/delete/[id]` - 상품 삭제
- `GET /api/users/product?userId={userId}` - 사용자별 상품 구매 내역
- `GET /api/users/product/special?userId={userId}` - 사용자별 스페셜 상품 내역

### 주문 관리
- `GET /api/home/order` - 전체 주문 목록
- `PUT /api/order/[id]` - 주문 상태 업데이트

### 환불 관리
- `GET /api/admin/refund` - 환불 요청 목록
- `PUT /api/admin/refund` - 환불 처리

### 브랜드 관리
- `GET /api/admin/brand` - 브랜드 목록
- `POST /api/admin/brand` - 브랜드 생성
- `PUT /api/admin/brand/edit` - 브랜드 수정
- `DELETE /api/admin/brand` - 브랜드 삭제

### 카테고리 관리
- `GET /api/categories` - 카테고리 목록
- `POST /api/categories` - 카테고리 생성
- `PUT /api/categories/edit` - 카테고리 수정
- `DELETE /api/categories` - 카테고리 삭제
- `GET /api/categories/subcategories?category={id}` - 서브카테고리 목록
- `GET /api/categories/childcategories?subcategory={id}` - 차일드 카테고리 목록
- `GET /api/categories/form?categoryId={id}` - 카테고리 폼 필드

### 속성 관리
- `GET /api/attributes` - 속성 목록
- `POST /api/attributes` - 속성 생성
- `PUT /api/attributes/edit` - 속성 수정
- `DELETE /api/attributes` - 속성 삭제

### 색상 관리
- `GET /api/colors` - 색상 목록
- `POST /api/colors` - 색상 생성
- `PUT /api/colors/edit` - 색상 수정
- `DELETE /api/colors` - 색상 삭제

### 쿠폰 관리
- `GET /api/coupons` - 쿠폰 목록
- `POST /api/coupons` - 쿠폰 생성
- `PUT /api/coupons/edit` - 쿠폰 수정
- `DELETE /api/coupons` - 쿠폰 삭제

### 배송 관리
- `GET /api/shipping` - 배송비 조회
- `PUT /api/shipping` - 배송비 수정

### 그룹 관리
- `GET /api/group` - 그룹 목록
- `POST /api/group/create` - 그룹 생성
- `PUT /api/group/edit` - 그룹 수정
- `DELETE /api/group/delete` - 그룹 삭제
- `GET /api/group/user?groupId={id}` - 그룹 회원 목록
- `GET /api/group/product?groupId={id}` - 그룹 상품 목록

### 페이지 관리
- `GET /api/page` - 페이지 컨텐츠 조회
- `PUT /api/page` - 페이지 컨텐츠 수정
- `GET /api/page/home` - 홈페이지 설정 조회
- `PUT /api/page/home` - 홈페이지 설정 수정

### 공지/이벤트/FAQ
- `GET /api/notice` - 공지사항 목록
- `POST /api/notice` - 공지사항 생성
- `PUT /api/notice/[id]` - 공지사항 수정
- `DELETE /api/notice/[id]` - 공지사항 삭제
- `GET /api/event` - 이벤트 목록
- `POST /api/event` - 이벤트 생성
- `PUT /api/event/[id]` - 이벤트 수정
- `DELETE /api/event/[id]` - 이벤트 삭제
- `GET /api/faq` - FAQ 목록
- `POST /api/faq` - FAQ 생성
- `PUT /api/faq` - FAQ 수정
- `DELETE /api/faq` - FAQ 삭제

### 뉴스레터
- `GET /api/subscribers` - 구독자 목록
- `DELETE /api/subscribers` - 구독자 삭제

### 리뷰 관리
- `GET /api/review` - 리뷰 목록
- `PUT /api/review` - 리뷰 수정 (승인/거부)
- `DELETE /api/review` - 리뷰 삭제

### 설정
- `GET /api/settings` - 사이트 설정 조회
- `PUT /api/settings` - 사이트 설정 수정

### 알림
- `GET /api/notification` - 알림 목록
- `POST /api/notification` - 알림 생성
- `DELETE /api/notification` - 알림 삭제

### 대시보드
- `GET /api/dashboard` - 대시보드 통계

### 갤러리
- `GET /api/gallery` - 갤러리 목록
- `GET /api/gallery/more-product` - 추가 상품 조회

### 파일 업로드
- `POST /api/fileupload/local` - 로컬 파일 업로드
- `POST /api/fileupload/s3` - S3 파일 업로드

---

## 권한 체크

모든 관리자 API는 `/lib/sessionPermission.js`를 통해 권한을 체크합니다.

```javascript
import sessionChecker from "~/lib/sessionPermission";

export default async function handler(req, res) {
  // Admin 또는 Staff (products 권한)
  const hasPermission = await sessionChecker(req, "products", false);

  if (!hasPermission) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // API 로직
}
```

### 권한 타겟
- `general` - 일반 Staff 권한
- `products` - 상품 관리
- `categories` - 카테고리 관리
- `orders` - 주문 관리
- `users` - 사용자 관리
- `settings` - 설정 관리

### Staff 권한 구조
```javascript
{
  isStaff: {
    status: true,
    surname: "Manager",
    permissions: [
      {
        name: "products",
        view: true,
        edit: true,
        delete: false
      },
      {
        name: "orders",
        view: true,
        edit: true,
        delete: false
      }
    ]
  }
}
```

---

## 대시보드 통계

### GET /api/dashboard

대시보드 통계를 조회합니다.

### 권한
- **Admin/Staff** (general 권한)

### Response
```json
{
  "success": true,
  "stats": {
    "totalOrders": 1500,
    "totalRevenue": 50000000,
    "totalProducts": 350,
    "totalUsers": 5000,
    "pendingOrders": 25,
    "shippedOrders": 80,
    "deliveredOrders": 1350,
    "cancelledOrders": 45,
    "monthlySales": [
      { "month": "2024-01", "sales": 3000000 },
      { "month": "2024-02", "sales": 3500000 }
    ],
    "topProducts": [
      {
        "product": { ... },
        "totalSold": 250
      }
    ],
    "recentOrders": [...]
  }
}
```

---

## 파일 업로드

### POST /api/fileupload/local

로컬 서버에 파일을 업로드합니다.

### 권한
- **Admin/Staff**

### Request
- Content-Type: `multipart/form-data`
- Field name: `file` 또는 `files`

### Response
```json
{
  "success": true,
  "files": [
    {
      "url": "/uploads/2024/01/01/image.jpg",
      "name": "image.jpg",
      "size": 125648
    }
  ]
}
```

### POST /api/fileupload/s3

S3에 파일을 업로드합니다.

### 권한
- **Admin/Staff**

### Request
- Content-Type: `multipart/form-data`
- Field name: `file` 또는 `files`

### Response
```json
{
  "success": true,
  "files": [
    {
      "url": "https://bucket.s3.region.amazonaws.com/path/to/file.jpg",
      "key": "uploads/2024/01/01/file.jpg",
      "name": "file.jpg",
      "size": 125648
    }
  ]
}
```

---

## 사용 예시

### 상품 생성 플로우
```javascript
// 1. 이미지 업로드
const formData = new FormData();
formData.append("file", imageFile);

const uploadRes = await fetch("/api/fileupload/local", {
  method: "POST",
  body: formData
});
const uploadData = await uploadRes.json();
const imageUrl = uploadData.files[0].url;

// 2. 상품 생성
const productRes = await fetch("/api/product/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "상품명",
    slug: "product-slug",
    price: 10000,
    image: [imageUrl],
    ...
  })
});
```

---

## 주의사항

1. **권한 확인**: 모든 요청마다 권한 체크 필수
2. **데이터 검증**: 입력 데이터 유효성 검증
3. **로그 기록**: 중요한 변경사항은 로그 기록
4. **트랜잭션**: 여러 모델을 변경하는 경우 트랜잭션 사용
5. **감사 로그**: 관리자 활동 감사 로그 구현 권장
