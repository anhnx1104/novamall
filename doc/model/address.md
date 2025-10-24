# Address Schema

사용자 주소록을 관리하는 스키마입니다.

## 위치
- **Model**: `/models/address.js`
- **Schema Definition**: `/utils/modelData.mjs` - `export const address`

## 필드 설명

### 기본 정보
| 필드 | 타입 | 설명 |
|------|------|------|
| `name` | String | 수령인 이름 |
| `email` | String | 이메일 |
| `phone` | String | 전화번호 |

### 주소 정보
| 필드 | 타입 | 설명 |
|------|------|------|
| `house` | String | 상세 주소 |
| `city` | String | 도시 |
| `state` | String | 주/도 |
| `zipCode` | String | 우편번호 |
| `country` | String | 국가 |

### 메타 정보
| 필드 | 타입 | 설명 |
|------|------|------|
| `addressType` | String | 주소 타입 (home, office 등) |
| `addressTitle` | String | 주소 별칭 (예: "우리집", "회사") |

### 관계 필드
| 필드 | 타입 | 참조 | 설명 |
|------|------|------|------|
| `user` | ObjectId | User | 주소 소유자 |

## 사용 예시

```javascript
import addressModel from "~/models/address";

// 주소 추가
const address = await addressModel.create({
  user: userId,
  name: "홍길동",
  email: "hong@example.com",
  phone: "01012345678",
  house: "123번지 456호",
  city: "서울",
  state: "강남구",
  zipCode: "12345",
  country: "Korea",
  addressType: "home",
  addressTitle: "우리집"
});

// 사용자의 주소 목록 조회
const addresses = await addressModel.find({ user: userId });

// User 스키마와의 관계 업데이트
await userModel.findByIdAndUpdate(userId, {
  $push: { address: address._id }
});
```

## 주문 시 주소 사용

```javascript
// 저장된 주소 선택하여 주문
const selectedAddress = await addressModel.findById(addressId);

const order = await orderModel.create({
  shippingInfo: {
    name: selectedAddress.name,
    email: selectedAddress.email,
    phone: selectedAddress.phone,
    house: selectedAddress.house,
    city: selectedAddress.city,
    state: selectedAddress.state,
    zipCode: selectedAddress.zipCode,
    country: selectedAddress.country
  }
});
```

## 관련 API

- `GET /api/address` - 주소 목록 (본인)
- `POST /api/address` - 주소 추가
- `PUT /api/address` - 주소 수정
- `DELETE /api/address` - 주소 삭제
- `GET /api/profile/address` - 프로필 페이지 주소 관리

## Address Type

주소 타입으로 주소를 분류할 수 있습니다:

- `home` - 집
- `office` - 회사
- `other` - 기타

## 주의사항

1. **기본 주소**: 사용자가 선호하는 기본 주소를 표시하려면 User 스키마에 `defaultAddress` 필드 추가 필요
2. **주소 검증**: 우편번호, 전화번호 형식 검증 권장
3. **개인정보**: 주소는 민감한 개인정보이므로 보안에 주의
