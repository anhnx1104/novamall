import { XLg } from "@styled-icons/bootstrap";
import { useEffect, useState } from "react";
import classes from "./cookieContest.module.css";

function CookieContest() {
  const [visible, setVisible] = useState(false);
  function hideCookieContest() {
    setVisible(false);
  }

  function setCookie(name, value, extend) {
    let dt = new Date();
    dt.setTime(dt.getTime() + extend * 24 * 60 * 60 * 1000);
    if (document) {
      document.cookie = `${name}=${value};expires=${dt.toUTCString()};path=/;`;
    }
  }
  function getCookie(name) {
    const n = `${name}=`;
    if (document) {
      const dc = decodeURIComponent(document.cookie);
      const accepted = dc.split(";");
      for (var i = 0; i < accepted.length; i++) {
        var c = accepted[i];
        while (c.charAt(0) === " ") {
          c = c.substring(1);
        }
        if (c.indexOf(n) === 0) {
          return c.substring(n.length, c.length);
        }
      }
      return "";
    }
  }
  function acceptCookie() {
    if (!getCookie("cookie_contest")) {
      setCookie("cookie_contest", true, 30);
      setVisible(false);
    }
  }

  useEffect(() => {
    if (!getCookie("cookie_contest")) {
      setVisible(true);
    }
  }, []);

  return (
    <>
      {visible && (
        <div className={classes.wrapper}>
          <div className={classes.card}>
            <XLg width={14} height={14} onClick={hideCookieContest} />
            <div className={classes.content}>
              <div className={classes.text}>
                <p className="cookies-popup-text-top">
                  당사는 웹사이트에서 최상의 경험을 제공하기 위해 쿠키를
                  사용합니다.
                </p>
                <span>자세한 내용은 다음을 읽어보세요.</span>
                <span>&nbsp;</span>
                <a href="/privacy" target="_blank">
                  개인정보 보호정책
                </a>
              </div>
            </div>
            <div className={classes.button_container}>
              <button className={classes.accept_button} onClick={acceptCookie}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CookieContest;
