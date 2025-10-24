# Novamall E-commerce Platform Guide

이 문서는 Novamall E-commerce 플랫폼의 구조와 기능에 대한 종합적인 가이드입니다. 프론트엔드와 백엔드 측면을 모두 다루고 있습니다.

## 목차

- [프론트엔드](#프론트엔드)
  - [사용자 인증 관리 방법](#사용자-인증-관리-방법)
  - [사용하는 외부 SDK 및 라이브러리](#사용하는-외부-sdk-및-라이브러리)
  - [폴더 구조](#프론트엔드-폴더-구조)
  - [기타 중요 사항](#기타-중요-사항)
- [백엔드](#백엔드)
  - [폴더 구조](#백엔드-폴더-구조)
  - [사용자 인증 및 관리 방법](#사용자-인증-및-관리-방법)
  - [사용하는 라이브러리 및 SDK](#사용하는-라이브러리-및-sdk)
  - [모델 구조](#모델-구조)
  - [API 리스트](#api-리스트)
- [배포 가이드](#배포-가이드)

---

## 프론트엔드

### 사용자 인증 관리 방법

Novamall은 Next.js와 NextAuth.js를 사용하여 사용자 인증을 관리합니다.

#### 인증 방식

1. **자격 증명 기반 로그인**
   - 이메일과 비밀번호를 사용한 로그인
   - bcryptjs를 사용한 비밀번호 암호화

2. **소셜 로그인**
   - Google OAuth
   - Facebook OAuth

3. **세션 관리**
   - JWT 기반 세션 관리
   - 세션 유효 기간: 3시간
   - MongoDB 어댑터를 사용하여 세션 데이터 저장

4. **인증 흐름**
   - 로그인 페이지: `/signin`
   - 인증 API: `/api/auth/[...nextauth].js`
   - 세션 상태는 Redux를 통해 전역적으로 관리

#### 사용자 권한 수준

- 일반 사용자
- 관리자 (`isAdmin: true`)
- 스태프 (`isStaff.status: true`)

### 사용하는 외부 SDK 및 라이브러리

#### 상태 관리
- **Redux Toolkit**: 애플리케이션 상태 관리
- **Next Redux Wrapper**: Next.js와 Redux 통합

#### UI 컴포넌트
- **React**: UI 구성 요소 라이브러리
- **Framer Motion**: 애니메이션 효과
- **React Modal**: 모달 창 구현
- **React Toastify**: 알림 메시지
- **Swiper**: 슬라이더 및 캐러셀
- **React Responsive Carousel**: 이미지 캐러셀
- **React Inner Image Zoom**: 이미지 확대 기능
- **React Circular Progressbar**: 원형 진행 표시줄
- **React Data Table Component**: 데이터 테이블
- **React Select & React Multi Select Component**: 선택 컴포넌트
- **React Colorful**: 색상 선택기
- **SunEditor**: WYSIWYG 에디터

#### 데이터 관리
- **SWR**: 데이터 가져오기 및 캐싱
- **Axios**: HTTP 클라이언트
- **Fuse.js**: 클라이언트 측 검색 기능

#### 폼 처리
- **React Hook Form**: 폼 상태 관리 및 유효성 검사

#### 결제 통합
- **Stripe**: 결제 처리
- **PayPal**: 결제 처리

#### 국제화
- **i18next & React i18next**: 다국어 지원
- **ni18n**: Next.js 국제화 통합

#### 유틸리티
- **Day.js**: 날짜 및 시간 처리
- **JS Cookie**: 쿠키 관리
- **XSS**: XSS 공격 방지
- **Crypto-JS**: 암호화 기능

### 프론트엔드 폴더 구조

```
novamall/
├── components/         # 재사용 가능한 UI 컴포넌트
│   ├── AboutUs/        # 회사 소개 관련 컴포넌트
│   ├── Auth/           # 인증 관련 컴포넌트
│   ├── Banner/         # 배너 컴포넌트
│   └── ...             # 기타 컴포넌트
├── pages/              # 페이지 컴포넌트 및 라우팅
│   ├── api/            # API 라우트 (백엔드)
│   ├── cart/           # 장바구니 페이지
│   ├── checkout/       # 결제 페이지
│   ├── dashboard/      # 관리자 대시보드
│   └── ...             # 기타 페이지
├── public/             # 정적 파일
│   ├── css/            # CSS 파일
│   ├── images/         # 이미지 파일
│   ├── js/             # 클라이언트 측 JavaScript
│   └── ...             # 기타 정적 파일
├── redux/              # Redux 상태 관리
│   ├── cart.slice.js   # 장바구니 상태 관리
│   ├── session.slice.js # 세션 상태 관리
│   ├── settings.slice.js # 설정 상태 관리
│   └── store.js        # Redux 스토어 설정
└── styles/             # 전역 스타일
```

### 기타 중요 사항

1. **반응형 디자인**
   - 모바일 및 데스크톱 환경에 최적화된 UI

2. **상태 관리**
   - Redux를 사용한 전역 상태 관리
   - 장바구니, 세션, 설정 등의 상태 관리

3. **국제화**
   - i18next를 사용한 다국어 지원
   - 언어 전환 기능

4. **결제 통합**
   - Stripe, PayPal 등 다양한 결제 방식 지원

5. **성능 최적화**
   - Next.js의 SSR 및 SSG 활용
   - 이미지 최적화 (Sharp 라이브러리 사용)

---

## 백엔드

### 백엔드 폴더 구조

```
novamall/
├── lib/                # 유틸리티 함수
│   ├── dataLoader/     # 데이터 로딩 함수
│   ├── cartHandle.js   # 장바구니 처리 함수
│   ├── checkCanPurchase.js # 구매 가능 여부 확인
│   └── ...             # 기타 유틸리티
├── middleware/         # 미들웨어 함수
│   └── functions.js    # 공통 미들웨어 함수
├── models/             # MongoDB 모델 정의
│   ├── user.js         # 사용자 모델
│   ├── product.js      # 제품 모델
│   ├── order.js        # 주문 모델
│   └── ...             # 기타 모델
├── pages/api/          # API 엔드포인트
│   ├── auth/           # 인증 관련 API
│   ├── users/          # 사용자 관련 API
│   ├── product/        # 제품 관련 API
│   └── ...             # 기타 API
├── seeder/             # 데이터베이스 시드 스크립트
├── utils/              # 유틸리티 함수
│   ├── dbConnect.js    # 데이터베이스 연결
│   ├── mongoDriver.js  # MongoDB 드라이버
│   └── ...             # 기타 유틸리티
└── server.js           # Express 서버 설정
```

### 사용자 인증 및 관리 방법

#### 인증 시스템

1. **NextAuth.js**
   - JWT 기반 인증
   - MongoDB 어댑터를 사용한 세션 저장
   - 다양한 인증 제공자 지원 (자격 증명, Google, Facebook)

2. **사용자 관리**
   - MongoDB에 사용자 정보 저장
   - bcryptjs를 사용한 비밀번호 암호화
   - 사용자 권한 수준 관리 (일반 사용자, 관리자, 스태프)

3. **세션 관리**
   - JWT 토큰 사용
   - 세션 유효 기간: 3시간
   - 세션 정보에 사용자 권한 포함

4. **비밀번호 재설정**
   - 이메일 기반 비밀번호 재설정
   - 토큰 기반 인증

### 사용하는 라이브러리 및 SDK

1. **데이터베이스**
   - **MongoDB**: NoSQL 데이터베이스
   - **Mongoose**: MongoDB ODM(Object Document Mapper)

2. **서버**
   - **Express**: 웹 서버 프레임워크
   - **Next.js API Routes**: API 엔드포인트

3. **인증**
   - **NextAuth.js**: 인증 프레임워크
   - **bcryptjs**: 비밀번호 암호화
   - **jsonwebtoken**: JWT 토큰 관리

4. **파일 처리**
   - **Formidable**: 파일 업로드 처리
   - **AWS SDK**: S3 스토리지 통합

5. **이메일**
   - **Nodemailer**: 이메일 전송

6. **결제**
   - **Stripe**: 결제 처리
   - **PayPal SDK**: PayPal 결제 통합

7. **유틸리티**
   - **dotenv**: 환경 변수 관리
   - **cross-env**: 환경 변수 설정
   - **crypto-js**: 암호화 기능

### 모델 구조

Novamall은 MongoDB와 Mongoose를 사용하여 데이터를 관리합니다. 주요 모델은 다음과 같습니다:

1. **User 모델**
   - 기본 정보: 이름, 이메일, 전화번호, 주소
   - 인증 정보: 비밀번호 해시, 소금
   - 권한 정보: 관리자 여부, 스태프 여부
   - 포인트 시스템: 출금 가능 포인트, 쇼핑 포인트
   - 레벨 시스템: 레벨, 경험치

2. **Product 모델**
   - 기본 정보: 이름, 설명, 가격, 할인
   - 카테고리 및 브랜드 정보
   - 이미지 및 갤러리
   - 재고 관리: 수량, SKU
   - 속성 및 변형
   - 리뷰 및 질문
   - 포인트 시스템: 포인트 비율, 리베이트 비율

3. **Order 모델**
   - 주문 정보: 주문 ID, 주문 날짜
   - 제품 목록
   - 결제 정보: 결제 방법, 결제 상태
   - 배송 정보
   - 가격 정보: 총 가격, 세금, VAT

4. **Category 모델**
   - 카테고리 정보: 이름, 아이콘, 슬러그
   - 하위 카테고리 및 자식 카테고리

5. **기타 모델**
   - Address: 주소 정보
   - Brand: 브랜드 정보
   - Coupon: 쿠폰 정보
   - FAQ: 자주 묻는 질문
   - Group: 그룹 정보
   - PointHistory: 포인트 내역
   - Refund: 환불 요청
   - Setting: 시스템 설정
   - Webpage: 웹페이지 콘텐츠

### API 리스트

Novamall은 Next.js API Routes를 사용하여 다양한 API 엔드포인트를 제공합니다:

#### 인증 API
- `/api/auth/[...nextauth]`: NextAuth.js 인증 엔드포인트
- `/api/auth/signup`: 회원가입 API

#### 사용자 API
- `/api/users`: 사용자 CRUD 작업
- `/api/users/point`: 포인트 관리
- `/api/users/level`: 레벨 관리
- `/api/users/status`: 사용자 상태 관리

#### 제품 API
- `/api/product`: 제품 CRUD 작업
- `/api/product/search`: 제품 검색
- `/api/product/review`: 제품 리뷰 관리
- `/api/product/question`: 제품 질문 관리

#### 주문 API
- `/api/order`: 주문 CRUD 작업
- `/api/order/status`: 주문 상태 관리
- `/api/order/payment`: 결제 처리

#### 카테고리 API
- `/api/categories`: 카테고리 CRUD 작업

#### 결제 API
- `/api/checkout`: 결제 처리
- `/api/checkout/paypal`: PayPal 결제 처리
- `/api/checkout/success`: 결제 성공 처리

#### 기타 API
- `/api/address`: 주소 관리
- `/api/attributes`: 속성 관리
- `/api/brand`: 브랜드 관리
- `/api/colors`: 색상 관리
- `/api/coupons`: 쿠폰 관리
- `/api/faq`: FAQ 관리
- `/api/fileupload`: 파일 업로드
- `/api/gallery`: 갤러리 관리
- `/api/group`: 그룹 관리
- `/api/health`: 헬스 체크 API (AWS Target Group용)
- `/api/notification`: 알림 관리
- `/api/refund`: 환불 관리
- `/api/reset`: 비밀번호 재설정
- `/api/settings`: 설정 관리
- `/api/shipping`: 배송 관리
- `/api/staffs`: 스태프 관리
- `/api/subscribers`: 구독자 관리
- `/api/wishlist`: 위시리스트 관리

---

## 배포 가이드

### PM2를 사용한 배포

Novamall은 PM2를 사용하여 Node.js 애플리케이션을 관리합니다. 프로덕션 및 스테이징 환경에 대한 설정이 포함되어 있습니다.

#### PM2 설정 파일

`ecosystem.config.js` 파일에는 다음과 같은 환경 설정이 포함되어 있습니다:

1. **프로덕션 환경 (novamall-prod)**
   - 클러스터 모드로 실행 (모든 CPU 코어 활용)
   - 포트 8080
   - SSL 활성화

2. **스테이징 환경 (novamall-stg)**
   - 단일 인스턴스로 실행
   - 포트 8080
   - SSL 비활성화

#### 배포 스크립트

`script/start.sh` 스크립트를 사용하여 애플리케이션을 배포할 수 있습니다:

```bash
# 프로덕션 환경에 배포
./script/start.sh prod

# 스테이징 환경에 배포
./script/start.sh stg
```

#### AWS 배포

AWS Target Group에서 헬스 체크를 위한 `/api/health` 엔드포인트가 구현되어 있습니다. 이 엔드포인트는 항상 200 상태 코드를 반환하여 애플리케이션의 상태를 모니터링합니다.
