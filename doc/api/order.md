# Order APIs

주문 관련 API입니다.

## 엔드포인트 목록

### 주문 조회
- `GET /api/order` - 내 주문 목록
- `GET /api/order/[id]` - 주문 상세
- `GET /api/home/order` - 전체 주문 목록 (관리자)
- `GET /api/home/order-track?orderId={orderId}` - 주문 추적

### 주문 생성
- `POST /api/order/new` - 새 주문 생성

### 쿠폰
- `POST /api/order/coupon` - 쿠폰 유효성 검증

---

## GET /api/order

내 주문 목록을 조회합니다.

### 권한
- **User** (로그인 필요)

### Query Parameters
- `page` (optional) - 페이지 번호 (기본값: 1)
- `limit` (optional) - 페이지당 항목 수 (기본값: 10)

### Response
```json
{
  "success": true,
  "orders": [
    {
      "_id": "...",
      "orderId": "ORD-20240101-001",
      "orderDate": "2024-01-01T00:00:00.000Z",
      "products": [
        {
          "productId": "...",
          "name": "상품명",
          "image": ["/uploads/product.jpg"],
          "price": 10000,
          "quantity": 2,
          "color": "Black",
          "attribute": "Size: L"
        }
      ],
      "totalPrice": 20000,
      "payAmount": 23000,
      "orderStatus": "delivered",
      "paymentStatus": "paid",
      "paymentMethod": "stripe",
      "deliveryInfo": {
        "shippingCost": 3000,
        "trackingNumber": "123456789"
      }
    }
  ],
  "total": 50,
  "page": 1,
  "pages": 5
}
```

---

## GET /api/order/[id]

주문 상세 정보를 조회합니다.

### 권한
- **User** (로그인 필요, 본인 주문만)
- **Admin/Staff** (모든 주문 조회 가능)

### URL Parameters
- `id` (required) - 주문 ID

### Response
```json
{
  "success": true,
  "order": {
    "_id": "...",
    "orderId": "ORD-20240101-001",
    "orderDate": "2024-01-01T00:00:00.000Z",
    "products": [...],
    "billingInfo": {
      "name": "홍길동",
      "email": "hong@example.com",
      "phone": "01012345678",
      "house": "123번지",
      "city": "서울",
      "state": "강남구",
      "zipCode": "12345",
      "country": "Korea"
    },
    "shippingInfo": {
      "name": "홍길동",
      "email": "hong@example.com",
      "phone": "01012345678",
      "house": "456번지",
      "city": "서울",
      "state": "강남구",
      "zipCode": "12345",
      "country": "Korea"
    },
    "deliveryInfo": {
      "shippingCost": 3000,
      "estimatedDate": "2024-01-05",
      "trackingNumber": "123456789",
      "courier": "CJ Logistics"
    },
    "totalPrice": 20000,
    "payAmount": 23000,
    "coupon": {
      "code": "SUMMER2024",
      "amount": 5000
    },
    "orderStatus": "delivered",
    "paymentStatus": "paid",
    "paymentMethod": "stripe",
    "paymentId": "pi_123456",
    "vat": 2000,
    "tax": 1000,
    "user": [{ "_id": "userId", "name": "홍길동", "email": "hong@example.com" }]
  }
}
```

---

## POST /api/order/new

새 주문을 생성합니다.

### 권한
- **User** (로그인 필요, 설정에 따라 비회원 가능)

### Request Body
```json
{
  "products": [
    {
      "productId": "...",
      "name": "상품명",
      "slug": "product-slug",
      "image": ["/uploads/product.jpg"],
      "price": 10000,
      "quantity": 2,
      "color": "Black",
      "attribute": "Size: L",
      "discount": 10,
      "vat": 1000,
      "tax": 500
    }
  ],
  "billingInfo": {
    "name": "홍길동",
    "email": "hong@example.com",
    "phone": "01012345678",
    "house": "123번지",
    "city": "서울",
    "state": "강남구",
    "zipCode": "12345",
    "country": "Korea"
  },
  "shippingInfo": {
    "name": "홍길동",
    "email": "hong@example.com",
    "phone": "01012345678",
    "house": "456번지",
    "city": "서울",
    "state": "강남구",
    "zipCode": "12345",
    "country": "Korea"
  },
  "paymentMethod": "cod",
  "couponCode": "SUMMER2024",
  "useShoppingPoint": 5000
}
```

