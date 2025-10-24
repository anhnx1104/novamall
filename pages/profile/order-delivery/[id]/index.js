import HeadData from "~/components/Head";
import classes from "./orderDetail.module.css";
import CollapseBox from "~/components/CollapseBox/collapseBox";
import { useTranslation } from "react-i18next";
import { TruckShippingIcon } from "~/components/Ui/Icons/icons";
import ButtonCustom from "~/components/ButtonCustom";

const OrderDeliveryDetail = () => {
  const { t } = useTranslation();
  return (
    <>
      <HeadData title="Order Delivery Detail" />
      <div className={classes.content_container + " bg_star"}>
        <div className={classes.card + " " + classes.orderInfo}>
          <div className={classes.order}>
            <span>2025.08.29. 16:15:45</span>
            <span className={classes.orderNumber}>
              주문번호 2025082918162751
            </span>
          </div>
          <button className={classes.orderBtn}>영수증</button>
        </div>
        <div className={classes.card}>
          <CollapseBox
            header="주문 상품"
            show={true}
            content={
              <div className={classes.productsContent}>
                <div className={classes.orderList}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div className={classes.orderItem} key={index}>
                      <div className={classes.shop}>
                        판매자이름노바샵
                        <p className={classes.truck}>
                          <TruckShippingIcon />
                          <span>무료배송</span>
                        </p>
                      </div>
                      <div className={classes.orderItemHeader}>
                        <div className={classes.orderItemHeaderInfo}>
                          <span>취소완료</span>
                          <span>구매확정일 2025. 5. 11. (일) </span>
                        </div>
                      </div>
                      <div className={classes.itemProduct}>
                        <div className={classes.left}>
                          <div className={classes.productImage}>
                            <img
                              src={"/images/product_ex.png"}
                              alt={"title"}
                              width={97}
                              height={97}
                            />
                          </div>
                          <div className={classes.info}>
                            <p className={classes.productPoint}>
                              5.2. 02:20 주문
                            </p>
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

                        {index < 2 && (
                          <div className={classes.note}>
                            취소사유 : 주문 실수
                          </div>
                        )}

                        <div className={classes.actions}>
                          {index < 2 && (
                            <>
                              <button
                                className={
                                  classes.actionBtn +
                                  " " +
                                  classes.borderRadiusLeft +
                                  " " +
                                  classes.borderRightNone
                                }
                              >
                                {t("장바구니 담기")}
                              </button>
                              <button
                                className={
                                  classes.actionBtn +
                                  " " +
                                  classes.borderRadiusRight
                                }
                              >
                                {t("바로 구매")}
                              </button>
                            </>
                          )}
                          {index >= 2 && (
                            <>
                              <button
                                className={
                                  classes.actionBtn +
                                  " " +
                                  classes.borderRadiusLeft +
                                  " " +
                                  classes.borderRightNone
                                }
                              >
                                {t("구매 확정")}
                              </button>
                              <button
                                className={
                                  classes.actionBtn +
                                  " " +
                                  classes.borderRightNone
                                }
                              >
                                {t("교환 요청")}
                              </button>
                              <button
                                className={
                                  classes.actionBtn +
                                  " " +
                                  classes.borderRadiusRight
                                }
                              >
                                {t("반품 요청")}
                              </button>
                              <button
                                className={
                                  classes.actionBtn +
                                  " " +
                                  classes.borderRadiusLeft +
                                  " " +
                                  classes.borderRightNone
                                }
                              >
                                {t("배송조회")}
                              </button>
                              <button
                                className={
                                  classes.actionBtn +
                                  " " +
                                  classes.borderRightNone
                                }
                              >
                                {t("장바구니 담기")}
                              </button>
                              <button
                                className={
                                  classes.actionBtn +
                                  " " +
                                  classes.borderRadiusRight
                                }
                              >
                                {t("바로 구매")}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={classes.addCart}>
                  <ButtonCustom
                    text={t("장바구니 담기")}
                    onClick={() => {}}
                    variant={"primary"}
                    className={classes.actionBtn}
                  />
                </div>
              </div>
            }
          />
        </div>
        <div className={classes.card}>
          <div className={classes.cardTitle}>배송지</div>
          <div className={classes.addressContent}>
            <div className={classes.addressHeader}>
              <div className={classes.addressTitle}>집</div>
            </div>

            <div className={classes.addressInfo}>
              <div className={classes.addressSub}>홍길동 | 010-1234-5678</div>
              <div className={classes.addressDetail}>
                서울특별시 강남구 테헤란로 111, 2층 221호 | 15844
              </div>
            </div>

            <div className={classes.addressNote}>
              배송메세지 : 문앞에 놓아주세요
            </div>
          </div>
        </div>
        <div className={classes.card}>
          <CollapseBox
            header="결제정보"
            show={true}
            content={
              <div className={classes.collapseContent}>
                <div className={classes.priceContent}>
                  <div className={classes.priceTitle}>
                    사용가능 포인트{" "}
                    <span>
                      총 <strong>21,700</strong>원
                    </span>
                  </div>
                  <div className={classes.priceSubtitle}>
                    <div className={classes.summary}>
                      상품 금액 <span>1,000 원</span>
                    </div>
                    <div className={classes.summary}>
                      배송비 <span>3,000 원</span>
                    </div>
                    <div className={classes.summary}>
                      포인트 할인 <span>-100 원</span>
                    </div>
                  </div>
                  <div className={classes.method}>
                    <div className={classes.methodTitle}>결제 방법</div>
                    <div className={classes.methodContent}>카드 결제</div>
                  </div>
                </div>
              </div>
            }
          />
        </div>
        <div className={classes.card}>
          <CollapseBox
            header="환불정보"
            show={true}
            content={
              <div className={classes.collapseContent}>
                <div className={classes.priceContent}>
                  <div className={classes.priceTitle}>
                    사용가능 포인트{" "}
                    <span>
                      총 <strong>21,700</strong>원
                    </span>
                  </div>
                  <div className={classes.priceSubtitle}>
                    <div className={classes.summary}>
                      환불 상품금액 <span>3,000 원</span>
                    </div>
                    <div className={classes.summary}>
                      차감금액<span>(-)0원</span>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default OrderDeliveryDetail;
OrderDeliveryDetail.headerBack = true;
OrderDeliveryDetail.headerBackText = "주문 상세 정보";
