import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import classes from "./footer.module.css";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import {
  TwitterIconFooter,
  InstagramIconFooter,
  DiscordIconFooter,
  RedditIconFooter,
  YoutubeIconFooter,
  TiktokIconFooter,
  MailIconFooter,
  HeaderLogoDark,
} from "~/components/Ui/Icons/icons";

const Footer = (props) => {
  // Selecting settings from global state
  const settings = useSelector((state) => state.settings);
  const { t } = useTranslation();
  const router = useRouter();

  if (props.visibility)
    return (
      <>
        <footer className={classes.footer_container}>
          <div className={classes.container}>
            {/* Left Sidebar */}
            <div className={classes.sidebar}>
              <HeaderLogoDark />
              <div className={classes.cscenter}>CS CENTER</div>
              <div className={classes.csmail}>email.email.com</div>
              <div className={classes.cstime}>
                MON-FRI: AM10:00-PM5:00
                <br />
                lunch: pm12:00-pm01:00
                <br />
                SAT,SUN,HOLIDAY OFF
              </div>
            </div>

            {/* Right Columns */}
            <div className={classes.right}>
              <div className={classes.column}>
                <h4>Info</h4>
                <ul>
                  <li>
                    <Link href="/" className={classes.footerLink}>
                      <span>공지사항</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className={classes.footerLink}>
                      <span>FAQ</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className={classes.footerLink}>
                      <span>Q&A</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className={classes.footerLink}>
                      <span>이벤트</span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className={classes.column}>
                <h4>ACCOUNT</h4>
                <ul>
                  <li>
                    00은행:
                    <br />
                    000-00000-00-000
                  </li>
                  <li>
                    HOLDER: <br />
                    주식회사 노바샵
                  </li>
                </ul>
              </div>
              <div className={classes.column}>
                <h4>USING INFO</h4>
                <ul>
                  <li>
                    <Link href="/" className={classes.footerLink}>
                      <span>회사소개</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className={classes.footerLink}>
                      <span>이용약관</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className={classes.footerLink}>
                      <span>개인정보 처리방침</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={classes.footerInfo}>
            <p>
              COMPANY : 주식회사 노바샵 <span>|</span> CEO : 홍길동{" "}
              <span>|</span> ADDRESS : 서울특별시 강남구 테헤란로 123 ABC빌딩
              5층 <span>|</span> TEL : 010-0000-0000
              <span>|</span> FAX : 02-0000-0000 <span>|</span> 사업자등록번호 :
              000-00-00000 사업자정보확인 <span>|</span> 통신판매업 신고번호 :
              2025-서울강남-000 <span>|</span>
              건강기능식품 신고번호 : 제2025-0000000 <span>|</span> 개인정보
              관리자 : (contact@dummycompany.com) 이메일 무단수집 거부
            </p>
            <p>
              노바샵 쇼핑몰 내 판매되는 상품 중에는 노바샵에 입점 등록한
              협력사(개별 판매자)가 판매하는 마켓플레이스(오픈마켓) 상품이
              포함되어 있습니다.
              <br />
              마켓플레이스(오픈마켓) 상품의 경우 주식회사 노바컴퍼니(노바샵)는
              통신판매중개자이며 통신판매의 당사자가 아닙니다. 따라서 주식회사
              노바컴퍼니는 상품·거래 정보 및 가격에 대해 책임을 지지 않습니다.
              <br />본 사이트의 모든 정보, 콘텐츠, UI 등에 대한 무단 복사, 전송,
              배포, 스크래핑 등의 행위는 엄격히 금지됩니다.
              <br />본 웹사이트에 게시된 이메일 주소는 전자우편 주소 수집
              프로그램 등으로 무단 수집을 거부하며, 이를 위반 시 정보통신망법에
              의해 형사처벌됨을 유념하여 주십시오.
            </p>
          </div>
          <div className={classes.copyright}>
            <div className={classes.copyright_container}>
              <p>
                {settings.settingsData.copyright ||
                  "© COPYRIGHT 주식회사 노바샵 ALL RIGHTS RESERVED."}
              </p>
              <p>
                {settings.settingsData.copyright || "© COPYRIGHT 2018 - 2025"}
              </p>
            </div>
          </div>
        </footer>
      </>
    );

  return null;
};

export default React.memo(Footer);
