# GroupRanking Schema

그룹 참여 및 순위, 포인트 지급 상태를 관리하는 스키마입니다.

## 위치
- **Model**: `/models/groupRanking.js`
- **Schema Definition**: `/utils/modelData.mjs` - `export const groupRanking`

## 필드 설명

### 관계 필드 (References)
| 필드 | 타입 | 참조 | 설명 |
|------|------|------|------|
| `group` | ObjectId | Group | 그룹 |
| `user` | ObjectId | User | 사용자 |
| `order` | ObjectId | Order | 가입 주문 |
| `product` | ObjectId | Product | 구매한 스페셜 상품 |

### 상태 관리
| 필드 | 타입 | 설명 |
|------|------|------|
| `status` | String | 상태: "progress", "pending", "completed" (기본값: "pending") |
| `endAt` | Date | 지급 종료일 (포인트 지급 완료 시점) |

## Status 설명

### Pending (대기 중)
- 그룹 가입 결제 완료
- 아직 스페셜 상품을 구매하지 않은 상태

### Progress (진행 중)
- 스페셜 상품을 구매하여 포인트 적립 진행 중
- 포인트 지급이 계속 진행되는 상태

### Completed (완료)
- 포인트 지급이 완료되거나 종료됨
- `endAt` 날짜에 지급 종료

## 역할 및 용도

GroupRanking은 다음 두 가지 주요 역할을 합니다:

### 1. 그룹 가입 관리
사용자가 어떤 그룹에 가입했는지 추적합니다.

```javascript
// 사용자의 그룹 가입 여부 확인
const hasJoined = await groupRankingModel.findOne({
  group: groupId,
  user: userId,
  status: { $in: ["pending", "progress"] }
});
```

### 2. 스페셜 상품 구매 추적
사용자가 구매한 스페셜 상품과 포인트 지급 상태를 관리합니다.

```javascript
// 사용자의 스페셜 상품 구매 내역
const purchases = await groupRankingModel.find({
  user: userId,
  product: { $exists: true },
  status: "progress"
});
```

## 사용 예시

### 그룹 가입 시 생성
```javascript
import groupRankingModel from "~/models/groupRanking";

// 1. 그룹 가입비 결제 완료 후 생성
const ranking = await groupRankingModel.create({
  group: groupId,
  user: userId,
  order: joinOrderId,  // 가입비 주문 ID
  status: "pending"
});
```

### 스페셜 상품 구매 시 업데이트
```javascript
// 2. 스페셜 상품 구매 시 새로운 레코드 생성
await groupRankingModel.create({
  group: groupId,
  user: userId,
  order: purchaseOrderId,  // 스페셜 상품 주문 ID
  product: productId,
  status: "progress"  // 포인트 지급 시작
});
```

### 포인트 지급 완료 처리
```javascript
// 3. 포인트 최대치 도달 또는 기타 이유로 지급 종료
await groupRankingModel.findByIdAndUpdate(rankingId, {
  status: "completed",
  endAt: new Date()
});
```

## 포인트 지급 로직과의 연동

GroupRanking은 `PointHistory`와 함께 포인트 지급을 관리합니다.

```javascript
// 스페셜 상품 구매 시 포인트 적립 프로세스
async function purchaseSpecialProduct(userId, productId, orderId) {
  const product = await productModel.findById(productId);

  // 1. 그룹 가입 확인
  const membership = await groupRankingModel.findOne({
    group: product.group,
    user: userId,
    status: { $in: ["pending", "progress"] }
  });

  if (!membership) {
    throw new Error("그룹에 가입되지 않았습니다.");
  }

  // 2. GroupRanking 레코드 생성 (스페셜 상품 구매 추적)
  const ranking = await groupRankingModel.create({
    group: product.group,
    user: userId,
    order: orderId,
    product: productId,
    status: "progress"
  });

  // 3. 포인트 최대치 확인
  const totalPoints = await pointHistoryModel.aggregate([
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

  if (totalPoints[0]?.total >= product.pointLimit) {
    // 최대치 도달 - 지급 중단
    await groupRankingModel.findByIdAndUpdate(ranking._id, {
      status: "completed",
      endAt: new Date()
    });
    return;
  }

  // 4. PointHistory 생성 (포인트 적립 기록)
  await pointHistoryModel.create({
    pointType: "withdrawable",
    point: calculatePoint(product),
    pointUsage: "earned",
    user: userId,
    order: orderId,
    product: productId,
    groupRanking: ranking._id,
    status: "progress"  // 배송 완료 후 completion으로 변경
  });
}
```

