import styles from "./settings.module.css";
import HeadData from "../Head";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const SettingsItem = ({ title, description, on = false }) => {
  const [checked, setChecked] = useState(on);
  const handleToggle = () => {
    setChecked(!checked);
  };
  return (
    <div className={styles.item}>
      <div className={styles.left}>
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.right}>
        <div className={styles.switchWrapper}>
          <div
            className={`${styles.switch} ${checked ? styles.checked : ""}`}
            onClick={handleToggle}
          >
            <span className={styles.label}>{checked ? "ON" : "OFF"}</span>
            <div className={styles.knob}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
const ManageSettings = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <HeadData title={"Settings"} />
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{t("알림 설정")}</h2>
          <span className={styles.line}></span>
          <p>{t("받고 싶은 알림 종류를 선택하세요")}</p>
        </div>
        <div className={styles.itemList}>
          <SettingsItem
            title="주문 및 결제 관련 알림"
            description="결제, 환불,교환 관련 알림"
            on={true}
          />
          <SettingsItem
            title="포인트 관련 알림"
            description="포인트 적립, 사용 관련 알림"
            on={false}
          />
          <SettingsItem
            title="프로모션 알림"
            description=" 할인, 이벤트, 마케팅 관련 알림"
            on={false}
          />
          <SettingsItem
            title="시스템 알림"
            description="앱 업데이트, 서비스 점검, 중요 공지 답변 등 알림"
            on={false}
          />
          <SettingsItem
            title="야간 알림 설정"
            description="야간 시간대에는 알림을 받지 않습니다 (22~08시)"
            on={true}
          />
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{t("알림 방식")}</h2>
          <span className={styles.line}></span>
          <p>
            {t(
              "두가지 모두 거부 시 중요한 알림의 경우 문자로 전송될 수 있습니다. ex) 배송, 결제, 포인트 사용 등"
            )}
          </p>
        </div>
        <div className={styles.itemList}>
          <SettingsItem
            title="푸시알림"
            description="앱을 사용하지 않을 때 알림"
            on={true}
          />
          <SettingsItem
            title="인앱 알림"
            description="앱 사용 중 화면 내 알림"
            on={false}
          />
        </div>
      </div>
    </>
  );
};

export default ManageSettings;
