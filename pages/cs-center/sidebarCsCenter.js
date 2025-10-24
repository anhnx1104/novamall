import React from "react";
import styles from "./cscenter.module.css";
import Checkbox from "~/components/Ui/Form/Checkbox/checkbox";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SidebarCsCenter() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathName = router.pathname;
  const sidebarItems = [
    {
      id: 1,
      name: t("공지사항"),
      to: "/cs-center/notice",
    },
    {
      id: 2,
      name: t("이벤트"),
      to: "/cs-center/event",
    },
    {
      id: 3,
      name: t("FAQ"),
      to: "/cs-center/faq",
    },
    {
      id: 4,
      name: t("Q&A"),
      to: "/cs-center/qna",
    },
  ];
  return (
    <aside className={styles.sidebar}>
      <ul>
        {sidebarItems.map((item) => (
          <li
            key={item.id}
            className={`${styles.listItem} ${
              pathName.includes(item.to) ? styles.active : ""
            }`}
          >
            <Link href={item.to}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
