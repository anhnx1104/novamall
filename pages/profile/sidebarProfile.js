import React from "react";
import styles from "./profile.module.css";
import Checkbox from "~/components/Ui/Form/Checkbox/checkbox";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { SignoutIcon } from "~/components/Ui/Icons/icons";

export default function SidebarProfile() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathName = router.pathname;
  const sidebarItems = [
    {
      id: 1,
      name: t("나의 쇼핑"),
      to: "/profile/info",
    },
    {
      id: 2,
      name: t("나의 포인트"),
      to: "/profile/points",
    },
    {
      id: 3,
      name: t("주문/배송내역"),
      to: "/profile/order-delivery",
    },
    {
      id: 4,
      name: t("찜한 상품"),
      to: "/profile/wishlist",
    },
    {
      id: 5,
      name: t("나의 리뷰"),
      to: "/profile/reviews/write",
    },
    {
      id: 6,
      name: t("나의 설정"),
      to: "/profile/settings",
    },
    {
      id: 7,
      name: t("로그아웃"),
      to: "#",
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
            {item.id === 7 ? (
              <Link
                href={item.to}
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                {item.name} <SignoutIcon />
              </Link>
            ) : (
              <Link href={item.to}>{item.name}</Link>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
