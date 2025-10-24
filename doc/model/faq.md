# FAQ Schema

자주 묻는 질문(FAQ)을 관리하는 스키마입니다.

## 위치
- **Model**: `/models/faq.js`
- **Schema Definition**: `/utils/modelData.mjs` - `export const faq`

## 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `question` | String | 질문 |
| `answer` | String | 답변 |
| `createdAt` | Date | 생성일 (기본값: Date.now) |

## 사용 예시

```javascript
import faqModel from "~/models/faq";

// FAQ 생성
const faq = await faqModel.create({
  question: "배송은 얼마나 걸리나요?",
  answer: "주문 후 2-3일 내에 배송됩니다."
});

// FAQ 목록 조회
const faqs = await faqModel.find().sort({ createdAt: -1 });

// 검색
const searchResults = await faqModel.find({
  $or: [
    { question: { $regex: keyword, $options: "i" } },
    { answer: { $regex: keyword, $options: "i" } }
  ]
});
```

## 관련 API

- `GET /api/faq/list` - FAQ 목록 (공개)
- `GET /api/faq/detail?id={id}` - FAQ 상세
- `POST /api/faq` - FAQ 생성 (관리자)
- `PUT /api/faq` - FAQ 수정 (관리자)
- `DELETE /api/faq` - FAQ 삭제 (관리자)

## 카테고리별 FAQ

FAQ를 카테고리로 분류하려면 `category` 필드를 추가할 수 있습니다.

```javascript
// 스키마 확장 예시
{
  question: String,
  answer: String,
  category: String,  // 예: "배송", "결제", "반품"
  createdAt: Date
}

// 카테고리별 조회
const deliveryFAQs = await faqModel.find({ category: "배송" });
```

## 주의사항

1. **HTML 답변**: `answer` 필드에 HTML을 저장하는 경우 XSS 방지 필요
2. **정렬**: 일반적으로 최신순 또는 중요도순으로 정렬
3. **검색 기능**: FAQ 검색 시 질문과 답변 모두 검색 대상으로 포함
