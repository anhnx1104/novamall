import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import BreadcrumbsCustom from "~/components/Breadcrumbs";
import classes from "~/styles/profile.module.css";
import HeadData from "~/components/Head";
import SideBarProfile from "~/components/Profile/SideBarProfile";
const ManageProfile = dynamic(() =>
  import("~/components/Profile/manageProfile")
);
const ManageAddressBook = dynamic(() =>
  import("~/components/Profile/addressBook")
);

const InformationPage = () => {
  const breadcrumbs = [
    { title: "홈페이지", href: "/" },
    { title: "내 계정", href: "/profile" },
    { title: "내 정보", href: "/profile/information" },
  ];

  const { session } = useSelector((state) => state.localSession);
  const router = useRouter();
  const { t } = useTranslation();
  const [addAddress, setAddAddress] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <>
      <HeadData title="My Information" />
      <div className="layout_top">
        <div className="custom_container">
          <BreadcrumbsCustom dataBreadcrumbs={breadcrumbs} />
          <div className="row m-0 mt-5">
            <div className="col-md-3">
              <SideBarProfile active={"information"} />
            </div>
            <div className={`${classes.content} col-md-9`}>
              <div className={classes.viewer}>
                {!addAddress ? (
                  <ManageProfile
                    openAddAddress={() => {
                      window.scroll({
                        top: 0,
                        behavior: "smooth",
                      });
                      setAddAddress(true);
                    }}
                    closeAddAddress={() => setAddAddress(false)}
                    id={session?.user?.id}
                  />
                ) : (
                  <ManageAddressBook
                    id={session?.user?.id}
                    closeAddAddress={() => setAddAddress(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

InformationPage.requireAuth = true;

export default InformationPage;
