# Profile & User APIs

사용자 프로필 관련 API입니다.

## 엔드포인트 목록

### 프로필
- `GET /api/profile` - 프로필 조회
- `PUT /api/profile` - 프로필 수정
- `POST /api/profile/address` - 주소 추가
- `PUT /api/profile/address` - 주소 수정
- `DELETE /api/profile/address` - 주소 삭제

### 포인트
- `GET /api/profile/mypoints` - 내 포인트 조회
- `GET /api/profile/mypoints/history` - 포인트 내역

### 스페셜 상품
- `GET /api/profile/myspecial` - 내 스페셜 상품 구매 내역

### 위시리스트
- `GET /api/wishlist` - 위시리스트 조회
- `POST /api/wishlist` - 위시리스트 추가
- `DELETE /api/wishlist` - 위시리스트 삭제

### 주소
- `GET /api/address` - 주소 목록
- `POST /api/address` - 주소 추가
- `PUT /api/address` - 주소 수정
- `DELETE /api/address` - 주소 삭제

---

## GET /api/profile

내 프로필 정보를 조회합니다.

### 권한
- **User** (로그인 필요)

### Response
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "홍길동",
    "email": "hong@example.com",
    "phone": "01012345678",
    "image": "/uploads/profile.jpg",
    "house": "123번지",
    "city": "서울",
    "state": "강남구",
    "zipCode": "12345",
    "country": "Korea",
    "withdrawablePoint": 10000,
    "shoppingPoint": 5000,
    "level": 5,
    "level_exp": 1200,
    "status": "active"
  }
}
```

---

## PUT /api/profile

프로필 정보를 수정합니다.

### 권한
- **User** (로그인 필요)

### Request Body
```json
{
  "name": "홍길동",
  "phone": "01012345678",
  "house": "123번지",
  "city": "서울",
  "state": "강남구",
  "zipCode": "12345",
  "country": "Korea",
  "image": "/uploads/profile.jpg"
}
```

### Response
```json
{
  "success": true,
  "user": { ... }
}
```

---

## GET /api/profile/mypoints

내 포인트 정보를 조회합니다.

### 권한
- **User** (로그인 필요)

### Response
```json
{
  "success": true,
  "points": {
    "withdrawablePoint": 10000,
    "shoppingPoint": 5000,
    "totalWithdrawablePoint": 50000,
    "totalShoppingPoint": 30000
  }
}
```

---

## GET /api/profile/mypoints/history

포인트 적립/사용 내역을 조회합니다.

### 권한
- **User** (로그인 필요)

### Query Parameters
- `page` (optional) - 페이지 번호
- `limit` (optional) - 페이지당 항목 수
- `pointType` (optional) - 포인트 타입 필터 (shopping, withdrawable)

### Response
```json
{
  "success": true,
  "history": [
    {
      "_id": "...",
      "pointType": "withdrawable",
      "point": 5000,
      "pointUsage": "earned",
      "status": "completion",
      "createAt": "2024-01-01T00:00:00.000Z",
      "order": { ... },
      "product": { ... }
    }
  ],
  "total": 100,
  "page": 1,
  "pages": 10
}
```

---

## GET /api/profile/myspecial

내 스페셜 상품 구매 내역을 조회합니다.

### 권한
- **User** (로그인 필요)

### Response
```json
{
  "success": true,
  "purchases": [
    {
      "_id": "...",
      "group": {
        "_id": "...",
        "name": "프리미엄 그룹"
      },
      "product": {
        "_id": "...",
        "name": "스페셜 상품",
        "price": 100000
      },
      "order": { ... },
      "status": "progress",
      "earnedPoints": 10000
    }
  ]
}
```

---

## GET /api/wishlist

위시리스트를 조회합니다.

### 권한
- **User** (로그인 필요)

### Response
```json
{
  "success": true,
  "wishlist": [
    {
      "_id": "...",
      "name": "상품명",
      "slug": "product-slug",
      "price": 10000,
      "discount": 10,
      "image": ["/uploads/product.jpg"],
      "inStock": true
    }
  ]
}
```

---

## POST /api/wishlist

위시리스트에 상품을 추가합니다.

### 권한
- **User** (로그인 필요)

### Request Body
```json
{
  "productId": "..."
}
```

### Response
```json
{
  "success": true,
  "message": "Added to wishlist"
}
```

---

## DELETE /api/wishlist

위시리스트에서 상품을 삭제합니다.

### 권한
- **User** (로그인 필요)

### Request Body
```json
{
  "productId": "..."
}
```

### Response
```json
{
  "success": true,
  "message": "Removed from wishlist"
}
```

---

## 주소 API

### GET /api/address
주소 목록 조회

### POST /api/address
주소 추가

### PUT /api/address
주소 수정

### DELETE /api/address
주소 삭제

모든 주소 API는 **User** 권한이 필요하며, `/doc/model/address.md` 참조
