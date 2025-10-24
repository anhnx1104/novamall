# Order Schema

주문 정보, 결제, 배송 정보를 관리하는 스키마입니다.

## 위치
- **Model**: `/models/order.js`
- **Schema Definition**: `/utils/modelData.mjs` - `export const order`

## 필드 설명

### 기본 정보
| 필드 | 타입 | 설명 |
|------|------|------|
| `orderId` | String | 주문 고유 ID |
| `orderDate` | Date | 주문일 (기본값: Date.now) |
| `products` | Array | 주문 상품 목록 |
| `new` | Boolean | 새 주문 여부 (기본값: true) |

### 결제 정보
| 필드 | 타입 | 설명 |
|------|------|------|
| `paymentMethod` | String | 결제 방법 (cod, stripe, paypal 등) |
| `paymentId` | String | 결제 ID (PG사 제공) |
| `paymentStatus` | String | 결제 상태 |
| `totalPrice` | Number | 총 상품 금액 |
| `payAmount` | Number | 실제 결제 금액 |
| `vat` | Number | 부가세 (기본값: 0) |
| `tax` | Number | 세금 (기본값: 0) |
| `coupon` | Object | 적용된 쿠폰 정보 |

### 주문 상태
| 필드 | 타입 | 설명 |
|------|------|------|
| `status` | String | 주문 상태 (deprecated, orderStatus 사용) |
| `orderStatus` | String | 주문 진행 상태 |

#### 주문 상태 값
- `pending` - 주문 접수
- `processing` - 처리 중
- `shipped` - 배송 중
- `delivered` - 배송 완료
- `cancelled` - 주문 취소
- `refunded` - 환불 완료

### 구매자 정보 (billingInfo)
| 필드 | 타입 | 설명 |
|------|------|------|
| `billingInfo` | Object | 구매자 정보 객체 |
| `billingInfo.name` | String | 이름 |
| `billingInfo.email` | String | 이메일 |
| `billingInfo.phone` | String | 전화번호 |
| `billingInfo.house` | String | 상세 주소 |
| `billingInfo.city` | String | 도시 |
| `billingInfo.state` | String | 주/도 |
| `billingInfo.zipCode` | String | 우편번호 |
| `billingInfo.country` | String | 국가 |

### 배송지 정보 (shippingInfo)
| 필드 | 타입 | 설명 |
|------|------|------|
| `shippingInfo` | Object | 배송지 정보 객체 |
| `shippingInfo.name` | String | 수령인 이름 |
| `shippingInfo.email` | String | 이메일 |
| `shippingInfo.phone` | String | 전화번호 |
| `shippingInfo.house` | String | 상세 주소 |
| `shippingInfo.city` | String | 도시 |
| `shippingInfo.state` | String | 주/도 |
| `shippingInfo.zipCode` | String | 우편번호 |
| `shippingInfo.country` | String | 국가 |

### 배송 정보 (deliveryInfo)
| 필드 | 타입 | 설명 |
|------|------|------|
| `deliveryInfo` | Object | 배송 정보 객체 |
| `deliveryInfo.shippingCost` | Number | 배송비 |
| `deliveryInfo.estimatedDate` | String | 예상 배송일 |
| `deliveryInfo.trackingNumber` | String | 송장 번호 |
| `deliveryInfo.courier` | String | 배송 업체 |

### 관계 필드 (References)
| 필드 | 타입 | 참조 | 설명 |
|------|------|------|------|
| `user` | Array | User | 주문자 (배열이지만 보통 1개) |

## Products 배열 구조

`products` 필드는 주문한 상품 정보를 담는 배열입니다.

```javascript
{
  products: [
    {
      productId: "ObjectId",        // 상품 ID
      name: "상품명",
      slug: "product-slug",
      image: ["image-url"],
      price: 10000,                 // 단가
      quantity: 2,                  // 수량
      color: "Red",                 // 선택한 색상
      attribute: "Size: L",         // 선택한 속성
      discount: 10,                 // 할인율 (%)
      vat: 1000,                    // 부가세
      tax: 500                      // 세금
    }
  ]
}
```

## 주문 프로세스

