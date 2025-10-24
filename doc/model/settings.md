# Settings Schema

사이트 설정, 결제 게이트웨이, 통화, SEO, 소셜 미디어 등을 관리하는 스키마입니다.

## 위치
- **Model**: `/models/setting.js`
- **Schema Definition**: `/utils/modelData.mjs` - `export const settings`

## 필드 설명

### 기본 정보
| 필드 | 타입 | 설명 |
|------|------|------|
| `name` | String | 사이트명 |
| `title` | String | 사이트 제목 |
| `description` | String | 사이트 설명 |
| `email` | String | 문의 이메일 |
| `address` | String | 주소 (전체) |
| `shortAddress` | String | 짧은 주소 |
| `phoneHeader` | String | 헤더 표시 전화번호 |
| `phoneFooter` | String | 푸터 표시 전화번호 |
| `copyright` | String | 저작권 표시 |
| `language` | String | 기본 언어 (기본값: "en") |

### 미디어
| 필드 | 타입 | 설명 |
|------|------|------|
| `logo` | Array | 로고 이미지 |
| `favicon` | Array | 파비콘 |
| `gatewayImage` | Array | 결제 게이트웨이 아이콘 이미지 |

### 커스텀 스크립트
| 필드 | 타입 | 설명 |
|------|------|------|
| `headerCustomScript` | String | `<head>` 태그 내 삽입할 스크립트 |
| `footerCustomScript` | String | `</body>` 태그 전 삽입할 스크립트 |

### Footer Banner
| 필드 | 타입 | 설명 |
|------|------|------|
| `footerBanner.security` | Object | 보안 관련 배너 |
| `footerBanner.security.title` | String | 제목 |
| `footerBanner.security.description` | String | 설명 |
| `footerBanner.support` | Object | 고객 지원 배너 |
| `footerBanner.support.title` | String | 제목 |
| `footerBanner.support.description` | String | 설명 |
| `footerBanner.delivery` | Object | 배송 정보 배너 |
| `footerBanner.delivery.title` | String | 제목 |
| `footerBanner.delivery.description` | String | 설명 |

### SEO 설정
| 필드 | 타입 | 설명 |
|------|------|------|
| `seo.title` | String | 메타 제목 |
| `seo.description` | String | 메타 설명 |
| `seo.keyword` | String | 메타 키워드 |
| `seo.image` | Array | OG 이미지 |

### 소셜 미디어
| 필드 | 타입 | 설명 |
|------|------|------|
| `social.facebook` | String | Facebook 페이지 URL |
| `social.instagram` | String | Instagram 프로필 URL |
| `social.twitter` | String | Twitter 프로필 URL |
| `social.youtube` | String | YouTube 채널 URL |
| `social.pinterest` | String | Pinterest 프로필 URL |

### 통화 설정
| 필드 | 타입 | 설명 |
|------|------|------|
| `currency.name` | String | 통화 코드 (기본값: "USD") |
| `currency.symbol` | String | 통화 기호 (기본값: "$") |
| `currency.exchangeRate` | Number | 환율 (기본값: 1) |

### 색상 테마
| 필드 | 타입 | 설명 |
|------|------|------|
| `color.primary` | String | 주 색상 (Hex) |
| `color.primary_hover` | String | 주 색상 호버 (Hex) |
| `color.secondary` | String | 보조 색상 (Hex) |
| `color.body_gray` | String | 본문 회색 (Hex) |
| `color.body_gray_contrast` | String | 본문 회색 대비 (Hex) |
| `color.primary_contrast` | String | 주 색상 대비 (Hex) |
| `color.primary_hover_contrast` | String | 주 색상 호버 대비 (Hex) |
| `color.secondary_contrast` | String | 보조 색상 대비 (Hex) |

### 스크립트 ID
| 필드 | 타입 | 설명 |
|------|------|------|
| `script.googleSiteVerificationId` | String | Google Search Console 인증 ID |
| `script.facebookAppId` | String | Facebook App ID |
| `script.googleAnalyticsId` | String | Google Analytics ID (GA4) |
| `script.facebookPixelId` | String | Facebook Pixel ID |
| `script.messengerPageId` | String | Facebook Messenger Page ID |

### 결제 게이트웨이
| 필드 | 타입 | 설명 |
|------|------|------|
| `paymentGateway.cod` | Boolean | 현금 결제 활성화 (기본값: true) |
| `paymentGateway.paypal` | Boolean | PayPal 활성화 (기본값: false) |
| `paymentGateway.stripe` | Boolean | Stripe 활성화 (기본값: false) |
| `paymentGateway.sslCommerz` | Boolean | SSLCommerz 활성화 (기본값: false) |
| `paymentGateway.razorpay` | Boolean | Razorpay 활성화 (기본값: false) |

### 로그인 설정
| 필드 | 타입 | 설명 |
|------|------|------|
| `login.facebook` | Boolean | Facebook 로그인 활성화 (기본값: false) |
| `login.google` | Boolean | Google 로그인 활성화 (기본값: false) |

