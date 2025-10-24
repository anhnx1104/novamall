import HeadData from "~/components/Head";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import styles from "./eventDetail.module.css";
import LayoutCsCenter from "~/pages/cs-center/layout";
import { IconArrowBack } from "~/components/Ui/Icons/icons";
import { useRouter } from "next/router";

const Error500 = dynamic(() => import("~/components/error/500"));

const EventDetailPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const notice = {
    title: "공지 사항 제목 123 abcdef",
    date: "2025.06.18 14:31",
    views: 2840,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/0f/LG_OLED_evo.jpg", // demo
    content: "내용이 들어갑니다.",
  };

  return (
    <LayoutCsCenter>
      <>
        <HeadData title="Notice Detail" />
        <div className={styles.container}>
          {/* Back link */}
          <div className={styles.back} onClick={() => router.back()}>
            <IconArrowBack />
            <span>목록으로</span>
          </div>

          {/* Title section */}
          <div className={styles.header}>
            <h2>{notice.title}</h2>
            <div className={styles.meta}>
              <span>{notice.date}</span>
              <span>조회수 {notice.views}</span>
            </div>
          </div>

          {/* Content */}
          <div className={styles.content}>
            <div className={styles.imageBox}>
              <img src={"/images/notice_image.png"} alt="notice" />
            </div>
            <p>{notice.content}</p>
          </div>
        </div>
      </>
    </LayoutCsCenter>
  );
};

export default EventDetailPage;
EventDetailPage.headerBack = true;
EventDetailPage.headerBackText = "목록으로";
