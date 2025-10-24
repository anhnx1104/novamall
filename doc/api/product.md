# Product APIs

상품 관련 API입니다.

## 엔드포인트 목록

### 상품 조회 (Public)
- `GET /api/product` - 상품 목록 (필터링, 정렬)
- `GET /api/product/[slug]` - 상품 상세 조회
- `GET /api/home/products` - 홈페이지용 상품 목록
- `GET /api/home/product_search` - 상품 검색

### 상품 관리 (Admin/Staff)
- `POST /api/product/create` - 상품 생성
- `PUT /api/product/edit` - 상품 수정
- `DELETE /api/product/delete/[id]` - 상품 삭제

### 스페셜 상품
- `GET /api/product/special` - 스페셜 상품 목록
- `GET /api/product/special/group` - 그룹별 스페셜 상품

---

## GET /api/product

상품 목록을 조회합니다. (관리자용)

### 권한
- **Admin/Staff** (products 권한 필요)

### Query Parameters
- `page` (optional) - 페이지 번호 (기본값: 1)
- `limit` (optional) - 페이지당 항목 수 (기본값: 10)
- `category` (optional) - 카테고리 필터
- `brand` (optional) - 브랜드 필터
- `search` (optional) - 검색어

### Response
```json
{
  "success": true,
  "products": [
    {
      "_id": "...",
      "name": "상품명",
      "slug": "product-slug",
      "price": 10000,
      "discount": 10,
      "quantity": 50,
      "image": ["/uploads/product.jpg"],
      "categories": ["전자제품"],
      "brand": "Samsung",
      "trending": false,
      "new": true,
      "isSpecial": false
    }
  ],
  "total": 100,
  "page": 1,
  "pages": 10
}
```

---

## GET /api/product/[slug]

상품 상세 정보를 조회합니다.

### 권한
- **Public** (인증 불필요)

### URL Parameters
- `slug` (required) - 상품 슬러그

### Response
```json
{
  "_id": "...",
  "name": "상품명",
  "slug": "product-slug",
  "price": 10000,
  "discount": 10,
  "quantity": 50,
  "description": "상세 설명",
  "shortDescription": "짧은 설명",
  "image": ["/uploads/product.jpg"],
  "gallery": ["/uploads/gallery1.jpg", "/uploads/gallery2.jpg"],
  "categories": ["전자제품"],
  "subcategories": ["스마트폰"],
  "brand": "Samsung",
  "colors": [
    { "name": "Black", "value": "#000000" },
    { "name": "White", "value": "#FFFFFF" }
  ],
  "attributes": [
    { "name": "Size", "values": ["128GB", "256GB"] }
  ],
  "variants": [],
  "review": [
    {
      "userName": "홍길동",
      "rating": 5,
      "comment": "좋은 상품입니다!",
      "date": "2024-01-01T00:00:00.000Z",
      "media": []
    }
  ],
  "question": [],
  "seo": {
    "title": "SEO 제목",
    "description": "SEO 설명",
    "image": []
  },
  "isSpecial": false,
  "group": null,
  "withdrawablePointRate": 0,
  "shoppingPointRate": 0
}
```

---

## POST /api/product/create

새 상품을 생성합니다.

### 권한
- **Admin/Staff** (products 편집 권한 필요)

### Request Body
```json
{
  "name": "상품명",
  "slug": "product-slug",
  "price": 10000,
  "discount": 10,
  "quantity": 50,
  "description": "상세 설명",
  "shortDescription": "짧은 설명",
  "image": ["/uploads/product.jpg"],
  "gallery": ["/uploads/gallery1.jpg"],
  "categories": ["전자제품"],
  "subcategories": ["스마트폰"],
  "brand": "Samsung",
  "colors": [
    { "name": "Black", "value": "#000000" }
  ],
  "attributes": [
    { "name": "Size", "values": ["128GB", "256GB"] }
  ],
  "sku": "PROD-001",
  "trending": false,
  "new": true,
  "bestSelling": false,
  "isSpecial": false,
  "seo": {
    "title": "SEO 제목",
    "description": "SEO 설명"
  }
}
```

