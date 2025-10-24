import {
  BoxArrowInRight,
  GeoAlt,
  Heart,
  Person,
  PersonPlus,
  Repeat,
  Telephone,
} from "@styled-icons/bootstrap";
import { signOut } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import c from "./navbar.module.css";
import { useTranslation } from "react-i18next";
import { Headset } from "@styled-icons/bootstrap";
import {
  HeaderAlertIcon,
  HeaderHeartIcon,
  HeaderLogoDark,
  HeaderLogoLight,
} from "~/components/Ui/Icons/icons";
import ButtonCustom from "~/components/ButtonCustom";

const CartView = dynamic(() => import("./cartView"), { ssr: false });
const CategoryMenu = dynamic(() => import("./categoryMenu"), { ssr: false });
const ImageLoader = dynamic(() => import("~/components/Image"));
const SearchBar = dynamic(() => import("./searchbar"));
const LanguageSwitcher = dynamic(() => import("~/components/LanguageSwitcher"));

const NavBar = ({ mode }) => {
  const [hideTopBar, setHideTopBar] = useState(false);
  // Selecting session from global state
  const { session } = useSelector((state) => state.localSession);
  // Selecting settings from global state
  const { settingsData } = useSelector((state) => state.settings);
  const { wishlist, compare } = useSelector((state) => state.cart);
  const [std, setStd] = useState(settingsData);
  const { t } = useTranslation();
  const [productTypeActiveNav, setProductTypeActiveNav] = useState("");

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setStd(settingsData);
  }, [settingsData]);

  const router = useRouter();
  const pathName = router.pathname;

  const handleScroll = () => {
    const position = window.pageYOffset;
    if (position > 189) {
      setHideTopBar(true);
    } else {
      setHideTopBar(false);
    }
  };

  useEffect(() => {
    const updateProductTypeNav = () => {
      if (!pathName.includes("/product")) {
        window.sessionStorage.setItem("productType", "");
        setProductTypeActiveNav("");
      } else {
        const stored = window.sessionStorage.getItem("productType");
        setProductTypeActiveNav(stored || "");
      }
    };

    updateProductTypeNav();

    // Poll sessionStorage when on product page to catch updates
    let interval;
    if (pathName.includes("/product")) {
      interval = setInterval(() => {
        const stored = window.sessionStorage.getItem("productType");
        if (stored && stored !== productTypeActiveNav) {
          setProductTypeActiveNav(stored);
        }
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pathName, productTypeActiveNav]);

  const goToWishList = () => {
    if (session) {
      router.push("/profile/wishlist");
    } else {
      toast.warning("위시리스트를 생성하려면 로그인해야 합니다.");
    }
  };

  const goToNotification = () => {
    if (session) {
      router.push("/notification");
    } else {
      toast.warning("알림을 확인하려면 로그인해야 합니다.");
    }
  };

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
      group: "cs-center",
    },
  ];

  return (
    <>
      <nav
        className={`${c.nav} ${mode === "dark" ? c.dark : c.light} ${
          hideTopBar ? c.hide_top_bar : c.show_top_bar
        }`}
      >
        <div className={c.container}>
          <div className={c.start}>
            <div className={c.brand}>
              <Link href="/">
                {/* {std.logo[0] ? (
                  <ImageLoader
                    src={std.logo[0]?.url}
                    width={155}
                    height={44}
                    alt={std.name}
                  />
                ) : (
                  <>
                    <p className={c.nav_logo}>LOGO</p>
                  </>
                )} */}
                {mode === "dark" ? <HeaderLogoDark /> : <HeaderLogoLight />}
              </Link>
            </div>
            <SearchBar mode={mode} />
          </div>

          <div className={c.end}>
            <div onClick={goToWishList} className={c.link_button}>
              <HeaderHeartIcon />
              {wishlist > 0 && <span>{wishlist || 0}</span>}
            </div>
            <div className={c.link_button} onClick={goToNotification}>
              <HeaderAlertIcon />
            </div>
            <CartView mode={mode} />
            <div className={c.divider}></div>
            <div className={c.auth_button}>
              <div className={``}>
                {!session && (
                  <Link href="/signin">
                    <ButtonCustom text={t("Log in")} className={c.btn_login} />
                  </Link>
                )}
                {session && (
                  <Link href="/profile/info" className={c.username}>
                    <span>{session.user.name}</span>
                  </Link>
                )}
              </div>
              {!session && (
                <Link href="/signup">
                  <ButtonCustom variant="primary" text={"Sign Up"} />
                </Link>
              )}
              {session && (
                <div className={`${c.point}`}>
                  <span className={c.line}></span>
                  <span onClick={() => signOut({ callbackUrl: "/" })}>
                    {t("로그아웃")}
                  </span>
                </div>
              )}
            </div>
          </div>
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
                        pathName.includes(item.group || item.to) ? c.active : ""
                      } ${
                        productTypeActiveNav === "special" && item.id === 1
                          ? c.active
                          : ""
                      } ${
                        productTypeActiveNav === "general" && item.id === 2
                          ? c.active
                          : ""
                      } flex items-center justify-center`}
                    >
                      <Link
                        href={item.to}
                        onClick={() => {
                          router.push(item.to);
                        }}
                        className="flex items-center justify-center w-full"
                        style={{
                          justifyContent: "center",
                        }}
                      >
                        {item.name}
                      </Link>
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
      </nav>
    </>
  );
};

export default memo(NavBar);
