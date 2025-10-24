# Event Schema

이벤트 정보를 관리하는 스키마입니다.

## 위치
- **Model**: `/models/event.js`

## 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | String | ✅ | 이벤트 제목 |
| `content` | String | ✅ | 이벤트 내용 |
| `startDate` | Date | ✅ | 이벤트 시작일 |
| `endDate` | Date | ✅ | 이벤트 종료일 |
| `isActive` | Boolean | - | 활성화 여부 (기본값: true) |
| `viewCount` | Number | - | 조회수 (기본값: 0) |
| `thumbnail` | String | - | 썸네일 이미지 URL (기본값: "") |
| `createdAt` | Date | - | 생성일 (자동) |
| `updatedAt` | Date | - | 수정일 (자동) |

## 특징

- `timestamps: true` 옵션으로 `createdAt`, `updatedAt` 자동 관리
- 날짜 범위(`startDate` ~ `endDate`)로 이벤트 기간 관리
- `isActive`로 이벤트 활성화/비활성화 제어

## 사용 예시

```javascript
import Event from "~/models/event";

// 이벤트 생성
const event = await Event.create({
  title: "신년 맞이 특가 세일",
  content: "모든 상품 최대 70% 할인!",
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-01-31"),
  isActive: true,
  thumbnail: "/uploads/events/newyear-sale.jpg"
});

// 진행 중인 이벤트 조회
const now = new Date();
const activeEvents = await Event.find({
  isActive: true,
  startDate: { $lte: now },
  endDate: { $gte: now }
}).sort({ startDate: -1 });

// 예정된 이벤트 조회
const upcomingEvents = await Event.find({
  isActive: true,
  startDate: { $gt: now }
}).sort({ startDate: 1 });

// 조회수 증가
await Event.findByIdAndUpdate(eventId, {
  $inc: { viewCount: 1 }
});
```

## 관련 API

- `GET /api/event` - 이벤트 목록
- `GET /api/event/[id]` - 이벤트 상세
- `POST /api/event` - 이벤트 생성 (관리자)
- `PUT /api/event/[id]` - 이벤트 수정 (관리자)
- `DELETE /api/event/[id]` - 이벤트 삭제 (관리자)

## 이벤트 상태 분류

```javascript
const now = new Date();

// 진행 중
const ongoing = await Event.find({
  isActive: true,
  startDate: { $lte: now },
  endDate: { $gte: now }
});

// 예정
const upcoming = await Event.find({
  isActive: true,
  startDate: { $gt: now }
});

// 종료
const ended = await Event.find({
  endDate: { $lt: now }
});
```

## 자동 비활성화

이벤트 종료 시 자동으로 `isActive`를 `false`로 변경하는 Cron Job을 설정할 수 있습니다.

```javascript
// 매일 자정에 실행
import cron from "node-cron";

cron.schedule("0 0 * * *", async () => {
  const now = new Date();

  await Event.updateMany(
    {
      isActive: true,
      endDate: { $lt: now }
    },
    {
      $set: { isActive: false }
    }
  );

  console.log("Expired events deactivated");
});
```

## 주의사항

1. **날짜 검증**: `startDate`는 `endDate`보다 앞서야 함
2. **썸네일**: 이벤트 목록에서 썸네일 이미지 표시
3. **HTML 내용**: `content` 필드에 HTML을 저장하는 경우 XSS 방지 필요
4. **조회수**: 중복 조회 방지를 위해 세션 또는 쿠키 활용 권장
