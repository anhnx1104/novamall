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
  SignInLogo,
  SocialGoogleIcon,
  SocialKakaoIcon,
  SocialNaverIcon,
} from "../Ui/Icons/icons";

const LoadingButton = dynamic(() => import("~/components/Ui/Button"));
const Link = dynamic(() => import("next/link"));

export default function SignIn({ popup, hidePopup }) {
  const [state, setState] = useState("");
  const router = useRouter();
  const settings = useSelector((state) => state.settings);
  const { data: session } = useSession();
  const { t } = useTranslation();
  const errors = {
    Signin: "Try signing with a different account.",
    OAuthSignin: "Try signing with a different account.",
    OAuthCallback: "Try signing with a different account.",
    OAuthCreateAccount: "Try signing with a different account.",
    EmailCreateAccount: "Try signing with a different account.",
    Callback: "Try signing with a different account.",
    OAuthAccountNotLinked:
      "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "Check your email address.",
    CredentialsSignin:
      "Sign in failed. Check the details you provided are correct.",
    default: "Unable to sign in.",
  };

  const { facebook, google } = settings.settingsData.login;

  async function signinProcess(e) {
    setState("loading");
    try {
      e.preventDefault();
      const { username, password } = formField(e.target.elements);
      const res = await signIn("credentials", {
        redirect: false,
        password,
        username,
      });
      if (res.error) {
        const errorMessage = res.error && (errors[res.error] ?? errors.default);
        toast.error("아이디와 비밀번호를 다시 확인주세요");
      }
      if (res.ok) {
        toast.success("로그인 성공");
        if (popup) {
          hidePopup();
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("로그인 실패");
    }
    setState("");
  }

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
        <div className={classes.card}>
          <div className={classes.logo}>
            <SignInLogo />
            <h1>{t("로그인")}</h1>
          </div>
          <form className={classes.form} onSubmit={signinProcess}>
            <div className={classes.input_container}>
              <input
                type="email"
                name="username"
                className={classes.inputEmail}
                defaultValue={"admin@admin.com"}
                placeholder={t("이메일 또는 아이디를 입력해주세요")}
                required
              />
            </div>
            <div className={classes.input_container}>
              <input
                type="password"
                name="password"
                className={classes.inputPassword}
                defaultValue={"1234"}
                placeholder={t("패스워드를 입력해주세요")}
                required
              />
            </div>
            <LoadingButton text={t("로그인")} type="submit" state={state} />
          </form>
          <div className={classes.socials}>
            <div className={classes.social_title}>
              <p>{t("소셜 로그인")}</p>
            </div>
            <div className={classes.social_container}>
              <button
                className={classes.social_item}
                onClick={() => signIn("google")}
              >
                <SocialGoogleIcon />
                <span>구글</span>
              </button>
              <button
                className={classes.social_item}
                onClick={() =>
                  router.push("/signup?type=social&provider=kakao")
                }
              >
                <SocialKakaoIcon />
                <span>카카오</span>
              </button>
              <button
                className={classes.social_item}
                onClick={() =>
                  router.push("/signup?type=social&provider=naver")
                }
              >
                <SocialNaverIcon />
                <span>네이버</span>
              </button>
            </div>
          </div>
          <div className={classes.link_container}>
            <Link href={"/find-id"}>{t("아이디 찾기")}</Link>
            <div className={classes.divider}></div>
            <Link href={"/find-password"}>{t("비밀번호 찾기")}</Link>
            <div className={classes.divider}></div>
            <Link href={"/signup"}>{t("회원가입")}</Link>
          </div>
        </div>
      </div>
    </>
  );
}
