import HeadData from "~/components/Head";
import classes from "../styles/pages.module.css";
import { useTranslation } from "react-i18next";
import ButtonCustom from "~/components/ButtonCustom";
import { useState } from "react";
import Popup from "~/components/Popup/popup";
import CheckboxCustom from "~/components/Ui/CheckboxCustom/checkboxCustom";
import StarRating from "~/components/Ui/StarRating/starRating";
import SearchSelect from "~/components/SearchSelect/searchSelect";
import popupClasses from "~/components/Popup/popup.module.css";

const PopupPage = ({ data, error }) => {
  const { t } = useTranslation();
  // Q&A 작성 POPUP
  const [openQna, setOpenQna] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);

  // 새 배송지 추가 POPUP
  const [openDelivery, setOpenDelivery] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(true);

  // 내역 삭제 POPUP
  const [openDeleteHistory, setOpenDeleteHistory] = useState(false);
  const IconWarning = ({ color }) => {
    return (
      <div
        style={{
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: color || "var(--main-system-red)",
          borderRadius: "50%",
        }}
      >
        <svg
          width="4"
          height="14"
          viewBox="0 0 4 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 13.75C1.5875 13.75 1.23438 13.6031 0.940625 13.3094C0.646875 13.0156 0.5 12.6625 0.5 12.25C0.5 11.8375 0.646875 11.4844 0.940625 11.1906C1.23438 10.8969 1.5875 10.75 2 10.75C2.4125 10.75 2.76562 10.8969 3.05938 11.1906C3.35313 11.4844 3.5 11.8375 3.5 12.25C3.5 12.6625 3.35313 13.0156 3.05938 13.3094C2.76562 13.6031 2.4125 13.75 2 13.75ZM0.5 9.25V0.25H3.5V9.25H0.5Z"
            fill="white"
          />
        </svg>
      </div>
    );
  };
  const IconSuccess = ({ color }) => {
    return (
      <div
        style={{
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: color || "var(--main-system-red)",
          borderRadius: "50%",
        }}
      >
        <svg
          width="12"
          height="10"
          viewBox="0 0 12 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 9.4L0 5.4L1.4 4L4 6.6L10.6 0L12 1.4L4 9.4Z"
            fill="white"
          />
        </svg>
      </div>
    );
  };
  // 영수증 내역 POPUP
  const [openReceipt, setOpenReceipt] = useState(false);

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
          borderBottom: "1px solid var(--stroke-E8ECEF)",
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
            borderRight: "1px solid var(--stroke-E8ECEF)",
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
  const [cancelStep, setCancelStep] = useState(1);
  const [reasonCancel, setReasonCancel] = useState("서비스 불만족");
  const [detailCancel, setDetailCancel] = useState("");

  const RowCancel = ({ label, value, children, last, fullLabel }) => {
    return (
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--stroke-E8ECEF)",
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
  const [detailReturnMethod, setDetailReturnMethod] = useState("");

  // 포인트 전송 POPUP
  const [openPoint, setOpenPoint] = useState(false);
  const [openPointConfirm, setOpenPointConfirm] = useState(false);
  const [useAllPoint, setUseAllPoint] = useState(true);
  const [point, setPoint] = useState("");

  return (
    <>
      <HeadData title="POPUP" />
      <div className="layout_top">
        <h1 className={`${classes.heading} ${classes.faqHeading}`}>
          {t("popup")}
        </h1>
        <div className="content_spacing" />
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
            backgroundColor: "var(--white)",
            padding: "40px",
            flexWrap: "wrap",
          }}
        >
          {/* Q&A 작성 POPUP */}
          <ButtonCustom
            variant={"primary"}
            text={t("Q&A 작성 POPUP")}
            style={{ width: "200px" }}
            onClick={() => setOpenQna(true)}
          />
          <Popup
            open={openQna}
            onClose={() => setOpenQna(false)}
            title={t("상품 Q&A 작성하기")}
            content={
              <div style={{ padding: "30px 30px 140px" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "bold",
                      marginBottom: 0,
                      fontSize: "14px",
                    }}
                  >
                    {t("상품 Q&A")}
                  </p>
                  <p
                    style={{
                      marginBottom: 0,
                      fontSize: "11px",
                    }}
                  >
                    0 / 500
                  </p>
                </div>
                <textarea
                  placeholder={t("상품 Q&A를 작성해주세요.")}
                  style={{ marginBottom: "24px" }}
                ></textarea>
                <CheckboxCustom
                  label={t("비공개")}
                  name="private"
                  value="private"
                  checked={isPrivate}
                  onChange={() => {
                    setIsPrivate(!isPrivate);
                    console.log(!isPrivate);
                  }}
                />
              </div>
            }
            action={
              <div style={{ display: "flex", gap: "10px" }}>
                <ButtonCustom
                  text={t("취소")}
                  onClick={() => setOpenQna(false)}
                />
                <ButtonCustom
                  variant={"primary"}
                  text={t("등록하기")}
                  onClick={() => setOpenQna(false)}
                />
              </div>
            }
          />

          {/* 새 배송지 추가-popup*/}
          <ButtonCustom
            variant={"primary-outline"}
            text={t("새 배송지 추가-popup")}
            style={{ width: "200px" }}
            onClick={() => setOpenDelivery(true)}
          />
          <Popup
            open={openDelivery}
            onClose={() => setOpenDelivery(false)}
            title={t("새 배송지 추가")}
            content={
              <div>
                <div style={{ margin: "12px 0 12px" }}>
                  <input
                    name="addressName"
                    placeholder={t("배송지명 (최대 10글자)")}
                    className="without-border-bottom"
                  ></input>
                  <input
                    name="receiverName"
                    placeholder={t("수령인 (최대 10글자)")}
                    className="without-border-bottom"
                  ></input>
                  <input name="phone" placeholder={t("휴대폰 번호")}></input>
                </div>
                <div style={{ margin: "0 0 12px" }}>
                  <div style={{ position: "relative" }}>
                    <input
                      placeholder={t("주소")}
                      className="without-border-bottom"
                    ></input>
                    <button
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        fontSize: "14px",
                        border: "1px solid var(--stroke-button)",
                        backgroundColor: "var(--bg-input-field)",
                        color: "var(--text-121212)",
                        padding: "0 16px",
                        height: "30px",
                        borderRadius: "2px",
                      }}
                    >
                      {t("주소검색")}
                    </button>
                  </div>
                  <input placeholder={t("상세 주소")}></input>
                </div>
                <div style={{ padding: "16px 16px 44px" }}>
                  <CheckboxCustom
                    label={t("기본 배송지로 선택")}
                    name="default"
                    value="default"
                    checked={defaultAddress}
                    onChange={() => {
                      setDefaultAddress(!defaultAddress);
                      console.log(!defaultAddress);
                    }}
                  />
                </div>
              </div>
            }
            styleAction={{
              backgroundColor: "#fff",
            }}
            action={
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <ButtonCustom
                  text={t("취소")}
                  onClick={() => setOpenDelivery(false)}
                />
                <ButtonCustom
                  variant={"primary"}
                  text={t("등록하기")}
                  onClick={() => setOpenDelivery(false)}
                />
              </div>
            }
          />
          {/* 내역 삭제 POPUP */}
          <ButtonCustom
            variant={"error"}
            text={t("내역 삭제 POPUP")}
            style={{ width: "200px" }}
            onClick={() => setOpenDeleteHistory(true)}
          />
          <Popup
            open={openDeleteHistory}
            onClose={() => setOpenDeleteHistory(false)}
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
                    {t("정말 삭제 하시겠습니까?")}
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--text-3f3f3f)",
                      marginBottom: "0",
                    }}
                  >
                    {t(
                      "함께 주문한 전체 상품의 주문/배송내역이 삭제되어 복구할 수 없으며, \n삭제 이후 상품에 대한 리뷰 작성이 불가능합니다."
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
                  text={t("취소")}
                  onClick={() => setOpenDeleteHistory(false)}
                />
                <ButtonCustom
                  variant={"error"}
                  text={t("삭제하기")}
                  onClick={() => setOpenDeleteHistory(false)}
                />
              </div>
            }
          />
          {/* 리뷰 작성 POPUP */}
          <ButtonCustom
            variant={"primary"}
            text={t("리뷰 작성 POPUP")}
            style={{ width: "200px" }}
            onClick={() => setOpenReview(true)}
          />
          <Popup
            open={openReview}
            onClose={() => setOpenReview(false)}
            content={
              <div>
                <div
                  style={{
                    borderBottom: "1px solid var(--stroke-E8ECEF)",
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
                        background: "var(--bg-navigator)",
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
                                fill="var(--text-121212)"
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
                      borderTop: "1px solid var(--stroke-E8ECEF)",
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
                        border: "1px solid var(--stroke-E8ECEF)",
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
          {/* 영수증 내역 POPUP */}
          <ButtonCustom
            variant={"primary-outline"}
            text={t("영수증 내역 POPUP")}
            style={{ width: "200px" }}
            onClick={() => setOpenReceipt(true)}
          />
          <Popup
            open={openReceipt}
            onClose={() => setOpenReceipt(false)}
            title={t("영수증 내역 ")}
            content={
              <div style={{ padding: "20px 20px 0", background: "#fff" }}>
                <div>
                  {/* 카드사 정보 */}
                  <div
                    style={{
                      borderBottom: "1px solid var(--stroke-E8ECEF)",
                      paddingBottom: "20px",
                      marginBottom: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    {[
                      ["카드사", "하나(외환)"],
                      ["승인번호", "1411111"],
                      ["카드번호(유효기간)", "****-****-****-****(**/**)"],
                      ["거래종류/할부", "체크(개인) / 일시불"],
                      ["결제일자", "2025-04-15 20:06:40"],
                      ["상품명", "USB PD 65W 초고속 충전기 포함 총 2건"],
                    ].map(([label, value], idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            color: "var(--text-757575)",
                          }}
                        >
                          {label}
                        </span>
                        <span
                          style={{
                            fontSize: "14px",
                            color: "var(--text-121212)",
                            textAlign: "right",
                          }}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 판매자 정보 */}
                  <div
                    style={{
                      borderBottom: "1px solid var(--stroke-E8ECEF)",
                      paddingBottom: "20px",
                      marginBottom: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "500",
                        marginBottom: "5px",
                        fontSize: "18px",
                        color: "var(--text-121212)",
                      }}
                    >
                      판매자 정보
                    </div>
                    {[
                      ["가맹점명", "주식회사 NOVA"],
                      ["대표자명", "홍길동"],
                      ["사업자등록번호", "123-45-67890"],
                      [
                        "주소",
                        "서울특별시 강남구 테헤란로 NOVA\n (역삼동, NOVA빌딩) 12층",
                      ],
                    ].map(([label, value], idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            color: "var(--text-757575)",
                          }}
                        >
                          {label}
                        </span>
                        <span
                          style={{
                            whiteSpace: "pre-line",
                            textAlign: "right",
                            fontSize: "14px",
                            color: "var(--text-121212)",
                          }}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 금액 */}
                  <div
                    style={{
                      borderBottom: "1px solid var(--stroke-E8ECEF)",
                      paddingBottom: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "500",
                        marginBottom: "5px",
                        fontSize: "18px",
                        color: "var(--text-121212)",
                      }}
                    >
                      금액
                    </div>
                    {[
                      ["삼품금액", "21,700"],
                      ["공급가액", "19,728"],
                      ["부가세액", "1,972"],
                    ].map(([label, value], idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            color: "var(--text-757575)",
                          }}
                        >
                          {label}
                        </span>
                        <span
                          style={{
                            fontSize: "14px",
                            color: "var(--text-121212)",
                          }}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "5px",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      <span>합계</span>
                      <span
                        style={{ color: "var(--purple)", fontSize: "20px" }}
                      >
                        29,900
                      </span>
                    </div>
                  </div>

                  {/* 안내 */}
                  <ul
                    style={{
                      fontSize: "11px",
                      color: "var(--text-757575)",
                      lineHeight: "16px",
                      padding: "30px 10px 0 30px",
                      letterSpacing: 0,
                      marginBottom: 0,
                    }}
                  >
                    <li>
                      발행 방법이 자진 발급인 경우 국세청 사이트에서 자진발급 분
                      사용자 등록을 하셔야만 소득공제 등 혜택을 받으실 수
                      있습니다.
                    </li>
                    <li>
                      발생 정보는 구매확정 또는 거래 완료 이후 전달되기 때문에
                      국세청 사이트에서 즉시 확인되지 않을 수 있습니다.
                    </li>
                    <li>
                      이 영수증은 조세특례제한법 제 126조 3항에 의거 연말정산 시
                      소득공제혜택 부여 목적으로 발행됩니다. (국세청 사이트
                      회원가입 필수)
                    </li>
                    <li>
                      현금 영수증은 구매확정 또는 거래 완료 후 48시간 내로
                      국세청에서 확인 작업 후 최종 확정됩니다.
                    </li>

                    <li>
                      국세청 확인: 홈택스 홈페이지({" "}
                      <a
                        href="https://www.hometax.go.kr"
                        target="_blank"
                        rel="noreferrer"
                      >
                        https://www.hometax.go.kr
                      </a>
                      ) 또는 국세청 상담센터(현금영수증 문의 126-1-1)
                    </li>
                  </ul>
                </div>
              </div>
            }
            styleAction={{
              backgroundColor: "#fff",
              borderTop: "none",
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
                  text={t("PDF 저장하기")}
                  onClick={() => setOpenReceipt(false)}
                />
              </div>
            }
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
            backgroundColor: "var(--white)",
            marginTop: "40px",
            padding: "40px",
            flexWrap: "wrap",
          }}
        >
          {/* 교환 요청 POPUP */}
          <ButtonCustom
            variant={"primary-outline"}
            text={t("교환 요청 POPUP")}
            style={{ width: "200px" }}
            onClick={() => setOpenExchange(true)}
          />
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
                        borderTop: "1px solid var(--stroke-E8ECEF)",
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
                          border: "1px solid var(--stroke-E8ECEF)",
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
                  <div style={{ borderTop: "1px solid var(--stroke-E8ECEF)" }}>
                    <RowExchange label="교환 사유" value="색상, 사이즈 변경" />
                    <RowExchange label="옵션 변경" value="BLACK (기존 옵션)" />
                    <RowExchange label="배송비 안내" value="3,000원" />
                    <RowExchange label="결제 방식 선택">
                      <select
                        style={{
                          border: "none",
                          outline: "none",
                          fontSize: "14px",
                          padding: "16px",
                          width: "50%",
                          margin: 0,
                        }}
                        placeholder="카드결제"
                      >
                        <option>카드결제</option>
                        <option>무통장 입금</option>
                      </select>
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
                            borderRight: "1px solid var(--stroke-E8ECEF)",
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
                          borderTop: "1px solid var(--stroke-E8ECEF)",
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
                            border: "1px solid var(--stroke-E8ECEF)",
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
                    color: "var(--main-system-red)",
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
                <IconSuccess color="var(--main-system-skyblue)" />
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

          {/* 취소 요청 POPUP */}
          <ButtonCustom
            variant={"primary"}
            text={t("취소 요청 POPUP")}
            style={{ width: "200px" }}
            onClick={() => setOpenCancel(true)}
          />
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
                      borderBottom: "1px solid var(--stroke-E8ECEF)",
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
                        borderTop: "1px solid var(--stroke-E8ECEF)",
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
                          border: "1px solid var(--stroke-E8ECEF)",
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
                      borderTop: "1px solid var(--stroke-E8ECEF)",
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
                            <span style={{ color: "var(--main-system-red)" }}>
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
                    alignItems: "center",
                    fontSize: "20px",
                    fontWeight: "600",
                    gap: "12px",
                    padding: "24px",
                    backgroundColor: "#fff",
                    borderTop: "8px solid var(--bg-white-cool)",
                    borderBottom: "1px solid var(--stroke-E8ECEF)",
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
                      {cancelStep !== 1 ? "19,000 원" : ""}
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
                      {cancelStep !== 1 ? "+ 3,000 원 " : ""}
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
                      {cancelStep !== 1 ? "+ 3,000 원 " : ""}
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
                      setCancelStep(3);
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

          {/* 반품 요청 POPUP */}
          <ButtonCustom
            variant={"primary-outline"}
            text={t("반품 요청 POPUP")}
            style={{ width: "200px" }}
            onClick={() => setOpenReturn(true)}
          />
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
                        borderTop: "1px solid var(--stroke-E8ECEF)",
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
                          border: "1px solid var(--stroke-E8ECEF)",
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
                  <div style={{ borderTop: "1px solid var(--stroke-E8ECEF)" }}>
                    <RowExchange label="교환 사유" value="파손 및 불량" />
                    <RowExchange label="배송비 안내" value="3,000원" />
                    <RowExchange label="결제 방식 선택">
                      <select
                        style={{
                          border: "none",
                          outline: "none",
                          fontSize: "14px",
                          padding: "16px",
                          width: "50%",
                          margin: 0,
                        }}
                        placeholder="카드결제"
                      >
                        <option>카드결제</option>
                        <option>무통장 입금</option>
                      </select>
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
                            borderRight: "1px solid var(--stroke-E8ECEF)",
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
                        borderTop: "1px solid var(--stroke-E8ECEF)",
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
                          border: "1px solid var(--stroke-E8ECEF)",
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
                        alignItems: "center",
                        fontSize: "20px",
                        fontWeight: "600",
                        gap: "12px",
                        padding: "24px",
                        backgroundColor: "#fff",
                        borderTop: "8px solid var(--bg-white-cool)",
                        borderBottom: "1px solid var(--stroke-E8ECEF)",
                        color: "var(--text-121212)",
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
                      color: "var(--main-system-red)",
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
                    <span style={{ color: "var(--main-system-red)" }}>
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
                <IconSuccess color="var(--main-system-skyblue)" />
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

          {/* / 포인트 전송 POPUP */}
          <ButtonCustom
            text={t("포인트 전송 POPUP")}
            style={{ width: "200px" }}
            onClick={() => setOpenPoint(true)}
          />
          <Popup
            open={openPoint}
            onClose={() => {
              setOpenPoint(false);
            }}
            content={
              <div>
                <div
                  style={{
                    padding: "24px",
                    backgroundColor: "var(--white)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "16px",
                      fontWeight: "500",
                      gap: "12px",
                      color:
                        cancelStep === 1
                          ? "var(--text-757575)"
                          : "var(--text-121212)",
                    }}
                  >
                    <span
                      style={{
                        color: "#fff",
                        fontSize: "16px",
                        borderRadius: "50%",
                        background: "var(--purple)",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      P
                    </span>
                    내 포인트
                  </div>
                  <p
                    style={{
                      fontSize: "28px",
                      fontWeight: "600",
                      marginBottom: 0,
                      color: "var(--text-121212)",
                    }}
                  >
                    743,129,563 P
                  </p>
                </div>
                <div style={{ padding: "24px" }}>
                  <SearchSelect
                    options={[
                      {
                        title: "Testuser1",
                        sub: "홍석 010-1254-**** zxcs****@naver.com",
                      },
                      {
                        title: "Testuser12",
                        sub: "홍석 010-1254-**** zxcs****@naver.com",
                      },
                      {
                        title: "Testuser123",
                        sub: "홍석 010-1254-**** zxcs****@naver.com",
                      },
                      {
                        title: "Testuser1234",
                        sub: "홍석 010-1254-**** zxcs****@naver.com",
                      },
                    ]}
                  />
                  <input
                    placeholder="전송할 포인트를 입력해주세요"
                    name="point"
                    type="text"
                    value={point}
                    onChange={(e) => setPoint(e.target.value)}
                    style={{
                      margin: "24px 0 12px",
                      border: "none",
                      borderBottom: "1px solid var(--stroke-E8ECEF)",
                      outline: "none",
                      background: "transparent",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      width: "100%",
                    }}
                  >
                    <CheckboxCustom
                      label={t("전체 포인트 사용")}
                      name="useAllPoint"
                      value="useAllPoint"
                      checked={useAllPoint}
                      onChange={() => {
                        setUseAllPoint(!useAllPoint);
                      }}
                    />
                  </div>
                </div>
              </div>
            }
            styleAction={{
              backgroundColor: "#fff",
            }}
            action={
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <ButtonCustom
                  text={t("취소")}
                  onClick={() => {
                    setOpenPoint(false);
                  }}
                />
                <ButtonCustom
                  variant={"primary"}
                  text={t("전환하기")}
                  onClick={() => {
                    setOpenPoint(false);
                    setOpenPointConfirm(true);
                  }}
                />
              </div>
            }
          />
          {/* Point confirm popup */}
          <Popup
            open={openPointConfirm}
            onClose={() => setOpenPointConfirm(false)}
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#fff",
                      fontSize: "16px",
                      borderRadius: "50%",
                      background: "var(--purple)",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    P
                  </span>
                </div>
                <div>
                  <p
                    style={{
                      fontWeight: "400",
                      color: "var(--text-121212)",
                      fontSize: "18px",
                      marginBottom: "0",
                    }}
                  >
                    <span style={{ fontWeight: "600" }}>Testuser123 </span>
                    님에게
                    <br />
                    <span style={{ fontWeight: "600" }}>50,000P</span> 를
                    전송하시겠습니까?
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
                  text={t("취소")}
                  onClick={() => setOpenPointConfirm(false)}
                />
                <ButtonCustom
                  variant={"primary"}
                  text={t("전환하기")}
                  onClick={() => setOpenPointConfirm(false)}
                />
              </div>
            }
          />
        </div>
        <div className="content_spacing" />
      </div>
    </>
  );
};

export default PopupPage;

const IconFreeShipping = () => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0.583984 2.33337C0.583984 2.10003 0.758984 1.8667 1.05065 1.8667H7.87565C8.10898 1.8667 8.34232 2.10003 8.34232 2.33337V2.50837H10.9673C11.1423 2.50837 11.259 2.5667 11.3757 2.7417L13.2423 5.8917C13.3007 5.95003 13.3007 6.0667 13.3007 6.12503V9.9167C13.3007 10.15 13.1257 10.3834 12.834 10.3834H12.0173C11.8423 11.0834 11.2007 11.6667 10.3257 11.6667C9.50898 11.6667 8.86732 11.1417 8.63398 10.3834H5.83398C5.60065 11.1417 4.95898 11.6667 4.20065 11.6667C3.44232 11.6667 2.74232 11.1417 2.50898 10.3834H1.69232C1.40065 10.3834 1.16732 10.15 1.16732 9.9167V7.40837C1.16732 7.17503 1.34232 6.9417 1.63398 6.9417C1.86732 6.9417 2.10065 7.17503 2.10065 7.40837V9.45003H2.45065C2.68398 8.75003 3.32565 8.1667 4.20065 8.1667C4.95898 8.1667 5.65898 8.6917 5.89232 9.45003H7.52565V2.85837H1.10898C0.758984 2.85837 0.583984 2.68337 0.583984 2.33337ZM8.40065 3.50003V5.65837H12.134L10.7923 3.50003H8.40065ZM12.484 6.65003H8.40065V9.45003H8.75065C8.92565 8.75003 9.56732 8.1667 10.4423 8.1667C11.259 8.1667 11.9007 8.6917 12.134 9.45003H12.484V6.65003ZM1.16732 4.90003C1.16732 4.6667 1.34232 4.37503 1.69232 4.37503H4.20065C4.43398 4.37503 4.66732 4.6667 4.66732 4.90003C4.66732 5.13337 4.49232 5.3667 4.20065 5.3667H1.69232C1.40065 5.3667 1.16732 5.1917 1.16732 4.90003ZM4.20065 9.15837C3.79232 9.15837 3.44232 9.50837 3.44232 9.9167C3.44232 10.325 3.79232 10.675 4.20065 10.675C4.60898 10.675 4.95898 10.325 4.95898 9.9167C4.95898 9.50837 4.60898 9.15837 4.20065 9.15837ZM10.4423 9.15837C10.034 9.15837 9.68398 9.50837 9.68398 9.9167C9.68398 10.325 10.034 10.675 10.4423 10.675C10.8507 10.675 11.2007 10.325 11.2007 9.9167C11.2007 9.50837 10.8507 9.15837 10.4423 9.15837Z"
        fill="var(--text-757575)"
      />
    </svg>
  );
};
