# Checkout APIs

결제 처리 관련 API입니다.

## 엔드포인트 목록

- `POST /api/checkout/stripe` - Stripe 결제
- `POST /api/checkout/sslcommerz` - SSLCommerz 결제
- `POST /api/checkout/razorpay` - Razorpay 결제
- `POST /api/checkout/process_order_ssl` - SSLCommerz 콜백 처리

---

## POST /api/checkout/stripe

Stripe를 통한 결제를 처리합니다.

### 권한
- **User** (로그인 필요)

### Request Body
```json
{
  "orderId": "ORD-20240101-001",
  "amount": 23000,
  "currency": "krw",
  "paymentMethodId": "pm_1234567890"
}
```

### Response

#### 성공
```json
{
  "success": true,
  "paymentIntent": {
    "id": "pi_1234567890",
    "status": "succeeded",
    "amount": 23000,
    "currency": "krw"
  },
  "order": {
    "_id": "...",
    "orderId": "ORD-20240101-001",
    "paymentStatus": "paid",
    "paymentId": "pi_1234567890"
  }
}
```

#### 실패
```json
{
  "success": false,
  "error": "Payment failed"
}
```

### Stripe 클라이언트 설정
```javascript
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)
    });

    if (!error) {
      const response = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderId,
          amount: totalAmount,
          currency: "krw",
          paymentMethodId: paymentMethod.id
        })
      });

      const data = await response.json();
      if (data.success) {
        // 결제 성공
        router.push(`/checkout/success/${orderId}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        결제하기
      </button>
    </form>
  );
}
```

### 환경 변수
```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
```

---

## POST /api/checkout/sslcommerz

SSLCommerz를 통한 결제를 처리합니다.

### 권한
- **User** (로그인 필요)

### Request Body
```json
{
  "orderId": "ORD-20240101-001",
  "amount": 23000,
  "currency": "BDT",
  "customerInfo": {
    "name": "홍길동",
    "email": "hong@example.com",
    "phone": "01012345678"
  }
}
```

### Response
```json
{
  "success": true,
  "gatewayUrl": "https://sandbox.sslcommerz.com/gwprocess/v4/...",
  "sessionKey": "ABC123XYZ789"
}
```

### 클라이언트 리다이렉트
```javascript
const response = await fetch("/api/checkout/sslcommerz", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    orderId: orderId,
    amount: totalAmount,
    currency: "BDT",
    customerInfo: {
      name: user.name,
      email: user.email,
      phone: user.phone
    }
  })
});

const data = await response.json();
if (data.success) {
  // SSLCommerz 결제 페이지로 리다이렉트
  window.location.href = data.gatewayUrl;
}
```

### 환경 변수
```env
SSLCOMMERZ_STORE_ID=...
SSLCOMMERZ_STORE_PASSWORD=...
SSLCOMMERZ_IS_LIVE=false
```

---

## POST /api/checkout/process_order_ssl

SSLCommerz 결제 완료 콜백을 처리합니다.

### 권한
- **Public** (SSLCommerz 서버에서 호출)

### Request Body (SSLCommerz에서 전송)
```json
{
  "val_id": "...",
  "status": "VALID",
  "tran_id": "ORD-20240101-001",
  "amount": "23000.00",
  "currency": "BDT",
  "card_type": "VISA",
  "card_no": "411111XXXXXX1111"
}
```

### 처리 흐름
1. SSLCommerz로부터 콜백 수신
2. 결제 검증 (Validation API 호출)
3. 주문 상태 업데이트 (`paymentStatus: "paid"`)
4. 사용자에게 성공 페이지 리다이렉트

---

## POST /api/checkout/razorpay

Razorpay를 통한 결제를 처리합니다.

### 권한
- **User** (로그인 필요)

### Request Body
```json
{
  "orderId": "ORD-20240101-001",
  "amount": 23000,
  "currency": "INR",
  "razorpayPaymentId": "pay_1234567890",
  "razorpayOrderId": "order_1234567890",
  "razorpaySignature": "..."
}
```

### Response
```json
{
  "success": true,
  "order": {
    "_id": "...",
    "orderId": "ORD-20240101-001",
    "paymentStatus": "paid",
    "paymentId": "pay_1234567890"
  }
}
```

### Razorpay 클라이언트 설정
```javascript
import { useRazorpay } from "react-razorpay";

function Checkout() {
  const Razorpay = useRazorpay();

  const handlePayment = async () => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: totalAmount * 100, // paise 단위
      currency: "INR",
      name: "Novamall",
      description: `Order ${orderId}`,
      order_id: razorpayOrderId,
      handler: async function (response) {
        // 결제 성공 콜백
        const result = await fetch("/api/checkout/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderId,
            amount: totalAmount,
            currency: "INR",
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature
          })
        });

        const data = await result.json();
        if (data.success) {
          router.push(`/checkout/success/${orderId}`);
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  };

  return <button onClick={handlePayment}>Pay with Razorpay</button>;
}
```

### 환경 변수
```env
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
```

---

## COD (Cash on Delivery)

COD는 별도의 결제 API 호출이 필요 없습니다. 주문 생성 시 `paymentMethod: "cod"`로 설정하면 됩니다.

```javascript
const order = await fetch("/api/order/new", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    ...orderData,
    paymentMethod: "cod"
  })
});
```

주문 상태는 `paymentStatus: "unpaid"`로 유지되며, 배송 완료 후 수동으로 `paid`로 변경합니다.

---

## 결제 게이트웨이 활성화

결제 게이트웨이는 Settings에서 활성화/비활성화할 수 있습니다.

```javascript
// Settings 조회
const settings = await fetch("/api/home/settings");
const data = await settings.json();

if (data.settings.paymentGateway.stripe) {
  // Stripe 결제 옵션 표시
}

if (data.settings.paymentGateway.sslCommerz) {
  // SSLCommerz 결제 옵션 표시
}

if (data.settings.paymentGateway.razorpay) {
  // Razorpay 결제 옵션 표시
}

if (data.settings.paymentGateway.cod) {
  // COD 옵션 표시
}
```

---

## 결제 프로세스

### 1. 주문 생성
```javascript
POST /api/order/new
```

### 2. 결제 처리
선택한 결제 방법에 따라:
- Stripe: `POST /api/checkout/stripe`
- SSLCommerz: `POST /api/checkout/sslcommerz`
- Razorpay: `POST /api/checkout/razorpay`
- COD: 결제 API 호출 없음

### 3. 결제 완료 확인
```javascript
GET /api/order/[id]
```

`paymentStatus`가 `"paid"`인지 확인

### 4. 성공 페이지
```javascript
router.push(`/checkout/success/${orderId}`);
```

---

## 보안 고려사항

1. **API Key 보안**: 환경 변수로 관리, 클라이언트에 노출 금지
2. **금액 검증**: 서버에서 주문 금액 재계산하여 검증
3. **Webhook 검증**: 결제 게이트웨이의 웹훅 서명 검증
4. **HTTPS**: 프로덕션 환경에서는 HTTPS 필수
5. **PCI DSS**: 카드 정보를 직접 다루지 않음 (결제 게이트웨이가 처리)

---

## 테스트 카드 (개발 환경)

### Stripe
- 카드 번호: `4242 4242 4242 4242`
- 만료일: 미래 날짜
- CVC: 임의의 3자리 숫자

### Razorpay
- 카드 번호: `4111 1111 1111 1111`
- 만료일: 미래 날짜
- CVV: 임의의 3자리 숫자

### SSLCommerz
테스트 환경에서는 실제 카드 없이 테스트 가능
