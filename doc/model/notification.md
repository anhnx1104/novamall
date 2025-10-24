# Notification Schema

시스템 알림을 관리하는 스키마입니다.

## 위치
- **Model**: `/models/notification.js`
- **Schema Definition**: `/utils/modelData.mjs` - `export const notification`

## 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `message` | String | 알림 메시지 |
| `createdAt` | Date | 생성일 (기본값: Date.now, TTL: 604800초 = 7일) |

## 특징

- **자동 삭제**: `createdAt` 필드에 `expires: 604800` 옵션이 설정되어 있어, 생성 후 7일이 지나면 자동으로 삭제됩니다.
- **일시적 알림**: 단기간 유효한 시스템 알림에 사용

## 사용 예시

```javascript
import notificationModel from "~/models/notification";

// 알림 생성
const notification = await notificationModel.create({
  message: "새로운 주문이 접수되었습니다."
});

// 알림 목록 조회 (최신순)
const notifications = await notificationModel
  .find()
  .sort({ createdAt: -1 })
  .limit(10);

// 읽지 않은 알림 개수
const unreadCount = await notificationModel.countDocuments();
```

## 관련 API

- `GET /api/notification` - 알림 목록
- `POST /api/notification` - 알림 생성 (시스템)
- `DELETE /api/notification` - 알림 삭제

## TTL (Time To Live) 인덱스

MongoDB의 TTL 인덱스를 사용하여 7일이 지난 알림을 자동으로 삭제합니다.

```javascript
// MongoDB는 createdAt 필드의 expires 옵션으로 TTL 인덱스를 자동 생성
{
  createdAt: {
    type: Date,
    expires: 604800,  // 7일 (초 단위)
    default: Date.now
  }
}
```

## 알림 타입 확장

알림을 타입별로 분류하려면 `type` 필드를 추가할 수 있습니다.

```javascript
// 스키마 확장 예시
{
  message: String,
  type: String,  // 예: "order", "payment", "system"
  userId: ObjectId,  // 특정 사용자에게만 표시
  isRead: Boolean,
  createdAt: { type: Date, expires: 604800, default: Date.now }
}

// 타입별 조회
const orderNotifications = await notificationModel.find({ type: "order" });
```

## 실시간 알림

WebSocket 또는 Server-Sent Events를 사용하여 실시간 알림을 구현할 수 있습니다.

```javascript
// Socket.io 예시
io.on("connection", (socket) => {
  notificationModel.watch().on("change", (change) => {
    if (change.operationType === "insert") {
      socket.emit("notification", change.fullDocument);
    }
  });
});
```

## 주의사항

1. **자동 삭제**: 7일 후 자동 삭제되므로 중요한 알림은 별도 저장 필요
2. **TTL 인덱스**: MongoDB가 백그라운드에서 주기적으로 삭제 작업 실행
3. **읽음 표시**: 사용자가 알림을 읽었는지 추적하려면 `isRead` 필드 추가 필요
