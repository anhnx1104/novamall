import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "~/components/Ui/Spinner";
import { postData } from "~/lib/clientFunctions";
import { resetCart } from "~/redux/cart.slice";
import classes from "~/styles/payment.module.css";

export default function RazorPay() {
  const [loading, setLoading] = useState(false);
  const cartData = useSelector((state) => state.cart);
  const settings = useSelector((state) => state.settings);
  const exchangeRate = Number(settings.settingsData.currency.exchangeRate);
  const dispatch = useDispatch();
  const router = useRouter();
  const processOrder = async (id) => {
    try {
      const { coupon, items, billingInfo, shippingInfo, deliveryInfo } =
        cartData;
      const data = {
        coupon,
        products: items,
        billingInfo,
        shippingInfo,
        deliveryInfo,
        paymentData: {
          method: "Razorpay",
          id,
        },
      };
      const url = `/api/order/new`;
      const formData = new FormData();
      formData.append("checkoutData", JSON.stringify(data));
      const responseData = await postData(url, formData);
      if (responseData && responseData.success) {
        dispatch(resetCart());
        toast.success("주문이 성공적으로 완료되었습니다.");
        setTimeout(() => {
          router.push(`/checkout/success/${responseData.createdOrder._id}`);
        }, 2000);
      } else {
        toast.error("문제가 발생했습니다.");
      }
    } catch (err) {
      toast.error(`문제가 발생했습니다. ${err.message}`);
      console.log(err);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const createPayment = async () => {
    if (cartData.items.length === 0) {
      toast.error(
        "잘못된 요청입니다. 결제 전에 장바구니에 항목을 추가해주세요."
      );
      return;
    }
    setLoading(true);
    const res = await loadRazorpay();
    setLoading(false);
    if (!res) {
      toast.error("Razorpay SDK 로드에 실패했습니다.");
      return;
    }

    const data = await postData(`/api/checkout/razorpay`, {
      cartData,
      exchangeRate,
    });

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      name: settings.settingsData.name,
      currency: data.currency,
      amount: data.amount,
      order_id: data.id,
      description: `${settings.settingsData.name} 거래`,
      image: settings.settingsData.logo[0].url,
      handler: async function (response) {
        toast.success("결제가 성공적으로 완료되었습니다!");
        await processOrder(response.razorpay_payment_id);
      },
      prefill: {
        name: cartData.billingInfo.fullName,
        email: cartData.billingInfo.email,
        contact: cartData.billingInfo.phone,
      },
      theme: {
        color: settings.settingsData.color.primary,
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      toast.error(
        `결제가 실패했습니다. 다시 시도해주세요. - ${response.error.reason}`
      );
    });
  };

  return (
    <>
      <div className="layout_top">
        <div className="App text-center">
          {loading && (
            <div style={{ height: "70vh" }}>
              <Spinner />
            </div>
          )}
          {!loading && (
            <div className={classes.container}>
              <h2 className={classes.h2}>Pay Now</h2>
              <button
                className="btn btn-primary fw-bold"
                onClick={createPayment}
              >
                Pay with Razorpay
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

RazorPay.footer = false;