### 1. 주문 생성
```javascript
const order = await orderModel.create({
  orderId: generateOrderId(),
  orderDate: new Date(),
  products: cartItems,
  user: [userId],
  billingInfo: { /* 구매자 정보 */ },
  shippingInfo: { /* 배송지 정보 */ },
  paymentMethod: "stripe",
  totalPrice: 50000,
  payAmount: 45000,  // 쿠폰 적용 후
  orderStatus: "pending",
  paymentStatus: "pending",
  new: true
});
```

### 2. 결제 처리
```javascript
// 결제 성공 시
await orderModel.findByIdAndUpdate(orderId, {
  paymentStatus: "paid",
  paymentId: "stripe_payment_id",
  orderStatus: "processing"
});
```

### 3. 배송 시작
```javascript
await orderModel.findByIdAndUpdate(orderId, {
  orderStatus: "shipped",
  "deliveryInfo.trackingNumber": "123456789",
  "deliveryInfo.courier": "CJ Logistics"
});
```

### 4. 배송 완료
```javascript
await orderModel.findByIdAndUpdate(orderId, {
  orderStatus: "delivered"
});
```

## 쿠폰 적용

`coupon` 객체에 적용된 쿠폰 정보를 저장합니다.

```javascript
{
  coupon: {
    code: "SUMMER2024",
    amount: 5000,        // 할인 금액
    type: "fixed"        // fixed 또는 percentage
  }
}
```

## 관련 API

### 주문 생성
- `POST /api/order/new` - 새 주문 생성
- `POST /api/checkout/stripe` - Stripe 결제
- `POST /api/checkout/sslcommerz` - SSLCommerz 결제
- `POST /api/checkout/razorpay` - Razorpay 결제

### 주문 조회
- `GET /api/order` - 주문 목록 (사용자)
- `GET /api/order/[id]` - 주문 상세
- `GET /api/home/order-track?orderId={orderId}` - 주문 추적

### 주문 관리 (관리자)
- `GET /api/home/order` - 전체 주문 목록
- `PUT /api/order/[id]` - 주문 상태 업데이트
- `DELETE /api/order/[id]` - 주문 삭제

### 쿠폰 적용
- `POST /api/order/coupon` - 쿠폰 유효성 검증

## 사용 예시

```javascript
import orderModel from "~/models/order";

// 주문 생성
const newOrder = await orderModel.create({
  orderId: "ORD-20240101-001",
  products: [
    {
      productId: productId,
      name: "테스트 상품",
      price: 10000,
      quantity: 2,
      color: "Red",
      attribute: "Size: L"
    }
  ],
  user: [userId],
  billingInfo: {
    name: "홍길동",
    email: "user@example.com",
    phone: "01012345678",
    house: "123번지",
    city: "서울",
    state: "강남구",
    zipCode: "12345",
    country: "Korea"
  },
  shippingInfo: {
    // billingInfo와 동일하거나 다른 배송지
  },
  deliveryInfo: {
    shippingCost: 3000,
    estimatedDate: "2024-01-05"
  },
  paymentMethod: "cod",
  totalPrice: 20000,
  payAmount: 23000,  // 상품 + 배송비
  orderStatus: "pending",
  paymentStatus: "unpaid"
});

// 주문 상태 업데이트
await orderModel.findByIdAndUpdate(orderId, {
  orderStatus: "shipped",
  "deliveryInfo.trackingNumber": "123456789"
});

// 사용자별 주문 조회
const userOrders = await orderModel
  .find({ user: userId })
  .sort({ orderDate: -1 });
```

## 포인트 적립

스페셜 상품 주문의 경우, 주문 완료(`orderStatus: "delivered"`) 시 포인트가 적립됩니다.

포인트 적립 로직은 `/lib/levelUpFunctions.js`와 `/lib/rebateFunctions.js`에 구현되어 있습니다.

## 주의사항

1. **재고 차감**: 주문 생성 시 상품 재고(`Product.quantity`) 차감 필수
2. **결제 검증**: 결제 완료 전까지 `paymentStatus`를 "pending" 유지
3. **배송비 계산**: `ShippingCharge` 스키마 참조하여 배송비 계산
4. **쿠폰 검증**: 쿠폰 유효성 및 만료일 확인 필수
5. **환불 처리**: 환불 시 `RefundRequest` 스키마에 별도 기록
