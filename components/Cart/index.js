import dynamic from "next/dynamic";
import { Basket3 } from "@styled-icons/bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { checkPercentage, formatNumber, postData } from "~/lib/clientFunctions";
import {
  applyCoupon,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  toggleItemSelection,
  selectAllItems,
} from "~/redux/cart.slice";
import ImageLoader from "../Image";
import classes from "./cartPage.module.css";
import { useTranslation } from "react-i18next";
import ButtonCustom from "../ButtonCustom";
import Checkbox from "../Ui/Form/Checkbox/checkbox";
import { CloseIcon } from "../Ui/Icons/icons";
import RelatedProductSection from "./relatedProducts";

const CartPage = () => {
  const couponCode = useRef("");
  const cart = useSelector((state) => state.cart);
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const router = useRouter();
  const { session } = useSelector((state) => state.localSession);
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("전체상품");
  const decimalBalance = (num) => Math.round(num * 10) / 10;

  // Filter only selected items for calculations
  const selectedItems = cart.items.filter((item) => item.selected);

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

  const discountPrice = decimalBalance(
    (cart.coupon.discount / 100) * getTotalPrice
  );

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

  const finalPrice = getSupplyPrice + getTotalVat - discountPrice;
  const checkMaxQty = (uid) => {
    const product = cart.items.find((item) => item.uid === uid);
    if (product && product.quantity === -1) {
      return true;
    }
    return product && product.quantity >= product.qty + 1;
  };

  const increaseQty = (uid) => {
    if (checkMaxQty(uid)) {
      dispatch(incrementQuantity(uid));
    } else {
      toast.error("해당 상품이 품절되었습니다.");
    }
  };

  const decreaseQty = (uid) => {
    dispatch(decrementQuantity(uid));
  };

  const validateCoupon = (data) => {
    const coupon = {
      code: data.code,
      discount: data.discount,
    };
    dispatch(applyCoupon(coupon));
  };

  const checkCoupon = async () => {
    try {
      const code = couponCode.current.value.trim();
      if (!code) {
        toast.error("쿠폰 코드를 입력하세요");
        return;
      }

      const data = await postData("/api/order/coupon", { code });

      if (data && data.success) {
        toast.success('"쿠폰이 적용되었습니다"');
        validateCoupon(data);
      } else {
        toast.error("잘못된 쿠폰 코드입니다");
        // Reset coupon in Redux state to ensure it's properly canceled
        dispatch(applyCoupon({ code: "", discount: 0 }));
      }
    } catch (err) {
      console.log(err);
      toast.error("쿠폰적용에 문제가 발생했습니다");
      // Also reset coupon on error
      dispatch(applyCoupon({ code: "", discount: 0 }));
    }
  };

  const checkoutProcess = () => {
    if (selectedItems.length === 0) {
      toast.info("구매할 상품을 선택하세요");
      return;
    }

    if (settings.settingsData.security.loginForPurchase && !session) {
      toast.info("로그인 후 구매가 가능합니다.");
      router.push("/signin");
    } else {
      router.push("/checkout");
    }
  };

  // Handle select all items
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Check if all items are selected
    const allSelected =
      cart.items.length > 0 && cart.items.every((item) => item.selected);
    setSelectAll(allSelected);
  }, [cart.items]);

  // useEffect(() => {
  //   document.querySelector("footer").style.paddingBottom = "76px";
  // }, []);

  const handleSelectAll = () => {
    const newSelectAllState = !selectAll;
    setSelectAll(newSelectAllState);
    dispatch(selectAllItems(newSelectAllState));
  };

  const handleSelectItem = (uid) => {
    dispatch(toggleItemSelection(uid));
  };

  if (cart.items.length === 0) {
    return (
      <div
        className={
          classes.content_container + " bg_star " + classes.emptyContainer
        }
      >
        <div className={classes.cartHeader}>
          <div className="custom_container">
            {/* Filter */}
            <div className={classes.filters}>
              <div className={classes.filterContainer}>
                <div
                  className={`${classes.filterItem} ${
                    activeFilter === "전체상품" ? classes.active : ""
                  }`}
                  onClick={() => setActiveFilter("전체상품")}
                >
                  <span>전체상품</span>
                </div>
                <div className={classes.filterDivider}></div>
                <div
                  className={`${classes.filterItem} ${
                    activeFilter === "특별상품" ? classes.active : ""
                  }`}
                  onClick={() => setActiveFilter("특별상품")}
                >
                  <span>특별상품</span>
                </div>
                <div className={classes.filterDivider}></div>
                <div
                  className={`${classes.filterItem} ${
                    activeFilter === "일반상품" ? classes.active : ""
                  }`}
                  onClick={() => setActiveFilter("일반상품")}
                >
                  <span>일반상품</span>
                </div>
              </div>
            </div>
            {/* Address */}
            <div className={classes.address}>
              <div className={classes.addressTitle}>
                <IconAddress /> 배송지 : 집
                <span>서울특별시 강남구 구로 1, 10호</span>
              </div>
              <button className={classes.addressButton}>
                {t("배송지 변경")}
              </button>
            </div>
          </div>
        </div>
        <div className={classes.bodyContainer + " custom_container"}>
          <div className={classes.card + " " + classes.empty}>
            <h1>{t("장바구니에 담긴 상품이 없습니다.")}</h1>
            <h3>{t("원하는 상품을 장바구니에 담아보세요!")}</h3>
            <button
              className={classes.buttonEmpty}
              onClick={() => router.back()}
            >
              {t("쇼핑 계속하기")}
            </button>
          </div>
          <div className={classes.card + " " + classes.relatedProducts}>
            <RelatedProductSection title="비슷한 다른 상품" id="similar" />
            <div className={classes.paginationMobile}>10개 더보기</div>
          </div>
          <div className={classes.card + " " + classes.relatedProducts}>
            <RelatedProductSection title="비슷한 다른 상품" id="similar2" />
            <div className={classes.paginationMobile}>10개 더보기</div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={classes.content_container + " bg_star"}>
      <div className={classes.cartHeader}>
        <div className="custom_container">
          {/* Filter */}
          <div className={classes.filters}>
            <div className={classes.filterContainer}>
              <div
                className={`${classes.filterItem} ${
                  activeFilter === "전체상품" ? classes.active : ""
                }`}
                onClick={() => setActiveFilter("전체상품")}
              >
                <span>전체상품</span>
              </div>
              <div className={classes.filterDivider}></div>
              <div
                className={`${classes.filterItem} ${
                  activeFilter === "특별상품" ? classes.active : ""
                }`}
                onClick={() => setActiveFilter("특별상품")}
              >
                <span>특별상품</span>
              </div>
              <div className={classes.filterDivider}></div>
              <div
                className={`${classes.filterItem} ${
                  activeFilter === "일반상품" ? classes.active : ""
                }`}
                onClick={() => setActiveFilter("일반상품")}
              >
                <span>일반상품</span>
              </div>
            </div>
          </div>
          {/* Address */}
          <div className={classes.address}>
            <div className={classes.addressTitle}>
              <IconAddress /> 배송지 : 집
              <span>서울특별시 강남구 구로 1, 10호</span>
            </div>
            <button className={classes.addressButton}>
              {t("배송지 변경")}
            </button>
          </div>
          {/* Header action */}
          <div className={classes.headerAction}>
            <Checkbox
              label={t("전체선택")}
              value={selectAll}
              checked={selectAll}
              onChange={() => handleSelectAll()}
            />
            <button className={classes.deleteAllButton} onClick={() => {}}>
              전체 삭제
            </button>
          </div>
        </div>
      </div>
      <div className={classes.bodyContainer + " custom_container"}>
        {cart.items.filter((item) => item.isSpecial).length > 0 && (
          <div className={classes.card + " " + classes.specialProducts}>
            <div className={classes.cardHeader}>
              <Checkbox
                label={t("특별상품")}
                value={selectAll}
                checked={selectAll}
                onChange={() => handleSelectAll()}
              />
            </div>

            {cart.items.filter((item) => item.isSpecial).length > 0 && (
              <div className={classes.cardBody}>
                {cart.items
                  .filter((item) => item.isSpecial)
                  .map((item) => (
                    <div key={item.uid} className={classes.cardContent}>
                      <div className={classes.productContainer}>
                        <Checkbox
                          value={item.selected}
                          checked={item.selected}
                          onChange={() => handleSelectItem(item.uid)}
                        />
                        <div className={classes.itemProduct}>
                          <div className={classes.left}>
                            <div className={classes.productImage}>
                              <img
                                src={"/images/product_ex.png"}
                                alt={"title"}
                                width={100}
                                height={100}
                              />
                            </div>
                            <div className={classes.info}>
                              <p className={classes.title}>
                                MLB 뉴욕양키스 볼캡 모자 32CPHL111-50L
                              </p>
                              <div className={classes.priceBox}>
                                <p className={classes.tagPoint}>
                                  <span>옵션</span>
                                  색상: 3종 / 사이즈: 66 | 5개
                                </p>
                                <p className={classes.discount}>
                                  <span className={classes.newPrice}>
                                    89,002원
                                  </span>
                                  <span className={classes.oldPrice}>
                                    110,002원
                                  </span>
                                </p>
                              </div>
                            </div>
                            <button
                              className={classes.deleteProduct}
                              onClick={() => dispatch(removeFromCart(item.uid))}
                            >
                              <CloseIcon fill="var(--text-757575)" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className={classes.productButtonsContainer}>
                        <div className={classes.productNameMobile}>
                          {item.name}
                        </div>
                        <div
                          className={classes.productButtons}
                          data-name="Actions"
                        >
                          <button
                            className={classes.btn}
                            onClick={() => decreaseQty(item.uid)}
                          >
                            -
                          </button>
                          <span className={classes.qty}>{item.qty}</span>
                          <button
                            className={classes.btn}
                            onClick={() => increaseQty(item.uid)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className={classes.deliveryFeeContainer}>
                        <div className={classes.deliveryFee}>
                          <span>배송비</span>
                          <span>3,002원</span>
                        </div>
                      </div>
                      <div
                        className={
                          classes.deliveryFeeContainer +
                          " " +
                          classes.priceContainer
                        }
                      >
                        <div className={classes.deliveryFee}>
                          <span>상품금액</span>
                          <span>
                            {formatNumber(
                              decimalBalance(item.qty * item.price)
                            )}
                            원
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
        {/* General products */}
        {cart.items.filter((item) => !item.isSpecial).length > 0 && (
          <div className={classes.card + " " + classes.specialProducts}>
            <div className={classes.cardHeader}>
              <Checkbox
                label={t("일반상품")}
                value={selectAll}
                checked={selectAll}
                onChange={() => handleSelectAll()}
              />
            </div>

            {cart.items.filter((item) => !item.isSpecial).length > 0 && (
              <div className={classes.cardBody}>
                {cart.items
                  .filter((item) => !item.isSpecial)
                  .map((item) => (
                    <div key={item.uid} className={classes.cardContent}>
                      <div className={classes.productContainer}>
                        <Checkbox
                          value={item.selected}
                          checked={item.selected}
                          onChange={() => handleSelectItem(item.uid)}
                        />
                        <div className={classes.itemProduct}>
                          <div className={classes.left}>
                            <div className={classes.productImage}>
                              <img
                                src={"/images/product_ex.png"}
                                alt={"title"}
                                width={100}
                                height={100}
                              />
                            </div>
                            <div className={classes.info}>
                              <p className={classes.title}>
                                MLB 뉴욕양키스 볼캡 모자 32CPHL111-50L
                              </p>
                              <div className={classes.priceBox}>
                                <p className={classes.tagPoint}>
                                  <span>옵션</span>
                                  색상: 3종 / 사이즈: 66 | 5개
                                </p>
                                <p className={classes.discount}>
                                  <span className={classes.newPrice}>
                                    89,002원
                                  </span>
                                  <span className={classes.oldPrice}>
                                    110,002원
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          className={classes.deleteProduct}
                          onClick={() => dispatch(removeFromCart(item.uid))}
                        >
                          <CloseIcon fill="var(--text-757575)" />
                        </button>
                      </div>

                      <div className={classes.productButtonsContainer}>
                        <div className={classes.productNameMobile}>
                          {item.name}
                        </div>
                        <div
                          className={classes.productButtons}
                          data-name="Actions"
                        >
                          <button
                            className={classes.btn}
                            onClick={() => decreaseQty(item.uid)}
                          >
                            -
                          </button>
                          <span className={classes.qty}>{item.qty}</span>
                          <button
                            className={classes.btn}
                            onClick={() => increaseQty(item.uid)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className={classes.deliveryFeeContainer}>
                        <div className={classes.deliveryFee}>
                          <span>배송비</span>
                          <span>3,002원</span>
                        </div>
                      </div>
                      <div
                        className={
                          classes.deliveryFeeContainer +
                          " " +
                          classes.priceContainer
                        }
                      >
                        <div className={classes.deliveryFee}>
                          <span>상품금액</span>
                          <span>
                            {formatNumber(
                              decimalBalance(item.qty * item.price)
                            )}
                            원
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        <div className={classes.card + " " + classes.notice}>
          <p>장바구니에 최대 200개의 상품을 담을 수 있습니다.</p>
          <p>장바구니 상품은 최대 90일간 저장됩니다</p>
          <p>
            장바구니에 담긴 상품은 옵션 또는 추가상품 단위로 최대 100개의 상품만
            동시 주문할 수 있습니다.
          </p>
          <p>가격, 옵션 등 정보가 변경된 경우 주문이 불가할 수 있습니다.</p>
          <p>
            오늘출발 정보는 판매자가 설정한 정보에 의해 제공되며, 물류위탁
            상품인 경우 물류사의 사정에 따라 실제와 다를 수 있습니다.
          </p>
          <p>
            일부 상품의 경우 카드 할부기간이 카드사 제공 기간보다 적게 제공될 수
            있습니다.
          </p>
          <p>
            장바구니에 보여지는 배송비는 최종적으로 발생하는 배송비가 아니며,
            주문 주소지에 따라 도서산간 비용 등이 추가 발생할 수 있습니다.
          </p>
        </div>
        <div className={classes.card + " " + classes.relatedProducts}>
          <RelatedProductSection title="비슷한 다른 상품" id="similar" />
          <div className={classes.paginationMobile}>10개 더보기</div>
        </div>
        <div className={classes.card + " " + classes.relatedProducts}>
          <RelatedProductSection title="비슷한 다른 상품" id="similar2" />
          <div className={classes.paginationMobile}>10개 더보기</div>
        </div>
      </div>
      <div className={classes.totalContainer}>
        <div className={classes.totalContent + " custom_container"}>
          <p>
            총 {selectedItems.length}건 주문금액{" "}
            <span>{formatNumber(decimalBalance(finalPrice))}원</span>
          </p>
          <div className={classes.totalBtn}>
            <ButtonCustom
              text="주문하기"
              variant="primary"
              onClick={checkoutProcess}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

const IconAddress = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7.99935 1.24967C6.56276 1.24967 5.18501 1.82036 4.16919 2.83618C3.15336 3.852 2.58268 5.22975 2.58268 6.66634C2.58268 8.76521 3.94603 10.7897 5.42282 12.3485C6.14929 13.1153 6.87774 13.7428 7.42522 14.1788C7.65333 14.3604 7.8492 14.5081 7.99935 14.6182C8.1495 14.5081 8.34537 14.3604 8.57347 14.1788C9.12096 13.7428 9.84941 13.1153 10.5759 12.3485C12.0527 10.7897 13.416 8.76521 13.416 6.66634C13.416 5.22975 12.8453 3.852 11.8295 2.83618C10.8137 1.82036 9.43594 1.24967 7.99935 1.24967ZM7.99935 15.333C7.67577 15.8184 7.67545 15.8182 7.67545 15.8182L7.67365 15.817L7.66936 15.8141L7.65438 15.8039C7.64161 15.7953 7.6233 15.7827 7.59983 15.7665C7.55291 15.734 7.48531 15.6865 7.4 15.6249C7.22943 15.5017 6.98769 15.3217 6.69847 15.0914C6.12096 14.6315 5.34941 13.9674 4.57588 13.1509C3.05267 11.543 1.41602 9.23414 1.41602 6.66634C1.41602 4.92033 2.10961 3.24584 3.34423 2.01122C4.57884 0.776607 6.25334 0.0830078 7.99935 0.0830078C9.74536 0.0830078 11.4199 0.776607 12.6545 2.01122C13.8891 3.24584 14.5827 4.92033 14.5827 6.66634C14.5827 9.23414 12.946 11.543 11.4228 13.1509C10.6493 13.9674 9.87774 14.6315 9.30022 15.0914C9.011 15.3217 8.76926 15.5017 8.5987 15.6249C8.51338 15.6865 8.44579 15.734 8.39886 15.7665C8.3754 15.7827 8.35709 15.7953 8.34431 15.8039L8.32934 15.8141L8.32504 15.817L8.32371 15.8178C8.32371 15.8178 8.32292 15.8184 7.99935 15.333ZM7.99935 15.333L8.32292 15.8184C8.12698 15.949 7.87139 15.9488 7.67545 15.8182L7.99935 15.333Z"
      fill="var(--purple)"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7.99935 1.24967C6.56276 1.24967 5.18501 1.82036 4.16919 2.83618C3.15336 3.852 2.58268 5.22975 2.58268 6.66634C2.58268 8.76521 3.94603 10.7897 5.42282 12.3485C6.14929 13.1153 6.87774 13.7428 7.42522 14.1788C7.65333 14.3604 7.8492 14.5081 7.99935 14.6182C8.1495 14.5081 8.34537 14.3604 8.57347 14.1788C9.12096 13.7428 9.84941 13.1153 10.5759 12.3485C12.0527 10.7897 13.416 8.76521 13.416 6.66634C13.416 5.22975 12.8453 3.852 11.8295 2.83618C10.8137 1.82036 9.43594 1.24967 7.99935 1.24967ZM7.99935 4.08301C6.57261 4.08301 5.41602 5.23961 5.41602 6.66634C5.41602 8.09308 6.57261 9.24967 7.99935 9.24967C9.42608 9.24967 10.5827 8.09308 10.5827 6.66634C10.5827 5.23961 9.42608 4.08301 7.99935 4.08301Z"
      fill="var(--purple)"
    />
  </svg>
);
