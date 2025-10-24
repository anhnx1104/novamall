# PointHistory Schema

포인트 적립 및 사용 내역을 추적하는 스키마입니다.

## 위치
- **Model**: `/models/pointHistory.js`
- **Schema Definition**: `/utils/modelData.mjs` - `export const pointHistory`

## 필드 설명

### 기본 정보
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `pointType` | String | ✅ | 포인트 타입: "shopping", "withdrawable" |
| `point` | Number | ✅ | 포인트 양 (양수: 적립, 음수: 차감) |
| `pointUsage` | String | ✅ | 포인트 사용 용도 |
| `status` | String | ✅ | 상태: "progress", "completion" (기본값: "progress") |
| `createAt` | Date | - | 생성일 (기본값: Date.now) |

### 관계 필드 (References)
| 필드 | 타입 | 참조 | 설명 |
|------|------|------|------|
| `user` | ObjectId | User | 사용자 |
| `order` | ObjectId | Order | 주문 ID (해당되는 경우) |
| `product` | ObjectId | Product | 상품 ID (해당되는 경우) |
| `groupRanking` | ObjectId | GroupRanking | 그룹 랭킹 ID (해당되는 경우) |

## Point Type

### 1. Shopping Point (쇼핑 포인트)
- 쇼핑몰 내에서만 사용 가능한 포인트
- 상품 구매 시 결제 수단으로 사용
- 현금 출금 불가

### 2. Withdrawable Point (출금 가능 포인트)
- 현금으로 출금 가능한 포인트
- 스페셜 상품 구매 시 적립
- 별도의 출금 신청 프로세스 필요

## Point Usage

### 적립 (Earned)
- `pointUsage: "earned"` - 포인트 적립
- 스페셜 상품 구매 시 자동 적립
- 관리자가 수동으로 지급

### 사용 (Purchase)
- `pointUsage: "purchase"` - 상품 구매에 사용
- Shopping Point만 사용 가능
- 결제 시 할인 적용

### 출금 (Withdrawal)
- `pointUsage: "withdrawal"` - 포인트 출금
- Withdrawable Point만 출금 가능
- 출금 신청 후 처리

### 바우처 교환 (Voucher)
- `pointUsage: "voucher"` - 바우처로 교환
- 쿠폰이나 기프트 카드로 교환

### 전송 (Send)
- `pointUsage: "send"` - 다른 사용자에게 전송
- 리베이트 지급 시 사용

## Status

### Progress (진행 중)
- 포인트 적립이 확정되지 않은 상태
- 예: 주문 완료 대기 중, 배송 완료 대기 중

### Completion (완료)
- 포인트 적립/사용이 확정된 상태
- 실제로 사용자의 포인트 잔액에 반영됨

## 사용 예시

### 포인트 적립 (스페셜 상품 구매)
```javascript
import pointHistoryModel from "~/models/pointHistory";
import userModel from "~/models/user";

// 1. PointHistory 생성
const history = await pointHistoryModel.create({
  pointType: "withdrawable",
  point: 5000,
  pointUsage: "earned",
  user: userId,
  order: orderId,
  product: productId,
  status: "progress",  // 배송 완료 전까지 progress
  createAt: new Date()
});

// 2. 배송 완료 후 상태 업데이트
await pointHistoryModel.findByIdAndUpdate(historyId, {
  status: "completion"
});

// 3. User의 포인트 잔액 업데이트
await userModel.findByIdAndUpdate(userId, {
  $inc: {
    withdrawablePoint: 5000,
    totalWithdrawablePoint: 5000
  }
});
```

### 포인트 사용 (상품 구매)
```javascript
// 1. PointHistory 생성
await pointHistoryModel.create({
  pointType: "shopping",
  point: -3000,  // 음수로 차감 표시
  pointUsage: "purchase",
  user: userId,
  order: orderId,
  status: "completion",
  createAt: new Date()
});

// 2. User의 포인트 잔액 차감
await userModel.findByIdAndUpdate(userId, {
  $inc: {
    shoppingPoint: -3000
  }
});
```

