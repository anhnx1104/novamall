import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import HeadData from "~/components/Head";
import { formField } from "~/lib/clientFunctions";
import classes from "~/styles/signin.module.css";
import dynamic from "next/dynamic";
import {
  IconArrowBack,
  IconSuccess,
  SignInLogo,
  SocialGoogleIcon,
  SocialKakaoIcon,
  SocialNaverIcon,
} from "../Ui/Icons/icons";
import Popup from "../Popup/popup";
import ButtonCustom from "../ButtonCustom";

const LoadingButton = dynamic(() => import("~/components/Ui/Button"));
const Link = dynamic(() => import("next/link"));

export default function FindId({ popup, hidePopup }) {
  const [state, setState] = useState("");
  const router = useRouter();
  const settings = useSelector((state) => state.settings);
  const { data: session } = useSession();
  const [findSocialPopup, setFindSocialPopup] = useState(false);
  const [findIdPopup, setFindIdPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(1);
  const { t } = useTranslation();

  useEffect(() => {
    if (session && !popup) {
      const url = session.user.a ? "/dashboard" : "/";
      router.push(url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <>
      <HeadData title="Sign in" />
      <div className={classes.container + " bg_star"}>
        <div className={classes.back_container}>
          <div onClick={() => router.back()}>
            <IconArrowBack fill="#fff" />
          </div>
        </div>
        <div className={`${classes.card} ${classes.findId}`}>
          <div className={classes.logo}>
            <SignInLogo />
            <h1>{t("아이디 찾기")}</h1>
          </div>
          <p className={classes.findIdText}>
            {t("등록된 전화번호로 아이디 찾기")}
          </p>
          <div className={classes.form}>
            <LoadingButton
              text={t("본인 인증하고 아이디 찾기")}
              type="button"
              clickEvent={() => {
                if (showPopup === 1) {
                  setShowPopup(2);
                  setFindIdPopup(true);
                } else {
                  setShowPopup(1);
                  setFindSocialPopup(true);
                }
              }}
              state={state}
            />
          </div>
        </div>
        <Popup
          bgTransparent
          open={findSocialPopup}
          onClose={() => setFindSocialPopup(false)}
          content={
            <div
              className={classes.popupContainer}
              style={{ backgroundColor: "#27223F" }}
            >
              <div className={classes.popupIconContainer}>
                <SocialKakaoIcon />
              </div>
              <div>
                <p className={classes.popupTitle}>
                  {t("이미 가입한 카카오 계정이 있습니다")}
                </p>
                <p className={classes.popupText}>
                  {t("홍길동님은 이미 가입한 카카오 계정이 있습니다.")}
                  <br />
                  <span style={{ color: "var(--main-secondary)" }}>
                    hgd***@kakao.com
                  </span>
                </p>
              </div>
            </div>
          }
          small
          styleAction={{
            backgroundColor: "#0C0824",
            border: "none",
          }}
          action={
            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <ButtonCustom
                variant={"primary"}
                text={t("카카오로 로그인하기")}
                onClick={() => setFindSocialPopup(false)}
              />
            </div>
          }
        />
        <Popup
          bgTransparent
          open={findIdPopup}
          onClose={() => setFindIdPopup(false)}
          content={
            <div
              className={classes.popupContainer}
              style={{ backgroundColor: "#27223F" }}
            >
              <div className="">
                <IconSuccess color={"#6B80DC"} />
              </div>
              <div>
                <p className={classes.popupTitle}>
                  회원님의 아이디는아이디는
                  <br />
                  nova@gmail.com 입니다.
                </p>
                <p className={classes.popupText}>
                  <span style={{ color: "#B4B4CC", fontSize: "14px" }}>
                    가입일: 2024-12-21
                  </span>
                </p>
              </div>
            </div>
          }
          small
          styleAction={{
            backgroundColor: "#0C0824",
            border: "none",
          }}
          action={
            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <ButtonCustom
                variant={"outline"}
                text={t("로그인하기")}
                onClick={() => setFindIdPopup(false)}
                style={{
                  backgroundColor: "transparent",
                  color: "#fff",
                  border: "1px solid #fff",
                  borderRadius: "2px",
                  border: "1px solid #27223F",
                }}
              />
              <ButtonCustom
                variant={"primary"}
                text={t("비밀번호 찾기")}
                onClick={() => setFindIdPopup(false)}
              />
            </div>
          }
        />
      </div>
    </>
  );
}
