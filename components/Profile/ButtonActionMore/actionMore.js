import { useState, useEffect, useRef } from "react";
import styles from "./actionMore.module.css";
import Link from "next/link";
import ButtonCustom from "~/components/ButtonCustom";
import Popup from "~/components/Popup/popup";
import { useTranslation } from "react-i18next";

export default function ActionMore({ width }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const [position, setPosition] = useState({ top: "100%", left: "0" });
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  const toggleDropdown = () => {
    setOpen(!open);
  };

  // 내역 삭제 POPUP
  const [openDeleteHistory, setOpenDeleteHistory] = useState(false);
  // 영수증 내역 POPUP
  const [openReceipt, setOpenReceipt] = useState(false);

  // Calculate dropdown position based on viewport
  const calculatePosition = () => {
    if (!dropdownRef.current || !menuRef.current) return;

    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = dropdownRect.bottom + 4; // Default: below dropdown
    let left = dropdownRect.left;
    let transformOrigin = "top";

    // Check if dropdown would go off bottom of screen
    if (dropdownRect.bottom + menuRect.height + 8 > viewportHeight) {
      top = dropdownRect.top - menuRect.height - 4; // Position above
      transformOrigin = "bottom";
    }

    // Check if dropdown would go off right side of screen
    if (dropdownRect.left + menuRect.width > viewportWidth - 8) {
      left = dropdownRect.right - menuRect.width; // Align right edge
    }

    // Check if dropdown would go off left side of screen
    if (left < 8) {
      left = 8; // Minimum left margin
    }

    // Ensure dropdown doesn't go off top of screen
    if (top < 8) {
      top = 8;
    }

    setPosition({
      top: `${top}px`,
      left: `${left}px`,
      position: "fixed",
      transformOrigin,
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      calculatePosition();
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", calculatePosition);
      window.addEventListener("scroll", calculatePosition);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", calculatePosition);
      window.removeEventListener("scroll", calculatePosition);
    };
  }, [open]);

  const actions = [
    { label: "주문상세", action: () => {} },
    { label: "배송 조회", action: () => {} },
    { label: "영수증 조회", action: () => setOpenReceipt(true) },
    { label: "1 : 1 문의", action: () => {} },
    { label: "전화 문의", action: () => {} },
    {
      label: "내역 삭제",
      action: () => {
        setOpenDeleteHistory(true);
      },
    },
  ];

  return (
    <div
      className={styles.dropdown}
      style={{ width: width || "fit-content" }}
      ref={dropdownRef}
    >
      {/* Header */}
      <button className={styles.actionBtnMore} onClick={toggleDropdown}>
        <IconDot />
      </button>
      {/* Menu */}
      {open && (
        <div
          className={styles.menu}
          ref={menuRef}
          style={{
            position: position.position || "absolute",
            top: position.top,
            left: position.left,
            zIndex: 9999,
            minWidth: "120px",
            width: "fit-content",
          }}
        >
          {actions.map((item) => (
            <p key={item.label} className={styles.item} onClick={item.action}>
              <span>{item.label}</span>
            </p>
          ))}
        </div>
      )}
      {/* Popup Delete */}
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
      {/* Popup Receipt */}
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
                  borderBottom: "1px solid #E8ECEF",
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
                  borderBottom: "1px solid #E8ECEF",
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
                  borderBottom: "1px solid #E8ECEF",
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
                  <span style={{ color: "var(--purple)", fontSize: "20px" }}>
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
                  사용자 등록을 하셔야만 소득공제 등 혜택을 받으실 수 있습니다.
                </li>
                <li>
                  발생 정보는 구매확정 또는 거래 완료 이후 전달되기 때문에
                  국세청 사이트에서 즉시 확인되지 않을 수 있습니다.
                </li>
                <li>
                  이 영수증은 조세특례제한법 제 126조 3항에 의거 연말정산 시
                  소득공제혜택 부여 목적으로 발행됩니다. (국세청 사이트 회원가입
                  필수)
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
  );
}
const IconDot = () => (
  <svg
    width="18"
    height="4"
    viewBox="0 0 18 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM16 0C14.9 0 14 0.9 14 2C14 3.1 14.9 4 16 4C17.1 4 18 3.1 18 2C18 0.9 17.1 0 16 0ZM9 0C7.9 0 7 0.9 7 2C7 3.1 7.9 4 9 4C10.1 4 11 3.1 11 2C11 0.9 10.1 0 9 0Z"
      fill="var(--text-121212)"
    />
  </svg>
);
const IconWarning = ({ color }) => {
  return (
    <div
      style={{
        width: "24px",
        height: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: color || "#FB64B6",
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
        background: color || "#D40022",
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
        <path d="M4 9.4L0 5.4L1.4 4L4 6.6L10.6 0L12 1.4L4 9.4Z" fill="white" />
      </svg>
    </div>
  );
};
