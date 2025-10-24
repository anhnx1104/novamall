# 전체 API 목록

Novamall 프로젝트의 전체 API 엔드포인트 목록입니다.

## 인증 (Authentication)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/auth/signup` | POST | Public | 회원가입 |
| `/api/auth/[...nextauth]` | POST | Public | 로그인 |
| `/api/reset` | GET | Public | 비밀번호 재설정 토큰 검증 |
| `/api/reset` | POST | Public | 비밀번호 재설정 이메일 발송 |
| `/api/reset` | PUT | Public | 비밀번호 재설정 완료 |

## 공개 API (Public)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/home` | GET | Public | 홈페이지 데이터 |
| `/api/home/products` | GET | Public | 상품 목록 (필터링) |
| `/api/home/product_search` | GET | Public | 상품 검색 |
| `/api/home/categories` | GET | Public | 카테고리 목록 |
| `/api/home/settings` | GET | Public | 사이트 설정 |
| `/api/home/pages` | GET | Public | 페이지 컨텐츠 |
| `/api/home/shipping` | GET | Public | 배송비 정보 |
| `/api/home/wishlist` | POST | Public | 위시리스트 상품 정보 |
| `/api/home/compare` | POST | Public | 비교 상품 정보 |
| `/api/home/order-track` | GET | Public | 주문 추적 |
| `/api/health` | GET | Public | 헬스 체크 |

## 상품 (Products)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/product` | GET | Admin/Staff | 상품 목록 (관리자) |
| `/api/product/[slug]` | GET | Public | 상품 상세 |
| `/api/product/create` | POST | Admin/Staff | 상품 생성 |
| `/api/product/edit` | PUT | Admin/Staff | 상품 수정 |
| `/api/product/delete/[id]` | DELETE | Admin/Staff | 상품 삭제 |
| `/api/product/special` | GET | User | 스페셜 상품 목록 |
| `/api/product/special/group` | GET | User | 그룹별 스페셜 상품 |

## 주문 (Orders)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/order` | GET | User | 내 주문 목록 |
| `/api/order/[id]` | GET | User | 주문 상세 |
| `/api/order/[id]` | PUT | Admin/Staff | 주문 상태 업데이트 |
| `/api/order/new` | POST | User | 새 주문 생성 |
| `/api/order/coupon` | POST | User | 쿠폰 검증 |
| `/api/home/order` | GET | Admin/Staff | 전체 주문 목록 |

## 결제 (Checkout)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/checkout/stripe` | POST | User | Stripe 결제 |
| `/api/checkout/sslcommerz` | POST | User | SSLCommerz 결제 |
| `/api/checkout/razorpay` | POST | User | Razorpay 결제 |
| `/api/checkout/process_order_ssl` | POST | Public | SSLCommerz 콜백 |

## 프로필 (Profile)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/profile` | GET | User | 프로필 조회 |
| `/api/profile` | PUT | User | 프로필 수정 |
| `/api/profile/address` | GET | User | 주소 목록 |
| `/api/profile/address` | POST | User | 주소 추가 |
| `/api/profile/address` | PUT | User | 주소 수정 |
| `/api/profile/address` | DELETE | User | 주소 삭제 |
| `/api/profile/mypoints` | GET | User | 포인트 조회 |
| `/api/profile/mypoints/history` | GET | User | 포인트 내역 |
| `/api/profile/myspecial` | GET | User | 스페셜 상품 구매 내역 |

## 주소 (Address)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/address` | GET | User | 주소 목록 |
| `/api/address` | POST | User | 주소 추가 |
| `/api/address` | PUT | User | 주소 수정 |
| `/api/address` | DELETE | User | 주소 삭제 |

## 위시리스트 (Wishlist)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/wishlist` | GET | User | 위시리스트 조회 |
| `/api/wishlist` | POST | User | 위시리스트 추가 |
| `/api/wishlist` | DELETE | User | 위시리스트 삭제 |

## 리뷰 (Reviews)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/review` | GET | Admin/Staff | 리뷰 목록 (관리자) |
| `/api/review/list` | GET | Public | 상품 리뷰 목록 |
| `/api/review/new` | POST | User | 리뷰 작성 |
| `/api/review/stats` | GET | Public | 리뷰 통계 |
| `/api/review` | PUT | Admin/Staff | 리뷰 수정 |
| `/api/review` | DELETE | Admin/Staff | 리뷰 삭제 |

