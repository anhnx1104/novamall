# Group Schema

스페셜 상품 그룹을 관리하는 스키마입니다.

## 위치
- **Model**: `/models/group.js`
- **Schema Definition**: `/utils/modelData.mjs` - `export const group`

## 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `name` | String | 그룹명 |
| `price` | Number | 그룹 가입비 |
| `user_limit` | Number | 최대 가입 가능 인원 (0: 무제한) |

## 개요

Group은 스페셜 상품을 그룹화하여 관리하는 단위입니다. 사용자는 그룹에 가입해야 해당 그룹의 스페셜 상품을 구매할 수 있습니다.

## 그룹 시스템 동작 방식

### 1. 그룹 생성
- 관리자가 그룹을 생성하고 가입비와 인원 제한을 설정

### 2. 그룹 가입
- 사용자가 그룹 가입비를 결제
- `GroupRanking` 스키마에 가입 정보 기록
- 인원 제한 확인

### 3. 스페셜 상품 연결
- 스페셜 상품(`Product.isSpecial: true`)을 특정 그룹에 연결
- `Product.group` 필드에 Group ID 저장

### 4. 구매 권한 확인
- 스페셜 상품 구매 시 사용자의 그룹 가입 여부 확인
- 미가입 시 구매 불가

## 데이터 예시

```javascript
{
  name: "프리미엄 멤버십",
  price: 100000,      // 가입비: 10만원
  user_limit: 500     // 최대 500명
}

{
  name: "VIP 멤버십",
  price: 500000,      // 가입비: 50만원
  user_limit: 100     // 최대 100명
}

{
  name: "무료 체험",
  price: 0,           // 무료
  user_limit: 0       // 무제한
}
```

## 관련 API

### 그룹 조회
- `GET /api/group` - 그룹 목록
- `GET /api/group/product` - 그룹별 스페셜 상품 목록

### 그룹 관리 (관리자)
- `POST /api/group/create` - 그룹 생성
- `PUT /api/group/edit` - 그룹 수정
- `DELETE /api/group/delete` - 그룹 삭제

### 그룹 가입
- `POST /api/group/user` - 그룹 가입 신청
- `GET /api/group/user?userId={userId}` - 사용자의 그룹 가입 내역

### 그룹별 상품
- `GET /api/group/product/list?groupId={groupId}` - 특정 그룹의 상품 목록

## 사용 예시

### 그룹 생성
```javascript
import groupModel from "~/models/group";

const group = await groupModel.create({
  name: "프리미엄 멤버십",
  price: 100000,
  user_limit: 500
});
```

### 그룹별 스페셜 상품 조회
```javascript
import productModel from "~/models/product";

const products = await productModel.find({
  isSpecial: true,
  group: groupId
});
```

### 그룹 가입 인원 확인
```javascript
import groupRankingModel from "~/models/groupRanking";

const memberCount = await groupRankingModel.countDocuments({
  group: groupId,
  status: { $in: ["pending", "progress", "completed"] }
});

const group = await groupModel.findById(groupId);

if (group.user_limit > 0 && memberCount >= group.user_limit) {
  // 인원 초과
  throw new Error("그룹 가입 인원이 초과되었습니다.");
}
```

### 사용자의 그룹 가입 여부 확인
```javascript
const hasJoined = await groupRankingModel.findOne({
  group: groupId,
  user: userId,
  status: { $in: ["pending", "progress", "completed"] }
});

if (!hasJoined) {
  // 그룹 미가입
  throw new Error("이 상품을 구매하려면 그룹에 가입해야 합니다.");
}
```

## 그룹 가입 프로세스

### 1. 그룹 선택 및 결제
```javascript
// 그룹 가입 주문 생성
const order = await orderModel.create({
  orderId: generateOrderId(),
  products: [{
    name: `${group.name} 가입비`,
    price: group.price,
    quantity: 1
  }],
  user: [userId],
  totalPrice: group.price,
  payAmount: group.price,
  orderStatus: "pending",
  paymentStatus: "pending"
});
```

### 2. 결제 완료 후 GroupRanking 생성
```javascript
await groupRankingModel.create({
  group: groupId,
  user: userId,
  order: orderId,
  status: "progress"
});
```

### 3. 그룹 혜택 활성화
- 스페셜 상품 구매 가능
- 포인트 적립 및 리베이트 수령

## 그룹별 통계

### 가입자 수
```javascript
const stats = await groupRankingModel.aggregate([
  {
    $group: {
      _id: "$group",
      totalMembers: { $sum: 1 },
      activeMembers: {
        $sum: {
          $cond: [{ $eq: ["$status", "progress"] }, 1, 0]
        }
      }
    }
  }
]);
```

### 그룹별 매출
```javascript
const revenue = await orderModel.aggregate([
  {
    $lookup: {
      from: "grouprankings",
      localField: "_id",
      foreignField: "order",
      as: "groupInfo"
    }
  },
  {
    $unwind: "$groupInfo"
  },
  {
    $group: {
      _id: "$groupInfo.group",
      totalRevenue: { $sum: "$payAmount" },
      orderCount: { $sum: 1 }
    }
  }
]);
```

## User Limit 관리

### 무제한 (user_limit: 0)
- 제한 없이 누구나 가입 가능
- 무료 체험 그룹 등에 사용

### 제한 있음 (user_limit > 0)
- 선착순 가입 마감
- 프리미엄 그룹 등에 사용

```javascript
// 가입 가능 여부 확인
async function canJoinGroup(groupId) {
  const group = await groupModel.findById(groupId);

  if (group.user_limit === 0) {
    return true; // 무제한
  }

  const currentMembers = await groupRankingModel.countDocuments({
    group: groupId,
    status: { $in: ["pending", "progress", "completed"] }
  });

  return currentMembers < group.user_limit;
}
```

## 그룹 종료 처리

그룹을 종료하려면:
1. 새로운 가입 중단
2. 기존 회원의 `GroupRanking.status`를 "completed"로 변경
3. 그룹 삭제 (선택사항)

```javascript
// 그룹의 모든 회원 종료 처리
await groupRankingModel.updateMany(
  { group: groupId, status: "progress" },
  { $set: { status: "completed", endAt: new Date() } }
);
```

## 주의사항

1. **인원 제한 확인**:
   - 그룹 가입 시 실시간으로 인원 확인 필수
   - Race Condition 방지를 위해 트랜잭션 사용 권장

2. **가입비 환불**:
   - 가입비 환불 정책 수립 필요
   - 환불 시 `GroupRanking` 상태 업데이트

3. **그룹 삭제**:
   - 활성 회원이 있는 그룹은 삭제 불가
   - 연관된 스페셜 상품 처리 필요

4. **가입 중복 방지**:
   - 동일 사용자가 같은 그룹에 중복 가입 방지
   - `GroupRanking`에서 `{group, user}` 조합으로 체크
