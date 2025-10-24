# User Schema

사용자 정보, 권한, 포인트, 레벨을 관리하는 스키마입니다.

## 위치
- **Model**: `/models/user.js`
- **Schema Definition**: `/utils/modelData.mjs` - `export const user`

## 필드 설명

### 기본 정보
| 필드 | 타입 | 설명 |
|------|------|------|
| `name` | String | 사용자 이름 |
| `email` | String | 이메일 (unique) |
| `phone` | String | 전화번호 |
| `image` | String | 프로필 이미지 URL |
| `hash` | String | 비밀번호 해시 |
| `salt` | String | 비밀번호 솔트 |
| `emailVerified` | String | 이메일 인증 상태 |
| `createdAt` | Date | 생성일 (기본값: Date.now) |
| `updatedAt` | Date | 수정일 (기본값: Date.now) |

### 주소 정보
| 필드 | 타입 | 설명 |
|------|------|------|
| `house` | String | 상세 주소 |
| `city` | String | 도시 |
| `state` | String | 주/도 |
| `zipCode` | String | 우편번호 |
| `country` | String | 국가 |

### 권한 관리
| 필드 | 타입 | 설명 |
|------|------|------|
| `isAdmin` | Boolean | 관리자 여부 (기본값: false) |
| `isStaff` | Object | 직원 정보 |
| `isStaff.status` | Boolean | 직원 여부 (기본값: false) |
| `isStaff.surname` | String | 직원 성 |
| `isStaff.permissions` | Array | 권한 목록 (예: products, orders) |

### 포인트 시스템
| 필드 | 타입 | 설명 |
|------|------|------|
| `withdrawablePoint` | Number | 현재 출금 가능 포인트 (기본값: 0) |
| `shoppingPoint` | Number | 현재 쇼핑몰 포인트 (기본값: 0) |
| `totalWithdrawablePoint` | Number | 총 적립된 출금 가능 포인트 (기본값: 0) |
| `totalShoppingPoint` | Number | 총 적립된 쇼핑몰 포인트 (기본값: 0) |

### 레벨 시스템
| 필드 | 타입 | 설명 |
|------|------|------|
| `level` | Number | 사용자 레벨 (기본값: 0) |
| `level_exp` | Number | 레벨 경험치 (기본값: 0) |

### 상태 관리
| 필드 | 타입 | 설명 |
|------|------|------|
| `status` | String | 구매 가능 상태: "active", "inactive" (기본값: "active") |
| `isDeleted` | Boolean | 삭제 여부 (기본값: false) |

### 비밀번호 재설정
| 필드 | 타입 | 설명 |
|------|------|------|
| `resetPasswordToken` | String | 비밀번호 재설정 토큰 |
| `resetPasswordExpires` | Date | 토큰 만료 시간 |

### 관계 필드 (References)
| 필드 | 타입 | 참조 | 설명 |
|------|------|------|------|
| `orders` | Array | Order | 사용자의 주문 목록 |
| `favorite` | Array | Product | 찜한 상품 목록 |
| `refundRequest` | Array | RefundRequest | 환불 요청 목록 |
| `address` | Array | Address | 저장된 주소 목록 |

## 권한 체계

### 1. Admin (`isAdmin: true`)
- 모든 기능에 대한 전체 권한
- 시스템 설정, 사용자 관리, 상품 관리 등

### 2. Staff (`isStaff.status: true`)
- 세부 권한 설정 가능
- `permissions` 배열로 관리
- 권한 예시:
  ```javascript
  {
    name: "products",
    view: true,
    edit: true,
    delete: false
  }
  ```

### 3. User (일반 사용자)
- 자신의 프로필 관리
- 상품 구매, 리뷰 작성
- 찜 목록, 주문 내역 조회

## 포인트 적립 규칙

### Withdrawable Point (출금 가능 포인트)
- 스페셜 상품 구매 시 적립
- 실제 현금으로 출금 가능
- `Product.withdrawablePointRate`에 따라 적립

### Shopping Point (쇼핑몰 포인트)
- 스페셜 상품 구매 시 적립
- 쇼핑몰에서만 사용 가능
- `Product.shoppingPointRate`에 따라 적립

## 레벨 시스템

사용자 활동에 따라 경험치(`level_exp`)가 쌓이고, 일정 경험치에 도달하면 레벨업합니다.

레벨업 로직은 `/lib/levelUpFunctions.js`에 구현되어 있습니다.

## 관련 API

### 인증
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/[...nextauth]` - NextAuth.js 인증

### 프로필 관리
- `GET /api/profile` - 프로필 조회
- `PUT /api/profile` - 프로필 수정
- `GET /api/profile/address` - 주소 목록
- `POST /api/profile/address` - 주소 추가

### 포인트
- `GET /api/profile/mypoints` - 포인트 조회
- `GET /api/profile/mypoints/history` - 포인트 내역

### 관리자
- `GET /api/users` - 사용자 목록 (관리자)
- `PUT /api/users/status` - 사용자 상태 변경
- `GET /api/users/level` - 레벨 관리
- `PUT /api/users/point` - 포인트 수동 지급

## 사용 예시

```javascript
import userModel from "~/models/user";

// 사용자 조회
const user = await userModel.findOne({ email: "user@example.com" });

// 포인트 적립
await userModel.findByIdAndUpdate(userId, {
  $inc: {
    withdrawablePoint: 1000,
    totalWithdrawablePoint: 1000
  }
});

// 레벨업
await userModel.findByIdAndUpdate(userId, {
  $inc: { level: 1 },
  $set: { level_exp: 0 }
});
```

## 보안 고려사항

1. **비밀번호**: bcrypt로 해시화되어 `hash`와 `salt`에 저장
2. **이메일 중복 방지**: `email` 필드에 unique 인덱스
3. **Soft Delete**: `isDeleted` 플래그로 소프트 삭제 구현
4. **토큰 만료**: `resetPasswordExpires`로 비밀번호 재설정 토큰 관리