## 질문 (Questions)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/question` | GET | Public | 상품 질문 목록 |
| `/api/question` | POST | User | 질문 작성 |
| `/api/question` | PUT | Admin/Staff | 답변 작성 |

## 카테고리 (Categories)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/categories` | GET | Admin/Staff | 카테고리 목록 |
| `/api/categories` | POST | Admin/Staff | 카테고리 생성 |
| `/api/categories/edit` | PUT | Admin/Staff | 카테고리 수정 |
| `/api/categories` | DELETE | Admin/Staff | 카테고리 삭제 |
| `/api/categories/subcategories` | GET | Public | 서브카테고리 목록 |
| `/api/categories/childcategories` | GET | Public | 차일드 카테고리 목록 |
| `/api/categories/form` | GET | Public | 카테고리 폼 필드 |

## 브랜드 (Brands)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/admin/brand` | GET | Admin/Staff | 브랜드 목록 |
| `/api/admin/brand` | POST | Admin/Staff | 브랜드 생성 |
| `/api/admin/brand/edit` | PUT | Admin/Staff | 브랜드 수정 |
| `/api/admin/brand` | DELETE | Admin/Staff | 브랜드 삭제 |

## 속성 (Attributes)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/attributes` | GET | Admin/Staff | 속성 목록 |
| `/api/attributes` | POST | Admin/Staff | 속성 생성 |
| `/api/attributes/edit` | PUT | Admin/Staff | 속성 수정 |
| `/api/attributes` | DELETE | Admin/Staff | 속성 삭제 |

## 색상 (Colors)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/colors` | GET | Admin/Staff | 색상 목록 |
| `/api/colors` | POST | Admin/Staff | 색상 생성 |
| `/api/colors/edit` | PUT | Admin/Staff | 색상 수정 |
| `/api/colors` | DELETE | Admin/Staff | 색상 삭제 |

## 쿠폰 (Coupons)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/coupons` | GET | Admin/Staff | 쿠폰 목록 |
| `/api/coupons` | POST | Admin/Staff | 쿠폰 생성 |
| `/api/coupons/edit` | PUT | Admin/Staff | 쿠폰 수정 |
| `/api/coupons` | DELETE | Admin/Staff | 쿠폰 삭제 |

## 배송 (Shipping)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/shipping` | GET | Admin/Staff | 배송비 조회 |
| `/api/shipping` | PUT | Admin/Staff | 배송비 수정 |

## 그룹 (Groups)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/group` | GET | Admin/Staff | 그룹 목록 |
| `/api/group/create` | POST | Admin/Staff | 그룹 생성 |
| `/api/group/edit` | PUT | Admin/Staff | 그룹 수정 |
| `/api/group/delete` | DELETE | Admin/Staff | 그룹 삭제 |
| `/api/group/user` | GET | Admin/Staff | 그룹 회원 목록 |
| `/api/group/user` | POST | User | 그룹 가입 |
| `/api/group/product` | GET | Public | 그룹 상품 목록 |
| `/api/group/product/list` | GET | Public | 특정 그룹 상품 목록 |

## 환불 (Refunds)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/refund` | GET | User | 내 환불 내역 |
| `/api/refund` | POST | User | 환불 요청 |
| `/api/admin/refund` | GET | Admin/Staff | 전체 환불 목록 |
| `/api/admin/refund` | PUT | Admin/Staff | 환불 처리 |

## 사용자 관리 (Users)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/users` | GET | Admin/Staff | 사용자 목록 |
| `/api/users/search` | GET | Admin/Staff | 사용자 검색 |
| `/api/users/status` | PUT | Admin/Staff | 사용자 상태 변경 |
| `/api/users/level` | GET | Admin/Staff | 레벨 관리 |
| `/api/users/level` | PUT | Admin/Staff | 레벨 수정 |
| `/api/users/point` | GET | Admin/Staff | 포인트 조회 |
| `/api/users/point` | POST | Admin/Staff | 포인트 지급 |
| `/api/users/point/history` | GET | Admin/Staff | 포인트 내역 |
| `/api/users/point/shoppingPoint` | GET | Admin/Staff | Shopping Point 통계 |
| `/api/users/point/withdrawablePoint` | GET | Admin/Staff | Withdrawable Point 통계 |
| `/api/users/rebate` | GET | Admin/Staff | 리베이트 내역 |
| `/api/users/product` | GET | Admin/Staff | 사용자 구매 내역 |
| `/api/users/product/special` | GET | Admin/Staff | 사용자 스페셜 상품 내역 |

