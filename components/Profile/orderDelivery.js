import { Trash3 } from "@styled-icons/bootstrap";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import { deleteData, fetchData, formatNumber } from "~/lib/clientFunctions";
import { updateWishlist } from "~/redux/cart.slice";
import Spinner from "../Ui/Spinner";
import Product from "../Shop/Product/product";
import ProductDetails from "../Shop/Product/productDetails";
import styles from "./orderDelivery.module.css";
import ImageLoader from "../Image";
import { X } from "@styled-icons/bootstrap";
import PaginationCustom from "../PaginationCustom";
import {
  DeleteIcon,
  IconArrowBack,
  IconFreeShipping,
  IconSuccess,
  IconWarning,
  TruckShippingIcon,
} from "../Ui/Icons/icons";
import { useTranslation } from "react-i18next";
import ActionMore from "./ButtonActionMore/actionMore";
import ButtonCustom from "../ButtonCustom";
import Popup from "../Popup/popup";
import StarRating from "../Ui/StarRating/starRating";
import popupClasses from "~/components/Popup/popup.module.css";
import classes from "~/styles/pages.module.css";
import CheckboxCustom from "../Ui/CheckboxCustom/checkboxCustom";
import SelectCustom from "../Ui/SelectCustom";

const StepProgress = ({ steps, currentStep }) => {
  // Define gradient colors for each step transition
  const getGradientForStep = (step) => {
    switch (step) {
      case 1:
        return "linear-gradient(to right, #8b5cf6, #8b5cf6)";
      case 2:
        return "linear-gradient(to right, #8b5cf6, #5e7fd4)";
      case 3:
        return "linear-gradient(to right, #5e7fd4, #39b8b5)";
      case 4:
        return "linear-gradient(to right, #39b8b5, #14b8a6)";
      default:
        return "linear-gradient(to right, #8b5cf6, #5e7fd4, #39b8b5, #14b8a6)";
    }
  };

  return (
    <div className={styles.wrapperStep}>
      <div className={styles.lineWrapper}>
        <div className={styles.lineBg}></div>

        <div
          className={styles.lineActive}
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            background: getGradientForStep(currentStep),
          }}
        ></div>

        <div className={styles.dots}>
          {steps.map((_, i) => {
            const isActive = i + 1 <= currentStep;
            return (
              <div
                key={i}
                className={`${styles.dot} ${isActive ? styles.dotActive : ""}`}
              />
            );
          })}
        </div>
      </div>

      {/* Labels */}
      <div className={styles.labels}>
        {steps.map((step, i) => (
          <span
            key={i}
            className={`${styles.label} ${
              i + 1 <= currentStep ? styles.labelActive : ""
            }`}
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
};

const ManageOrderDelivery = (props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [category, setCategory] = useState("all");

  // 리뷰 작성 POPUP
  const [openReview, setOpenReview] = useState(false);
  const [files, setFiles] = useState([
    "어쩌구저쩌구1",
    "어쩌구저쩌구2",
    "어쩌구저쩌구3",
    "어쩌구저쩌구4",
    "어쩌구저쩌구5",
  ]);
  const [detail, setDetail] = useState("");

  // 파일 업로드 핸들러
  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = selectedFiles.filter((file) => {
      const validTypes = ["image/jpeg", "image/jpg", "image/gif", "image/png"];
      const isValidType = validTypes.includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (validFiles.length + files.length > 5) {
      alert("최대 5개의 파일만 업로드 가능합니다.");
      return;
    }

    setFiles((prevFiles) => [
      ...prevFiles,
      ...validFiles.map((file) => file.name),
    ]);
  };
  const handleFileSelect = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg,image/jpg,image/gif,image/png";
    fileInput.multiple = true;
    fileInput.onchange = handleFileUpload;
    fileInput.click();
  };

  // 교환 요청 POPUP
  const [openExchange, setOpenExchange] = useState(false);
  const [openExchangeConfirm, setOpenExchangeConfirm] = useState(false);
  const [exchangeStep, setExchangeStep] = useState(1);
  const [reasonExchange, setReasonExchange] = useState("파손 및 불량");
  const [detailExchange, setDetailExchange] = useState("");
  const [exchangeMethod, setExchangeMethod] = useState("방문 수거");
  const [detailExchangeMethod, setDetailExchangeMethod] = useState("");
  const RowExchange = ({ label, value, children, last, fullLabel }) => {
    return (
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #e8ecef",
          alignItems: "center",
          ...(last && {
            borderBottom: "none",
          }),
        }}
        className={popupClasses.rowContainer}
      >
        <div
          style={{
            flex: "0 0 150px",
            color: "var(--text-757575)",
            backgroundColor: "var(--bg-white-cool)",
            padding: "16px",
            borderRight: "1px solid #e8ecef",
            fontSize: "14px",
            "@media (max-width: 550px)": {
              flex: "0 0 100%",
            },
          }}
          className={fullLabel ? popupClasses.rowLabel : ""}
        >
          {label}
        </div>
        {value ? (
          <div
            style={{
              flex: 1,
              backgroundColor: "var(--white)",
              padding: "16px",
              fontSize: "14px",
              color: "var(--text-121212)",
            }}
            className={popupClasses.rowValue}
          >
            <span>{value}</span>
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              backgroundColor: "var(--white)",
              fontSize: "14px",
              color: "var(--text-121212)",
            }}
            className={classes.rowChildren}
          >
            {children}
          </div>
        )}
      </div>
    );
  };

  const ProductInfo = () => {
    return (
      <div
        style={{
          padding: "42px 20px",
          display: "flex",
          alignItems: "start",
          gap: "26px",
          background: "#fff",
        }}
        className={popupClasses.productInfo}
      >
        <div
          style={{
            width: "68px",
            height: "68px",
            background: "#fff",
          }}
        >
          <img
            src="/images/product_ex.png"
            alt="product_image"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className={popupClasses.productInfoText}>
          <h4
            style={{
              fontWeight: "500",
              fontSize: "16px",
              textAlign: "center",
              marginBottom: "12px",
            }}
          >
            MLB 뉴욕양키스 볼캡 모자 32CPHL111-50L
          </h4>
          <p
            style={{
              color: "var(--text-121212)",
              fontSize: "12px",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                fontWeight: "400",
                fontSize: "12px",
                padding: "4px",
                background: "#fff",
                border: "1px solid var(--stroke-button)",
                borderRadius: "2px",
                marginRight: "8px",
                color: "var(--text-757575)",
              }}
            >
              옵션
            </span>
            색상: 3종 / 사이즈: 66 | 5개
          </p>
          <p
            style={{
              color: "var(--text-757575)",
              fontWeight: "600",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              marginBottom: "0",
            }}
          >
            <IconFreeShipping />
            무료배송
          </p>
        </div>
      </div>
    );
  };

  // 취소 요청 POPUP
  const [openCancel, setOpenCancel] = useState(false);
  const [openCancelConfirm, setOpenCancelConfirm] = useState(false);
  const [cancelStep, setCancelStep] = useState(1);
  const [reasonCancel, setReasonCancel] = useState("서비스 불만족");
  const [detailCancel, setDetailCancel] = useState("");

  const RowCancel = ({ label, value, children, last, fullLabel }) => {
    return (
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #e8ecef",
          alignItems: "start",
          padding: "20px 32px",
          ...(last && {
            borderBottom: "none",
          }),
        }}
        className={popupClasses.rowContainer}
      >
        <div
          style={{
            flex: "0 0 120px",
            color: "var(--text-757575)",
            fontSize: "14px",
          }}
          className={fullLabel ? popupClasses.rowLabel : ""}
        >
          {label}
        </div>
        {value ? (
          <div
            style={{
              flex: 1,
              backgroundColor: "var(--white)",
              fontSize: "14px",
              color: "var(--text-121212)",
            }}
            className={popupClasses.rowValue}
          >
            <span>{value}</span>
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              backgroundColor: "var(--white)",
              fontSize: "14px",
              color: "var(--text-121212)",
            }}
            className={popupClasses.rowChildren}
          >
            {children}
          </div>
        )}
      </div>
    );
  };
  // 반품 요청 POPUP
  const [openReturn, setOpenReturn] = useState(false);
  const [openReturnConfirm, setOpenReturnConfirm] = useState(false);
  const [returnStep, setReturnStep] = useState(1);
  const [reasonReturn, setReasonReturn] = useState("파손 및 불량");
  const [detailReturn, setDetailReturn] = useState("");
  const [returnMethod, setReturnMethod] = useState("방문 수거");
  const [paymentMethod, setPaymentMethod] = useState("카드결제");
  const [detailReturnMethod, setDetailReturnMethod] = useState("");

  const steps = [
    { label: "발송준비" },
    { label: "배송시작" },
    { label: "배송중" },
    { label: "배송완료" },
  ];

  return (
    <>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2>{t("주문/배송내역")}</h2>
        </div>

        {/* Search */}
        <div className={styles.searchBox}>
          <input type="text" placeholder={t("검색어를 입력하세요")} />
          <button>{t("검색하기")}</button>
        </div>

        <div className={styles.orderCategory}>
          {[
            { label: "전체", value: "all" },
            { label: "배송중", value: "shipping" },
            { label: "배송완료", value: "delivered" },
            { label: "주문취소", value: "cancelled" },
            { label: "반품요청", value: "return" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setCategory(item.value)}
              className={category === item.value ? styles.active : ""}
            >
              {item.label}
            </button>
          ))}
        </div>
        {/* List Order */}
        <div className={styles.orderList}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div className={styles.orderItem} key={index}>
              <div className={styles.orderItemHeader}>
                <div className={styles.orderItemHeaderInfo}>
                  <span>구매확정완료</span>
                  <span>주문 번호 : ORD-2024-001 </span>
                </div>
                <p
                  className={styles.detailButton}
                  onClick={() => {
                    router.push(`/profile/order-delivery/${index}`);
                  }}
                >
                  상세보기
                  <span>
                    <IconArrowBack fill="var(--text-949494)" />
                  </span>
                </p>
              </div>
              <div className={styles.itemProduct}>
                <div className={styles.left}>
                  <div className={styles.productImage}>
                    <img
                      src={"/images/product_ex.png"}
                      alt={"title"}
                      width={97}
                      height={97}
                    />
                  </div>
                  <div className={styles.info}>
                    <p className={styles.productPoint}>5.2. 02:20 주문</p>
                    <p className={styles.title}>
                      MLB 뉴욕양키스 볼캡 모자 32CPHL111-50L
                    </p>
                    <div className={styles.priceBox}>
                      <p className={styles.tagPoint}>
                        <span>옵션</span>
                        색상: 3종 / 사이즈: 66 | 5개
                      </p>
                      <p className={styles.discount}>
                        <span className={styles.newPrice}>89,002원</span>
                      </p>
                    </div>
                  </div>
                </div>
                <StepProgress steps={steps} currentStep={2} />

                <div className={styles.actions}>
                  {index == 0 && (
                    <>
                      <button
                        className={styles.actionBtn}
                        onClick={() => setOpenReview(true)}
                      >
                        {t("리뷰쓰기")}
                      </button>
                      <button className={styles.actionBtn}>
                        {t("영수증 조회")}
                      </button>
                    </>
                  )}
                  {index > 0 && (
                    <>
                      <button className={styles.actionBtn}>
                        {t("구매확정")}
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => setOpenReturn(true)}
                      >
                        {t("반품요청")}
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => setOpenCancel(true)}
                      >
                        {t("취소 요청")}
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => setOpenExchange(true)}
                      >
                        {t("교환요청")}
                      </button>
                    </>
                  )}
                  <ActionMore />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          {/* Popup Review */}
          <Popup
            open={openReview}
            onClose={() => setOpenReview(false)}
            content={
              <div>
                <div
                  style={{
                    borderBottom: "1px solid #E8ECEF",
                    padding: "42px 0 60px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      marginBottom: "24px",
                      background: "#fff",
                    }}
                  >
                    <img
                      src="/images/product_ex.png"
                      alt="product_image"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                  <h4
                    style={{
                      fontWeight: "500",
                      fontSize: "16px",
                      textAlign: "center",
                      marginBottom: "12px",
                    }}
                  >
                    MLB 뉴욕양키스 볼캡 모자 32CPHL111-50L
                  </h4>
                  <p
                    style={{
                      color: "var(--text-121212)",
                      fontSize: "12px",
                      marginBottom: "42px",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "400",
                        fontSize: "12px",
                        padding: "4px",
                        background: "#fff",
                        border: "1px solid var(--stroke-button)",
                        borderRadius: "2px",
                        marginRight: "8px",
                        color: "var(--text-757575)",
                      }}
                    >
                      옵션
                    </span>
                    색상: 3종 / 사이즈: 66 | 5개
                  </p>
                  <StarRating rate={3.5} size={35} spacing={24} />
                </div>
                <div
                  style={{
                    padding: "20px",
                    background: "#fff",
                  }}
                >
                  {/* 파일 첨부 */}
                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#666",
                            marginBottom: "10px",
                          }}
                        >
                          <label
                            style={{
                              fontWeight: "600",
                              fontSize: "14px",
                              color: "var(--text-121212)",
                              marginBottom: "8px",
                            }}
                          >
                            파일 첨부
                          </label>
                          <p
                            style={{
                              fontSize: "10px",
                              color: "var(--text-757575)",
                              marginBottom: "0",
                            }}
                          >
                            참고할 수 있는 사진이 있으면 등록해 주십시오.(jpg
                            gif png 파일만 가능, 10MB이하)
                          </p>
                        </div>
                      </div>
                      <ButtonCustom
                        text={"파일 선택"}
                        style={{
                          height: "30px",
                          width: "85px",
                          fontSize: "14px",
                        }}
                        onClick={handleFileSelect}
                      />
                    </div>

                    {/* file tags */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "4px",
                        padding: "12px",
                        background: "#F3F5F7",
                      }}
                    >
                      {files.map((file, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            background: "#fff",
                            border: "1px solid var(--stroke-button)",
                            padding: "4px 8px",
                            fontSize: "11px",
                          }}
                        >
                          <span style={{ marginRight: "6px" }}>{file}</span>
                          <button
                            style={{
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                              padding: 0,
                              margin: 0,
                            }}
                            onClick={() =>
                              setFiles(files.filter((_, i) => i !== idx))
                            }
                          >
                            {/* Icon X */}
                            <svg
                              width="8"
                              height="9"
                              viewBox="0 0 8 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.6 7.5L1 6.9L3.4 4.5L1 2.1L1.6 1.5L4 3.9L6.4 1.5L7 2.1L4.6 4.5L7 6.9L6.4 7.5L4 5.1L1.6 7.5Z"
                                fill="#121212"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 상세 사유 */}
                  <div
                    style={{
                      borderTop: "1px solid #E8ECEF",
                      paddingTop: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <label
                        style={{
                          fontWeight: "600",
                          fontSize: "14px",
                          color: "var(--text-121212)",
                        }}
                      >
                        상세 사유
                      </label>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--text-757575)",
                        }}
                      >
                        {detail.length} / 500
                      </span>
                    </div>
                    <textarea
                      placeholder="상세 사유를 작성해주세요."
                      value={detail}
                      maxLength={500}
                      onChange={(e) => setDetail(e.target.value)}
                      style={{
                        width: "100%",
                        border: "1px solid #E8ECEF",
                        padding: "12px",
                        fontSize: "14px",
                        resize: "none",
                        outline: "none",
                        backgroundColor: "var(--bg-white-cool)",
                      }}
                    />
                  </div>
                </div>
              </div>
            }
            action={
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <ButtonCustom
                  text={t("취소")}
                  onClick={() => setOpenReview(false)}
                />
                <ButtonCustom
                  variant={"primary"}
                  text={t("등록하기")}
                  onClick={() => setOpenReview(false)}
                />
              </div>
            }
          />
          {/* Popup Exchange */}
          <Popup
            open={openExchange}
            onClose={() => {
              setOpenExchange(false);
              setExchangeStep(1);
            }}
            title={t("교환 요청")}
            content={
              <div>
                <ProductInfo />
                {/* Exchane step 1 */}
                {exchangeStep === 1 && (
                  <div
                    style={{
                      marginTop: "8px",
                      padding: "24px 20px",
                      background: "#fff",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "12px 24px",
                        flexWrap: "wrap",
                        width: "100%",
                        paddingBottom: "24px",
                      }}
                    >
                      {[
                        "색상, 사이즈 변경",
                        "파손 및 불량",
                        "주문 실수",
                        "오배송 및 지연",
                        "기타",
                      ].map((item, index) => {
                        return (
                          <ButtonCustom
                            key={index}
                            text={item}
                            variant={reasonExchange === item ? "primary" : ""}
                            onClick={() => setReasonExchange(item)}
                            style={{
                              flex: "1 1 calc(50% - 24px)",
                              backgroundColor:
                                reasonExchange === item
                                  ? ""
                                  : "var(--bg-white-cool)",
                            }}
                          />
                        );
                      })}
                    </div>
                    <div
                      style={{
                        borderTop: "1px solid #E8ECEF",
                        paddingTop: "20px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <label
                          style={{
                            fontWeight: "600",
                            fontSize: "14px",
                            color: "var(--text-121212)",
                          }}
                        >
                          상세 사유
                        </label>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "var(--text-757575)",
                          }}
                        >
                          {detailExchange.length} / 500
                        </span>
                      </div>
                      <textarea
                        placeholder="상세 사유를 작성해주세요."
                        value={detailExchange}
                        maxLength={500}
                        onChange={(e) => setDetailExchange(e.target.value)}
                        style={{
                          width: "100%",
                          border: "1px solid #E8ECEF",
                          padding: "12px",
                          fontSize: "14px",
                          resize: "none",
                          outline: "none",
                          backgroundColor: "var(--bg-white-cool)",
                        }}
                      />
                    </div>
                  </div>
                )}
                {/* Exchange step 2 */}
                {exchangeStep === 2 && (
                  <div style={{ borderTop: "1px solid #e8ecef" }}>
                    <RowExchange label="교환 사유" value="색상, 사이즈 변경" />
                    <RowExchange label="옵션 변경" value="BLACK (기존 옵션)" />
                    <RowExchange label="배송비 안내" value="3,000원" />
                    <RowExchange label="결제 방식 선택">
                      <div style={{ width: "50%" }}>
                        <SelectCustom
                          options={[
                            { value: "카드결제", label: "카드결제" },
                            { value: "무통장 입금", label: "무통장 입금" },
                          ]}
                          value={paymentMethod}
                          onChange={setPaymentMethod}
                          placeholder="카드결제"
                        />
                      </div>
                    </RowExchange>
                    <RowExchange
                      last={exchangeMethod === "방문 수거"}
                      label="수거 방식 선택"
                      fullLabel
                    >
                      {" "}
                      <div style={{ display: "flex" }}>
                        <div
                          style={{
                            flex: "0 0 50%",
                            padding: "16px",
                            borderRight: "1px solid #e8ecef",
                          }}
                        >
                          <CheckboxCustom
                            label={t("방문 수거")}
                            name="exchangeMethod1"
                            value="방문 수거"
                            checked={exchangeMethod === "방문 수거"}
                            onChange={() => {
                              setExchangeMethod("방문 수거");
                            }}
                            width="18px"
                          />
                        </div>
                        <div style={{ flex: "0 0 50%", padding: "16px" }}>
                          <CheckboxCustom
                            label={t("직접 발송")}
                            name="exchangeMethod2"
                            value="직접 발송"
                            checked={exchangeMethod === "직접 발송"}
                            onChange={() => {
                              setExchangeMethod("직접 발송");
                            }}
                            width="18px"
                          />
                        </div>
                      </div>
                    </RowExchange>
                    {exchangeMethod === "방문 수거" && (
                      <div
                        style={{
                          borderTop: "1px solid #E8ECEF",
                          padding: "24px 20px",
                          backgroundColor: "var(--white)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "12px",
                          }}
                        >
                          <label
                            style={{
                              fontWeight: "600",
                              fontSize: "14px",
                              color: "var(--text-121212)",
                            }}
                          >
                            회수 요청 사항
                          </label>
                          <span
                            style={{
                              fontSize: "11px",
                              color: "var(--text-757575)",
                            }}
                          >
                            {detailExchangeMethod.length} / 500
                          </span>
                        </div>
                        <textarea
                          placeholder="상세 사유를 작성해주세요."
                          value={detailExchangeMethod}
                          maxLength={500}
                          onChange={(e) =>
                            setDetailExchangeMethod(e.target.value)
                          }
                          style={{
                            width: "100%",
                            border: "1px solid #E8ECEF",
                            padding: "12px",
                            fontSize: "14px",
                            resize: "none",
                            outline: "none",
                            backgroundColor: "var(--bg-white-cool)",
                          }}
                        />
                      </div>
                    )}
                    {exchangeMethod === "직접 발송" && (
                      <div>
                        <RowExchange label="반송 번호" value="010-1111-1111" />
                        <RowExchange
                          label="보내실 곳"
                          value="서울특별시 돌곶이로 12234"
                        />
                        <RowExchange label="발송 택배사">
                          <input
                            placeholder="택배사를 입력해주세요"
                            style={{
                              border: "none",
                            }}
                          />
                        </RowExchange>
                        <RowExchange last label="운송장 번호">
                          <input
                            placeholder="운송장 번호를 입력해주세요"
                            style={{
                              border: "none",
                            }}
                          />
                        </RowExchange>
                      </div>
                    )}
                  </div>
                )}
              </div>
            }
            styleAction={{
              backgroundColor: "#fff",
            }}
            action={
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "22px",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    color: "#D40022",
                    textAlign: "center",
                    marginBottom: 0,
                  }}
                >
                  훼손/사용 흔적/기간 초과 등은 거절될 수 있습니다.{" "}
                </p>
                <ButtonCustom
                  variant={"primary"}
                  text={
                    exchangeStep === 1 ? t("다음 단계") : t("교환 신청하기")
                  }
                  onClick={() => {
                    if (exchangeStep === 1) {
                      setExchangeStep(2);
                    } else {
                      setOpenExchange(false);
                      setOpenExchangeConfirm(true);
                    }
                  }}
                />
              </div>
            }
          />
          {/* Exchange confirm popup */}
          <Popup
            open={openExchangeConfirm}
            onClose={() => setOpenExchangeConfirm(false)}
            content={
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "24px",
                }}
              >
                <IconSuccess color="#6B80DC" />
                <div>
                  <p
                    style={{
                      fontWeight: "bold",
                      marginBottom: "12px",
                      color: "var(--text-121212)",
                      fontSize: "20px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t("“상품 이름”의 교환 신청이 완료 되었습니다. ")}
                  </p>
                </div>
              </div>
            }
            small
            styleAction={{
              backgroundColor: "var(--white)",
            }}
            action={
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <ButtonCustom
                  variant={"primary"}
                  text={t("확인")}
                  onClick={() => setOpenExchangeConfirm(false)}
                />
              </div>
            }
          />

          {/* Cancel popup */}
          <Popup
            open={openCancel}
            onClose={() => {
              setOpenCancel(false);
              setCancelStep(1);
            }}
            title={t("취소 요청")}
            content={
              <div>
                {(cancelStep === 1 || cancelStep === 3) && (
                  <div
                    style={{
                      fontSize: "20px",
                      color: "var(--text-757575)",
                      textAlign: "center",
                      padding: "24px 0",
                      backgroundColor: "var(--bg-white-cool)",
                      borderBottom: "1px solid #E8ECEF",
                    }}
                  >
                    {cancelStep === 1 && "사유를 입력해주세요"}
                    {cancelStep === 3 && "취소 신청이 완료되었습니다"}
                  </div>
                )}

                <ProductInfo />
                {/* Cancel step 1 */}
                {cancelStep === 1 && (
                  <div
                    style={{
                      borderTop: "8px solid #F1F4F6",
                      padding: "24px 20px",
                      background: "#fff",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "12px 24px",
                        flexWrap: "wrap",
                        width: "100%",
                        paddingBottom: "24px",
                      }}
                    >
                      {[
                        "단순 변심",
                        "서비스 불만족",
                        "주문 실수",
                        "상품 불량",
                        "배송 지연",
                        "기타",
                      ].map((item, index) => {
                        return (
                          <ButtonCustom
                            key={index}
                            text={item}
                            variant={reasonCancel === item ? "primary" : ""}
                            onClick={() => setReasonCancel(item)}
                            style={{
                              flex: "1 1 calc(50% - 24px)",
                              backgroundColor:
                                reasonCancel === item
                                  ? ""
                                  : "var(--bg-white-cool)",
                            }}
                          />
                        );
                      })}
                    </div>
                    <div
                      style={{
                        borderTop: "8px solid #F1F4F6",
                        paddingTop: "20px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <label
                          style={{
                            fontWeight: "600",
                            fontSize: "14px",
                            color: "var(--text-121212)",
                          }}
                        >
                          상세 사유
                        </label>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "var(--text-757575)",
                          }}
                        >
                          {detailCancel.length} / 500
                        </span>
                      </div>
                      <textarea
                        placeholder="상세 사유를 작성해주세요."
                        value={detailCancel}
                        maxLength={500}
                        onChange={(e) => setDetailCancel(e.target.value)}
                        style={{
                          width: "100%",
                          border: "1px solid #E8ECEF",
                          padding: "12px",
                          fontSize: "14px",
                          resize: "none",
                          outline: "none",
                          backgroundColor: "var(--bg-white-cool)",
                        }}
                      />
                    </div>
                  </div>
                )}
                {/* Cancel step 2 */}
                {(cancelStep === 2 || cancelStep === 3) && (
                  <div
                    style={{
                      borderTop: "8px solid #F1F4F6",
                      backgroundColor: "#fff",
                    }}
                  >
                    <RowCancel label="현 상태" value="취소 완료" />
                    <RowCancel label="취소 사유" value="주문 실수" />
                    <RowCancel
                      label="상세 사유"
                      value={`주문 실수 등등 텍스트 필드 입력 주문 실수 등등 텍스\n트 필드 입력 내용이 들어갑니다.`}
                    />
                    <RowCancel label="환불 수단">
                      <div>
                        체크카드 08.11(월) 취소 요청
                        {cancelStep === 2 && (
                          <span
                            style={{
                              color: "var(--text-757575)",
                              fontSize: "11px",
                              lineHeight: "16px",
                              whiteSpace: "pre-line",
                              paddingTop: "10px",
                              display: "block",
                            }}
                          >
                            {`이미 배송중이거나 택배사 인계가 끝난 경우 등으로 인하여 \n취소 요청이 거부될 수 있습니다.`}
                          </span>
                        )}
                        {cancelStep === 3 && (
                          <span
                            style={{
                              color: "var(--text-757575)",
                              fontSize: "11px",
                              lineHeight: "16px",
                              whiteSpace: "pre-line",
                              paddingTop: "10px",
                              display: "block",
                            }}
                          >
                            <span style={{ color: "#D40022" }}>
                              취소 완료 후 3~5 영업일 이내
                            </span>{" "}
                            카드 결제 취소예정입니다. 정확한 환불 완료일은
                            카드사로 직접 문의해주세요.
                          </span>
                        )}
                      </div>
                    </RowCancel>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "24px",
                    backgroundColor: "#fff",
                    borderTop: "8px solid var(--bg-white-cool)",
                    borderBottom: "1px solid #e8ecef",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "20px",
                      fontWeight: "600",
                      gap: "12px",

                      color:
                        cancelStep === 1
                          ? "var(--text-757575)"
                          : "var(--text-121212)",
                    }}
                  >
                    <svg
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12.5" r="12" fill="#3D3D4F" />
                      <path
                        d="M8.53691 17.5L7.42282 13.0801H6V11.9061H7.12752L6.01342 7.5H7.44966L8.4698 11.9061H10.1879L11.2617 7.5H12.7383L13.8121 11.9061H15.5302L16.5503 7.5H17.9866L16.8725 11.9061H18V13.0801H16.5772L15.4497 17.5H13.9732L12.8591 13.0801H11.1409L10.0268 17.5H8.53691ZM8.75168 13.0801L9.26174 15.3039H9.3557L9.90604 13.0801H8.75168ZM11.4497 11.9061H12.5638L12.0403 9.84807H11.9597L11.4497 11.9061ZM14.1074 13.0801L14.6443 15.3177H14.7248L15.2483 13.0801H14.1074Z"
                        fill="white"
                      />
                    </svg>
                    환불 예정 금액
                  </div>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "24px",
                      color: "var(--text-121212)",
                    }}
                  >
                    25,000 원
                  </div>
                </div>

                <div
                  style={{
                    padding: "24px 32px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                    backgroundColor: "#fff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "500",
                        fontSize: "14px",
                        color: "var(--text-757575)",
                        minWidth: "100px",
                      }}
                    >
                      총 구매 금액
                    </span>
                    <span
                      style={{
                        fontWeight: "500",
                        fontSize: "14px",
                        color: "var(--text-121212)",
                        textAlign: "right",
                      }}
                    >
                      19,000 원
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "500",
                        fontSize: "14px",
                        color: "var(--text-757575)",
                        minWidth: "100px",
                      }}
                    >
                      환불 출금 포인트
                    </span>
                    <span
                      style={{
                        fontWeight: "500",
                        fontSize: "14px",
                        color: "var(--text-121212)",
                        textAlign: "right",
                      }}
                    >
                      + 3,000 원
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "500",
                        fontSize: "14px",
                        color: "var(--text-757575)",
                        minWidth: "100px",
                      }}
                    >
                      환불 쇼핑 포인트
                    </span>
                    <span
                      style={{
                        fontWeight: "500",
                        fontSize: "14px",
                        color: "var(--text-121212)",
                        textAlign: "right",
                      }}
                    >
                      + 3,000 원
                    </span>
                  </div>
                </div>
              </div>
            }
            styleAction={{
              backgroundColor: "#fff",
              border: "none",
            }}
            action={
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "22px",
                }}
              >
                <ButtonCustom
                  variant={"primary"}
                  text={t("취소 신청하기")}
                  onClick={() => {
                    if (cancelStep === 1) {
                      setCancelStep(2);
                    }
                    if (cancelStep === 2) {
                      setOpenCancelConfirm(true);
                    }
                    if (cancelStep === 3) {
                      setOpenCancel(false);
                      setCancelStep(1);
                    }
                  }}
                />
              </div>
            }
          />
          {/* Cancel confirm popup */}
          <Popup
            open={openCancelConfirm}
            onClose={() => setOpenCancelConfirm(false)}
            content={
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "24px",
                }}
              >
                <IconWarning />

                <div>
                  <p
                    style={{
                      fontWeight: "bold",
                      marginBottom: "12px",
                      color: "var(--text-121212)",
                      fontSize: "20px",
                    }}
                  >
                    {t("정말 취소 하시겠습니까?")}
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--text-3f3f3f)",
                      marginBottom: "0",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {t(
                      "함께 주문한 전체 상품의 배송이 취소되며,\n취소 이후 배송 및 리뷰작성이 불가능합니다."
                    )}
                  </p>
                </div>
              </div>
            }
            small
            styleAction={{
              backgroundColor: "var(--white)",
            }}
            action={
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <ButtonCustom
                  variant={"outline"}
                  text={t("아니오")}
                  onClick={() => setOpenCancelConfirm(false)}
                />
                <ButtonCustom
                  variant={"primary"}
                  text={t("취소하기")}
                  onClick={() => {
                    setOpenCancelConfirm(false);
                    setCancelStep(3);
                  }}
                />
              </div>
            }
          />
          {/* Popup Return */}
          <Popup
            open={openReturn}
            onClose={() => {
              setOpenReturn(false);
              setReturnStep(1);
            }}
            title={t("반품 요청")}
            content={
              <div>
                <ProductInfo />
                {/* Exchane step 1 */}
                {returnStep === 1 && (
                  <div
                    style={{
                      marginTop: "8px",
                      padding: "24px 20px",
                      background: "#fff",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "12px 24px",
                        flexWrap: "wrap",
                        width: "100%",
                        paddingBottom: "24px",
                      }}
                    >
                      {[
                        "색상, 사이즈 변경",
                        "파손 및 불량",
                        "주문 실수",
                        "오배송 및 지연",
                        "기타",
                      ].map((item, index) => {
                        return (
                          <ButtonCustom
                            key={index}
                            text={item}
                            variant={reasonReturn === item ? "primary" : ""}
                            onClick={() => setReasonReturn(item)}
                            style={{
                              flex: "1 1 calc(50% - 24px)",
                              backgroundColor:
                                reasonReturn === item
                                  ? ""
                                  : "var(--bg-white-cool)",
                            }}
                          />
                        );
                      })}
                    </div>
                    <div
                      style={{
                        borderTop: "1px solid #E8ECEF",
                        paddingTop: "20px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <label
                          style={{
                            fontWeight: "600",
                            fontSize: "14px",
                            color: "var(--text-121212)",
                          }}
                        >
                          상세 사유
                        </label>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "var(--text-757575)",
                          }}
                        >
                          {detailReturn.length} / 500
                        </span>
                      </div>
                      <textarea
                        placeholder="상세 사유를 작성해주세요."
                        value={detailReturn}
                        maxLength={500}
                        onChange={(e) => setDetailReturn(e.target.value)}
                        style={{
                          width: "100%",
                          border: "1px solid #E8ECEF",
                          padding: "12px",
                          fontSize: "14px",
                          resize: "none",
                          outline: "none",
                          backgroundColor: "var(--bg-white-cool)",
                        }}
                      />
                    </div>
                  </div>
                )}
                {/* Return step 2 */}
                {returnStep === 2 && (
                  <div style={{ borderTop: "1px solid #e8ecef" }}>
                    <RowExchange label="교환 사유" value="파손 및 불량" />
                    <RowExchange label="배송비 안내" value="3,000원" />
                    <RowExchange label="결제 방식 선택">
                      <div style={{ width: "50%" }}>
                        <SelectCustom
                          options={[
                            { value: "카드결제", label: "카드결제" },
                            { value: "무통장 입금", label: "무통장 입금" },
                          ]}
                          value={paymentMethod}
                          onChange={setPaymentMethod}
                          placeholder="카드결제"
                        />
                      </div>
                    </RowExchange>
                    <RowExchange
                      last={exchangeMethod === "방문 수거"}
                      label="수거 방식 선택"
                      fullLabel
                    >
                      <div style={{ display: "flex" }}>
                        <div
                          style={{
                            flex: "0 0 50%",
                            padding: "16px",
                            borderRight: "1px solid #e8ecef",
                          }}
                        >
                          <CheckboxCustom
                            label={t("방문 수거")}
                            name="returnMethod1"
                            value="방문 수거"
                            checked={returnMethod === "방문 수거"}
                            onChange={() => {
                              setReturnMethod("방문 수거");
                            }}
                            width="18px"
                          />
                        </div>
                        <div style={{ flex: "0 0 50%", padding: "16px" }}>
                          <CheckboxCustom
                            label={t("직접 발송")}
                            name="returnMethod2"
                            value="직접 발송"
                            checked={returnMethod === "직접 발송"}
                            onChange={() => {
                              setReturnMethod("직접 발송");
                            }}
                            width="18px"
                          />
                        </div>
                      </div>
                    </RowExchange>

                    {returnMethod === "직접 발송" && (
                      <div>
                        <RowExchange
                          label="보내실 곳"
                          value="서울특별시 돌곶이로 12234"
                        />

                        <RowExchange label="발송 택배사">
                          <input
                            placeholder="택배사를 입력해주세요"
                            style={{
                              border: "none",
                            }}
                          />
                        </RowExchange>
                        <RowExchange last label="운송장 번호">
                          <input
                            placeholder="운송장 번호를 입력해주세요"
                            style={{
                              border: "none",
                            }}
                          />
                        </RowExchange>
                      </div>
                    )}
                    <div
                      style={{
                        borderTop: "1px solid #E8ECEF",
                        padding: "24px 20px",
                        backgroundColor: "var(--white)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <label
                          style={{
                            fontWeight: "600",
                            fontSize: "14px",
                            color: "var(--text-121212)",
                          }}
                        >
                          회수 요청 사항
                        </label>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "var(--text-757575)",
                          }}
                        >
                          {detailReturn.length} / 500
                        </span>
                      </div>
                      <textarea
                        placeholder="상세 사유를 작성해주세요."
                        value={detailReturn}
                        maxLength={500}
                        onChange={(e) => setDetailReturn(e.target.value)}
                        style={{
                          width: "100%",
                          border: "1px solid #E8ECEF",
                          padding: "12px",
                          fontSize: "14px",
                          resize: "none",
                          outline: "none",
                          backgroundColor: "var(--bg-white-cool)",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "24px",
                        backgroundColor: "#fff",
                        borderTop: "8px solid var(--bg-white-cool)",
                        borderBottom: "1px solid #e8ecef",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "20px",
                          fontWeight: "600",
                          gap: "12px",

                          color:
                            cancelStep === 1
                              ? "var(--text-757575)"
                              : "var(--text-121212)",
                        }}
                      >
                        <svg
                          width="24"
                          height="25"
                          viewBox="0 0 24 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="12" cy="12.5" r="12" fill="#3D3D4F" />
                          <path
                            d="M8.53691 17.5L7.42282 13.0801H6V11.9061H7.12752L6.01342 7.5H7.44966L8.4698 11.9061H10.1879L11.2617 7.5H12.7383L13.8121 11.9061H15.5302L16.5503 7.5H17.9866L16.8725 11.9061H18V13.0801H16.5772L15.4497 17.5H13.9732L12.8591 13.0801H11.1409L10.0268 17.5H8.53691ZM8.75168 13.0801L9.26174 15.3039H9.3557L9.90604 13.0801H8.75168ZM11.4497 11.9061H12.5638L12.0403 9.84807H11.9597L11.4497 11.9061ZM14.1074 13.0801L14.6443 15.3177H14.7248L15.2483 13.0801H14.1074Z"
                            fill="white"
                          />
                        </svg>
                        환불 예정 금액
                      </div>
                      <div
                        style={{
                          fontWeight: "700",
                          fontSize: "24px",
                          color: "var(--text-121212)",
                        }}
                      >
                        25,000 원
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "24px 32px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "18px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "500",
                            fontSize: "14px",
                            color: "var(--text-757575)",
                            minWidth: "100px",
                          }}
                        >
                          총 구매 금액
                        </span>
                        <span
                          style={{
                            fontWeight: "500",
                            fontSize: "14px",
                            color: "var(--text-121212)",
                            textAlign: "right",
                          }}
                        >
                          19,000 원
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "500",
                            fontSize: "14px",
                            color: "var(--text-757575)",
                            minWidth: "100px",
                          }}
                        >
                          환불 출금 포인트
                        </span>
                        <span
                          style={{
                            fontWeight: "500",
                            fontSize: "14px",
                            color: "var(--text-121212)",
                            textAlign: "right",
                          }}
                        >
                          + 3,000 원
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "500",
                            fontSize: "14px",
                            color: "var(--text-757575)",
                            minWidth: "100px",
                          }}
                        >
                          환불 쇼핑 포인트
                        </span>
                        <span
                          style={{
                            fontWeight: "500",
                            fontSize: "14px",
                            color: "var(--text-121212)",
                            textAlign: "right",
                          }}
                        >
                          + 3,000 원
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            }
            styleAction={{
              backgroundColor: "#fff",
            }}
            action={
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "22px",
                }}
              >
                {returnStep === 1 && (
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#D40022",
                      textAlign: "center",
                      marginBottom: 0,
                    }}
                  >
                    훼손/사용 흔적/기간 초과 등은 거절될 수 있습니다.
                  </p>
                )}
                {returnStep === 2 && (
                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--text-757575)",
                      textAlign: "center",
                      marginBottom: 0,
                    }}
                  >
                    반품 물건 접수 완료 후 3~5영업일 이내 카드 결제
                    취소예정입니다. <br />
                    정확한 환불 완료일은 카드사로 직접 문의해주세요.
                    <br />
                    <span style={{ color: "#D40022" }}>
                      사용/훼손/기간 초과 등은 반품 거부 될 수 있습니다.
                    </span>
                  </p>
                )}
                <ButtonCustom
                  variant={"primary"}
                  text={returnStep === 1 ? t("다음 단계") : t("반품 신청하기")}
                  onClick={() => {
                    if (returnStep === 1) {
                      setReturnStep(2);
                    } else {
                      setOpenReturn(false);
                      setOpenReturnConfirm(true);
                    }
                  }}
                />
              </div>
            }
          />
          {/* Return confirm popup */}
          <Popup
            open={openReturnConfirm}
            onClose={() => setOpenReturnConfirm(false)}
            content={
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "24px",
                }}
              >
                <IconSuccess color="#6B80DC" />
                <div>
                  <p
                    style={{
                      fontWeight: "bold",
                      marginBottom: "12px",
                      color: "var(--text-121212)",
                      fontSize: "20px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t("“상품 이름”의 반품 신청이 완료 되었습니다. ")}
                  </p>
                </div>
              </div>
            }
            small
            styleAction={{
              backgroundColor: "var(--white)",
            }}
            action={
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <ButtonCustom
                  variant={"primary"}
                  text={t("확인")}
                  onClick={() => setOpenReturnConfirm(false)}
                />
              </div>
            }
          />
        </div>
        <div className={styles.paginationMobile}>10개 더보기</div>

        <div className={styles.pagination}>
          <PaginationCustom />
        </div>
      </div>
    </>
  );
};

export default ManageOrderDelivery;
