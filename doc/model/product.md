# Product Schema

상품 정보, 스페셜 상품, 리뷰, 질문을 관리하는 스키마입니다.

## 위치
- **Model**: `/models/product.js`
- **Schema Definition**: `/utils/modelData.mjs` - `export const product`

## 필드 설명

### 기본 정보
| 필드 | 타입 | 설명 |
|------|------|------|
| `name` | String | 상품명 |
| `slug` | String | URL 슬러그 |
| `productId` | String | 상품 고유 ID |
| `description` | String | 상세 설명 |
| `shortDescription` | String | 간단한 설명 |
| `type` | String | 상품 타입 |
| `date` | Date | 등록일 (기본값: Date.now) |

### 가격 및 재고
| 필드 | 타입 | 설명 |
|------|------|------|
| `price` | Number | 판매가 |
| `discount` | Number | 할인율 (%) |
| `quantity` | Number | 재고 수량 |
| `sku` | String | SKU (Stock Keeping Unit) |
| `currency` | String | 통화 단위 |
| `vat` | Number | 부가세 (기본값: 0) |
| `tax` | Number | 세금 (기본값: 0) |

### 단위
| 필드 | 타입 | 설명 |
|------|------|------|
| `unit` | String | 단위 (예: kg, piece) |
| `unitValue` | String | 단위 값 (예: 1, 500g) |

### 미디어
| 필드 | 타입 | 설명 |
|------|------|------|
| `image` | Array | 대표 이미지 |
| `gallery` | Array | 갤러리 이미지 |

### 카테고리 및 브랜드
| 필드 | 타입 | 설명 |
|------|------|------|
| `categories` | Array | 카테고리 목록 |
| `subcategories` | Array | 서브카테고리 목록 |
| `childCategories` | Array | 차일드 카테고리 목록 |
| `brand` | String | 브랜드명 |

### 상품 속성
| 필드 | 타입 | 설명 |
|------|------|------|
| `colors` | Array | 색상 옵션 |
| `attributes` | Array | 속성 (사이즈, 재질 등) |
| `variants` | Array | 변형 상품 |
| `attributeIndex` | String | 속성 인덱스 |
| `option` | Array | 추가 옵션 |
| `option[].optionId` | String | 옵션 ID |
| `option[].name` | String | 옵션명 |
| `option[].values` | Array | 옵션 값 목록 |

### 상품 상태
| 필드 | 타입 | 설명 |
|------|------|------|
| `trending` | Boolean | 트렌딩 상품 (기본값: false) |
| `new` | Boolean | 신상품 (기본값: false) |
| `bestSelling` | Boolean | 베스트셀러 (기본값: false) |

### SEO
| 필드 | 타입 | 설명 |
|------|------|------|
| `seo.title` | String | SEO 제목 |
| `seo.description` | String | SEO 설명 |
| `seo.image` | Array | SEO 이미지 |

### 스페셜 상품 시스템
| 필드 | 타입 | 설명 |
|------|------|------|
| `isSpecial` | Boolean | 스페셜 상품 여부 (기본값: false) |
| `group` | ObjectId | 스페셜 상품 그룹 (ref: "group") |
| `withdrawablePointRate` | Number | 출금 가능 포인트 비율 (%) |
| `shoppingPointRate` | Number | 쇼핑 포인트 비율 (%) |
| `rebateRate` | Number | 리베이트 비율 (%) |
| `pointLimitRate` | Number | 포인트 지급 비율 (%) |
| `pointLimit` | Number | 포인트 최대 지급량 |

### 상품 공지
| 필드 | 타입 | 설명 |
|------|------|------|
| `noticeInfo` | Array | 상품 공지사항 |
| `noticeInfo[].title` | String | 공지 제목 |
| `noticeInfo[].description` | String | 공지 내용 |

