import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import BreadcrumbsCustom from "~/components/Breadcrumbs";
import classes from "~/styles/profile.module.css";
import HeadData from "~/components/Head";
import SideBarProfile from "~/components/Profile/SideBarProfile";

const ManageVouchersList = dynamic(() =>
  import("~/components/Profile/vouchers")
);

const VouchersPage = () => {
  const breadcrumbs = [
    { title: "홈페이지", href: "/" },
    { title: "내 계정", href: "/profile" },
    { title: "내 상품권", href: "/profile/vouchers" },
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
      <HeadData title="My Vouchers" />
      <div className="layout_top">
        <div className="custom_container">
          <BreadcrumbsCustom dataBreadcrumbs={breadcrumbs} />
          <div className="row m-0 mt-5">
            <div className="col-md-3">
              <SideBarProfile active={"vouchers"} />
            </div>
            <div className={`${classes.content} col-md-9`}>
              <div className={classes.viewer}>
                <ManageVouchersList id={session?.user?.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

VouchersPage.requireAuth = true;

export default VouchersPage;
