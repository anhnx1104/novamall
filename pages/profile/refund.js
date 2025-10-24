import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import BreadcrumbsCustom from "~/components/Breadcrumbs";
import classes from "~/styles/profile.module.css";
import HeadData from "~/components/Head";
import SideBarProfile from "~/components/Profile/SideBarProfile";

const Refund = dynamic(() => import("~/components/Profile/refund"));

const RefundPage = () => {
  const breadcrumbs = [
    { title: "홈페이지", href: "/" },
    { title: "내 계정", href: "/profile" },
    { title: "환불 요청", href: "/profile/refund" },
  ];

  const { session } = useSelector((state) => state.localSession);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <>
      <HeadData title="Refund Requests" />
      <div className="layout_top">
        <div className="custom_container">
          <BreadcrumbsCustom dataBreadcrumbs={breadcrumbs} />

          <div className="row m-0 mt-5">
            <div className="col-md-3">
              <SideBarProfile active={"refund"} />
            </div>
            <div className={`${classes.content} col-md-9`}>
              <div className={classes.viewer}>
                <Refund id={session?.user?.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

RefundPage.requireAuth = true;

export default RefundPage;
