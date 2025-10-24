# Attributes Schema

상품 속성(사이즈, 재질 등)을 관리하는 스키마입니다.

## 위치
- **Model**: `/models/attributes.js`
- **Schema Definition**: `/utils/modelData.mjs` - `export const attribute`

## 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `name` | String | 속성명 (예: Size, Material, Weight) |
| `values` | Array | 속성 값 목록 (예: ["S", "M", "L", "XL"]) |

## 사용 예시

```javascript
import attributesModel from "~/models/attributes";

// 속성 생성
const sizeAttr = await attributesModel.create({
  name: "Size",
  values: ["S", "M", "L", "XL", "XXL"]
});

const materialAttr = await attributesModel.create({
  name: "Material",
  values: ["Cotton", "Polyester", "Silk", "Leather"]
});

// 속성 조회
const attributes = await attributesModel.find();
```

## Product와의 연동

상품에 속성을 적용할 때:

```javascript
// 상품 생성 시 속성 적용
const product = await productModel.create({
  name: "티셔츠",
  attributes: [
    {
      name: "Size",
      values: ["M", "L", "XL"]  // Size 속성 중 일부만 사용
    },
    {
      name: "Material",
      values: ["Cotton"]
    }
  ]
});
```

## 관련 API

- `GET /api/attributes` - 속성 목록
- `POST /api/attributes` - 속성 생성
- `PUT /api/attributes/edit` - 속성 수정
- `DELETE /api/attributes` - 속성 삭제
