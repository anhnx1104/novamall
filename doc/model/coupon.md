# Coupon Schema

쿠폰 정보를 관리하는 스키마입니다.

## 위치
- **Model**: `/models/coupon.js`
- **Schema Definition**: `/utils/modelData.mjs` - `export const coupon`

## 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `code` | String | 쿠폰 코드 (unique) |
| `amount` | Number | 할인 금액 또는 할인율 |
| `active` | Date | 활성화 날짜 |
| `expired` | Date | 만료 날짜 |

## 사용 예시

```javascript
import couponModel from "~/models/coupon";

// 쿠폰 생성
const coupon = await couponModel.create({
  code: "SUMMER2024",
  amount: 5000,  // 5,000원 할인 또는 50% (타입에 따라)
  active: new Date("2024-06-01"),
  expired: new Date("2024-08-31")
});

// 쿠폰 유효성 검증
async function validateCoupon(code) {
  const coupon = await couponModel.findOne({ code });

  if (!coupon) {
    throw new Error("존재하지 않는 쿠폰입니다.");
  }

  const now = new Date();

  if (now < coupon.active) {
    throw new Error("아직 사용할 수 없는 쿠폰입니다.");
  }

  if (now > coupon.expired) {
    throw new Error("만료된 쿠폰입니다.");
  }

  return coupon;
}
```

## Order와의 연동

주문 시 쿠폰 적용:

```javascript
// 쿠폰 적용
const coupon = await validateCoupon("SUMMER2024");

const totalPrice = 50000;
const discount = coupon.amount;
const payAmount = totalPrice - discount;

const order = await orderModel.create({
  orderId: "ORD-001",
  totalPrice,
  payAmount,
  coupon: {
    code: coupon.code,
    amount: discount
  }
});
```

## 관련 API

- `GET /api/coupons` - 쿠폰 목록 (관리자)
- `POST /api/coupons` - 쿠폰 생성
- `PUT /api/coupons/edit` - 쿠폰 수정
- `DELETE /api/coupons` - 쿠폰 삭제
- `POST /api/order/coupon` - 쿠폰 유효성 검증 (사용자)

## 주의사항

1. **중복 방지**: `code` 필드는 unique 인덱스
2. **날짜 검증**: `active`와 `expired` 날짜 범위 확인 필수
3. **사용 횟수 제한**: 현재 스키마에는 없지만, 필요시 `usageLimit`, `usedCount` 필드 추가 가능