### 리뷰 (Embedded Schema)
| 필드 | 타입 | 설명 |
|------|------|------|
| `review` | Array | 리뷰 목록 |
| `review[].date` | Date | 작성일 (기본값: Date.now) |
| `review[].userName` | String | 작성자명 |
| `review[].email` | String | 작성자 이메일 |
| `review[].rating` | Number | 평점 (1-5) |
| `review[].comment` | String | 리뷰 내용 |
| `review[].media` | Array | 첨부 미디어 (이미지/비디오) |
| `review[].media[].url` | String | 미디어 URL |
| `review[].media[].type` | String | 미디어 타입 (image/video) |

### 질문 (Q&A)
| 필드 | 타입 | 설명 |
|------|------|------|
| `question` | Array | 질문 목록 |
| `question[].date` | Date | 작성일 (기본값: Date.now) |
| `question[].userName` | String | 작성자명 |
| `question[].email` | String | 작성자 이메일 |
| `question[].question` | String | 질문 내용 |
| `question[].answer` | String | 답변 내용 |

## 스페셜 상품 시스템

### 개요
스페셜 상품(`isSpecial: true`)은 일반 상품과 달리 그룹 가입이 필요하며, 구매 시 포인트와 리베이트를 제공합니다.

### 포인트 적립 계산

```javascript
// 출금 가능 포인트
const withdrawablePoint = (productPrice * withdrawablePointRate) / 100;

// 쇼핑 포인트
const shoppingPoint = (productPrice * shoppingPointRate) / 100;

// 최대 지급 포인트 제한
if (totalPoint > pointLimit) {
  // 포인트 지급 중단
}
```

### 리베이트 시스템
- 추천인에게 구매 금액의 일정 비율(`rebateRate`)을 리베이트로 지급
- 리베이트 로직은 `/lib/rebateFunctions.js`에 구현

## 리뷰 시스템

### 리뷰 작성
- 로그인한 사용자만 작성 가능
- 미디어 첨부 가능 (이미지/비디오)
- 평점: 1-5점

### 리뷰 통계
- 평균 평점 계산
- 평점별 개수 집계
- API: `GET /api/review/stats?product={productId}`

## 관련 API

### 상품 조회
- `GET /api/home/products` - 상품 목록 (필터링)
- `GET /api/product/[slug]` - 상품 상세
- `GET /api/home/product_search` - 상품 검색

### 상품 관리 (관리자)
- `POST /api/product/create` - 상품 생성
- `PUT /api/product/edit` - 상품 수정
- `DELETE /api/product/delete/[id]` - 상품 삭제

### 스페셜 상품
- `GET /api/product/special` - 스페셜 상품 목록
- `GET /api/product/special/group` - 그룹별 스페셜 상품

### 리뷰
- `GET /api/review/list?product={productId}` - 리뷰 목록
- `POST /api/review/new` - 리뷰 작성
- `GET /api/review/stats?product={productId}` - 리뷰 통계

### 질문
- `GET /api/question?product={productId}` - 질문 목록
- `POST /api/question` - 질문 작성

## 사용 예시

```javascript
import productModel from "~/models/product";

// 일반 상품 생성
const product = await productModel.create({
  name: "테스트 상품",
  slug: "test-product",
  price: 10000,
  quantity: 100,
  isSpecial: false
});

// 스페셜 상품 생성
const specialProduct = await productModel.create({
  name: "스페셜 상품",
  slug: "special-product",
  price: 50000,
  isSpecial: true,
  group: groupId,
  withdrawablePointRate: 10, // 10%
  shoppingPointRate: 5,      // 5%
  rebateRate: 3,             // 3%
  pointLimit: 100000         // 최대 10만 포인트
});

// 리뷰 추가
await productModel.findByIdAndUpdate(productId, {
  $push: {
    review: {
      userName: "홍길동",
      email: "user@example.com",
      rating: 5,
      comment: "좋은 상품입니다!",
      media: [
        { url: "/uploads/review.jpg", type: "image" }
      ]
    }
  }
});
```

## 주의사항

1. **재고 관리**: 주문 시 `quantity` 차감 필수
2. **포인트 한도**: `pointLimit` 초과 시 포인트 지급 중단
3. **리뷰 인증**: 구매한 사용자만 리뷰 작성 가능하도록 구현 권장
4. **스페셜 상품**: 그룹 가입 확인 필수
