# Colors Schema

색상 정보를 관리하는 스키마입니다.

## 위치
- **Model**: `/models/colors.js`
- **Schema Definition**: `/utils/modelData.mjs` - `export const color`

## 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `name` | String | 색상명 (예: Red, Blue, Black) |
| `value` | String | 색상 코드 Hex (예: #FF0000) |

## 사용 예시

```javascript
import colorsModel from "~/models/colors";

// 색상 생성
const red = await colorsModel.create({
  name: "Red",
  value: "#FF0000"
});

const blue = await colorsModel.create({
  name: "Blue",
  value: "#0000FF"
});

// 색상 목록 조회
const colors = await colorsModel.find();
```

## Product와의 연동

```javascript
// 상품에 색상 옵션 추가
const product = await productModel.create({
  name: "티셔츠",
  colors: [
    { name: "Red", value: "#FF0000" },
    { name: "Blue", value: "#0000FF" },
    { name: "Black", value: "#000000" }
  ]
});
```

## 관련 API

- `GET /api/colors` - 색상 목록
- `POST /api/colors` - 색상 생성
- `PUT /api/colors/edit` - 색상 수정
- `DELETE /api/colors` - 색상 삭제