### 보안 설정
| 필드 | 타입 | 설명 |
|------|------|------|
| `security.loginForPurchase` | Boolean | 구매 시 로그인 필수 (기본값: true) |

## 사용 예시

### 설정 조회
```javascript
import settingModel from "~/models/setting";

// 전체 설정 조회
const settings = await settingModel.findOne();

// 특정 필드만 조회
const { name, logo, currency } = await settingModel
  .findOne()
  .select("name logo currency");
```

### 설정 업데이트
```javascript
// 기본 정보 업데이트
await settingModel.findOneAndUpdate(
  {},
  {
    name: "Novamall",
    email: "contact@novamall.com",
    phoneHeader: "1-800-123-4567"
  },
  { upsert: true }
);

// 색상 테마 변경
await settingModel.findOneAndUpdate(
  {},
  {
    "color.primary": "#FF6B6B",
    "color.primary_hover": "#FF5252",
    "color.secondary": "#4ECDC4"
  }
);

// 결제 게이트웨이 활성화
await settingModel.findOneAndUpdate(
  {},
  {
    "paymentGateway.stripe": true,
    "paymentGateway.paypal": true
  }
);
```

### Redux Store와 연동
설정은 Redux Store에 저장되어 클라이언트에서 사용됩니다.

```javascript
// /redux/settings.slice.js
import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {},
  reducers: {
    updateSettings: (state, action) => {
      return action.payload;
    }
  }
});
```

## 관련 API

### 공개 API
- `GET /api/home/settings` - 설정 조회 (공개)

### 관리자 API
- `GET /api/settings` - 설정 조회 (전체)
- `PUT /api/settings` - 설정 업데이트

## 환경 변수와의 관계

일부 민감한 설정은 환경 변수(`.env.local`)에 저장됩니다:

```env
# 결제 게이트웨이
STRIPE_SECRET_KEY=sk_test_...
PAYPAL_CLIENT_ID=...

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...

# 기타
AUTH_SECRET=...
MONGO_URI=...
```

Settings 스키마의 `paymentGateway`와 `login` 필드는 UI에서 기능 활성화/비활성화만 제어하며, 실제 API 키는 환경 변수에서 가져옵니다.

## 색상 테마 적용

색상 설정은 CSS 변수로 변환되어 전역 스타일에 적용됩니다.

```javascript
// 예: _app.js 또는 Layout 컴포넌트
const { color } = settings;

<style jsx global>{`
  :root {
    --primary-color: ${color.primary};
    --primary-hover-color: ${color.primary_hover};
    --secondary-color: ${color.secondary};
    /* ... */
  }
`}</style>
```

## SEO 적용

SEO 설정은 모든 페이지의 `<head>` 태그에 적용됩니다.

```javascript
import Head from "next/head";

<Head>
  <title>{seo.title}</title>
  <meta name="description" content={seo.description} />
  <meta name="keywords" content={seo.keyword} />
  <meta property="og:image" content={seo.image[0]} />
</Head>
```

## 커스텀 스크립트 삽입

관리자가 직접 스크립트를 추가할 수 있습니다.

```javascript
// 헤더 스크립트
<Head>
  <script dangerouslySetInnerHTML={{ __html: headerCustomScript }} />
</Head>

// 푸터 스크립트
<script dangerouslySetInnerHTML={{ __html: footerCustomScript }} />
```

**주의**: XSS 공격 위험이 있으므로 관리자만 수정 가능하도록 권한 제한 필수

## 통화 변환

`currency.exchangeRate`를 사용하여 다른 통화로 변환합니다.

```javascript
function convertPrice(priceInUSD) {
  return priceInUSD * settings.currency.exchangeRate;
}

// 표시
const displayPrice = `${settings.currency.symbol}${convertPrice(100).toFixed(2)}`;
// 예: $100 (USD) → ₩130,000 (KRW, exchangeRate: 1300)
```

## 주의사항

1. **단일 레코드**:
   - Settings는 전체 사이트에 단 하나의 레코드만 존재
   - `findOne()`으로 조회, `findOneAndUpdate({}, ..., { upsert: true })`로 업데이트

2. **캐싱**:
   - Settings는 자주 조회되므로 Redis 등으로 캐싱 권장
   - 업데이트 시 캐시 무효화 필수

3. **환경 변수 우선**:
   - 민감한 정보(API 키, 시크릿)는 항상 환경 변수 사용
   - Settings는 UI 표시 및 기능 토글 용도로만 사용

4. **색상 검증**:
   - Hex 색상 코드 형식 검증 (#RRGGBB)
   - 잘못된 색상 입력 시 기본값 사용

5. **스크립트 보안**:
   - `headerCustomScript`와 `footerCustomScript`는 XSS 위험
   - 관리자 권한 사용자만 수정 가능하도록 제한
