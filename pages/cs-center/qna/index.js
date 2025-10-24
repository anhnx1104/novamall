import HeadData from "~/components/Head";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import styles from "./qna.module.css";
import LayoutCsCenter from "../layout";
import PaginationCustom from "~/components/PaginationCustom";
import { useRouter } from "next/router";
import { useState } from "react";
import DropdownCustom from "~/components/DropdownCustom/dropdownCustom";
import { IconCheck } from "~/components/Layout/Client/sidebarFilterMobile";
import { Divider } from "~/components/Ui/Divider/divider";
import PopupQna from "./_components/popupQna";
import CustomSelect from "~/components/CustomSelect";

const Error500 = dynamic(() => import("~/components/error/500"));

const QnaPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
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

  const [openId, setOpenId] = useState(null);
  const [category, setCategory] = useState("all");
  const [activeItem, setActiveItem] = useState(null);
  const [checked, setChecked] = useState(false);
  const [filterSort, setFilterSort] = useState([]);
  const [activeFilter, setActiveFilter] = useState("전체");
  const sortOptions = [
    { value: "전체", label: "전체" },
    { value: "답변완료", label: "답변완료" },
    { value: "미답변", label: "미답변" },
  ];
  const handleSortChange = (values) => {
    setFilterSort(Array.isArray(values) ? values : [values]);
  };

  const handleToggle = () => {
    setChecked(!checked);
  };

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  // Toggle active item to expand/collapse answer
  const toggleQnaItem = (id) => {
    setActiveItem(activeItem === id ? null : id);
  };

  return (
    <LayoutCsCenter>
      <>
        <HeadData title="FAQ" />
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <h2>{t("Q&A")}</h2>
            <span className={styles.line}></span>
            <p>{t("궁금하신 사항이 있을 경우 Q&A를 통해 확인 가능합니다.")}</p>
            <button
              className={styles.qnaButton}
              onClick={() => setOpenQna(true)}
            >
              <IconQnA /> {t("Q&A 작성하기")}
            </button>
          </div>
          <div className={styles.filter}>
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
              <div
                className={`${styles.switch} ${checked ? styles.checked : ""}`}
              >
                <div className={styles.knob}></div>
              </div>
            </div>
            <div className={styles.selectWrapper}>
              <CustomSelect
                list={sortOptions || []}
                dataChange={handleSortChange}
                value={activeFilter}
                placeholder="전체"
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
                    cursor:
                      !item.isSecret && item.answer ? "pointer" : "default",
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
                      <img
                        src={item.productImg}
                        alt=""
                        className={styles.thumb}
                      />
                      <div>
                        <div className={styles.title}>{item.title}</div>
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
                    <div className={styles.answerBox}>
                      <p className={styles.answerText}>{item.question}</p>
                      <div className={styles.answerImages}>
                        {item.answer.images.map((src, i) => (
                          <img key={i} src={src} alt="" />
                        ))}
                      </div>
                    </div>
                    <div className={styles.sellerReply}>
                      <svg
                        width="10"
                        height="11"
                        viewBox="0 0 10 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.5 0V9.5H10V10.5H0.5V0H1.5Z"
                          fill="var(--text-a6a6a6)"
                        />
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
                    cursor:
                      !item.isSecret && item.answer ? "pointer" : "default",
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
                        <img
                          src={item.productImg}
                          alt=""
                          className={styles.thumb}
                        />
                        <div>
                          <div className={styles.title}>{item.title}</div>
                          <div className={styles.question}>{item.question}</div>
                        </div>
                      </div>
                      <div className={styles.description}>
                        <span className={styles.status}>{item.status}</span>
                        <Divider />{" "}
                        <span className={styles.author}>
                          {item.author}
                        </span>{" "}
                        <Divider />{" "}
                        <span className={styles.date}>{item.date}</span>
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
                    </div>
                  )}
                </div>

                {/* Answer Section */}
                {item.answer && activeItem === item.id && (
                  <>
                    <div className={styles.answerBox}>
                      <p className={styles.answerText}>{item.question}</p>
                      <div className={styles.answerImages}>
                        {item.answer.images.map((src, i) => (
                          <img key={i} src={src} alt="" />
                        ))}
                      </div>
                    </div>
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
          <div className={styles.paginationMobile}>10개 더보기</div>

          <div className={styles.pagination}>
            <PaginationCustom />
          </div>
        </div>
        <PopupQna openQna={openQna} setOpenQna={setOpenQna} />
      </>
    </LayoutCsCenter>
  );
};

