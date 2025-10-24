# Brand Schema

브랜드 정보를 관리하는 스키마입니다.

## 위치
- **Model**: `/models/brand.js`
- **Schema Definition**: `/utils/modelData.mjs` - `export const brand`

## 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `brandId` | String | 브랜드 고유 ID |
| `name` | String | 브랜드명 |
| `slug` | String | URL 슬러그 |
| `image` | Array | 브랜드 로고 이미지 |
| `topBrand` | Boolean | 상위 노출 브랜드 (기본값: false) |

## 관련 API

- `GET /api/admin/brand` - 브랜드 목록
- `POST /api/admin/brand` - 브랜드 생성
- `PUT /api/admin/brand/edit` - 브랜드 수정
- `DELETE /api/admin/brand` - 브랜드 삭제

## 사용 예시

```javascript
import brandModel from "~/models/brand";

// 브랜드 생성
const brand = await brandModel.create({
  brandId: "BRAND001",
  name: "Nike",
  slug: "nike",
  image: ["/brands/nike-logo.png"],
  topBrand: true
});

// 브랜드별 상품 조회
const products = await productModel.find({ brand: "Nike" });

// Top 브랜드 조회
const topBrands = await brandModel.find({ topBrand: true });
```
