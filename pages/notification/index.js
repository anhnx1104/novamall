import HeadData from "~/components/Head";
import { appUrl, fetchData, setSettingsData } from "~/lib/clientFunctions";
import { wrapper } from "~/redux/store";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import styles from "./notification.module.css";
import { Divider } from "~/components/Ui/Divider/divider";
import { CloseIcon } from "~/components/Ui/Icons/icons";
import PaginationCustom from "~/components/PaginationCustom";

const NotificationPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");

  const notifications = [
    {
      id: 1,
      title: "(주)노바타",
      time: "어제 오후 03:44",
      text: "매일 3번! 최대 15% 쿠폰의 기회 🎁 장바구니 채우고 6시 쿠폰 GO 👉",
      read: false,
    },
    {
      id: 2,
      title: "결제완료",
      time: "어제 오후 03:44",
      text: "어제주꾸미구 상품 외 1개 상품이 결제되었습니다.",
      read: true,
    },
    {
      id: 3,
      title: "배송준비중",
      time: "오늘 오전 09:12",
      text: "상품이 배송을 준비 중입니다.",
      read: false,
    },
    {
      id: 4,
      title: "배송중",
      time: "오늘 오전 11:30",
      text: "주문한 상품이 배송 중입니다.",
      read: true,
    },
    {
      id: 5,
      title: "배송완료",
      time: "오늘 오후 02:15",
      text: "상품이 성공적으로 배송되었습니다.",
      read: false,
    },
    {
      id: 6,
      title: "환불요청",
      time: "내일 오전 10:20",
      text: "환불 요청이 접수되었습니다.",
      read: false,
    },
  ];

  const filteredNotifications =
    activeTab === "all" ? notifications : notifications.filter((n) => !n.read);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <>
      <HeadData title="Notification" />
      <div className={styles.content_container}>
        <div className={styles.header_tabs}>
          <div className={`${styles.tabs} custom_container`}>
            <span
              className={activeTab === "all" ? styles.active : ""}
              onClick={() => handleTabClick("all")}
            >
              전체 ({notifications.length})
            </span>
            <Divider />
            <span
              className={activeTab === "unread" ? styles.active : ""}
              onClick={() => handleTabClick("unread")}
            >
              읽지 않음 ({notifications.filter((n) => !n.read).length})
            </span>
          </div>
        </div>
        <div className={styles.header}>
          <div className={`${styles.header_container} custom_container`}>
            <div className={styles.total}>
              총 알림 <span>{filteredNotifications.length}</span>
            </div>
            <button className={styles.clearBtn}>전체삭제</button>
          </div>
        </div>
        <div className={`${styles.custom_container} custom_container`}>
          {/* Notification List */}
          <div className={styles.list}>
            {filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={styles.item + (n.read ? " " + styles.read : "")}
              >
                <div className={styles.textBlock}>
                  <div className={styles.titleRow}>
                    <span className={styles.title}>{n.title}</span>
                    <Divider />
                    <span className={styles.time}>{n.time}</span>
                  </div>
                  <div className={styles.text}>{n.text}</div>
                </div>
                <button className={styles.closeBtn}>
                  <CloseIcon />
                </button>
              </div>
            ))}
          </div>
          <div className={styles.paginationMobile}>10개 더보기</div>

          <div className={styles.pagination}>
            <PaginationCustom />
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPage;
NotificationPage.headerBack = true;
NotificationPage.headerBackText = "나의 알림";
