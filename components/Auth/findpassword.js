import { signIn } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import HeadData from "~/components/Head";
import { postData } from "~/lib/clientFunctions";
import classes from "~/styles/signup.module.css";
import { useRouter } from "next/router";
import {
  IconArrowBack,
  IconSuccess,
  IconWarning,
  SignInLogo,
} from "../Ui/Icons/icons";
import { useState } from "react";
import CheckboxCustom from "../Ui/CheckboxCustom/checkboxCustom";
import LoadingButton from "../Ui/Button";
import Popup from "../Popup/popup";
import ButtonCustom from "../ButtonCustom";

const Link = dynamic(() => import("next/link"));

export default function FindPassword() {
  const router = useRouter();

  const { t } = useTranslation();
  const settings = useSelector((state) => state.settings);
  const [state, setState] = useState("");
  const [type, setType] = useState("email");
  const [openSuccessPopup, setOpenSuccessPopup] = useState(false);
  const [step, setStep] = useState(1);

  const { facebook, google } = settings.settingsData.login;

  return (
    <>
      <HeadData title="Register" />
      <div className={classes.container + " bg_star"}>
        <div className={classes.back_container}>
          <div onClick={() => router.back()}>
            <IconArrowBack fill="#fff" />
          </div>
        </div>
        <div className={classes.card}>
          <div className={classes.logo}>
            <SignInLogo />
            <h1>{step === 1 ? t("비밀번호 찾기") : t("새 비밀번호 설정")}</h1>
          </div>
          {step === 1 && (
            <div className={classes.link_container}>
              <div
                onClick={() => setType("phone")}
                className={type === "phone" ? classes.active : ""}
              >
                {t("전화번호로 찾기")}
              </div>
              <div className={classes.divider}></div>
              <div
                onClick={() => setType("email")}
                className={type === "email" ? classes.active : ""}
              >
                {t("이메일로 찾기")}
              </div>
            </div>
          )}

          <form className={classes.form}>
            {step === 1 && (
              <>
                {" "}
                <div>
                  <div className={classes.input_container}>
                    <input
                      type="text"
                      name="username"
                      placeholder={
                        type === "email"
                          ? t("이메일을 입력해주세요")
                          : t("전화번호를 입력해주세요")
                      }
                      required
                    />
                  </div>
                  <div className={classes.input_container}>
                    <button
                      type="button"
                      className={classes.btnVerify + " " + classes.btnVerifyId}
                    >
                      인증번호 보내기
                    </button>
                  </div>
                </div>
                <div>
                  <div
                    className={classes.input_container}
                    style={{
                      borderRadius: "12px",
                      borderBottom: "1px solid #27223f",
                    }}
                  >
                    <input
                      type="text"
                      name="username"
                      placeholder={t("인증번호를 입력해주세요")}
                      required
                    />
                  </div>
                </div>
              </>
            )}
            {step === 2 && (
              <div>
                <div className={classes.input_container}>
                  <input
                    type="password"
                    name="password"
                    placeholder={t("새 비밀번호를 입력해주세요")}
                    required
                  />
                </div>
                <div className={classes.input_container}>
                  <input
                    type="password"
                    name="passwordConfirm"
                    placeholder={t("새 비밀번호를 재입력해주세요")}
                    required
                  />
                </div>
              </div>
            )}

            <LoadingButton
              text={step === 1 ? t("인증 하기") : t("비밀번호 재설정")}
              type="button"
              state={state}
              clickEvent={() => {
                if (step === 1) {
                  setStep(2);
                } else {
                  setOpenSuccessPopup(true);
                }
              }}
            />
          </form>
        </div>
      </div>
      <Popup
        open={openSuccessPopup}
        bgTransparent
        onClose={() => setOpenSuccessPopup(false)}
        content={
          <div
            className={classes.popupContainer}
            style={{ backgroundColor: "#27223F" }}
          >
            <IconSuccess color={"var(--main-system-skyblue)"} />
            <div>
              <p className={classes.popupTitle}>
                {t("비밀번호 재설정이 완료되었습니다.")}
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
              text={t("로그인 하러 가기")}
              onClick={() => {
                setOpenSuccessPopup(false);
                setStep(1);
              }}
            />
          </div>
        }
      />
    </>
  );
}
