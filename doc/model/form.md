# Form Schema

카테고리별 동적 폼 필드를 관리하는 스키마입니다.

## 위치
- **Model**: `/models/form.js`
- **Schema Definition**: `/utils/modelData.mjs` - `export const form`

## 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `categoryId` | ObjectId (ref: Category) | ✅ | 카테고리 ID |
| `label` | String | ✅ | 필드 라벨 (예: Material, Size, Color) |
| `type` | String | ✅ | 필드 타입: input, select, textarea, radio, checkbox |
| `options` | Array\<String\> | - | 선택 옵션 (select, radio, checkbox용) |

## 필드 타입

- `input` - 텍스트 입력
- `select` - 드롭다운 선택
- `textarea` - 여러 줄 텍스트
- `radio` - 단일 선택 (라디오 버튼)
- `checkbox` - 다중 선택 (체크박스)

## 사용 예시

### 폼 필드 생성
```javascript
import formModel from "~/models/form";

// "의류" 카테고리에 동적 폼 필드 추가
await formModel.create({
  categoryId: clothingCategoryId,
  label: "Size",
  type: "select",
  options: ["S", "M", "L", "XL", "XXL"]
});

await formModel.create({
  categoryId: clothingCategoryId,
  label: "Material",
  type: "select",
  options: ["Cotton", "Polyester", "Silk", "Leather"]
});

await formModel.create({
  categoryId: clothingCategoryId,
  label: "Care Instructions",
  type: "textarea",
  options: []
});
```

### 카테고리별 폼 필드 조회
```javascript
const formFields = await formModel.find({ categoryId: clothingCategoryId });
```

### 상품 등록 폼에서 사용
```javascript
// 관리자 페이지: 상품 등록 폼
const category = req.body.category;
const formFields = await formModel.find({ categoryId: category });

// 동적으로 폼 필드 렌더링
formFields.map(field => {
  switch (field.type) {
    case "input":
      return <input type="text" name={field.label} />;
    case "select":
      return (
        <select name={field.label}>
          {field.options.map(opt => (
            <option value={opt}>{opt}</option>
          ))}
        </select>
      );
    case "textarea":
      return <textarea name={field.label}></textarea>;
    case "radio":
      return field.options.map(opt => (
        <label>
          <input type="radio" name={field.label} value={opt} />
          {opt}
        </label>
      ));
    case "checkbox":
      return field.options.map(opt => (
        <label>
          <input type="checkbox" name={field.label} value={opt} />
          {opt}
        </label>
      ));
  }
});
```

## 관련 API

- `GET /api/categories/form?categoryId={id}` - 카테고리별 폼 필드 조회
- `POST /api/categories/form` - 폼 필드 추가 (관리자)
- `PUT /api/categories/form` - 폼 필드 수정 (관리자)
- `DELETE /api/categories/form` - 폼 필드 삭제 (관리자)

## 활용 예시

### 예: 전자제품 카테고리
```javascript
[
  {
    categoryId: electronicsId,
    label: "Warranty",
    type: "select",
    options: ["6 months", "1 year", "2 years"]
  },
  {
    categoryId: electronicsId,
    label: "Voltage",
    type: "input",
    options: []
  },
  {
    categoryId: electronicsId,
    label: "Features",
    type: "checkbox",
    options: ["WiFi", "Bluetooth", "USB-C", "HDMI"]
  }
]
```

### 예: 가구 카테고리
```javascript
[
  {
    categoryId: furnitureId,
    label: "Dimensions",
    type: "input",
    options: []
  },
  {
    categoryId: furnitureId,
    label: "Assembly Required",
    type: "radio",
    options: ["Yes", "No"]
  }
]
```

## 상품 등록 시 저장

상품 등록 시 동적 폼 필드의 값을 `Product` 스키마에 저장합니다.

```javascript
// 상품 생성
const product = await productModel.create({
  name: "티셔츠",
  categoryId: clothingCategoryId,
  // ... 기본 필드들
  // 동적 필드 값
  customFields: {
    Size: ["M", "L", "XL"],
    Material: "Cotton",
    "Care Instructions": "Machine wash cold"
  }
});
```

또는 `Product.attributes` 배열에 저장할 수 있습니다.

## 주의사항

1. **필수 여부**: 현재 스키마에는 필수 여부 필드가 없으므로, 필요시 `required: Boolean` 추가
2. **검증**: 폼 제출 시 필드 타입에 맞는 검증 필요
3. **카테고리 삭제**: 카테고리 삭제 시 연관된 Form 레코드도 삭제 필요
4. **옵션 수정**: 폼 필드의 옵션을 수정하면 기존 상품 데이터와 불일치 발생 가능
