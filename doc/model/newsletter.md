# Newsletter Schema

뉴스레터 구독자를 관리하는 스키마입니다.

## 위치
- **Model**: `/models/newsletter.js`
- **Schema Definition**: `/utils/modelData.mjs` - `export const newsletter`

## 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `subscribers` | Array | 구독자 목록 |
| `subscribers[].email` | String | 이메일 |
| `subscribers[].username` | String | 사용자명 |
| `subscribers[].phone` | String | 전화번호 |
| `subscribers[].message` | String | 메시지 |
| `subscribers[].date` | Date | 구독일 (기본값: Date.now) |

## 특징

Newsletter 스키마는 단일 레코드에 모든 구독자를 배열로 저장합니다.

## 사용 예시

```javascript
import newsletterModel from "~/models/newsletter";

// 구독자 추가
await newsletterModel.findOneAndUpdate(
  {},
  {
    $push: {
      subscribers: {
        email: "user@example.com",
        username: "홍길동",
        phone: "01012345678",
        message: "최신 소식을 받고 싶습니다.",
        date: new Date()
      }
    }
  },
  { upsert: true }
);

// 구독자 목록 조회
const newsletter = await newsletterModel.findOne();
const subscribers = newsletter?.subscribers || [];

// 이메일 중복 체크
const exists = subscribers.some(s => s.email === "user@example.com");

// 특정 구독자 제거 (구독 취소)
await newsletterModel.findOneAndUpdate(
  {},
  {
    $pull: {
      subscribers: { email: "user@example.com" }
    }
  }
);
```

## 관련 API

- `POST /api/subscribers/new` - 구독 신청
- `GET /api/subscribers` - 구독자 목록 (관리자)
- `DELETE /api/subscribers` - 구독 취소

## 뉴스레터 발송

구독자 목록을 기반으로 이메일을 발송할 수 있습니다.

```javascript
import { sendEmail } from "~/lib/sendEmail";

const newsletter = await newsletterModel.findOne();
const subscribers = newsletter.subscribers;

for (const subscriber of subscribers) {
  await sendEmail({
    to: subscriber.email,
    subject: "신상품 출시 안내",
    html: `<p>안녕하세요, ${subscriber.username}님!</p>`
  });
}
```

## 주의사항

1. **이메일 검증**: 유효한 이메일 형식인지 검증 필수
2. **중복 방지**: 같은 이메일로 중복 구독 방지
3. **개인정보**: 구독자 정보는 민감한 개인정보이므로 보안에 주의
4. **구독 취소**: 뉴스레터 이메일에 구독 취소 링크 포함 필수
