import HeadData from "~/components/Head";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import styles from "./notice.module.css";
import LayoutCsCenter from "../layout";
import PaginationCustom from "~/components/PaginationCustom";
import Link from "next/link";
import { useRouter } from "next/router";

const Error500 = dynamic(() => import("~/components/error/500"));

const NoticePage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const notices = [
    {
      id: 4,
      title: "MLB 뉴욕양키스 볼캡 모자 32CPH1111-50L",
      date: "24.01.01",
    },
    {
      id: 3,
      title: "MLB 뉴욕양키스 볼캡 모자 32CPH1111-50L",
      date: "24.01.01",
    },
    {
      id: 2,
      title: "MLB 뉴욕양키스 볼캡 모자 32CPH1111-50L",
      date: "24.01.01",
    },
    {
      id: 1,
      title: "MLB 뉴욕양키스 볼캡 모자 32CPH1111-50L",
      date: "24.01.01",
    },
  ];
  return (
    <LayoutCsCenter>
      <>
        <HeadData title="Notice" />
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <h2>{t("공지사항")}</h2>
            <span className={styles.line}></span>
            <p>{t("중요한 공지사항과 업데이트 소식을 확인하세요.")}</p>
          </div>

          {/* Search */}
          <div className={styles.searchBox}>
            <input type="text" placeholder={t("검색어를 입력하세요")} />
            <button>{t("검색하기")}</button>
          </div>

          {/* Table */}
          <table className={styles.table}>
            <thead>
              <tr>
                <th className="left">{t("번호")}</th>
                <th>{t("제목")}</th>
                <th>{t("작성일")}</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => router.push(`/cs-center/notice/${item.id}`)}
                >
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.tableMobile}>
            {notices.map((item, index) => (
              <Link
                href={`/cs-center/notice/${item.id}`}
                className={styles.noticeItem}
                key={item.id}
              >
                <div className={styles.noticeItemNumber}>{index + 1}</div>
                <div className={styles.noticeItemContent}>
                  <p>{item.title}</p>
                  <p className={styles.date}>{item.date}</p>
                </div>
              </Link>
            ))}
            <div className={styles.paginationMobile}>10개 더보기</div>
          </div>
          <div className={styles.pagination}>
            <PaginationCustom />
          </div>
        </div>
      </>
    </LayoutCsCenter>
  );
};

export default NoticePage;

NoticePage.headerBack = true;
NoticePage.headerBackText = "공지사항";