## 관련 API

### 그룹 가입 내역
- `GET /api/group/user?userId={userId}` - 사용자의 그룹 가입 내역
- `GET /api/profile/myspecial` - 내 스페셜 상품 구매 내역

### 관리자
- `GET /api/users/product/special?userId={userId}` - 사용자의 스페셜 상품 구매 내역

## 랭킹 시스템 (선택사항)

GroupRanking이라는 이름에서 알 수 있듯이, 향후 그룹 내 사용자 랭킹 시스템을 구현할 수 있습니다.

### 구매액 기준 랭킹
```javascript
const ranking = await groupRankingModel.aggregate([
  {
    $match: {
      group: groupId,
      status: { $in: ["progress", "completed"] }
    }
  },
  {
    $lookup: {
      from: "orders",
      localField: "order",
      foreignField: "_id",
      as: "orderInfo"
    }
  },
  {
    $unwind: "$orderInfo"
  },
  {
    $group: {
      _id: "$user",
      totalPurchase: { $sum: "$orderInfo.payAmount" },
      productCount: { $sum: 1 }
    }
  },
  {
    $sort: { totalPurchase: -1 }
  },
  {
    $limit: 10  // Top 10
  }
]);
```

### 포인트 적립액 기준 랭킹
```javascript
const topEarners = await pointHistoryModel.aggregate([
  {
    $match: {
      groupRanking: { $exists: true },
      pointUsage: "earned",
      status: "completion"
    }
  },
  {
    $lookup: {
      from: "grouprankings",
      localField: "groupRanking",
      foreignField: "_id",
      as: "rankingInfo"
    }
  },
  {
    $unwind: "$rankingInfo"
  },
  {
    $match: {
      "rankingInfo.group": groupId
    }
  },
  {
    $group: {
      _id: "$user",
      totalPoints: { $sum: "$point" }
    }
  },
  {
    $sort: { totalPoints: -1 }
  },
  {
    $limit: 10
  }
]);
```

## 통계

### 그룹별 활성 회원 수
```javascript
const activeMembers = await groupRankingModel.aggregate([
  {
    $match: {
      status: { $in: ["pending", "progress"] }
    }
  },
  {
    $group: {
      _id: "$group",
      count: { $sum: 1 }
    }
  }
]);
```

### 스페셜 상품별 구매자 수
```javascript
const productStats = await groupRankingModel.aggregate([
  {
    $match: {
      product: { $exists: true }
    }
  },
  {
    $group: {
      _id: "$product",
      totalPurchases: { $sum: 1 },
      activeCount: {
        $sum: {
          $cond: [{ $eq: ["$status", "progress"] }, 1, 0]
        }
      }
    }
  }
]);
```

## 주의사항

1. **중복 가입 방지**:
   - 동일 사용자가 같은 그룹에 중복 가입하지 않도록 체크
   ```javascript
   const exists = await groupRankingModel.findOne({
     group: groupId,
     user: userId,
     status: { $in: ["pending", "progress"] }
   });

   if (exists) {
     throw new Error("이미 가입된 그룹입니다.");
   }
   ```

2. **포인트 지급 종료**:
   - `status: "completed"`이면 더 이상 포인트 지급 안 함
   - 포인트 적립 전에 반드시 status 확인

3. **Order와의 관계**:
   - `order` 필드는 가입비 주문 또는 스페셜 상품 주문을 참조
   - 하나의 주문이 여러 GroupRanking 레코드를 가질 수 있음

4. **Product 필드 존재 여부**:
   - `product` 필드가 없으면: 그룹 가입만 한 상태
   - `product` 필드가 있으면: 스페셜 상품 구매한 상태
