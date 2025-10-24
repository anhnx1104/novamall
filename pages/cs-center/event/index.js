import HeadData from "~/components/Head";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import styles from "./event.module.css";
import LayoutCsCenter from "../layout";
import PaginationCustom from "~/components/PaginationCustom";
import Link from "next/link";
import { useRouter } from "next/router";

const Error500 = dynamic(() => import("~/components/error/500"));

const EventPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const events = [
    {
      id: 4,
      title: "MLB 뉴욕양키스 볼캡 모자 32CPH1111-50L",
      startDate: "2025-01-01",
      endDate: "2025-01-01",
      status: "진행중",
    },
    {
      id: 3,
      title: "MLB 뉴욕양키스 볼캡 모자 32CPH1111-50L",
      startDate: "2025-01-01",
      endDate: "2025-01-01",
      status: "진행중",
    },
    {
      id: 2,
      title: "MLB 뉴욕양키스 볼캡 모자 32CPH1111-50L",
      startDate: "2025-01-01",
      endDate: "2025-01-01",
      status: "종료",
    },
    {
      id: 1,
      title: "MLB 뉴욕양키스 볼캡 모자 32CPH1111-50L",
      startDate: "2025-01-01",
      endDate: "2025-01-01",
      status: "종료",
    },
  ];
  return (
    <LayoutCsCenter>
      <>
        <HeadData title="Events" />
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <h2>{t("이벤트")}</h2>
            <span className={styles.line}></span>
            <p>{t("노바몰의 다양한 이벤트를 확인해보세요")}</p>
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
                <th>{t("내용")}</th>
                <th className="center">{t("시작일")}</th>
                <th className="center">{t("종료일")}</th>
                <th className="center">{t("현황")}</th>
              </tr>
            </thead>
            <tbody>
              {events.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => router.push(`/cs-center/event/${item.id}`)}
                  className={item.status === "종료" ? styles.disabled : ""}
                >
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td className="center">{item.startDate}</td>
                  <td className="center">{item.endDate}</td>
                  <td className="center">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.tableMobile}>
            {events.map((item, index) => (
              <Link
                href={`/cs-center/event/${item.id}`}
                className={styles.eventItem}
                key={item.id}
              >
                <div className={styles.eventItemNumber}>{index + 1}</div>
                <div className={styles.eventItemContent}>
                  <p>{item.title}</p>
                  <p className={styles.date}>
                    {item.startDate} ~ {item.endDate}
                  </p>
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

export default EventPage;

EventPage.headerBack = true;
EventPage.headerBackText = "이벤트";
