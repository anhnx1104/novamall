import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import classes from "~/components/Checkout/checkout.module.css";
import NewAddress from "~/components/Profile/addressForm";
import HeadData from "~/components/Head";
import GlobalModal from "~/components/Ui/Modal/modal";
import {
  checkPercentage,
  fetchData,
  formatNumber,
  postData,
} from "~/lib/clientFunctions";
import { applyCoupon, resetCart, updateBillingData } from "~/redux/cart.slice";
import SignIn from "~/components/Auth/signin";
import BreadcrumbsCustom from "~/components/Breadcrumbs";
import { formatNumberWithCommaAndFloor } from "~/utils/number";
import { TruckShippingIcon } from "~/components/Ui/Icons/icons";
import ButtonCustom from "~/components/ButtonCustom";

const CheckoutNav = dynamic(() => import("~/components/Checkout/checkoutNav"));
const PaymentGatewayList = dynamic(() =>
  import("~/components/Checkout/paymentGatewayList")
);
const ImageLoader = dynamic(() => import("~/components/Image"));

const Checkout = () => {
  const cartData = useSelector((state) => state.cart);
  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol || "₩";
  const dispatch = useDispatch();
  const router = useRouter();
  const couponCode = useRef("");
  const { session, status } = useSelector((state) => state.localSession);
  const [visibleTab, setVisibleTab] = useState(1);
  const [changeTab, setChangeTab] = useState(false);
  const [sameShippingAddressValue, setSameShippingAddressValue] =
    useState(true);
  const [deliveryInfo, setDeliveryInfo] = useState({});
  const [shippingChargeInfo, setShippingChargeInfo] = useState({});
  const [newCustomer, setNewCustomer] = useState(false);
  const [_address, _setAddress] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [shippingId, setShippingId] = useState("");
  const [hasMainAddress, setHasMainAddress] = useState(false);
  const [preInfo, setPreInfo] = useState({
    billingInfo: {},
    shippingInfo: {},
  });
  const [mainInfo, setMainInfo] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [paymentMethodUI, setPaymentMethodUI] = useState("cash");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const deliveryLocation = useRef();
  const deliveryArea = useRef();
  const infoForm = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    if (status === "unauthenticated") {
      setShowLoginModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function fetchShippingCharge() {
    try {
      const response = await fetchData(`/api/home/shipping`);
      if (response.success) {
        setShippingChargeInfo(response.shippingCharge);
        setMainInfo(response.address);
      } else {
        toast.error("문제가 발생했습니다.");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchAddress() {
    try {
      const response = await fetchData(`/api/profile/address`);
      if (response.success && response.user?.address) {
        _setAddress(response.user.address);
        const resp = response.user.address.find(
          (e) => e.addressType === "main address"
        );
        if (resp) {
          const {
            name,
            email,
            phone,
            house,
            city,
            state,
            zipCode,
            country,
            addressTitle,
          } = resp;
          const data = {
            fullName: name,
            phone,
            email,
            house,
            city,
            state,
            zipCode,
            country,
            addressTitle,
          };
          const preData = {
            billingInfo: data,
            shippingInfo: data,
          };
          setPreInfo(preData);
          setAddressId(resp._id);
          setShippingId(resp._id);
          setHasMainAddress(true);
        }
      } else {
        const { billingInfo, shippingInfo } = cartData;
        setPreInfo({ billingInfo, shippingInfo });
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchShippingCharge();
    fetchAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sameShippingAddress = (e) => {
    const isChecked = e.target.checked;
    setSameShippingAddressValue(isChecked);
    let preData = { ...preInfo };
    preData.shippingInfo = preData.billingInfo;
    setPreInfo(preData);
    setShippingId(addressId);
  };

  function selectInfo(id, type) {
    const resp = _address.find((e) => e._id === id);
    if (resp) {
      const {
        name,
        email,
        phone,
        house,
        city,
        state,
        zipCode,
        country,
        addressTitle,
      } = resp;
      const data = {
        fullName: name,
        phone,
        email,
        house,
        city,
        state,
        zipCode,
        country,
        addressTitle,
      };
      let preData = { ...preInfo };
      preData[type === "billing_address" ? "billingInfo" : "shippingInfo"] =
        data;
      setPreInfo(preData);
      type === "billing_address"
        ? setAddressId(resp._id)
        : setShippingId(resp._id);
    }
  }

  const handleInfoSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!deliveryInfo.cost && !deliveryInfo.area) {
        return toast.warning("배송 정보를 업데이트해주세요.");
      }
      if (!preInfo.billingInfo?.fullName && !preInfo.shippingInfo?.fullName) {
        return toast.warning("결제 정보를 업데이트해주세요.");
      }

      dispatch(
        updateBillingData({
          billingInfo: preInfo.billingInfo,
          shippingInfo: preInfo.shippingInfo,
          deliveryInfo,
        })
      );
      setVisibleTab(2);
      setChangeTab(true);
    } catch (err) {
      console.log(err);
    }
  };

  const setDeliveryLocation = () => {
    const loc = deliveryLocation.current.value;
    if (loc.length > 0) {
      if (loc === "International Delivery") {
        const deliveryData = {
          type: "International Delivery",
          cost: shippingChargeInfo.internationalCost,
          area: null,
        };
        setDeliveryInfo(deliveryData);
      } else {
        const deliveryData = {
          type: "Local Delivery",
          cost: 0,
          area: null,
        };
        setDeliveryInfo(deliveryData);
      }
    }
  };

  const setDeliveryArea = () => {
    const area = deliveryArea.current.value;
    const areaInfo = shippingChargeInfo.area.filter((item) =>
      area.includes(item._id)
    );
    if (area.length > 0) {
      const deliveryData = {
        type: "Local Delivery",
        cost: areaInfo[0]?.price,
        area: areaInfo[0]?.name,
      };
      setDeliveryInfo(deliveryData);
    }
  };

  const decimalBalance = (num) => Math.round(num * 10) / 10;

  const selectPaymentMethod = (e) => setPaymentMethod(e.target.value);

  // Filter only selected items for calculations
  const selectedItems = cartData.items.filter((item) => item.selected);

  const getTotalPrice = decimalBalance(
    selectedItems.reduce(
      (accumulator, item) => accumulator + item.qty * item.price,
      0
    )
  );

  const getSupplyPrice = decimalBalance(
    selectedItems.reduce(
      (accumulator, item) => accumulator + item.qty * item.price,
      0
    ) / 1.1
  );

  const discountPrice = (cartData.coupon.discount / 100) * getTotalPrice;

  const getTotalVat = decimalBalance(
    (selectedItems.reduce(
      (accumulator, item) => accumulator + item.qty * item.price,
      0
    ) /
      1.1) *
      0.1
  );

  const getTotalTax = decimalBalance(
    selectedItems.reduce(
      (accumulator, item) =>
        accumulator + checkPercentage(item.qty * item.price, item.tax),
      0
    )
  );

  const finalPrice =
    getSupplyPrice + getTotalVat + (deliveryInfo.cost || 0) - discountPrice;

  async function processOrder(method) {
    const data = {
      coupon: cartData.coupon,
      products: selectedItems,
      billingInfo: preInfo.billingInfo,
      shippingInfo: preInfo.shippingInfo,
      deliveryInfo,
      paymentData: {
        method: method,
        id: null,
      },
    };
    const url = `/api/order/new`;
    const formData = new FormData();
    formData.append("checkoutData", JSON.stringify(data));
    const response = await postData(url, formData);
    response && response.success
      ? (dispatch(resetCart()),
        toast.success("주문이 성공적으로 완료되었습니다."),
        router.push(`/checkout/success/${response.createdOrder._id}`))
      : toast.error(response.message || "문제가 발생했습니다.");
  }

  const submitOrder = async () => {
    try {
      if (selectedItems.length === 0) {
        return toast.warning("결제할 항목을 최소 하나 이상 선택해주세요.");
      }
      if (!deliveryInfo.cost && !deliveryInfo.area) {
        return toast.warning("배송 정보를 업데이트해주세요.");
      }
      if (!preInfo.billingInfo?.fullName && !preInfo.shippingInfo?.fullName) {
        return toast.warning("결제 정보를 업데이트해주세요.");
      }
      if (paymentMethod === "cod") {
        await processOrder("현금 결제");
      } else if (paymentMethod === "wallet") {
        await processOrder("지갑 결제");
      } else {
        router.push(`/checkout/${paymentMethod}`);
      }
    } catch (err) {
      toast.error(`문제가 발생했습니다. ${err}`);
      console.log(err);
    }
  };

  return (
    <>
      <HeadData title="Checkout" />
      <div className={classes.content_container + " bg_star"}>
        {/* Addres */}
        <div className={classes.card}>
          <div className={classes.cardTitle}>배송지</div>
          <div className={classes.addressContent}>
            <div className={classes.addressHeader}>
              <div className={classes.addressTitle}>집</div>
              <button className={classes.addressChangeBtn}>배송지 변경</button>
            </div>

            <div className={classes.addressInfo}>
              <div className={classes.addressSub}>홍길동 | 010-1234-5678</div>
              <div className={classes.addressDetail}>
                서울특별시 강남구 테헤란로 111, 2층 221호 | 15844
              </div>
            </div>

            <select className={classes.addressSelect}>
              <option value="">추가 요청사항을 선택해주세요</option>
            </select>
          </div>
        </div>
        {/* Ordered Items */}
        <div className={classes.card}>
          <div className={classes.cardTitle}>주문 상품</div>
          <div className={classes.orderedItemsContent}>
            <div className={classes.orderedItem}>
              <div className={classes.shop}>
                판매자이름노바샵
                <p className={classes.truck}>
                  <TruckShippingIcon />
                  <span>무료배송</span>
                </p>
              </div>
              <div className={classes.productList}>
                {Array.from({ length: 2 }).map((item, idx) => (
                  <div className={classes.productItem} key={item + idx}>
                    <div className={classes.productHeader}>
                      <div className={classes.productImage}>
                        <img
                          src={"/images/product_ex.png"}
                          alt={"title"}
                          width={97}
                          height={97}
                        />
                      </div>
                      <div className={classes.productName}>
                        MLB 뉴욕양키스 볼캡 모자 32CPHL111-50L
                      </div>
                    </div>
                    <div className={classes.productBody}>
                      <p className={classes.tagPoint}>
                        <span>옵션</span>
                        색상: 3종 / 사이즈: 66 | 5개
                      </p>
                      <p className={classes.discount}>
                        <span className={classes.oldPrice}>110,002원</span>
                        <span className={classes.newPrice}>89,002원</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={classes.orderedItem}>
              <div className={classes.shop}>
                판매자이름노바샵
                <p className={classes.truck}>
                  <TruckShippingIcon />
                  <span>무료배송</span>
                </p>
              </div>
              <div className={classes.productList}>
                {Array.from({ length: 2 }).map((item, idx) => (
                  <div className={classes.productItem} key={item + idx}>
                    <div className={classes.productHeader}>
                      <div className={classes.productImage}>
                        <img
                          src={"/images/product_ex.png"}
                          alt={"title"}
                          width={97}
                          height={97}
                        />
                      </div>
                      <div className={classes.productName}>
                        MLB 뉴욕양키스 볼캡 모자 32CPHL111-50L
                      </div>
                    </div>
                    <div className={classes.productBody}>
                      <p className={classes.tagPoint}>
                        <span>옵션</span>
                        색상: 3종 / 사이즈: 66 | 5개
                      </p>
                      <p className={classes.discount}>
                        <span className={classes.oldPrice}>110,002원</span>
                        <span className={classes.newPrice}>89,002원</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Coupon */}
        <div className={classes.card}>
          <div className={classes.cardTitle}>포인트</div>
          <div className={classes.couponContent}>
            <div className={classes.couponTitle}>사용가능 포인트 </div>
            <div className={classes.couponSubtitle}>
              <div className={classes.summary}>
                출금 포인트 <span>1,000 원</span>
              </div>
              <div className={classes.summary}>
                쇼핑 포인트 <span>3,000 원</span>
              </div>
            </div>

            {/* Item 1 */}
            <div className={classes.itemContainer}>
              <div className={classes.item}>
                <span className={classes.label}>출금 포인트</span>
                <span className={classes.value}>1,000원</span>
                <button className={classes.clearBtn}>
                  <IconX />
                </button>
              </div>
              <button className={classes.useBtn}>전액사용</button>
            </div>

            {/* Item 2 */}
            <div className={classes.itemContainer}>
              <div className={classes.item}>
                <span className={classes.label}>쇼핑 포인트</span>
                <span className={classes.value}>3,000원</span>
                <button className={classes.clearBtn}>
                  <IconX />
                </button>
              </div>
              <button className={classes.useBtn}>전액사용</button>
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className={classes.card}>
          <div className={classes.cardTitle}>결제수단</div>
          <div className={classes.paymentMethodContent}>
            <div className={classes.paymentMethodItem}>
              결제 방법 <span>카드 결제</span>
            </div>
          </div>
        </div>

        <div className={classes.totalContainer}>
          <div className={classes.totalContent + " custom_container"}>
            <p>약관 및 주문 내용을 확인하였으며, 정보 제공 등에 동의합니다</p>
            <div className={classes.totalBtn}>
              <ButtonCustom
                text="150,000원 결제하기"
                variant="primary"
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={classes.top}>
        <div className={classes.card}>
          <div className="custom_container">
            <div className="row">
              <div className="col-lg-8 pb-5">
                {/* <CheckoutNav
                  tab={visibleTab}
                  setTab={setVisibleTab}
                  changeTab={changeTab}
                /> */}
                {/* shipping, billing and delivery form */}
                <form
                  className={classes.checkout_form}
                  onSubmit={handleInfoSubmit}
                  ref={infoForm}
                  style={{ display: visibleTab === 1 ? "block" : "none" }}
                >
                  {/* <div className={classes.box}>{deliveryTypeJsx()}</div>
                  <div className={classes.box}>
                    {billingInfoJsx()}
                    {!sameShippingAddressValue && shippingInfoJsx()}
                    <button type="submit">{t("continue")}</button>
                  </div> */}
                  <div className={""}>{billingDetailsJsx()}</div>
                  <div className={""} style={{ mt: "12px" }}>
                    {shippingInfoJsx()}
                  </div>
                  {/* <div className={""}>{shippingAddressJsx()}</div> */}
                  <div className={""}>{shippingMethodJsx()}</div>
                  {/* <div className={""}>{paymentMethodJsx()}</div> */}
                  <button
                    className="button-primary"
                    style={{
                      width: "148px",
                      borderRadius: "8px",
                      marginTop: "12px",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      submitOrder();
                    }}
                  >
                    결제하기
                  </button>
                </form>
                {/* Payment form */}
                <div
                  className={classes.checkout_form}
                  style={{ display: visibleTab === 2 ? "block" : "none" }}
                >
                  <div className={classes.box}>
                    <PaymentGatewayList
                      selectPaymentMethod={selectPaymentMethod}
                      submitOrder={submitOrder}
                      settings={settings.settingsData.paymentGateway}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-4 pb-5">
                <div className={classes.box}>{reviewJsx()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GlobalModal
        isOpen={newCustomer}
        handleCloseModal={() => {
          setNewCustomer(false);
          fetchAddress();
        }}
      >
        <NewAddress hasMainAddress={hasMainAddress} />
      </GlobalModal>
      {showLoginModal && (
        <div className={classes.overlay}>
          <SignIn
            popup
            hidePopup={() => {
              setShowLoginModal(false);
              router.reload();
            }}
          />
        </div>
      )}
    </>
  );

  function reviewJsx() {
    const validateCoupon = (data) => {
      const coupon = {
        code: data.code,
        discount: data.discount,
      };
      dispatch(applyCoupon(coupon));
    };

    const checkCoupon = async () => {
      try {
        const data = await postData("/api/order/coupon", {
          code: couponCode.current.value.trim(),
        });
        data && data.success
          ? (toast.success("쿠폰이 성공적으로 적용되었습니다."),
            validateCoupon(data))
          : toast.error("쿠폰 코드가 유효하지 않습니다.");
      } catch (err) {
        console.log(err);
        toast.error("문제가 발생했습니다.");
      }
    };
    return (
      <div>
        <h5 className="mt-3">{t("주문 요약")} :</h5>
        <div className={classes.cart_item_list}>
          <table className="table">
            <thead className={classes.cart_item_header}>
              <tr>
                <th></th>
                <th className="text-end"></th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item, index) => (
                <tr className={classes.cart_item} key={index}>
                  <td>
                    <div className={classes.cart_container}>
                      <span className={classes.cart_image}>
                        <ImageLoader
                          src={item.image[0]?.url}
                          height={64}
                          width={56}
                          alt={item.name}
                          style={{
                            width: "100%",
                          }}
                        />
                      </span>
                      <span className={classes.cart_disc}>
                        <div
                          style={{
                            display: "flex",
                            alighnItems: "center",
                            fontSize: "14px",
                            gap: "6px",
                          }}
                        >
                          <p className={classes.cart_title}>{item.name}</p>
                          {"     "} x{item.qty}
                        </div>

                        {item.color.name && (
                          <span>Color: {item.color.name}</span>
                        )}
                        {item.attribute.name && (
                          <span>{`${item.attribute.for}: ${item.attribute.name}`}</span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td>{decimalBalance(item.price)}원</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className={classes.priceTable}>
            <tbody>
              <tr>
                <td>
                  합계 ({" "}
                  {selectedItems.reduce((acc, item) => acc + item.qty, 0)}개 ):
                </td>
                <td colSpan="2"></td>
                <td className="text-end">
                  {currencySymbol}
                  {formatNumberWithCommaAndFloor(decimalBalance(getTotalPrice))}
                </td>
              </tr>

              <tr>
                <td className="">{t("할인")}:</td>
                <td colSpan="2"></td>
                <td className="text-end">
                  -{currencySymbol}
                  {formatNumberWithCommaAndFloor(
                    decimalBalance(discountPrice || 0)
                  )}
                </td>
              </tr>
              <tr>
                <td className="">{t("배송비")}:</td>
                <td colSpan="2"></td>
                <td className="text-end">
                  {currencySymbol}
                  {formatNumberWithCommaAndFloor(
                    decimalBalance(deliveryInfo.cost || 0)
                  )}
                </td>
              </tr>
              <tr>
                <td className="">{t("공급가액")}:</td>
                <td colSpan="2"></td>
                <td className="text-end">
                  {currencySymbol}
                  {formatNumberWithCommaAndFloor(
                    decimalBalance(getSupplyPrice || 0)
                  )}
                </td>
              </tr>

              <tr>
                <td className="">{t("부가세")}:</td>
                <td colSpan="2"></td>
                <td className="text-end">
                  {currencySymbol}
                  {formatNumberWithCommaAndFloor(
                    decimalBalance(getTotalVat || 0)
                  )}
                </td>
              </tr>

              <tr>
                <td className="">{t("총 합계")}:</td>
                <td colSpan="2"></td>
                <td className="text-end fw-bold">
                  {currencySymbol}
                  {formatNumberWithCommaAndFloor(decimalBalance(finalPrice))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* <div className="input-group mt-3">
          <input
            type="text"
            ref={couponCode}
            defaultValue={cartData.coupon.code}
            className="form-control p-auto"
            placeholder={t("please_enter_promo_code")}
          />
          <div className="input-group-append">
            <button onClick={checkCoupon}>{t("apply_discount")}</button>
          </div>
        </div> */}
      </div>
    );
  }

  function shippingInfoJsx() {
    return (
      <div className="mt-4">
        <div className="mb-3">
          <h5>배송 정보</h5>
          <div className={classes.payment_list}>
            {_address.map((x, i) => (
              <label className={classes.payment_card_label} key={i}>
                <input
                  type="radio"
                  name="shipping_address"
                  value={x._id}
                  defaultChecked={x._id === shippingId}
                  onChange={() => selectInfo(x._id, "shipping_address")}
                />
                <div
                  className={`${classes.payment_card} ${classes.address_card}`}
                >
                  <span>{x.name}</span>
                  <span>{x.phone}</span>
                  <span>{`${x.city} ${x.state} ${x.house} ${x.zipCode}`}</span>
                  {x.addressType === "main address" && (
                    <div className="badge bg-primary">default</div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function billingDetailsJsx() {
    return (
      <div className={classes.billingDetails}>
        <div className="mb-3">
          <h5 className={classes.checkoutTitle}>{t("구매하기")}</h5>
          <h6 style={{ marginBottom: "40px" }}>{t("결제 세부 정보")}</h6>
          <div>
            <div className={`${classes.flex} ${classes.formRowContainer}`}>
              <div className={classes.flexForm}>
                <label className={classes.labelForm}>
                  고객명<span>*</span>
                </label>
                <input
                  className={classes.inputForm}
                  type="text"
                  value={mainInfo.name || ""}
                  onChange={(e) => {
                    setMainInfo({ ...mainInfo, name: e.target.value });
                  }}
                />
              </div>
              <div className={classes.flexForm}>
                <label className={classes.labelForm}>
                  전화번호<span>*</span>
                </label>
                <input
                  className={classes.inputForm}
                  type="text"
                  value={mainInfo.phone || ""}
                  onChange={(e) => {
                    setMainInfo({ ...mainInfo, phone: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  function shippingAddressJsx() {
    return (
      <div className={`${classes.shippingAdress}`}>
        <div className="mb-3">
          <h6 style={{ marginBottom: "12px", padding: "40px 0 0" }}>
            {t("배송지 주소")}
          </h6>
          <p
            style={{
              fontWeight: "400",
              color: "#3C4242",
              marginBottom: "20px",
            }}
          >
            카드 또는 결제 수단과 일치하는 주소를 선택합니다.{" "}
          </p>
          <div className={classes.shippingAdressContainer}>
            <div className="py-2 form-check border-bottom">
              <input
                type="radio"
                name="shippingAddress"
                className="form-check-input"
                id="shipAdd1"
                value={"same"}
                checked={sameShippingAddressValue}
                onChange={(e) => {
                  setSameShippingAddressValue(true);
                  const newPreInfo = { ...preInfo };
                  newPreInfo.shippingInfo = { ...newPreInfo.billingInfo };
                  setPreInfo(newPreInfo);
                }}
              />
              <label className="form-check-label" htmlFor="shipAdd1">
                {t("청구지 주소와 동일")}
              </label>
            </div>
            <div className="py-2 form-check">
              <input
                type="radio"
                name="shippingAddress"
                className="form-check-input"
                id="shipAdd2"
                value={"different"}
                checked={!sameShippingAddressValue}
                onChange={(e) => {
                  setSameShippingAddressValue(false);
                }}
              />
              <label className="form-check-label" htmlFor="shipAdd2">
                {t("다른 배송지 주소 사용")}
              </label>
            </div>
          </div>
          {!sameShippingAddressValue && (
            <div className="mt-4">
              <div className={`${classes.flex} ${classes.formRowContainer}`}>
                <div className={classes.flexForm}>
                  <label className={classes.labelForm}>
                    고객명<span>*</span>
                  </label>
                  <input
                    className={classes.inputForm}
                    type="text"
                    value={preInfo.shippingInfo?.fullName || ""}
                    onChange={(e) => {
                      const newPreInfo = { ...preInfo };
                      newPreInfo.shippingInfo = {
                        ...newPreInfo.shippingInfo,
                        fullName: e.target.value,
                      };
                      setPreInfo(newPreInfo);
                    }}
                  />
                </div>
                <div className={classes.flexForm}>
                  <label className={classes.labelForm}>
                    전화번호<span>*</span>
                  </label>
                  <input
                    className={classes.inputForm}
                    type="text"
                    value={preInfo.shippingInfo?.phone || ""}
                    onChange={(e) => {
                      const newPreInfo = { ...preInfo };
                      newPreInfo.shippingInfo = {
                        ...newPreInfo.shippingInfo,
                        phone: e.target.value,
                      };
                      setPreInfo(newPreInfo);
                    }}
                  />
                </div>
              </div>
              <div className={`${classes.flex} ${classes.formRowContainer}`}>
                <div className={classes.flexForm}>
                  <label className={classes.labelForm}>
                    국가/지역<span>*</span>
                  </label>
                  <input
                    className={classes.inputForm}
                    type="text"
                    value={preInfo.shippingInfo?.country || ""}
                    onChange={(e) => {
                      const newPreInfo = { ...preInfo };
                      newPreInfo.shippingInfo = {
                        ...newPreInfo.shippingInfo,
                        country: e.target.value,
                      };
                      setPreInfo(newPreInfo);
                    }}
                  />
                </div>
                <div className={classes.flexForm}>
                  <label className={classes.labelForm}>주소</label>
                  <input
                    className={classes.inputForm}
                    type="text"
                    value={preInfo.shippingInfo?.house || ""}
                    onChange={(e) => {
                      const newPreInfo = { ...preInfo };
                      newPreInfo.shippingInfo = {
                        ...newPreInfo.shippingInfo,
                        house: e.target.value,
                      };
                      setPreInfo(newPreInfo);
                    }}
                  />
                </div>
              </div>
              <div className={`${classes.flex} ${classes.formRowContainer}`}>
                <div className={classes.flexForm}>
                  <label className={classes.labelForm}>
                    주소<span>*</span>
                  </label>
                  <input
                    className={classes.inputForm}
                    type="text"
                    value={preInfo.shippingInfo?.state || ""}
                    onChange={(e) => {
                      const newPreInfo = { ...preInfo };
                      newPreInfo.shippingInfo = {
                        ...newPreInfo.shippingInfo,
                        state: e.target.value,
                      };
                      setPreInfo(newPreInfo);
                    }}
                  />
                </div>
                <div className={classes.flexForm}>
                  <label className={classes.labelForm}>
                    상세주소<span>*</span>
                  </label>
                  <input
                    className={classes.inputForm}
                    type="text"
                    value={preInfo.shippingInfo?.city || ""}
                    onChange={(e) => {
                      const newPreInfo = { ...preInfo };
                      newPreInfo.shippingInfo = {
                        ...newPreInfo.shippingInfo,
                        city: e.target.value,
                      };
                      setPreInfo(newPreInfo);
                    }}
                  />
                </div>
                <div className={classes.flexForm}>
                  <label className={classes.labelForm}>
                    우편번호<span>*</span>
                  </label>
                  <input
                    className={classes.inputForm}
                    type="text"
                    value={preInfo.shippingInfo?.zipCode || ""}
                    onChange={(e) => {
                      const newPreInfo = { ...preInfo };
                      newPreInfo.shippingInfo = {
                        ...newPreInfo.shippingInfo,
                        zipCode: e.target.value,
                      };
                      setPreInfo(newPreInfo);
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  function shippingMethodJsx() {
    return (
      <div className={`${classes.shippingMethod}`}>
        <div className="mb-3">
          <h6 style={{ marginBottom: "12px", padding: "40px 0 0" }}>
            {t("배송 방법")}
          </h6>
          <div className={classes.shippingAdressContainer}>
            <div
              className={`${classes.flex} pt-4 align-items-start justify-content-between`}
            >
              <p
                style={{
                  fontWeight: "600",
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: 0,
                }}
              >
                배송 비용
                <span style={{ fontWeight: "400", color: "#807D7E" }}>
                  추가 요금이 적용될 수 있습니다{" "}
                </span>
              </p>
              <p style={{ fontWeight: "bold", marginBottom: 0 }}>
                {currencySymbol}
                {deliveryInfo.cost ? decimalBalance(deliveryInfo.cost) : 0}
              </p>
            </div>
            <div className="mt-4">
              <select
                className="form-control mb-3"
                defaultValue=""
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "International Delivery") {
                    const deliveryData = {
                      type: "International Delivery",
                      cost: shippingChargeInfo.internationalCost || 0,
                      area: null,
                    };
                    setDeliveryInfo(deliveryData);
                    dispatch(
                      updateBillingData({
                        billingInfo: preInfo.billingInfo,
                        shippingInfo: preInfo.shippingInfo,
                        deliveryInfo: deliveryData,
                      })
                    );
                  } else if (value === "Local Delivery") {
                    const deliveryData = {
                      type: "Local Delivery",
                      cost: 0,
                      area: "Korea",
                    };
                    setDeliveryInfo(deliveryData);
                    dispatch(
                      updateBillingData({
                        billingInfo: preInfo.billingInfo,
                        shippingInfo: preInfo.shippingInfo,
                        deliveryInfo: deliveryData,
                      })
                    );
                  }
                }}
              >
                <option value="" disabled>
                  {t("배송 방법 선택")}*
                </option>
                <option value="International Delivery">국제 배송</option>
                <option value="Local Delivery">국내 배송</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
  function paymentMethodJsx() {
    return (
      <div
        className={`${classes.shippingMethod}`}
        style={{ borderBottom: "none" }}
      >
        <div className="mb-3">
          <h6 style={{ marginBottom: "12px", padding: "40px 0 0" }}>
            {t("결제 방법")}
          </h6>
          <p
            style={{
              fontWeight: "400",
              color: "#3C4242",
              marginBottom: "20px",
            }}
          >
            모든 거래는 안전하게 암호화됩니다.{" "}
          </p>
          <div className={classes.shippingAdressContainer}>
            <div className={`${classes.flex} ${classes.paymentItem}`}>
              <input
                type="radio"
                name="paymentMethod"
                className="form-check-input"
                id="creditCard"
                value={"credit"}
                defaultChecked={paymentMethodUI === "credit"}
                onChange={(e) => {
                  setPaymentMethodUI("credit");
                  setPaymentMethod("credit");
                }}
              />
              <label className="form-check-label" htmlFor="creditCard">
                {t("신용 카드")} <br />
                <span
                  style={{
                    color: "#3C4242",
                  }}
                >
                  We accept all major credit cards.
                </span>
              </label>
            </div>
            {paymentMethodUI === "credit" && (
              <div>
                <ImageLoader
                  src={`${process.env.NEXT_PUBLIC_URL}/images/paymentMethod.png`}
                  alt="Credit Card"
                  width={380}
                  height={46}
                  style={{
                    marginBottom: "38px",
                    width: "100%",
                    height: "auto",
                    maxWidth: "380px",
                  }}
                />
                <div className={`${classes.flex} ${classes.formRowContainer}`}>
                  <div className={classes.flexForm}>
                    <label className={classes.labelForm}>
                      카드 소지자 이름
                    </label>
                    <input
                      className={classes.inputForm}
                      type="text"
                      value={"홍길동"}
                    />
                  </div>
                  <div className={classes.flexForm}>
                    <label className={classes.labelForm}>카드 번호</label>
                    <input
                      className={classes.inputForm}
                      type="text"
                      value={"1234567890123456"}
                    />
                  </div>
                </div>
                <div className={`${classes.flex} ${classes.formRowContainer}`}>
                  <div className={classes.flexForm}>
                    <label className={classes.labelForm}>유효기간</label>
                    <input
                      className={classes.inputForm}
                      type="text"
                      value={"10/30"}
                    />
                  </div>
                  <div className={classes.flexForm}>
                    <label className={classes.labelForm}>CVC</label>
                    <input
                      className={classes.inputForm}
                      type="text"
                      value={"***"}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className={`${classes.flex} ${classes.paymentItem}`}>
              <input
                type="radio"
                name="paymentMethod"
                className="form-check-input"
                id="cash"
                value={"cash"}
                onChange={(e) => {
                  setPaymentMethodUI("cash");
                  setPaymentMethod("cod");
                }}
              />
              <label className="form-check-label" htmlFor="cash">
                {t("착불 결제")} <br />
                <span
                  style={{
                    color: "#3C4242",
                  }}
                >
                  배달 시 현금으로 지불하세요.
                </span>
              </label>
            </div>
            <div className={`${classes.flex} ${classes.paymentItem}`}>
              <input
                type="radio"
                name="paymentMethod"
                className="form-check-input"
                id="paypol"
                value={"paypol"}
                onChange={(e) => {
                  setPaymentMethodUI("paypol");
                  setPaymentMethod("paypal");
                }}
              />
              <label className="form-check-label" htmlFor="paypol">
                {t("Paypol")} <br />
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
  function billingInfoJsx() {
    return (
      <div>
        {session && (
          <button
            className={classes.updateButton}
            onClick={() => setNewCustomer(true)}
            type="button"
          >
            {t("add_address")}
          </button>
        )}
        <div className="mb-3">
          <h5 className={classes.top_space}>{t("billing_info")}</h5>
          <div className={classes.payment_list}>
            {_address.map((x, i) => (
              <label className={classes.payment_card_label} key={i}>
                <input
                  type="radio"
                  name="billing_address"
                  value={x._id}
                  defaultChecked={x._id === addressId}
                  onChange={() => selectInfo(x._id, "billing_address")}
                />
                <div
                  className={`${classes.payment_card} ${classes.address_card}`}
                >
                  <span>{x.name}</span>
                  <span>{x.phone}</span>
                  <span>{`${x.city} ${x.state} ${x.house} ${x.zipCode}`}</span>
                  {x.addressType === "main address" && (
                    <div className="badge bg-primary">default</div>
                  )}
                </div>
              </label>
            ))}
          </div>
          <div className="py-2 mt-4 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="Check1"
              onClick={sameShippingAddress}
            />
            <label className="form-check-label" htmlFor="Check1">
              {t("shipping_address_same_as_billing_address")}
            </label>
          </div>
        </div>
      </div>
    );
  }

  function deliveryTypeJsx() {
    return (
      <div>
        <div className="mb-3">
          <div className={classes.input}>
            <h5>{t("select_delivery_type")}*</h5>
            <select
              className="form-control mb-3"
              defaultValue=""
              onChange={setDeliveryLocation}
              ref={deliveryLocation}
            >
              <option value="" disabled>
                {t("select_delivery_type")}*
              </option>
              <option value="International Delivery">국제 배송</option>
              <option value="Local Delivery">국내 배송</option>
            </select>
            {deliveryInfo.type && deliveryInfo.type === "Local Delivery" && (
              <div>
                <label>{t("select_delivery_area")}*</label>
                <select
                  className="form-control mb-3"
                  defaultValue=""
                  onChange={setDeliveryArea}
                  ref={deliveryArea}
                >
                  <option value="" disabled>
                    {t("select_delivery_area")}*
                  </option>
                  {shippingChargeInfo.area.map((ct, idx) => (
                    <option value={ct._id} key={idx}>
                      {ct.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};
Checkout.headerBack = true;
Checkout.headerBackText = "결제하기";
export default Checkout;
const IconX = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="22" height="22" rx="11" fill="#949494" />
    <path
      d="M6.8 16.25L5.75 15.2L9.95 11L5.75 6.8L6.8 5.75L11 9.95L15.2 5.75L16.25 6.8L12.05 11L16.25 15.2L15.2 16.25L11 12.05L6.8 16.25Z"
      fill="white"
    />
  </svg>
);
