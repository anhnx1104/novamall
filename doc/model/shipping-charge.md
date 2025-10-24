# ShippingCharge Schema

배송비 정보를 관리하는 스키마입니다.

## 위치
- **Model**: `/models/shippingCharge.js`
- **Schema Definition**: `/utils/modelData.mjs` - `export const shippingCharge`

## 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `area` | Array | 지역별 배송비 목록 |
| `area[].name` | String | 지역명 (예: Seoul, Busan) |
| `area[].price` | Number | 해당 지역 배송비 |
| `internationalCost` | Number | 국제 배송비 |

## 사용 예시

```javascript
import shippingChargeModel from "~/models/shippingCharge";

// 배송비 설정
const shippingCharge = await shippingChargeModel.create({
  area: [
    { name: "Seoul", price: 3000 },
    { name: "Busan", price: 3500 },
    { name: "Jeju", price: 5000 }
  ],
  internationalCost: 30000
});

// 배송비 조회
const charge = await shippingChargeModel.findOne();

// 특정 지역 배송비 찾기
function getShippingCost(city) {
  const areaCharge = charge.area.find(a => a.name === city);
  return areaCharge ? areaCharge.price : charge.internationalCost;
}

const cost = getShippingCost("Seoul");  // 3000
```

## Order와의 연동

주문 시 배송비 계산:

```javascript
// 배송비 계산 및 주문 생성
const shippingCost = getShippingCost(shippingInfo.city);

const order = await orderModel.create({
  orderId: "ORD-001",
  totalPrice: 50000,
  deliveryInfo: {
    shippingCost: shippingCost
  },
  payAmount: 50000 + shippingCost
});
```

## 관련 API

- `GET /api/shipping` - 배송비 조회
- `GET /api/home/shipping` - 배송비 조회 (공개)
- `PUT /api/shipping` - 배송비 수정 (관리자)

## 주의사항

1. **단일 레코드**: 전체 사이트에 하나의 ShippingCharge 레코드만 존재
2. **기본값**: 해당 지역이 없으면 `internationalCost` 사용
3. **무료 배송**: 조건부 무료 배송은 별도 로직으로 구현 (예: 주문 금액 5만원 이상)
