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
import { useSearchParams } from "next/navigation";

const Link = dynamic(() => import("next/link"));

export default function SignUp() {
  const name = useRef();
  const router = useRouter();
  const firstName = useRef();
  const lastName = useRef();
  const email = useRef();
  const password = useRef();
  const passwordConfirm = useRef();
  const type = useSearchParams().get("type");
  const { t } = useTranslation();
  const settings = useSelector((state) => state.settings);
  const [state, setState] = useState("");
  const [openSignupPopup, setOpenSignupPopup] = useState(true);
  const [openAgePopup, setOpenAgePopup] = useState(false);
  const [openAccountPopup, setOpenAccountPopup] = useState(false);
  const [openSuccessPopup, setOpenSuccessPopup] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    allAgree: false,
    terms: false,
    privacy: false,
    age: false,
    marketing: false,
    nightPush: false,
  });

  const { facebook, google } = settings.settingsData.login;

  const handleCheckboxChange = (name, value) => {
    setCheckboxes((prev) => {
      const newState = { ...prev, [name]: value };

      // If "all agree" is checked/unchecked, update all checkboxes
      if (name === "allAgree") {
        return {
          allAgree: value,
          terms: value,
          privacy: value,
          age: value,
          marketing: value,
          nightPush: value,
        };
      }

      // If any required checkbox is unchecked, uncheck "all agree"
      if (["terms", "privacy", "age"].includes(name) && !value) {
        newState.allAgree = false;
      }

      // If all required checkboxes are checked, check "all agree"
      if (
        newState.terms &&
        newState.privacy &&
        newState.age &&
        !["marketing", "nightPush"].includes(name)
      ) {
        // Only check "all agree" if all required are checked
        const allRequiredChecked =
          newState.terms && newState.privacy && newState.age;
        if (allRequiredChecked) {
          newState.allAgree = true;
        }
      }

      return newState;
    });
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setOpenSuccessPopup(true);

    // Validate required checkboxes
    // if (!checkboxes.terms || !checkboxes.privacy || !checkboxes.age) {
    //   toast.error("필수 약관에 모두 동의해주세요.");
    //   return;
    // }

    // try {
    //   if (password.current.value) {
    //     const data = new FormData();
    //     data.append(
    //       "name",
    //       `${firstName.current.value} ${lastName.current.value}`
    //     );
    //     data.append("email", email.current.value);
    //     data.append("password", password.current.value);
    //     data.append("terms", checkboxes.terms);
    //     data.append("privacy", checkboxes.privacy);
    //     data.append("age", checkboxes.age);
    //     data.append("marketing", checkboxes.marketing);
    //     data.append("nightPush", checkboxes.nightPush);

    //     const response = await postData(`/api/auth/signup`, data);
    //     if (response.success) {
    //       toast.success("회원가입이 완료되었습니다");
    //       document.querySelector("#signup_form").reset();
    //       router.push("/signin");
    //     } else if (!response.success && response.duplicate) {
    //       toast.error("해당 이메일을 사용하는 사용자가 이미 존재합니다.");
    //     } else {
    //       toast.error("회원가입에서 문제가 발생했습니다.");
    //     }
    //   } else {
    //     toast.error("비밀번호가 동일하지 않습니다. ");
    //     passwordConfirm.current.focus();
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  };

  return (
    <>
      <HeadData title="Register" />

      <div className={classes.container + " bg_star"}>
        <div className={classes.back_container}>
          <div onClick={() => router.back()}>
            <IconArrowBack fill="#fff" />
          </div>
        </div>
        {!openSignupPopup && (
          <div className={classes.card}>
            <div className={classes.logo}>
              <SignInLogo />
              <h1>{t("회원가입")}</h1>
            </div>
            <form className={classes.form} onSubmit={handleForm}>
              {type === "social" ? (
                <div>
                  <div className={classes.input_container}>
                    <input
                      type="text"
                      name="new-username"
                      placeholder={t(
                        "아이디를 입력해주세요 (영문, 숫자 조합 8글자 이상)"
                      )}
                      required
                    />
                  </div>
                  <div className={classes.input_container}>
                    <button
                      type="button"
                      className={classes.btnVerify + " " + classes.btnVerifyId}
                      onClick={() => setOpenAccountPopup(true)}
                    >
                      중복확인
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className={classes.input_container}>
                      <input
                        type="text"
                        name="name"
                        placeholder={t("이름을 입력해주세요")}
                        required
                      />
                    </div>
                    <div className={classes.input_container}>
                      <input
                        type="text"
                        name="phone"
                        placeholder={t("전화번호를 입력해주세요")}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <div className={classes.input_container}>
                      <input
                        type="text"
                        name="email"
                        placeholder={t("이메일을 입력해주세요")}
                        required
                      />
                      <button type="button" className={classes.btnVerify}>
                        인증번호 보내기
                      </button>
                    </div>
                    <div className={classes.input_container}>
                      <input
                        type="text"
                        name="otp"
                        placeholder={t("인증번호를 입력해주세요")}
                        required
                      />
                      <button type="button" className={classes.btnVerify}>
                        인증번호 확인
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className={classes.input_container}>
                      <input
                        type="text"
                        name="new-username"
                        autoComplete="new-username"
                        autocorrect="off"
                        spellcheck="false"
                        placeholder={t(
                          "아이디를 입력해주세요 (영문, 숫자 조합 8글자 이상)"
                        )}
                        required
                      />
                    </div>
                    <div className={classes.input_container}>
                      <button
                        type="button"
                        className={
                          classes.btnVerify + " " + classes.btnVerifyId
                        }
                        onClick={() => setOpenAccountPopup(true)}
                      >
                        중복확인
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className={classes.input_container}>
                      <input
                        type="password"
                        name="new-password"
                        autoComplete="new-password"
                        autocorrect="off"
                        spellcheck="false"
                        placeholder={t("비밀번호를 입력해주세요")}
                        required
                      />
                    </div>
                    <div className={classes.input_container}>
                      <input
                        type="password"
                        name="new-passwordConfirm"
                        placeholder={t("비밀번호를 재입력해주세요")}
                        required
                      />
                    </div>
                  </div>
                </>
              )}
              <div className={classes.checkbox_container}>
                <CheckboxCustom
                  unCheckIcon={true}
                  width="30px"
                  checked={checkboxes.allAgree}
                  onChange={(value) => handleCheckboxChange("allAgree", value)}
                  content={
                    <p>
                      전체 동의하기
                      <br />
                      <span>선택항목 포함 모든 약관에 동의합니다</span>
                    </p>
                  }
                />
                <CheckboxCustom
                  unCheckIcon={true}
                  width="30px"
                  checked={checkboxes.terms}
                  onChange={(value) => handleCheckboxChange("terms", value)}
                  content={
                    <p>
                      (필수)
                      <Link href="/terms"> 서비스 이용약관</Link> 에 동의
                    </p>
                  }
                />
                <CheckboxCustom
                  unCheckIcon={true}
                  width="30px"
                  checked={checkboxes.privacy}
                  onChange={(value) => handleCheckboxChange("privacy", value)}
                  content={
                    <p>
                      (필수)
                      <Link href="/terms">개인정보 수집 및 이용 의</Link>에 동의
                    </p>
                  }
                />
                <CheckboxCustom
                  unCheckIcon={true}
                  width="30px"
                  checked={checkboxes.age}
                  onChange={(value) => handleCheckboxChange("age", value)}
                  content={<p>(필수) 만 19세 이상입니다</p>}
                />
                <CheckboxCustom
                  unCheckIcon={true}
                  width="30px"
                  checked={checkboxes.marketing}
                  onChange={(value) => handleCheckboxChange("marketing", value)}
                  content={<p>(선택) 마케팅 정보 수신에 동의</p>}
                />
                <CheckboxCustom
                  unCheckIcon={true}
                  width="30px"
                  checked={checkboxes.nightPush}
                  onChange={(value) => handleCheckboxChange("nightPush", value)}
                  content={
                    <p>(선택) 야간(오후 9시~오전8시) 광고성 푸시 수신 동의</p>
                  }
                />
              </div>
              <LoadingButton
                text={t("회원가입 완료")}
                type="submit"
                state={state}
              />
            </form>
          </div>
        )}
      </div>
      <Popup
        open={openSignupPopup}
        bgTransparent
        onClose={() => setOpenSignupPopup(false)}
        content={
          <div
            className={
              classes.popupContainer + " " + classes.popupContainer_signup
            }
          >
            <div className={classes.logo}>
              <SignInLogo />
              <h1>{t("회원가입")}</h1>
            </div>
            <div>
              <p className={classes.popupText}>
                {t("지금 바로 회원가입하고 노바샵을 이용해 보세요!")}
              </p>
            </div>
          </div>
        }
        small
        styleAction={{
          backgroundColor: "var(--bg-dark)",
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
              text={t("본인인증하고 가입하기")}
              onClick={() => setOpenSignupPopup(false)}
            />
          </div>
        }
      />
      <Popup
        open={openAgePopup}
        bgTransparent
        onClose={() => setOpenAgePopup(false)}
        content={
          <div
            className={classes.popupContainer}
            style={{ backgroundColor: "#27223F" }}
          >
            <IconWarning color="var(--main-secondary)" />
            <div>
              <p className={classes.popupTitle}>{t("회원가입 불가능")}</p>
              <p className={classes.popupText}>
                <span> {t("만 19세 미만")}</span>
                {t("은 노바몰 이용이 불가능합니다.")}
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
              text={t("확인")}
              onClick={() => setOpenAgePopup(false)}
            />
          </div>
        }
      />
      <Popup
        open={openAccountPopup}
        bgTransparent
        onClose={() => setOpenAccountPopup(false)}
        content={
          <div
            className={classes.popupContainer}
            style={{ backgroundColor: "#27223F" }}
          >
            <IconWarning color="var(--main-secondary)" />
            <div>
              <p className={classes.popupTitle}>
                {t("이미 가입된 계정이 있습니다.")}
              </p>
              <p className={classes.popupText}>
                {t("가입된 이메일 : zxc***@gmail.com")}
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
              text={t("확인")}
              onClick={() => setOpenAccountPopup(false)}
            />
          </div>
        }
      />
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
                {t("회원가입이 완료되었습니다. ")}
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
              text={t("확인")}
              onClick={() => setOpenSuccessPopup(false)}
            />
          </div>
        }
      />
    </>
  );
}