export default QnaPage;

QnaPage.headerBack = true;
QnaPage.headerBackText = "Q&A";

export const IconQnA = () => (
  <svg
    width="19"
    height="18"
    viewBox="0 0 19 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.65199 16.1327L9.08227 16.3873H9.08227L8.65199 16.1327ZM8.84657 15.8039L8.41629 15.5493L8.41629 15.5493L8.84657 15.8039ZM7.15341 15.8039L7.58368 15.5493L7.58368 15.5493L7.15341 15.8039ZM7.34798 16.1327L6.91771 16.3873L7.34798 16.1327ZM2.22836 12.8481L2.6903 12.6567L2.22836 12.8481ZM5.21698 14.6887L5.23296 14.189H5.23296L5.21698 14.6887ZM3.85195 14.4717L3.66061 14.9336H3.66061L3.85195 14.4717ZM13.7716 12.8481L14.2336 13.0394L13.7716 12.8481ZM10.783 14.6887L10.767 14.189L10.783 14.6887ZM12.1481 14.4717L12.3394 14.9336H12.3394L12.1481 14.4717ZM12.5675 4.94208L12.8287 4.51576V4.51576L12.5675 4.94208ZM13.5579 5.93251L13.9842 5.67126L13.9842 5.67126L13.5579 5.93251ZM3.4325 4.94208L3.17125 4.51576V4.51576L3.4325 4.94208ZM2.44208 5.93251L2.01576 5.67126H2.01576L2.44208 5.93251ZM6.43728 14.8668L6.18272 15.2971L6.43728 14.8668ZM8.65199 16.1327L9.08227 16.3873L9.27684 16.0586L8.84657 15.8039L8.41629 15.5493L8.22171 15.878L8.65199 16.1327ZM7.15341 15.8039L6.72313 16.0586L6.91771 16.3873L7.34798 16.1327L7.77826 15.878L7.58368 15.5493L7.15341 15.8039ZM8.65199 16.1327L8.22172 15.878C8.12542 16.0407 7.87455 16.0407 7.77826 15.878L7.34798 16.1327L6.91771 16.3873C7.40121 17.2042 8.59876 17.2042 9.08227 16.3873L8.65199 16.1327ZM7.1 4.5V5H8.9V4.5V4H7.1V4.5ZM14 9.60002H13.5V10.2H14H14.5V9.60002H14ZM2 10.2H2.5V9.60002H2H1.5V10.2H2ZM2 10.2H1.5C1.5 10.8921 1.49973 11.4362 1.5297 11.8755C1.55999 12.3194 1.6228 12.6927 1.76642 13.0394L2.22836 12.8481L2.6903 12.6567C2.60556 12.4522 2.55419 12.2004 2.52739 11.8075C2.50027 11.4101 2.5 10.9058 2.5 10.2H2ZM5.21698 14.6887L5.23296 14.189C4.63728 14.1699 4.30487 14.1181 4.04329 14.0097L3.85195 14.4717L3.66061 14.9336C4.09731 15.1145 4.58157 15.1687 5.20099 15.1885L5.21698 14.6887ZM2.22836 12.8481L1.76642 13.0394C2.12165 13.897 2.80301 14.5784 3.66061 14.9336L3.85195 14.4717L4.04329 14.0097C3.43072 13.756 2.94404 13.2693 2.6903 12.6567L2.22836 12.8481ZM14 10.2H13.5C13.5 10.9058 13.4997 11.4101 13.4726 11.8075C13.4458 12.2004 13.3944 12.4522 13.3097 12.6567L13.7716 12.8481L14.2336 13.0394C14.3772 12.6927 14.44 12.3194 14.4703 11.8755C14.5003 11.4362 14.5 10.8921 14.5 10.2H14ZM10.783 14.6887L10.799 15.1885C11.4184 15.1687 11.9027 15.1145 12.3394 14.9336L12.1481 14.4717L11.9567 14.0097C11.6951 14.1181 11.3627 14.1699 10.767 14.189L10.783 14.6887ZM13.7716 12.8481L13.3097 12.6567C13.056 13.2693 12.5693 13.756 11.9567 14.0097L12.1481 14.4717L12.3394 14.9336C13.197 14.5784 13.8784 13.897 14.2336 13.0394L13.7716 12.8481ZM8.9 4.5V5C9.89171 5 10.6004 5.00053 11.1524 5.05302C11.697 5.1048 12.0373 5.20359 12.3062 5.3684L12.5675 4.94208L12.8287 4.51576C12.3763 4.23849 11.8649 4.11625 11.2471 4.05751C10.6367 3.99947 9.87235 4 8.9 4V4.5ZM14 9.60002H14.5C14.5 8.62767 14.5005 7.86329 14.4425 7.25294C14.3838 6.63515 14.2615 6.12373 13.9842 5.67126L13.5579 5.93251L13.1316 6.19376C13.2964 6.4627 13.3952 6.803 13.447 7.3476C13.4995 7.89963 13.5 8.60831 13.5 9.60002H14ZM12.5675 4.94208L12.3062 5.3684C12.6426 5.57454 12.9255 5.85737 13.1316 6.19376L13.5579 5.93251L13.9842 5.67126C13.6956 5.20032 13.2997 4.80436 12.8287 4.51576L12.5675 4.94208ZM7.1 4.5V4C6.12765 4 5.36328 3.99947 4.75293 4.05751C4.13514 4.11625 3.62372 4.23849 3.17125 4.51576L3.4325 4.94208L3.69375 5.3684C3.96269 5.20359 4.30299 5.1048 4.84759 5.05302C5.39962 5.00053 6.10829 5 7.1 5V4.5ZM2 9.60002H2.5C2.5 8.60831 2.50053 7.89963 2.55302 7.3476C2.6048 6.803 2.70359 6.4627 2.8684 6.19376L2.44208 5.93251L2.01576 5.67126C1.73849 6.12373 1.61624 6.63515 1.5575 7.25294C1.49947 7.86329 1.5 8.62767 1.5 9.60002H2ZM3.4325 4.94208L3.17125 4.51576C2.70031 4.80436 2.30435 5.20032 2.01576 5.67126L2.44208 5.93251L2.8684 6.19376C3.07454 5.85737 3.35737 5.57454 3.69375 5.3684L3.4325 4.94208ZM7.15341 15.8039L7.58368 15.5493C7.43249 15.2938 7.30208 15.0725 7.17609 14.899C7.04417 14.7174 6.89568 14.557 6.69184 14.4364L6.43728 14.8668L6.18272 15.2971C6.22725 15.3234 6.28091 15.3682 6.367 15.4867C6.45902 15.6134 6.56249 15.7872 6.72313 16.0586L7.15341 15.8039ZM5.21698 14.6887L5.20099 15.1885C5.53396 15.1991 5.75078 15.2065 5.91643 15.2267C6.07421 15.246 6.14127 15.2726 6.18272 15.2971L6.43728 14.8668L6.69184 14.4364C6.48492 14.314 6.26581 14.262 6.03751 14.2341C5.81709 14.2072 5.54795 14.1991 5.23296 14.189L5.21698 14.6887ZM8.84657 15.8039L9.27684 16.0586C9.43748 15.7872 9.54095 15.6134 9.63298 15.4867C9.71907 15.3682 9.77272 15.3234 9.81726 15.2971L9.5627 14.8668L9.30813 14.4364C9.1043 14.557 8.9558 14.7174 8.82388 14.899C8.6979 15.0725 8.56748 15.2938 8.41629 15.5493L8.84657 15.8039ZM10.783 14.6887L10.767 14.189C10.452 14.1991 10.1829 14.2072 9.96246 14.2341C9.73417 14.262 9.51505 14.314 9.30813 14.4364L9.5627 14.8668L9.81726 15.2971C9.85871 15.2726 9.92577 15.246 10.0835 15.2267C10.2492 15.2065 10.466 15.1991 10.799 15.1885L10.783 14.6887Z"
      fill="var(--text-121212)"
    />
    <path
      d="M16.7844 9.32633L17.2463 9.51767L16.7844 9.32633ZM15.2623 10.8485L15.4536 11.3104L15.2623 10.8485ZM15.6555 1.91445L15.3943 2.34077L15.6555 1.91445ZM16.584 2.84298L17.0104 2.58173V2.58173L16.584 2.84298ZM7.09147 1.91445L6.83022 1.48813V1.48813L7.09147 1.91445ZM6.16294 2.84298L5.73662 2.58173H5.73662L6.16294 2.84298ZM10.5297 1.5V2H12.2172V1.5V1H10.5297V1.5ZM16.9985 6.28127H16.4985V6.84377H16.9985H17.4985V6.28127H16.9985ZM16.9985 6.84377H16.4985C16.4985 7.50585 16.4982 7.97736 16.4729 8.34862C16.4479 8.71539 16.4001 8.94764 16.3225 9.13499L16.7844 9.32633L17.2463 9.51767C17.3828 9.18816 17.4421 8.83437 17.4706 8.41669C17.4988 8.0035 17.4985 7.49217 17.4985 6.84377H16.9985ZM16.7844 9.32633L16.3225 9.13499C16.0878 9.70162 15.6376 10.1518 15.0709 10.3865L15.2623 10.8485L15.4536 11.3104C16.2653 10.9742 16.9101 10.3293 17.2463 9.51767L16.7844 9.32633ZM12.2172 1.5V2C13.1476 2 13.8102 2.00053 14.3259 2.04956C14.8342 2.09789 15.1479 2.18978 15.3943 2.34077L15.6555 1.91445L15.9168 1.48813C15.4868 1.22467 15.002 1.10934 14.4206 1.05405C13.8466 0.999472 13.1282 1 12.2172 1V1.5ZM16.9985 6.28127H17.4985C17.4985 5.3703 17.499 4.65195 17.4444 4.07793C17.3892 3.49646 17.2738 3.01166 17.0104 2.58173L16.584 2.84298L16.1577 3.10423C16.3087 3.35062 16.4006 3.66431 16.4489 4.17258C16.498 4.68829 16.4985 5.35093 16.4985 6.28127H16.9985ZM15.6555 1.91445L15.3943 2.34077C15.7054 2.53145 15.967 2.79307 16.1577 3.10423L16.584 2.84298L17.0104 2.58173C16.7372 2.13601 16.3625 1.76127 15.9168 1.48813L15.6555 1.91445ZM10.5297 1.5V1C9.61877 1 8.90044 0.999472 8.32641 1.05405C7.74494 1.10934 7.26014 1.22467 6.83022 1.48813L7.09147 1.91445L7.35272 2.34077C7.59911 2.18978 7.9128 2.09789 8.42106 2.04956C8.93677 2.00053 9.59941 2 10.5297 2V1.5ZM7.09147 1.91445L6.83022 1.48813C6.3845 1.76127 6.00976 2.13601 5.73662 2.58173L6.16294 2.84298L6.58927 3.10423C6.77994 2.79307 7.04156 2.53145 7.35272 2.34077L7.09147 1.91445ZM5.77344 4.5L6.27276 4.52597C6.31037 3.80304 6.40462 3.40555 6.58927 3.10423L6.16294 2.84298L5.73662 2.58173C5.4172 3.10298 5.31392 3.70877 5.27411 4.47403L5.77344 4.5ZM13.9985 11.0514L14.0151 11.5512C14.5886 11.5321 15.0425 11.4807 15.4536 11.3104L15.2623 10.8485L15.071 10.3865C14.8336 10.4848 14.5301 10.5335 13.9819 10.5517L13.9985 11.0514Z"
      fill="var(--text-121212)"
    />
    <path
      d="M6.125 9.75C6.125 10.1642 5.78921 10.5 5.375 10.5C4.96079 10.5 4.625 10.1642 4.625 9.75C4.625 9.33579 4.96079 9 5.375 9C5.78921 9 6.125 9.33579 6.125 9.75Z"
      fill="var(--text-121212)"
    />
    <path
      d="M8.75 9.75C8.75 10.1642 8.41421 10.5 8 10.5C7.58579 10.5 7.25 10.1642 7.25 9.75C7.25 9.33579 7.58579 9 8 9C8.41421 9 8.75 9.33579 8.75 9.75Z"
      fill="var(--text-121212)"
    />
    <path
      d="M11.375 9.75C11.375 10.1642 11.0392 10.5 10.625 10.5C10.2108 10.5 9.875 10.1642 9.875 9.75C9.875 9.33579 10.2108 9 10.625 9C11.0392 9 11.375 9.33579 11.375 9.75Z"
      fill="var(--text-121212)"
    />
  </svg>
);
export const IconLock = () => (
  <svg
    width="15"
    height="14"
    viewBox="0 0 15 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M3.41536 6.92708C3.05293 6.92708 2.75911 7.2209 2.75911 7.58333V11.6667C2.75911 12.0291 3.05293 12.3229 3.41536 12.3229H11.582C11.9445 12.3229 12.2383 12.0291 12.2383 11.6667V7.58333C12.2383 7.2209 11.9445 6.92708 11.582 6.92708H3.41536ZM1.73828 7.58333C1.73828 6.65711 2.48914 5.90625 3.41536 5.90625H11.582C12.5083 5.90625 13.2591 6.65711 13.2591 7.58333V11.6667C13.2591 12.5929 12.5083 13.3438 11.582 13.3438H3.41536C2.48914 13.3438 1.73828 12.5929 1.73828 11.6667V7.58333Z"
      fill="var(--text-757575)"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7.4987 1.67708C6.86052 1.67708 6.24848 1.9306 5.79722 2.38186C5.34596 2.83312 5.09245 3.44516 5.09245 4.08333V6.41667C5.09245 6.69856 4.86393 6.92708 4.58203 6.92708C4.30014 6.92708 4.07161 6.69856 4.07161 6.41667V4.08333C4.07161 3.17441 4.43268 2.30272 5.07538 1.66002C5.71809 1.01732 6.58978 0.65625 7.4987 0.65625C8.40762 0.65625 9.27931 1.01732 9.92201 1.66002C10.5647 2.30272 10.9258 3.17441 10.9258 4.08333V6.41667C10.9258 6.69856 10.6973 6.92708 10.4154 6.92708C10.1335 6.92708 9.90495 6.69856 9.90495 6.41667V4.08333C9.90495 3.44516 9.65143 2.83312 9.20017 2.38186C8.74891 1.9306 8.13688 1.67708 7.4987 1.67708Z"
      fill="var(--text-757575)"
    />
  </svg>
);
export const ArrowDownIcon = () => (
  <svg
    width="12"
    height="7"
    viewBox="0 0 12 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 7L12 1.0997L10.8817 0L6 4.8006L1.11828 0L0 1.0997L6 7Z"
      fill="var(--text-949494)"
    />
  </svg>
);

export const ArrowUpIcon = () => (
  <svg
    width="12"
    height="7"
    viewBox="0 0 12 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 0L12 5.9003L10.8817 7L6 2.1994L1.11828 7L0 5.9003L6 0Z"
      fill="var(--text-949494)"
    />
  </svg>
);
