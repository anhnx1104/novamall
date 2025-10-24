import { Basket, Cart, Person, UiChecksGrid } from "@styled-icons/bootstrap";
import { House } from "@styled-icons/bootstrap/House";
import Link from "next/link";
import { useEffect, useState } from "react";
import c from "./footerMobile.module.css";
import { useSelector } from "react-redux";
import { decimalBalance } from "~/lib/clientFunctions";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import {
  BottomBarCartActiveIcon,
  BottomBarCartIcon,
  BottomBarHeartIcon,
  BottomBarHeartActiveIcon,
  BottomBarHomeIcon,
  BottomBarHomeActiveIcon,
  BottomBarProfileIconActive,
  BottomBarProfileIcon,
} from "~/components/Ui/Icons/icons";

export default function FooterMobile() {
  const router = useRouter();
  const pathName = router.pathname;
  const { session } = useSelector((state) => state.localSession);
  const cart = useSelector((state) => state.cart);
  const { t } = useTranslation();
  // Getting the count of items
  const getItemsCount = () => {
    const p = cart.items.reduce(
      (accumulator, item) => accumulator + item.qty,
      0
    );
    return decimalBalance(p);
  };
  return (
    <div className={c.menu}>
      <ul>
        <li>
          <Link href="/">
            {pathName === "/" ? (
              <BottomBarHomeActiveIcon />
            ) : (
              <BottomBarHomeIcon />
            )}
            <span>{t("홈")}</span>
          </Link>
        </li>
        <li>
          <Link href="/">
            {pathName === "/favorite" ? (
              <BottomBarHeartActiveIcon />
            ) : (
              <BottomBarHeartIcon />
            )}
            <span>{t("찜한 상품")}</span>
          </Link>
        </li>

        <li>
          <Link href="/cart">
            {pathName === "/cart" ? (
              <BottomBarCartActiveIcon />
            ) : (
              <BottomBarCartIcon />
            )}
            <span>
              {t("장바구니")} ({getItemsCount()})
            </span>
          </Link>
        </li>
        <li>
          <Link href={session && session?.user ? `/profile/info` : `/signin`}>
            {pathName === "/profile/info" ? (
              <BottomBarProfileIconActive />
            ) : (
              <BottomBarProfileIcon />
            )}
            <span>{t("계정")}</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