### Response
```json
{
  "success": true,
  "product": {
    "_id": "...",
    "name": "상품명",
    ...
  }
}
```

---

## PUT /api/product/edit

상품 정보를 수정합니다.

### 권한
- **Admin/Staff** (products 편집 권한 필요)

### Request Body
```json
{
  "id": "productId",
  "name": "수정된 상품명",
  "price": 12000,
  ...
}
```

### Response
```json
{
  "success": true,
  "product": { ... }
}
```

---

## DELETE /api/product/delete/[id]

상품을 삭제합니다.

### 권한
- **Admin/Staff** (products 삭제 권한 필요)

### URL Parameters
- `id` (required) - 상품 ID

### Response
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## GET /api/home/products

홈페이지용 상품 목록을 조회합니다. (필터링 지원)

### 권한
- **Public** (인증 불필요)

### Query Parameters
- `page` (optional) - 페이지 번호
- `limit` (optional) - 페이지당 항목 수
- `category` (optional) - 카테고리 필터
- `subcategory` (optional) - 서브카테고리 필터
- `brand` (optional) - 브랜드 필터
- `minPrice` (optional) - 최소 가격
- `maxPrice` (optional) - 최대 가격
- `color` (optional) - 색상 필터
- `sort` (optional) - 정렬 (price, date, name)
- `order` (optional) - 정렬 방향 (asc, desc)
- `trending` (optional) - 트렌딩 상품만 (true/false)
- `new` (optional) - 신상품만 (true/false)
- `bestSelling` (optional) - 베스트셀러만 (true/false)

### 예시
```javascript
// 카테고리별 조회
GET /api/home/products?category=전자제품&page=1&limit=20

// 가격 범위 필터
GET /api/home/products?minPrice=10000&maxPrice=50000

// 정렬
GET /api/home/products?sort=price&order=asc

// 트렌딩 상품
GET /api/home/products?trending=true
```

---

## GET /api/home/product_search

상품을 검색합니다.

### 권한
- **Public** (인증 불필요)

### Query Parameters
- `q` (required) - 검색어

### Response
```json
{
  "success": true,
  "products": [...],
  "total": 25
}
```

### 검색 대상
- 상품명 (`name`)
- 설명 (`description`, `shortDescription`)
- 카테고리 (`categories`)
- 브랜드 (`brand`)
- SKU (`sku`)

### 예시
```javascript
const response = await fetch("/api/home/product_search?q=삼성 갤럭시");
const data = await response.json();
```

---

## GET /api/product/special

스페셜 상품 목록을 조회합니다.

### 권한
- **User** (로그인 필요)

### Query Parameters
- `page` (optional) - 페이지 번호
- `limit` (optional) - 페이지당 항목 수

### Response
```json
{
  "success": true,
  "products": [
    {
      "_id": "...",
      "name": "스페셜 상품",
      "price": 100000,
      "isSpecial": true,
      "group": {
        "_id": "groupId",
        "name": "프리미엄 그룹",
        "price": 50000
      },
      "withdrawablePointRate": 10,
      "shoppingPointRate": 5,
      "rebateRate": 3,
      "pointLimit": 100000
    }
  ]
}
```

---

## GET /api/product/special/group

특정 그룹의 스페셜 상품 목록을 조회합니다.

### 권한
- **User** (로그인 필요)

### Query Parameters
- `groupId` (required) - 그룹 ID

### Response
```json
{
  "success": true,
  "products": [...]
}
```

---

## 주의사항

1. **Slug 고유성**: 상품 slug는 고유해야 하며, 중복 시 에러 발생
2. **재고 관리**: 주문 시 `quantity` 자동 차감
3. **이미지 업로드**: 이미지는 먼저 `/api/fileupload/*`로 업로드 후 URL 사용
4. **스페셜 상품**: `isSpecial: true`인 경우 `group` 필드 필수
5. **포인트 한도**: 스페셜 상품의 `pointLimit` 초과 시 포인트 지급 중단
6. **검색 최적화**: 대량의 상품이 있는 경우 Elasticsearch 등의 검색 엔진 사용 권장
