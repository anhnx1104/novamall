# Refund (RefundRequest) Schema

환불 요청을 관리하는 스키마입니다.

## 위치
- **Model**: `/models/refund.js`
- **Schema Definition**: `/utils/modelData.mjs` - `export const refundRequest`

## 필드 설명

### 기본 정보
| 필드 | 타입 | 설명 |
|------|------|------|
| `userId` | ObjectId (ref: User) | 환불 요청자 |
| `orderId` | String | 주문 ID |
| `refundReason` | String | 환불 사유 |
| `status` | String | 처리 상태 |
| `refundAmount` | Number | 환불 금액 |
| `note` | String | 관리자 메모 |
| `date` | Date | 요청일 (기본값: Date.now) |
| `attachments` | Array | 첨부 파일 (사진, 문서 등) |

### 상품 정보 (product)
| 필드 | 타입 | 설명 |
|------|------|------|
| `product.id` | ObjectId (ref: Product) | 상품 ID |
| `product.name` | String | 상품명 |
| `product.color` | String | 선택한 색상 |
| `product.attribute` | String | 선택한 속성 |
| `product.price` | Number | 단가 |
| `product.qty` | Number | 수량 |
| `product.vat` | Number | 부가세 |
| `product.tax` | Number | 세금 |

## Status 값

- `pending` - 요청 접수
- `reviewing` - 검토 중
- `approved` - 승인
- `rejected` - 거부
- `completed` - 환불 완료

## 사용 예시

### 환불 요청 생성
```javascript
import refundRequestModel from "~/models/refund";

const refund = await refundRequestModel.create({
  userId: userId,
  orderId: "ORD-001",
  product: {
    id: productId,
    name: "테스트 상품",
    color: "Red",
    attribute: "Size: L",
    price: 10000,
    qty: 2,
    vat: 1000,
    tax: 500
  },
  refundReason: "상품 불량",
  refundAmount: 21500,  // (price * qty) + vat + tax
  status: "pending",
  attachments: ["/uploads/refund/image1.jpg"],
  date: new Date()
});

// User의 refundRequest 배열에 추가
await userModel.findByIdAndUpdate(userId, {
  $push: { refundRequest: refund._id }
});
```

### 환불 처리 (관리자)
```javascript
// 환불 승인
await refundRequestModel.findByIdAndUpdate(refundId, {
  status: "approved",
  note: "승인되었습니다. 3-5일 내 환불 처리됩니다."
});

// 환불 거부
await refundRequestModel.findByIdAndUpdate(refundId, {
  status: "rejected",
  note: "환불 조건에 부합하지 않습니다."
});

// 환불 완료
await refundRequestModel.findByIdAndUpdate(refundId, {
  status: "completed",
  note: "환불이 완료되었습니다."
});
```

### 환불 요청 조회
```javascript
// 사용자의 환불 내역
const refunds = await refundRequestModel
  .find({ userId })
  .sort({ date: -1 });

// 특정 주문의 환불 내역
const orderRefunds = await refundRequestModel.find({ orderId: "ORD-001" });
```

## 관련 API

### 사용자
- `GET /api/refund` - 내 환불 내역
- `POST /api/refund` - 환불 요청

### 관리자
- `GET /api/admin/refund` - 전체 환불 목록
- `PUT /api/admin/refund` - 환불 상태 업데이트

## 환불 프로세스

1. **환불 요청**: 사용자가 환불 사유와 함께 요청
2. **검토**: 관리자가 요청 내용 검토
3. **승인/거부**: 환불 조건 확인 후 결정
4. **환불 처리**: 승인 시 결제 게이트웨이를 통해 환불
5. **완료**: 환불 처리 완료 후 상태 업데이트

## Attachments

첨부 파일은 상품 불량, 파손 등의 증빙 자료로 사용됩니다.

```javascript
{
  attachments: [
    "/uploads/refund/damaged-product-1.jpg",
    "/uploads/refund/damaged-product-2.jpg",
    "/uploads/refund/invoice.pdf"
  ]
}
```

## 환불 금액 계산

```javascript
function calculateRefundAmount(product) {
  const subtotal = product.price * product.qty;
  const total = subtotal + product.vat + product.tax;
  return total;
}
```

배송비 환불 여부는 환불 정책에 따라 결정합니다.

## 통계

### 환불율 계산
```javascript
const totalOrders = await orderModel.countDocuments();
const totalRefunds = await refundRequestModel.countDocuments({
  status: { $in: ["approved", "completed"] }
});

const refundRate = (totalRefunds / totalOrders) * 100;
```

### 환불 사유 통계
```javascript
const reasonStats = await refundRequestModel.aggregate([
  {
    $group: {
      _id: "$refundReason",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count: -1 }
  }
]);
```

## 주의사항

1. **환불 기한**: 상품 수령 후 N일 이내 환불 가능 등의 정책 필요
2. **부분 환불**: 주문 내 일부 상품만 환불하는 경우 처리 로직 필요
3. **재고 복구**: 환불 승인 시 상품 재고 복구 고려
4. **결제 게이트웨이 연동**: 실제 환불 처리는 Stripe, PayPal 등의 API 사용
