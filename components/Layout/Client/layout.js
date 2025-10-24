import { useEffect, useState } from "react";
import ScrollToTop from "~/components/ScrollToTop";
import data from "~/data.json";
import useWindowDimensions from "~/lib/useWindowDimensions";
import Footer from "./footer";
import c from "./layout.module.css";
import MobileNav from "./mobileNavbar";
import NavBar from "./navbar";
import FooterMobile from "./mobileFooterNav";

const ClientLayout = (props) => {
  const footerVisibility =
    typeof props.footer == "undefined" ? true : props.footer;
  const headerVisibility =
    typeof props.header == "undefined" ? true : props.header;
  const navbarMode =
    typeof props.navbarMode == "undefined" ? "light" : props.navbarMode;
  const headerBack =
    typeof props.headerBack == "undefined" ? false : props.headerBack;
  const headerBackText =
    typeof props.headerBackText == "undefined" ? "" : props.headerBackText;
  const [mobileNav, setMobileNav] = useState(false);
  const dimension = useWindowDimensions();
  useEffect(() => {
    document.body.classList.add("client");
    document.documentElement.classList.add("client");
    return () => {
      document.body.classList.remove("client");
      document.documentElement.classList.remove("client");
    };
  }, []);
  useEffect(() => {
    if (dimension.width !== 0 && dimension.width <= 991) {
      return setMobileNav(true);
    } else {
      setMobileNav(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimension.width]);
  return (
    <>
      {headerVisibility ? (
        mobileNav ? (
          <MobileNav
            mode={navbarMode}
            showSearch={true}
            headerBack={headerBack}
            headerBackText={headerBackText}
          />
        ) : (
          <NavBar mode={navbarMode} />
        )
      ) : null}
      <main
        className={`${navbarMode === "dark" ? c.dark : c.light} ${c.main} ${
          headerBack ? c.headerBack : ""
        } ${footerVisibility ? "" : c.footerHidden}`}
      >
        {props.children}
      </main>
      <Footer visibility={footerVisibility} />
      <ScrollToTop />
      {footerVisibility && mobileNav && <FooterMobile />}
    </>
  );
};

export default ClientLayout;
