import HeadData from "~/components/Head";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import styles from "./faq.module.css";
import LayoutCsCenter from "../layout";
import PaginationCustom from "~/components/PaginationCustom";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const Error500 = dynamic(() => import("~/components/error/500"));

const FaqPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const mockFaqs = [
    {
      id: 1,
      question: "반품이나 교환 시 배송비는 누가 부담하나요?",
      answer: null,
      category: "[반품/교환/환불]",
    },
    {
      id: 2,
      question: "주문을 취소하고자 합니다.",
      answer: `<p style="color: var(--text-555555); margin:0">반품이나 교환 시 배송비 부담은 사유에 따라 다음과 같이 구분됩니다.<br/><br/>1. 구매자가 부담하는 경우<br/>가) 구매자의 단순 변심의 경우<br/>나) 기타 (구매자 귀책 사유)</p>`,
      category: "[주문취소]",
    },
    {
      id: 3,
      question: "주문 내역은 어디에서 확인할 수 있나요?",
      answer: null,
      category: "[주문결제]",
    },
  ];
  const [openId, setOpenId] = useState(null);
  const [category, setCategory] = useState("all");
  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };
  return (
    <LayoutCsCenter>
      <>
        <HeadData title="FAQ" />
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <h2>{t("FAQ")}</h2>
            <span className={styles.line}></span>
            <p>{t("자주 묻는 질문을 여기서 확인하세요")}</p>
          </div>

          {/* Search */}
          <div className={styles.searchBox}>
            <input type="text" placeholder={t("검색어를 입력하세요")} />
            <button>{t("검색하기")}</button>
          </div>

          <div className={styles.faqCategory}>
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
          <div className={styles.faqList}>
            {mockFaqs.map((item) => (
              <div
                key={item.id}
                className={
                  styles.faqItem +
                  " " +
                  (openId === item.id ? styles.faqItemActive : "")
                }
              >
                <div
                  className={styles.faqItemHeader}
                  onClick={() => toggleFaq(item.id)}
                >
                  <div className={styles.faqItemHeaderLeft}>
                    <p>Q.</p>
                  </div>
                  <div className={styles.faqItemHeaderRight}>
                    <span>{item.category}</span>
                    {item.question}
                  </div>
                </div>
                {item.answer && (
                  <div
                    className={styles.faqItemContent}
                    style={{ display: openId === item.id ? "block" : "none" }}
                  >
                    <div
                      style={{ color: "#555555" }}
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className={styles.paginationMobile}>10개 더보기</div>

          <div className={styles.pagination}>
            <PaginationCustom />
          </div>
        </div>
      </>
    </LayoutCsCenter>
  );
};

export default FaqPage;

FaqPage.headerBack = true;
FaqPage.headerBackText = "FAQ";
