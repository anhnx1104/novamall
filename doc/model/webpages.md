# Webpages Schema

홈페이지, About, FAQ 등 웹페이지 컨텐츠를 관리하는 스키마입니다.

## 위치
- **Model**: `/models/webpages.js`
- **Schema Definition**: `/utils/modelData.mjs` - `export const webpage`

## 필드 설명

### 홈페이지 (homePage)

#### Carousel
| 필드 | 타입 | 설명 |
|------|------|------|
| `homePage.carousel.background` | Array | 캐러셀 배경 이미지 |
| `homePage.carousel.carouselData` | Array | 캐러셀 슬라이드 데이터 |

#### Banner
| 필드 | 타입 | 설명 |
|------|------|------|
| `homePage.banner.title` | String | 배너 제목 |
| `homePage.banner.subTitle` | String | 배너 부제목 |
| `homePage.banner.description` | String | 배너 설명 |
| `homePage.banner.url` | String | 배너 링크 URL |
| `homePage.banner.image` | Array | 배너 이미지 |

#### Collection
| 필드 | 타입 | 설명 |
|------|------|------|
| `homePage.collection.scopeA` | Object | 컬렉션 A |
| `homePage.collection.scopeA.title` | String | 제목 |
| `homePage.collection.scopeA.url` | String | 링크 URL |
| `homePage.collection.scopeA.image` | Array | 이미지 |
| `homePage.collection.scopeB` | Object | 컬렉션 B (구조 동일) |
| `homePage.collection.scopeC` | Object | 컬렉션 C (구조 동일) |
| `homePage.collection.scopeD` | Object | 컬렉션 D (구조 동일) |

### 기타 페이지

| 필드 | 타입 | 설명 |
|------|------|------|
| `aboutPage.content` | String | About 페이지 내용 (HTML) |
| `privacyPage.content` | String | 개인정보 처리방침 내용 (HTML) |
| `termsPage.content` | String | 이용약관 내용 (HTML) |
| `returnPolicyPage.content` | String | 반품 정책 내용 (HTML) |
| `faqPage.content` | String | FAQ 페이지 내용 (HTML) |

## 사용 예시

### 홈페이지 설정
```javascript
import webpagesModel from "~/models/webpages";

const webpages = await webpagesModel.findOneAndUpdate(
  {},
  {
    homePage: {
      carousel: {
        background: ["/images/carousel-bg.jpg"],
        carouselData: [
          {
            title: "Summer Sale",
            subtitle: "Up to 50% OFF",
            image: "/images/slide1.jpg",
            url: "/products/sale"
          },
          {
            title: "New Arrivals",
            subtitle: "Check out our latest products",
            image: "/images/slide2.jpg",
            url: "/products/new"
          }
        ]
      },
      banner: {
        title: "Free Shipping",
        subTitle: "On orders over $50",
        description: "Limited time offer",
        url: "/products",
        image: ["/images/banner.jpg"]
      },
      collection: {
        scopeA: {
          title: "Men's Fashion",
          url: "/category/mens",
          image: ["/images/collection-men.jpg"]
        },
        scopeB: {
          title: "Women's Fashion",
          url: "/category/womens",
          image: ["/images/collection-women.jpg"]
        },
        scopeC: {
          title: "Electronics",
          url: "/category/electronics",
          image: ["/images/collection-electronics.jpg"]
        },
        scopeD: {
          title: "Home & Living",
          url: "/category/home",
          image: ["/images/collection-home.jpg"]
        }
      }
    }
  },
  { upsert: true, new: true }
);
```

### About 페이지 수정
```javascript
await webpagesModel.findOneAndUpdate(
  {},
  {
    "aboutPage.content": `
      <h1>About Us</h1>
      <p>We are a leading e-commerce platform...</p>
    `
  }
);
```

### 개인정보 처리방침 수정
```javascript
await webpagesModel.findOneAndUpdate(
  {},
  {
    "privacyPage.content": `
      <h1>Privacy Policy</h1>
      <p>Your privacy is important to us...</p>
    `
  }
);
```

## 관련 API

- `GET /api/page/home` - 홈페이지 데이터 조회
- `GET /api/home/pages` - 모든 페이지 컨텐츠 조회 (공개)
- `PUT /api/page` - 페이지 수정 (관리자)

## Carousel Data 구조

```javascript
carouselData: [
  {
    title: "메인 제목",
    subtitle: "부제목",
    description: "설명 (선택사항)",
    image: "/images/slide.jpg",
    url: "/link",
    buttonText: "자세히 보기" // 선택사항
  }
]
```

## Collection Scope

홈페이지에 4개의 컬렉션 영역(scopeA, B, C, D)을 표시할 수 있습니다. 각 영역은 카테고리나 프로모션을 홍보하는 데 사용됩니다.

```
┌─────────────┬─────────────┐
│   Scope A   │   Scope B   │
├─────────────┼─────────────┤
│   Scope C   │   Scope D   │
└─────────────┴─────────────┘
```

## HTML 컨텐츠 편집

`content` 필드는 HTML을 저장합니다. 관리자 페이지에서 Rich Text Editor (예: Quill, SunEditor)를 사용하여 편집할 수 있습니다.

```javascript
// SunEditor 사용 예시
import SunEditor from "suneditor-react";

<SunEditor
  setContents={content}
  onChange={(content) => setContent(content)}
/>
```

## 주의사항

1. **단일 레코드**: Webpages는 전체 사이트에 하나의 레코드만 존재
2. **HTML 보안**: `content` 필드는 XSS 공격 위험이 있으므로:
   - 관리자만 수정 가능하도록 권한 제한
   - 출력 시 `dangerouslySetInnerHTML` 대신 sanitize 라이브러리 사용 권장
3. **이미지 경로**: 이미지는 `/public/uploads/` 또는 S3에 저장
4. **캐싱**: 자주 조회되므로 Redis 등으로 캐싱 권장
