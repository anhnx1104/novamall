# Category Schema

카테고리, 서브카테고리, 차일드 카테고리를 관리하는 계층적 스키마입니다.

## 위치
- **Model**: `/models/category.js`
- **Schema Definition**: `/utils/modelData.mjs` - `export const category`

## 필드 설명

### 기본 정보
| 필드 | 타입 | 설명 |
|------|------|------|
| `categoryId` | String | 카테고리 고유 ID |
| `name` | String | 카테고리명 |
| `slug` | String | URL 슬러그 |
| `icon` | Array | 아이콘 이미지 |
| `topCategory` | Boolean | 상위 노출 카테고리 (기본값: false) |

### 서브카테고리 (subCategories)
| 필드 | 타입 | 설명 |
|------|------|------|
| `subCategories` | Array | 서브카테고리 목록 |
| `subCategories[].id` | String | 서브카테고리 ID |
| `subCategories[].name` | String | 서브카테고리명 |
| `subCategories[].slug` | String | URL 슬러그 |
| `subCategories[].child` | Array | 차일드 카테고리 목록 |

### 차일드 카테고리 (child)
| 필드 | 타입 | 설명 |
|------|------|------|
| `subCategories[].child` | Array | 3단계 카테고리 |
| `subCategories[].child[].name` | String | 차일드 카테고리명 |
| `subCategories[].child[].slug` | String | URL 슬러그 |

## 카테고리 계층 구조

```
Category (1단계)
├── SubCategory (2단계)
│   ├── Child Category (3단계)
│   ├── Child Category (3단계)
│   └── Child Category (3단계)
└── SubCategory (2단계)
    ├── Child Category (3단계)
    └── Child Category (3단계)
```

## 데이터 예시

```javascript
{
  categoryId: "CAT001",
  name: "전자제품",
  slug: "electronics",
  icon: ["/icons/electronics.svg"],
  topCategory: true,
  subCategories: [
    {
      id: "SUB001",
      name: "컴퓨터",
      slug: "computers",
      child: [
        { name: "노트북", slug: "laptops" },
        { name: "데스크탑", slug: "desktops" },
        { name: "태블릿", slug: "tablets" }
      ]
    },
    {
      id: "SUB002",
      name: "모바일",
      slug: "mobile",
      child: [
        { name: "스마트폰", slug: "smartphones" },
        { name: "액세서리", slug: "accessories" }
      ]
    }
  ]
}
```

## 관련 API

### 카테고리 조회
- `GET /api/home/categories` - 전체 카테고리 (공개)
- `GET /api/categories` - 카테고리 목록 (관리자)
- `GET /api/categories/form` - 카테고리별 폼 필드

### 계층 조회
- `GET /api/categories/subcategories?category={categoryId}` - 서브카테고리 목록
- `GET /api/categories/childcategories?subcategory={subId}` - 차일드 카테고리 목록

### 카테고리 관리 (관리자)
- `POST /api/categories` - 카테고리 생성
- `PUT /api/categories/edit` - 카테고리 수정
- `DELETE /api/categories` - 카테고리 삭제

## 사용 예시

### 카테고리 생성
```javascript
import categoryModel from "~/models/category";

const category = await categoryModel.create({
  categoryId: "CAT001",
  name: "전자제품",
  slug: "electronics",
  icon: ["/icons/electronics.svg"],
  topCategory: true,
  subCategories: []
});
```

### 서브카테고리 추가
```javascript
await categoryModel.findByIdAndUpdate(categoryId, {
  $push: {
    subCategories: {
      id: "SUB001",
      name: "컴퓨터",
      slug: "computers",
      child: []
    }
  }
});
```

### 차일드 카테고리 추가
```javascript
await categoryModel.findOneAndUpdate(
  {
    _id: categoryId,
    "subCategories.id": "SUB001"
  },
  {
    $push: {
      "subCategories.$.child": {
        name: "노트북",
        slug: "laptops"
      }
    }
  }
);
```

### 카테고리별 상품 조회
```javascript
// 1단계 카테고리로 조회
const products = await productModel.find({
  categories: { $in: ["전자제품"] }
});

// 2단계 서브카테고리로 조회
const products = await productModel.find({
  subcategories: { $in: ["컴퓨터"] }
});

// 3단계 차일드 카테고리로 조회
const products = await productModel.find({
  childCategories: { $in: ["노트북"] }
});
```

## Top Category

`topCategory: true`인 카테고리는 홈페이지 상단 또는 메인 메뉴에 노출됩니다.

```javascript
// Top 카테고리 조회
const topCategories = await categoryModel.find({ topCategory: true });
```

## Form 필드와의 연동

카테고리별로 동적 폼 필드를 설정할 수 있습니다. `Form` 스키마를 참조하세요.

```javascript
// 카테고리별 폼 필드 조회
const formFields = await formModel.find({ categoryId: categoryId });
```

예: "의류" 카테고리에는 사이즈, 재질 필드를 표시

## Slug 규칙

- **URL 친화적**: 영문 소문자, 숫자, 하이픈(`-`)만 사용
- **고유성**: 각 레벨에서 slug는 고유해야 함
- **예시**:
  - Category: `electronics`
  - SubCategory: `computers`
  - Child: `laptops`
  - 최종 URL: `/category/electronics/computers/laptops`

## 주의사항

1. **카테고리 삭제**:
   - 해당 카테고리에 속한 상품이 있는지 먼저 확인
   - 상품이 있다면 삭제 불가 또는 경고 표시

2. **Slug 중복 방지**:
   - 같은 레벨에서 slug 중복 체크 필수
   - 예: 두 개의 서브카테고리가 같은 slug를 가질 수 없음

3. **계층 깊이**:
   - 현재 3단계까지 지원 (Category > SubCategory > Child)
   - 더 깊은 계층이 필요하면 스키마 수정 필요

4. **Icon 관리**:
   - SVG 형식 권장 (크기 조절 용이)
   - 아이콘 파일은 `/public/icons/` 디렉토리에 저장
