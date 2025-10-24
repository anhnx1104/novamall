import { List, Search, XSquare } from "@styled-icons/bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import c from "./mobileNav.module.css";
import dynamic from "next/dynamic";
import {
  HeaderAlertIcon,
  HeaderHeartIcon,
  HeaderLogoDark,
  HeaderLogoLight,
  HeaderNavbarListIcon,
  IconArrowBack,
} from "~/components/Ui/Icons/icons";
import { useTranslation } from "react-i18next";

const ImageLoader = dynamic(() => import("~/components/Image"));
const SearchBar = dynamic(() => import("./searchbar"));
const Sidebar = dynamic(() => import("./sidebar"));

export default function MobileNav({
  mode,
  showSearch,
  headerBack,
  headerBackText,
}) {
  const [show, setShow] = useState(false);
  const { session } = useSelector((state) => state.localSession);

  const toggleSidebar = () => setShow(!show);
  const { t } = useTranslation();

  const router = useRouter();
  const pathName = router.pathname;

  const navItem = [
    {
      id: 1,
      name: t("특별상품"),
      to: "/special-products",
    },
    {
      id: 2,
      name: t("일반상품"),
      to: "/general-products",
    },
    {
      id: 3,
      name: t("CS Center"),
      to: "/cs-center/notice",
    },
  ];
  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setShow(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <nav className={`${c.nav} ${mode === "dark" ? c.dark : c.light}`}>
        <div className={headerBack ? c.topBack : c.top}>
          <div className={c.brand}>
            {headerBack && headerBackText ? (
              <h2 className={c.headerBackText} onClick={() => router.back()}>
                <IconArrowBack />
                {headerBackText}
              </h2>
            ) : (
              <Link href="/">
                {/* {settings.settingsData.logo[0] && (
                <ImageLoader
                  src={settings.settingsData.logo[0]?.url}
                  width={250}
                  height={70}
                  quality={100}
                  alt={settings.settingsData.name}
                  style={{ width: "100%", height: "auto" }}
                />
              )} */}
                {mode === "dark" ? <HeaderLogoDark /> : <HeaderLogoLight />}
              </Link>
            )}
          </div>
          <button
            className={c.sidebar_button}
            onClick={() => toggleSidebar()}
            title="Menu"
          >
            <HeaderNavbarListIcon />
          </button>
        </div>
        {!headerBack && (
          <>
            <div className={c.bottom}>
              <SearchBar mode={mode} />
            </div>
            <div className={c.bottom_bar}>
              <div className={c.bottom_bar_container}>
                {/* <CategoryMenu /> */}
                <div className={c.nav_link}>
                  <ul className={c.ul}>
                    {navItem.map((item, index) => (
                      <li className={c.list} key={index}>
                        <div
                          className={`${c.item} ${
                            pathName === item.to ? c.active : ""
                          }`}
                        >
                          <Link href={item.to}>{item.name}</Link>
                        </div>
                      </li>
                    ))}
                    {session && (session.user.a || session.user.s.status) && (
                      <li className={c.list}>
                        <div className={c.item}>
                          <Link href="/dashboard">{t("관리자 대시보드")}</Link>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
      {/* {showSearch && (
        <div className={c.searchbar}>
          <SearchBar />
          <XSquare width={25} height={25} onClick={toggleSearchbar} />
        </div>
      )} */}
      <Sidebar show={show} toggle={toggleSidebar} />
    </>
  );
}