### Response
```json
{
  "success": true,
  "orderId": "ORD-20240101-001",
  "order": {
    "_id": "...",
    "orderId": "ORD-20240101-001",
    "totalPrice": 20000,
    "payAmount": 18000,
    "orderStatus": "pending",
    "paymentStatus": "unpaid"
  }
}
```

### 주문 프로세스
1. 상품 재고 확인 (`Product.quantity`)
2. 쿠폰 유효성 검증 (선택사항)
3. 배송비 계산
4. 포인트 차감 (선택사항)
5. 주문 생성
6. 재고 차감
7. 이메일 발송 (주문 확인)

---

## GET /api/home/order

전체 주문 목록을 조회합니다. (관리자용)

### 권한
- **Admin/Staff** (orders 권한 필요)

### Query Parameters
- `page` (optional) - 페이지 번호
- `limit` (optional) - 페이지당 항목 수
- `status` (optional) - 주문 상태 필터
- `paymentStatus` (optional) - 결제 상태 필터
- `startDate` (optional) - 시작 날짜
- `endDate` (optional) - 종료 날짜

### Response
```json
{
  "success": true,
  "orders": [...],
  "total": 500,
  "page": 1,
  "pages": 50
}
```

---

## GET /api/home/order-track

주문을 추적합니다.

### 권한
- **Public** (인증 불필요, orderId로 조회)

### Query Parameters
- `orderId` (required) - 주문 ID

### Response
```json
{
  "success": true,
  "order": {
    "orderId": "ORD-20240101-001",
    "orderStatus": "shipped",
    "orderDate": "2024-01-01T00:00:00.000Z",
    "deliveryInfo": {
      "trackingNumber": "123456789",
      "courier": "CJ Logistics",
      "estimatedDate": "2024-01-05"
    },
    "statusHistory": [
      {
        "status": "pending",
        "date": "2024-01-01T00:00:00.000Z"
      },
      {
        "status": "processing",
        "date": "2024-01-01T10:00:00.000Z"
      },
      {
        "status": "shipped",
        "date": "2024-01-02T00:00:00.000Z"
      }
    ]
  }
}
```

---

## POST /api/order/coupon

쿠폰 유효성을 검증합니다.

### 권한
- **User** (로그인 필요)

### Request Body
```json
{
  "code": "SUMMER2024"
}
```

### Response

#### 성공
```json
{
  "success": true,
  "coupon": {
    "code": "SUMMER2024",
    "amount": 5000,
    "active": "2024-06-01T00:00:00.000Z",
    "expired": "2024-08-31T23:59:59.000Z"
  }
}
```

#### 실패 - 쿠폰 없음
```json
{
  "success": false,
  "message": "Invalid coupon code"
}
```

#### 실패 - 쿠폰 만료
```json
{
  "success": false,
  "message": "Coupon has expired"
}
```

#### 실패 - 쿠폰 아직 활성화 안됨
```json
{
  "success": false,
  "message": "Coupon is not active yet"
}
```

---

## PUT /api/order/[id]

주문 상태를 업데이트합니다. (관리자용)

### 권한
- **Admin/Staff** (orders 편집 권한 필요)

### Request Body
```json
{
  "orderStatus": "shipped",
  "paymentStatus": "paid",
  "deliveryInfo": {
    "trackingNumber": "123456789",
    "courier": "CJ Logistics"
  }
}
```

### Response
```json
{
  "success": true,
  "order": { ... }
}
```

---

## 주문 상태 (orderStatus)

- `pending` - 주문 접수
- `processing` - 처리 중
- `shipped` - 배송 중
- `delivered` - 배송 완료
- `cancelled` - 주문 취소
- `refunded` - 환불 완료

## 결제 상태 (paymentStatus)

- `unpaid` - 미결제
- `pending` - 결제 대기
- `paid` - 결제 완료
- `failed` - 결제 실패
- `refunded` - 환불 완료

---

## 주의사항

1. **재고 확인**: 주문 생성 전 반드시 재고 확인
2. **포인트 차감**: Shopping Point 사용 시 잔액 확인 필수
3. **쿠폰 검증**: 쿠폰 사용 시 유효성 검증 필수
4. **배송비 계산**: `ShippingCharge` 스키마 참조
5. **포인트 적립**: 스페셜 상품 주문 시 배송 완료 후 포인트 적립
6. **이메일 발송**: 주문 상태 변경 시 고객에게 이메일 발송 권장
7. **트랜잭션**: 주문 생성, 재고 차감, 포인트 차감은 트랜잭션으로 처리 권장
