# Notice Schema

공지사항을 관리하는 스키마입니다.

## 위치
- **Model**: `/models/notice.js`

## 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | String | ✅ | 공지사항 제목 |
| `content` | String | ✅ | 공지사항 내용 |
| `isImportant` | Boolean | - | 중요 공지 여부 (기본값: false) |
| `viewCount` | Number | - | 조회수 (기본값: 0) |
| `createdAt` | Date | - | 생성일 (자동) |
| `updatedAt` | Date | - | 수정일 (자동) |

## 특징

- `timestamps: true` 옵션으로 `createdAt`, `updatedAt` 자동 관리
- 중요 공지(`isImportant: true`)는 상단에 고정 표시 가능

## 사용 예시

```javascript
import Notice from "~/models/notice";

// 공지사항 생성
const notice = await Notice.create({
  title: "사이트 점검 안내",
  content: "2024년 1월 1일 02:00 ~ 06:00 사이에 서버 점검이 있을 예정입니다.",
  isImportant: true
});

// 공지사항 목록 조회
const notices = await Notice.find()
  .sort({ isImportant: -1, createdAt: -1 })
  .limit(10);

// 조회수 증가
await Notice.findByIdAndUpdate(noticeId, {
  $inc: { viewCount: 1 }
});

// 중요 공지 조회
const importantNotices = await Notice.find({ isImportant: true })
  .sort({ createdAt: -1 });
```

## 관련 API

- `GET /api/notice` - 공지사항 목록
- `GET /api/notice/[id]` - 공지사항 상세
- `POST /api/notice` - 공지사항 작성 (관리자)
- `PUT /api/notice/[id]` - 공지사항 수정 (관리자)
- `DELETE /api/notice/[id]` - 공지사항 삭제 (관리자)

## 페이지네이션

```javascript
const page = 1;
const limit = 10;

const notices = await Notice.find()
  .sort({ isImportant: -1, createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit);

const total = await Notice.countDocuments();
```

## 주의사항

1. **중요 공지**: `isImportant: true`인 공지는 목록 상단에 고정 표시
2. **HTML 내용**: `content` 필드에 HTML을 저장하는 경우 XSS 방지 필요
3. **조회수**: 중복 조회 방지를 위해 세션 또는 쿠키 활용 권장