### 포인트 출금
```javascript
// 1. PointHistory 생성
await pointHistoryModel.create({
  pointType: "withdrawable",
  point: -10000,
  pointUsage: "withdrawal",
  user: userId,
  status: "progress",  // 출금 처리 중
  createAt: new Date()
});

// 2. User의 포인트 잔액 차감
await userModel.findByIdAndUpdate(userId, {
  $inc: {
    withdrawablePoint: -10000
  }
});

// 3. 출금 완료 후 상태 업데이트
await pointHistoryModel.findByIdAndUpdate(historyId, {
  status: "completion"
});
```

### 리베이트 지급
```javascript
// 추천인에게 리베이트 지급
await pointHistoryModel.create({
  pointType: "withdrawable",
  point: 1500,  // 구매 금액의 3% 리베이트
  pointUsage: "send",
  user: referrerId,  // 추천인 ID
  order: orderId,
  product: productId,
  groupRanking: groupRankingId,
  status: "completion",
  createAt: new Date()
});
```

## 관련 API

### 포인트 내역 조회
- `GET /api/profile/mypoints/history` - 내 포인트 내역
- `GET /api/users/point/history?userId={userId}` - 특정 사용자 포인트 내역 (관리자)

### 포인트 조회
- `GET /api/profile/mypoints` - 내 포인트 잔액
- `GET /api/users/point?userId={userId}` - 특정 사용자 포인트 (관리자)

### 포인트 관리 (관리자)
- `POST /api/users/point` - 포인트 수동 지급
- `GET /api/users/point/shoppingPoint` - Shopping Point 통계
- `GET /api/users/point/withdrawablePoint` - Withdrawable Point 통계

## 포인트 적립 자동화

스페셜 상품 주문의 경우, 배송 완료(`Order.orderStatus: "delivered"`) 시 자동으로 포인트가 적립됩니다.

관련 로직:
- `/lib/levelUpFunctions.js` - 레벨업 및 포인트 적립
- `/lib/rebateFunctions.js` - 리베이트 지급

## 포인트 한도 체크

스페셜 상품의 `pointLimit`을 초과하면 포인트 적립이 중단됩니다.

```javascript
// 이미 적립된 포인트 합계
const totalEarned = await pointHistoryModel.aggregate([
  {
    $match: {
      product: productId,
      pointUsage: "earned",
      status: "completion"
    }
  },
  {
    $group: {
      _id: null,
      total: { $sum: "$point" }
    }
  }
]);

if (totalEarned[0].total >= product.pointLimit) {
  // 포인트 지급 중단
}
```

## 통계 및 리포트

### 사용자별 포인트 통계
```javascript
const stats = await pointHistoryModel.aggregate([
  { $match: { user: userId, status: "completion" } },
  {
    $group: {
      _id: "$pointType",
      totalEarned: {
        $sum: {
          $cond: [{ $gt: ["$point", 0] }, "$point", 0]
        }
      },
      totalUsed: {
        $sum: {
          $cond: [{ $lt: ["$point", 0] }, { $abs: "$point" }, 0]
        }
      }
    }
  }
]);
```

### 기간별 포인트 사용 내역
```javascript
const monthlyUsage = await pointHistoryModel.aggregate([
  {
    $match: {
      createAt: {
        $gte: new Date("2024-01-01"),
        $lte: new Date("2024-12-31")
      },
      status: "completion"
    }
  },
  {
    $group: {
      _id: {
        year: { $year: "$createAt" },
        month: { $month: "$createAt" },
        pointType: "$pointType"
      },
      total: { $sum: "$point" }
    }
  }
]);
```

## 주의사항

1. **트랜잭션 처리**:
   - PointHistory 생성과 User 포인트 업데이트는 트랜잭션으로 처리 권장
   - 데이터 불일치 방지

2. **음수 포인트**:
   - 사용/차감 시에는 음수(`-`)로 기록
   - 적립 시에는 양수(`+`)로 기록

3. **Status 관리**:
   - 주문 취소 시 `progress` 상태의 내역을 삭제하거나 취소 처리
   - `completion` 상태는 확정된 것이므로 변경 불가

4. **포인트 잔액 검증**:
   - 포인트 사용 전 잔액 확인 필수
   - User의 포인트와 PointHistory 합계가 일치하는지 주기적으로 검증