## 직원 관리 (Staff)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/staffs` | GET | Admin | 직원 목록 |
| `/api/staffs` | POST | Admin | 직원 추가 |
| `/api/staffs` | PUT | Admin | 직원 수정 |
| `/api/staffs` | DELETE | Admin | 직원 삭제 |

## 페이지 관리 (Pages)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/page` | GET | Admin/Staff | 페이지 컨텐츠 조회 |
| `/api/page` | PUT | Admin/Staff | 페이지 컨텐츠 수정 |
| `/api/page/home` | GET | Admin/Staff | 홈페이지 설정 조회 |
| `/api/page/home` | PUT | Admin/Staff | 홈페이지 설정 수정 |

## 공지사항 (Notices)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/notice` | GET | Public | 공지사항 목록 |
| `/api/notice/[id]` | GET | Public | 공지사항 상세 |
| `/api/notice` | POST | Admin/Staff | 공지사항 생성 |
| `/api/notice/[id]` | PUT | Admin/Staff | 공지사항 수정 |
| `/api/notice/[id]` | DELETE | Admin/Staff | 공지사항 삭제 |

## 이벤트 (Events)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/event` | GET | Public | 이벤트 목록 |
| `/api/event/[id]` | GET | Public | 이벤트 상세 |
| `/api/event` | POST | Admin/Staff | 이벤트 생성 |
| `/api/event/[id]` | PUT | Admin/Staff | 이벤트 수정 |
| `/api/event/[id]` | DELETE | Admin/Staff | 이벤트 삭제 |

## FAQ
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/faq/list` | GET | Public | FAQ 목록 |
| `/api/faq/detail` | GET | Public | FAQ 상세 |
| `/api/faq` | GET | Admin/Staff | FAQ 목록 (관리자) |
| `/api/faq` | POST | Admin/Staff | FAQ 생성 |
| `/api/faq` | PUT | Admin/Staff | FAQ 수정 |
| `/api/faq` | DELETE | Admin/Staff | FAQ 삭제 |

## 뉴스레터 (Newsletter)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/subscribers/new` | POST | Public | 뉴스레터 구독 |
| `/api/subscribers` | GET | Admin/Staff | 구독자 목록 |
| `/api/subscribers` | DELETE | Admin/Staff | 구독자 삭제 |

## 알림 (Notifications)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/notification` | GET | Admin/Staff | 알림 목록 |
| `/api/notification` | POST | Admin/Staff | 알림 생성 |
| `/api/notification` | DELETE | Admin/Staff | 알림 삭제 |

## 설정 (Settings)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/settings` | GET | Admin/Staff | 설정 조회 |
| `/api/settings` | PUT | Admin/Staff | 설정 수정 |

## 대시보드 (Dashboard)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/dashboard` | GET | Admin/Staff | 대시보드 통계 |

## 갤러리 (Gallery)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/gallery` | GET | Public | 갤러리 목록 |
| `/api/gallery/more-product` | GET | Public | 추가 상품 조회 |

## 파일 업로드 (File Upload)
| 엔드포인트 | 메서드 | 권한 | 설명 |
|-----------|--------|------|------|
| `/api/fileupload/local` | POST | Admin/Staff | 로컬 파일 업로드 |
| `/api/fileupload/s3` | POST | Admin/Staff | S3 파일 업로드 |

---

## 권한 레벨

- **Public**: 인증 불필요
- **User**: 로그인 필요
- **Admin/Staff**: 관리자 또는 직원 권한 필요
- **Admin**: 관리자 전용

## API 기본 URL

- **Development**: `http://localhost:8080/api`
- **Production**: `https://yourdomain.com/api`

## 총 API 수

약 **100개**의 API 엔드포인트
