"use client";

import { useState } from "react";
import styles from "./productTabQna.module.css";
import PopupQna from "~/pages/cs-center/qna/_components/popupQna";
import { useTranslation } from "react-i18next";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  IconLock,
  IconQnA,
} from "~/pages/cs-center/qna/index";
import DropdownCustom from "~/components/DropdownCustom/dropdownCustom";
import { IconCheck } from "~/components/Layout/Client/sidebarFilterMobile";
import PaginationCustom from "~/components/PaginationCustom";
import { Divider } from "~/components/Ui/Divider/divider";
import ButtonCustom from "~/components/ButtonCustom";
import CheckboxCustom from "~/components/Ui/CheckboxCustom/checkboxCustom";
import Popup from "~/components/Popup/popup";

export default function ProductTabQna() {
  const { t } = useTranslation();
  const qnaList = [
    {
      id: 1,
      status: "미답변",
      productImg: "/images/product_ex.png",
      title: "[노바샵] MLB 뉴욕양키스 볼캡 모자 32CPHL111-50L",
      question: "월요일날 주문했는데 언제오나요?",
      author: "aksd****",
      date: "25.05.12",
      isSecret: false,
    },
    {
      id: 2,
      status: "미답변",
      productImg: "/images/product_ex.png",
      title: "[노바샵] MLB 뉴욕양키스 볼캡 모자 32CPHL111-50L",
      question: "비밀글입니다.",
      author: "aksd****",
      date: "25.05.12",
      isSecret: true,
    },
    {
      id: 3,
      status: "답변완료",
      productImg: "/images/product_ex.png",
      title: "[노바샵] MLB 뉴욕양키스 볼캡 모자 32CPHL111-50L",
      question: "월요일날 주문했는데 언제오나요?(전체문의입니다)",
      author: "aksd****",
      date: "25.05.12",
      isSecret: false,
      answer: {
        text: "지금 배송대기 상태이며 곧 배달 예정입니다. → 개고 해주시면 감사하겠습니다.",
        images: [
          "/images/product_ex.png",
          "/images/product_ex.png",
          "/images/product_ex.png",
        ],
      },
    },
  ];
  const [openQna, setOpenQna] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);
  const [activeFilter, setActiveFilter] = useState("전체");
  const [activeItem, setActiveItem] = useState(null);
  const [checked, setChecked] = useState(false);
  const [filterSort, setFilterSort] = useState([]);
  const sortOptions = [
    { value: "답변완료", label: "답변완료" },
    { value: "미답변", label: "미답변" },
  ];
  const handleSortChange = (values) => {
    setFilterSort(Array.isArray(values) ? values : [values]);
  };

  const handleToggle = () => {
    setChecked(!checked);
  };
  // Toggle active item to expand/collapse answer
  const toggleQnaItem = (id) => {
    setActiveItem(activeItem === id ? null : id);
  };
  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <h2>{t("Q&A")}</h2>
        <p>{t("궁금하신 사항이 있을 경우 Q&A를 통해 확인 가능합니다.")}</p>
      </div>
      <div className={styles.filter}>
        <button className={styles.qnaButton} onClick={() => setOpenQna(true)}>
          <IconQnA /> {t("Q&A 작성하기")}
        </button>
        <div className={styles.filterRight}>
          <div
            className={`${styles.filterRightItem} ${
              activeFilter === "전체" ? styles.active : ""
            }`}
            onClick={() => setActiveFilter("전체")}
          >
            {activeFilter === "전체" && <IconCheck />}
            <span>전체</span>
          </div>
          <div className={styles.filterDivider}></div>
          <div
            className={`${styles.filterRightItem} ${
              activeFilter === "답변완료" ? styles.active : ""
            }`}
            onClick={() => setActiveFilter("답변완료")}
          >
            {activeFilter === "답변완료" && <IconCheck />}
            <span>답변완료</span>
          </div>
          <div className={styles.filterDivider}></div>
          <div
            className={`${styles.filterRightItem} ${
              activeFilter === "미답변" ? styles.active : ""
            }`}
            onClick={() => setActiveFilter("미답변")}
          >
            {activeFilter === "미답변" && <IconCheck />}
            <span>미답변</span>
          </div>
        </div>
        <div className={styles.switchWrapper} onClick={handleToggle}>
          <span className={styles.label}>내 Q&A 보기</span>
          <div className={`${styles.switch} ${checked ? styles.checked : ""}`}>
            <div className={styles.knob}></div>
          </div>
        </div>
        <div className={styles.selectWrapper}>
          <DropdownCustom
            label="전체"
            options={sortOptions}
            value={filterSort}
            type="single"
            onChange={handleSortChange}
          />
        </div>
      </div>

      {/* Table Header */}
      <div className={styles.tableHeader}>
        <span className={styles.colStatus}>답변 상태</span>
        <span className={styles.colTitle}>제목/상품</span>
        <span className={styles.colAuthor}>작성자</span>
        <span className={styles.colDate}>작성일</span>
      </div>

      {/* QnA List */}
      <div className={styles.list}>
        {qnaList.map((item) => (
          <div
            key={item.id}
            className={`${styles.item} ${
              activeItem === item.id ? styles.active : ""
            }`}
          >
            {/* Row */}
            <div
              className={styles.row}
              onClick={() =>
                !item.isSecret && item.answer && toggleQnaItem(item.id)
              }
              style={{
                cursor: !item.isSecret && item.answer ? "pointer" : "default",
              }}
            >
              <span className={styles.status}>{item.status}</span>
              {item.isSecret ? (
                <div className={styles.content}>
                  <div className={styles.private}>
                    {" "}
                    비밀글입니다.{" "}
                    <span className={styles.lock}>
                      <IconLock />
                    </span>
                  </div>
                </div>
              ) : (
                <div className={styles.content}>
                  <div>
                    <div className={styles.question}>{item.question}</div>
                  </div>
                </div>
              )}

              <span className={styles.author}>{item.author}</span>
              <span className={styles.date}>{item.date}</span>
            </div>

            {/* Answer Section */}
            {item.answer && activeItem === item.id && (
              <>
                <div className={styles.sellerReply}>
                  <svg
                    width="10"
                    height="11"
                    viewBox="0 0 10 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1.5 0V9.5H10V10.5H0.5V0H1.5Z" fill="#A6A6A6" />
                  </svg>

                  <span className={styles.replyLabel}>답변</span>
                  <p>
                    지금 배송대기 상태이며 곧 배달 예정이니 → 개고 해주시면
                    감사하겠습니다.
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {/* QnA List Mobile Layout */}
      <div className={styles.listMobile}>
        {qnaList.map((item) => (
          <div
            key={item.id}
            className={`${styles.item} ${
              activeItem === item.id ? styles.active : ""
            }`}
          >
            {/* Row */}
            <div
              className={styles.row}
              onClick={() =>
                !item.isSecret && item.answer && toggleQnaItem(item.id)
              }
              style={{
                cursor: !item.isSecret && item.answer ? "pointer" : "default",
              }}
            >
              {item.isSecret ? (
                <div className={styles.content}>
                  <div className={styles.private}>
                    {" "}
                    비밀글입니다.{" "}
                    <span className={styles.lock}>
                      <IconLock />
                    </span>
                  </div>
                </div>
              ) : (
                <div className={styles.contentTitle}>
                  <div className={styles.content}>
                    <div>
                      <div className={styles.question}>{item.question}</div>
                    </div>
                  </div>
                  <div className={styles.description}>
                    <span className={styles.status}>{item.status}</span>
                    <Divider />{" "}
                    <span className={styles.author}>{item.author}</span>{" "}
                    <Divider /> <span className={styles.date}>{item.date}</span>
                  </div>
                  {activeItem === item.id ? (
                    <div className={styles.iconArrow}>
                      <ArrowUpIcon />
                    </div>
                  ) : (
                    <div className={styles.iconArrow}>
                      <ArrowDownIcon />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Answer Section */}
            {item.answer && activeItem === item.id && (
              <>
                <div className={styles.sellerReply}>
                  <p>
                    지금 배송대기 상태이며 곧 배달 예정이니 → 개고 해주시면
                    감사하겠습니다.
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className={styles.pagination}>
        <PaginationCustom />
      </div>
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
            <ButtonCustom text={t("취소")} onClick={() => setOpenQna(false)} />
            <ButtonCustom
              variant={"primary"}
              text={t("등록하기")}
              onClick={() => setOpenQna(false)}
            />
          </div>
        }
      />
    </div>
  );
}
