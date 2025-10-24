# Public (Home) APIs

인증이 필요 없는 공개 API입니다.

## 엔드포인트 목록

### 홈페이지
- `GET /api/home` - 홈페이지 데이터
- `GET /api/home/products` - 상품 목록 (필터링)
- `GET /api/home/product_search` - 상품 검색
- `GET /api/home/categories` - 카테고리 목록
- `GET /api/home/settings` - 사이트 설정
- `GET /api/home/pages` - 페이지 컨텐츠
- `GET /api/home/shipping` - 배송비 정보
- `GET /api/home/wishlist` - 위시리스트 상품 정보
- `GET /api/home/compare` - 비교 상품 정보
- `GET /api/home/order-track?orderId={orderId}` - 주문 추적

---

## GET /api/home

홈페이지 초기 데이터를 조회합니다.

### 권한
- **Public**

### Response
```json
{
  "success": true,
  "data": {
    "carousel": {
      "background": ["/uploads/carousel-bg.jpg"],
      "carouselData": [
        {
          "title": "Summer Sale",
          "subtitle": "Up to 50% OFF",
          "image": "/uploads/slide1.jpg",
          "url": "/products/sale"
        }
      ]
    },
    "banner": {
      "title": "Free Shipping",
      "subTitle": "On orders over $50",
      "image": ["/uploads/banner.jpg"],
      "url": "/products"
    },
    "collection": {
      "scopeA": {
        "title": "Men's Fashion",
        "url": "/category/mens",
        "image": ["/uploads/collection-men.jpg"]
      },
      "scopeB": { ... },
      "scopeC": { ... },
      "scopeD": { ... }
    },
    "trendingProducts": [...],
    "newProducts": [...],
    "bestSellingProducts": [...]
  }
}
```

---

## GET /api/home/products

상품 목록을 조회합니다. (필터링, 정렬 지원)

### 권한
- **Public**

### Query Parameters
- `page` - 페이지 번호 (기본값: 1)
- `limit` - 페이지당 항목 수 (기본값: 20)
- `category` - 카테고리 필터
- `subcategory` - 서브카테고리 필터
- `childCategory` - 차일드 카테고리 필터
- `brand` - 브랜드 필터
- `minPrice` - 최소 가격
- `maxPrice` - 최대 가격
- `color` - 색상 필터
- `rating` - 최소 평점 (1-5)
- `sort` - 정렬 (price, date, name, rating)
- `order` - 정렬 방향 (asc, desc)
- `trending` - 트렌딩 상품만 (true/false)
- `new` - 신상품만 (true/false)
- `bestSelling` - 베스트셀러만 (true/false)

### 예시
```javascript
// 카테고리 + 가격 필터 + 정렬
GET /api/home/products?category=electronics&minPrice=10000&maxPrice=50000&sort=price&order=asc

// 트렌딩 상품
GET /api/home/products?trending=true&limit=10

// 브랜드 + 평점 필터
GET /api/home/products?brand=Samsung&rating=4
```

### Response
```json
{
  "success": true,
  "products": [...],
  "total": 150,
  "page": 1,
  "pages": 8
}
```

---

## GET /api/home/product_search

상품을 검색합니다.

### 권한
- **Public**

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

---

## GET /api/home/categories

카테고리 목록을 조회합니다.

### 권한
- **Public**

### Response
```json
{
  "success": true,
  "categories": [
    {
      "_id": "...",
      "categoryId": "CAT001",
      "name": "전자제품",
      "slug": "electronics",
      "icon": ["/icons/electronics.svg"],
      "topCategory": true,
      "subCategories": [
        {
          "id": "SUB001",
          "name": "컴퓨터",
          "slug": "computers",
          "child": [
            { "name": "노트북", "slug": "laptops" },
            { "name": "데스크탑", "slug": "desktops" }
          ]
        }
      ]
    }
  ]
}
```

---

## GET /api/home/settings

사이트 설정을 조회합니다.

### 권한
- **Public**

### Response
```json
{
  "success": true,
  "settings": {
    "name": "Novamall",
    "title": "E-commerce Platform",
    "logo": ["/uploads/logo.png"],
    "currency": {
      "name": "USD",
      "symbol": "$",
      "exchangeRate": 1
    },
    "color": {
      "primary": "#FF6B6B",
      "secondary": "#4ECDC4"
    },
    "social": {
      "facebook": "https://facebook.com/...",
      "instagram": "https://instagram.com/..."
    },
    "paymentGateway": {
      "cod": true,
      "stripe": true,
      "paypal": false
    },
    "login": {
      "facebook": false,
      "google": true
    }
  }
}
```

---

## GET /api/home/pages

페이지 컨텐츠를 조회합니다.

### 권한
- **Public**

### Query Parameters
- `page` (optional) - 페이지명 (about, privacy, terms, returnPolicy, faq)

### Response
```json
{
  "success": true,
  "pages": {
    "aboutPage": {
      "content": "<h1>About Us</h1><p>...</p>"
    },
    "privacyPage": {
      "content": "<h1>Privacy Policy</h1><p>...</p>"
    },
    "termsPage": {
      "content": "<h1>Terms of Service</h1><p>...</p>"
    },
    "returnPolicyPage": {
      "content": "<h1>Return Policy</h1><p>...</p>"
    },
    "faqPage": {
      "content": "<h1>FAQ</h1><p>...</p>"
    }
  }
}
```

---

## GET /api/home/shipping

배송비 정보를 조회합니다.

### 권한
- **Public**

### Response
```json
{
  "success": true,
  "shippingCharge": {
    "area": [
      { "name": "Seoul", "price": 3000 },
      { "name": "Busan", "price": 3500 },
      { "name": "Jeju", "price": 5000 }
    ],
    "internationalCost": 30000
  }
}
```

---

## GET /api/home/wishlist

위시리스트 상품 정보를 조회합니다.

### 권한
- **Public**

### Request Body
```json
{
  "productIds": ["id1", "id2", "id3"]
}
```

### Response
```json
{
  "success": true,
  "products": [...]
}
```

---

## GET /api/home/compare

비교 상품 정보를 조회합니다.

### 권한
- **Public**

### Request Body
```json
{
  "productIds": ["id1", "id2", "id3"]
}
```

### Response
```json
{
  "success": true,
  "products": [...]
}
```

---

## GET /api/home/order-track

주문을 추적합니다.

### 권한
- **Public**

### Query Parameters
- `orderId` (required) - 주문 ID

### Response
```json
{
  "success": true,
  "order": {
    "orderId": "ORD-20240101-001",
    "orderStatus": "shipped",
    "orderDate": "2024-01-01T00:00:00.000Z",
    "deliveryInfo": {
      "trackingNumber": "123456789",
      "courier": "CJ Logistics",
      "estimatedDate": "2024-01-05"
    }
  }
}
```

---

## 캐싱 권장

공개 API는 자주 호출되므로 다음 방법으로 캐싱하는 것을 권장합니다:

1. **CDN 캐싱**: CloudFlare, AWS CloudFront 등
2. **Redis 캐싱**: 서버 사이드 캐싱
3. **SWR/React Query**: 클라이언트 사이드 캐싱

```javascript
import useSWR from "swr";

function HomePage() {
  const { data, error } = useSWR("/api/home", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000 // 1분
  });

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return <div>{/* 홈페이지 렌더링 */}</div>;
}
```
